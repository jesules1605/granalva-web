import "server-only";
import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import type { Payload } from "payload";
import type { AnalyticsSetting, ContactSubmission } from "../../../payload-types";
import { SIERRA_NEVADA_SLUG } from "./events";

/**
 * Datos de «Analítica y rendimiento» (/admin/analitica).
 * - Solicitudes y clientes: de Payload (fuente interna, completa, sin depender de cookies).
 * - Comportamiento y eventos: GA4 Data API (solo usuarios que aceptan la analítica).
 * - Búsquedas: Search Console API.
 * - Visitas sin cookies y Core Web Vitals: Cloudflare Web Analytics (GraphQL).
 * Nada de GA4, Search Console ni Cloudflare se copia en PostgreSQL: se consulta y se
 * guarda 15 minutos en memoria.
 */

// ---------- Periodos ----------
export type Period = { days: number; from: Date; to: Date; prevFrom: Date; prevTo: Date };
export function period(days: number): Period {
  const to = new Date();
  const from = new Date(to.getTime() - days * 86_400_000);
  return { days, from, to, prevFrom: new Date(from.getTime() - days * 86_400_000), prevTo: from };
}
const ymd = (date: Date) => date.toISOString().slice(0, 10);

// ---------- Caché en memoria ----------
const cache = new Map<string, { at: number; value: unknown }>();
async function cached<T>(key: string, load: () => Promise<T>, ttl = 15 * 60_000): Promise<T> {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < ttl) return hit.value as T;
  const value = await load();
  cache.set(key, { at: Date.now(), value });
  return value;
}
export const clearAnalyticsCache = () => cache.clear();

// ---------- Solicitudes (Payload) ----------
type Row = Pick<ContactSubmission, "status" | "servicio" | "tipoCliente" | "formulario" | "createdAt" | "estimatedAmount" | "attribution" | "lostReason">;
const tally = (rows: Row[], key: (row: Row) => string | null | undefined) => {
  const counts = new Map<string, number>();
  for (const row of rows) {
    const value = key(row) || "(sin dato)";
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
};
const isBusiness = (row: Row) => row.tipoCliente !== "Particular";
const isSierra = (row: Row) => row.servicio === SIERRA_NEVADA_SLUG || row.formulario === "sierra-nevada";
const channelOf = (row: Row) => {
  const a = row.attribution ?? {};
  if (a.utmMedium) return `${a.utmSource || "?"} / ${a.utmMedium}`;
  if (!a.referrer) return "Directo";
  if (/google\.|bing\.|duckduckgo|yahoo\./i.test(a.referrer)) return "Buscadores (orgánico)";
  if (/facebook|instagram|linkedin|t\.co|twitter|x\.com|whatsapp/i.test(a.referrer)) return "Redes sociales";
  try {
    return `Referencia: ${new URL(a.referrer).hostname}`;
  } catch {
    return "Referencia";
  }
};

export type LeadStats = ReturnType<typeof summarizeLeads>;
function summarizeLeads(rows: Row[]) {
  const valid = rows.filter((row) => row.status !== "spam");
  const won = valid.filter((row) => row.status === "ganado");
  const lost = valid.filter((row) => row.status === "perdido");
  const contacted = valid.filter((row) => ["contactado", "presupuesto-enviado", "ganado", "perdido"].includes(row.status));
  const quoted = valid.filter((row) => ["presupuesto-enviado", "ganado", "perdido"].includes(row.status));
  const business = valid.filter(isBusiness);
  const sierra = valid.filter(isSierra);
  return {
    total: valid.length,
    spam: rows.length - valid.length,
    contacted: contacted.length,
    quoted: quoted.length,
    won: won.length,
    lost: lost.length,
    wonAmount: won.reduce((sum, row) => sum + (row.estimatedAmount ?? 0), 0),
    business: { total: business.length, won: business.filter((row) => row.status === "ganado").length },
    private: { total: valid.length - business.length, won: won.filter((row) => !isBusiness(row)).length },
    sierra: { total: sierra.length, won: sierra.filter((row) => row.status === "ganado").length },
    byService: tally(valid, (row) => row.servicio),
    byChannel: tally(valid, channelOf),
    byCampaign: tally(valid.filter((row) => row.attribution?.utmCampaign), (row) => row.attribution?.utmCampaign),
    wonByCampaign: tally(won, (row) => row.attribution?.utmCampaign || channelOf(row)),
    byLanding: tally(valid, (row) => row.attribution?.paginaEntrada),
    byFormPage: tally(valid, (row) => row.attribution?.pagina?.split("?")[0]),
    lostReasons: tally(lost, (row) => row.lostReason),
  };
}

export async function leadStats(payload: Payload, p: Period) {
  const load = async (from: Date, to: Date) => {
    const result = await payload.find({
      collection: "contact-submissions",
      where: { and: [{ createdAt: { greater_than_equal: from.toISOString() } }, { createdAt: { less_than: to.toISOString() } }] },
      pagination: false,
      depth: 0,
      overrideAccess: true,
      select: { status: true, servicio: true, tipoCliente: true, formulario: true, createdAt: true, estimatedAmount: true, attribution: true, lostReason: true },
    });
    return summarizeLeads(result.docs as Row[]);
  };
  const [current, previous] = await Promise.all([load(p.from, p.to), load(p.prevFrom, p.prevTo)]);
  return { current, previous };
}

export async function formErrorCount(payload: Payload, days: number) {
  const since = new Date(Date.now() - days * 86_400_000);
  const result = await payload.count({ collection: "system-events", overrideAccess: true, where: { and: [{ type: { in: ["form_error", "email_error"] } }, { createdAt: { greater_than_equal: since.toISOString() } }] } });
  return result.totalDocs;
}

// ---------- Cifrado del token de Google ----------
const key = () => createHash("sha256").update(`granalva-analitica:${process.env.PAYLOAD_SECRET ?? ""}`).digest();
export function encryptSecret(value: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const data = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  return [iv, cipher.getAuthTag(), data].map((part) => part.toString("base64url")).join(".");
}
export function decryptSecret(value: string) {
  const [iv, tag, data] = value.split(".").map((part) => Buffer.from(part, "base64url"));
  const decipher = createDecipheriv("aes-256-gcm", key(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(data), decipher.final()]).toString("utf8");
}

// ---------- Google (GA4 Data API y Search Console API) ----------
export const GOOGLE_SCOPES = ["openid", "email", "https://www.googleapis.com/auth/analytics.readonly", "https://www.googleapis.com/auth/webmasters.readonly"];
export const googleConfigured = () => Boolean(process.env.GOOGLE_OAUTH_CLIENT_ID && process.env.GOOGLE_OAUTH_CLIENT_SECRET);

async function settingsWithToken(payload: Payload) {
  // overrideAccess: el campo del token no es legible por nadie desde la API.
  return (await payload.findGlobal({ slug: "analytics-settings", overrideAccess: true, depth: 0 })) as AnalyticsSetting;
}

async function googleAccessToken(payload: Payload): Promise<string | null> {
  const settings = await settingsWithToken(payload);
  if (!settings.googleRefreshToken || !googleConfigured()) return null;
  return cached("google-access-token", async () => {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_OAUTH_CLIENT_ID ?? "",
        client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET ?? "",
        refresh_token: decryptSecret(settings.googleRefreshToken ?? ""),
        grant_type: "refresh_token",
      }),
    });
    const json = (await response.json()) as { access_token?: string; error?: string };
    if (!json.access_token) throw new Error(`Google: ${json.error ?? response.status}`);
    return json.access_token;
  }, 45 * 60_000);
}

type GaRow = { dimensionValues?: { value: string }[]; metricValues?: { value: string }[] };
type GaReport = { rows?: GaRow[]; error?: { message: string } };

async function gaBatch(token: string, propertyId: string, requests: object[]): Promise<GaReport[]> {
  const response = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:batchRunReports`, {
    method: "POST",
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify({ requests }),
  });
  const json = (await response.json()) as { reports?: GaReport[]; error?: { message: string } };
  if (json.error) throw new Error(`GA4: ${json.error.message}`);
  return json.reports ?? [];
}
const rowsOf = (report?: GaReport) => (report?.rows ?? []).map((row) => ({ dims: (row.dimensionValues ?? []).map((d) => d.value), values: (row.metricValues ?? []).map((m) => Number(m.value)) }));

export const TRACKED_EVENTS = ["page_view", "service_view", "sierra_nevada_view", "quote_cta_click", "quote_form_view", "quote_form_start", "quote_form_submit", "quote_form_success", "quote_form_error", "quote_form_validation_error", "phone_click", "whatsapp_click", "email_click", "app_order_click", "order_cta_click"];

export async function ga4Stats(payload: Payload, p: Period) {
  const settings = await settingsWithToken(payload);
  const propertyId = settings.ga4PropertyId?.replace(/\D/g, "");
  if (!propertyId) return { status: "sin-configurar" as const };
  let token: string | null;
  try {
    token = await googleAccessToken(payload);
  } catch (error) {
    return { status: "error" as const, message: error instanceof Error ? error.message : "Error de Google" };
  }
  if (!token) return { status: "sin-conectar" as const };
  const ranges = [{ startDate: ymd(p.from), endDate: ymd(p.to), name: "actual" }, { startDate: ymd(p.prevFrom), endDate: ymd(new Date(p.prevTo.getTime() - 86_400_000)), name: "anterior" }];
  const range = [ranges[0]];
  try {
    return await cached(`ga4:${propertyId}:${p.days}`, async () => {
      const [a, b] = await Promise.all([
        gaBatch(token, propertyId, [
          { dateRanges: ranges, metrics: [{ name: "sessions" }, { name: "totalUsers" }, { name: "newUsers" }, { name: "screenPageViews" }, { name: "keyEvents" }] },
          { dateRanges: ranges, dimensions: [{ name: "eventName" }], metrics: [{ name: "eventCount" }], dimensionFilter: { filter: { fieldName: "eventName", inListFilter: { values: TRACKED_EVENTS } } } },
          { dateRanges: range, dimensions: [{ name: "sessionDefaultChannelGroup" }], metrics: [{ name: "sessions" }, { name: "keyEvents" }], limit: 10 },
          { dateRanges: range, dimensions: [{ name: "sessionCampaignName" }], metrics: [{ name: "sessions" }, { name: "keyEvents" }], limit: 10 },
          { dateRanges: range, dimensions: [{ name: "deviceCategory" }], metrics: [{ name: "sessions" }, { name: "keyEvents" }] },
        ]),
        gaBatch(token, propertyId, [
          { dateRanges: range, dimensions: [{ name: "pagePath" }], metrics: [{ name: "screenPageViews" }], limit: 10, orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }] },
          { dateRanges: range, dimensions: [{ name: "landingPagePlusQueryString" }], metrics: [{ name: "sessions" }, { name: "keyEvents" }], limit: 10, orderBys: [{ metric: { metricName: "keyEvents" }, desc: true }] },
          { dateRanges: range, dimensions: [{ name: "customEvent:service_slug" }], metrics: [{ name: "eventCount" }], dimensionFilter: { filter: { fieldName: "eventName", stringFilter: { value: "service_view" } } }, limit: 12 },
          { dateRanges: range, dimensions: [{ name: "region" }], metrics: [{ name: "sessions" }], limit: 8 },
          { dateRanges: range, dimensions: [{ name: "eventName" }], metrics: [{ name: "eventCount" }], dimensionFilter: { andGroup: { expressions: [{ filter: { fieldName: "eventName", stringFilter: { value: "page_view" } } }, { filter: { fieldName: "customEvent:page_type", stringFilter: { value: "not_found" } } }] } } },
        ]).catch((error: Error) => {
          // Las dimensiones personalizadas aún no registradas en GA4 no deben tumbar el resto.
          return [{ error: { message: error.message } }] as GaReport[];
        }),
      ]);
      const totals = rowsOf(a[0]);
      const pick = (name: string) => totals.find((row) => row.dims.includes(name))?.values ?? [0, 0, 0, 0, 0];
      const events = rowsOf(a[1]);
      const eventCount = (name: string, rangeName: string) => events.filter((row) => row.dims[0] === name && row.dims.includes(rangeName)).reduce((sum, row) => sum + row.values[0], 0);
      return {
        status: "ok" as const,
        current: pick("actual"),
        previous: pick("anterior"),
        events: Object.fromEntries(TRACKED_EVENTS.map((name) => [name, { current: eventCount(name, "actual"), previous: eventCount(name, "anterior") }])),
        channels: rowsOf(a[2]),
        campaigns: rowsOf(a[3]),
        devices: rowsOf(a[4]),
        pages: rowsOf(b[0]),
        landings: rowsOf(b[1]),
        services: rowsOf(b[2]),
        regions: rowsOf(b[3]),
        notFound: rowsOf(b[4])[0]?.values[0] ?? 0,
        partialError: b[0]?.error?.message,
      };
    });
  } catch (error) {
    return { status: "error" as const, message: error instanceof Error ? error.message : "Error de GA4" };
  }
}

export async function searchConsoleStats(payload: Payload, p: Period) {
  const settings = await settingsWithToken(payload);
  const site = settings.searchConsoleProperty || "sc-domain:limpiezasgranalva.com";
  let token: string | null;
  try {
    token = await googleAccessToken(payload);
  } catch (error) {
    return { status: "error" as const, message: error instanceof Error ? error.message : "Error de Google" };
  }
  if (!token) return { status: "sin-conectar" as const };
  // Search Console publica los datos con 2-3 días de retraso.
  const end = new Date(p.to.getTime() - 3 * 86_400_000);
  const start = new Date(end.getTime() - p.days * 86_400_000);
  const prevEnd = start;
  const prevStart = new Date(prevEnd.getTime() - p.days * 86_400_000);
  const query = async (body: object) => {
    const response = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}/searchAnalytics/query`, {
      method: "POST",
      headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = (await response.json()) as { rows?: { keys?: string[]; clicks: number; impressions: number; ctr: number; position: number }[]; error?: { message: string } };
    if (json.error) throw new Error(`Search Console: ${json.error.message}`);
    return json.rows ?? [];
  };
  try {
    return await cached(`gsc:${site}:${p.days}`, async () => {
      const [total, previous, queries, pages, devices] = await Promise.all([
        query({ startDate: ymd(start), endDate: ymd(end) }),
        query({ startDate: ymd(prevStart), endDate: ymd(prevEnd) }),
        query({ startDate: ymd(start), endDate: ymd(end), dimensions: ["query"], rowLimit: 15 }),
        query({ startDate: ymd(start), endDate: ymd(end), dimensions: ["page"], rowLimit: 10 }),
        query({ startDate: ymd(start), endDate: ymd(end), dimensions: ["device"] }),
      ]);
      return { status: "ok" as const, range: `${ymd(start)} → ${ymd(end)}`, total: total[0], previous: previous[0], queries, pages, devices };
    });
  } catch (error) {
    return { status: "error" as const, message: error instanceof Error ? error.message : "Error de Search Console" };
  }
}

// ---------- Cloudflare Web Analytics (GraphQL) ----------
export async function cloudflareStats(payload: Payload, p: Period) {
  const settings = await settingsWithToken(payload);
  const siteTag = settings.cloudflareSiteTag;
  const accountTag = process.env.CF_ACCOUNT_ID;
  const apiToken = process.env.CF_API_TOKEN;
  if (!siteTag || !accountTag || !apiToken) return { status: "sin-configurar" as const };
  const gql = `query($account:string!,$filter:AccountRumPageloadEventsAdaptiveGroupsFilter_InputObject!,$vitalsFilter:AccountRumWebVitalsEventsAdaptiveGroupsFilter_InputObject!){viewer{accounts(filter:{accountTag:$account}){
    total:rumPageloadEventsAdaptiveGroups(filter:$filter,limit:1){count sum{visits}}
    pages:rumPageloadEventsAdaptiveGroups(filter:$filter,limit:10,orderBy:[count_DESC]){count dimensions{requestPath}}
    referers:rumPageloadEventsAdaptiveGroups(filter:$filter,limit:8,orderBy:[sum_visits_DESC]){sum{visits} dimensions{refererHost}}
    countries:rumPageloadEventsAdaptiveGroups(filter:$filter,limit:8,orderBy:[sum_visits_DESC]){sum{visits} dimensions{countryName}}
    devices:rumPageloadEventsAdaptiveGroups(filter:$filter,limit:5,orderBy:[sum_visits_DESC]){sum{visits} dimensions{deviceType}}
    vitals:rumWebVitalsEventsAdaptiveGroups(filter:$vitalsFilter,limit:1){count quantiles{largestContentfulPaintP75 interactionToNextPaintP75 cumulativeLayoutShiftP75}}
  }}}`;
  const run = async (from: Date, to: Date) => {
    const filter = { siteTag, datetime_geq: from.toISOString(), datetime_leq: to.toISOString(), bot: 0 };
    const response = await fetch("https://api.cloudflare.com/client/v4/graphql", {
      method: "POST",
      headers: { authorization: `Bearer ${apiToken}`, "content-type": "application/json" },
      body: JSON.stringify({ query: gql, variables: { account: accountTag, filter, vitalsFilter: { siteTag, datetime_geq: from.toISOString(), datetime_leq: to.toISOString() } } }),
    });
    const json = (await response.json()) as { data?: { viewer: { accounts: Record<string, { count?: number; sum?: { visits?: number }; dimensions?: Record<string, string>; quantiles?: Record<string, number> }[]>[] } }; errors?: { message: string }[] };
    if (json.errors?.length) throw new Error(`Cloudflare: ${json.errors[0].message}`);
    return json.data?.viewer.accounts[0] ?? {};
  };
  try {
    return await cached(`cf:${siteTag}:${p.days}`, async () => {
      const [current, previous] = await Promise.all([run(p.from, p.to), run(p.prevFrom, p.prevTo)]);
      return { status: "ok" as const, current, previous };
    });
  } catch (error) {
    return { status: "error" as const, message: error instanceof Error ? error.message : "Error de Cloudflare" };
  }
}

export async function getAnalyticsSettings(payload: Payload) {
  const settings = await settingsWithToken(payload);
  return { ...settings, googleRefreshToken: undefined, googleConnected: Boolean(settings.googleRefreshToken) };
}
