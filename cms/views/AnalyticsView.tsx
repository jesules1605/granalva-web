/* eslint-disable @next/next/no-html-link-for-pages -- enlaces del panel y de la API: navegación completa a propósito (OAuth y vistas de Payload). */
import { DefaultTemplate } from "@payloadcms/next/templates";
import { Gutter } from "@payloadcms/ui";
import { redirect } from "next/navigation";
import type { AdminViewServerProps } from "payload";
import type { ReactNode } from "react";
import { cloudflareStats, formErrorCount, ga4Stats, getAnalyticsSettings, googleConfigured, leadStats, period, searchConsoleStats } from "../../app/lib/analytics/server";
import { SERVICE_OPTIONS } from "../../app/lib/contact-schema";

// «Analítica y rendimiento» (/admin/analitica). Solo propietario y administradores.
// Cada bloque indica su fuente: las cifras de Cloudflare (todas las visitas, sin cookies),
// GA4 (solo quien acepta la analítica) y Payload (todas las solicitudes) no coinciden
// entre sí por diseño: consentimiento, bloqueadores, bots y metodología.

const fmt = new Intl.NumberFormat("es-ES");
const pct = (value: number) => `${(value * 100).toLocaleString("es-ES", { maximumFractionDigits: 1 })} %`;
const eur = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const serviceLabel = (slug: string) => SERVICE_OPTIONS.find((option) => option.value === slug)?.label ?? slug;

function Delta({ current, previous }: { current: number; previous: number }) {
  if (!previous && !current) return <small style={{ color: "var(--theme-elevation-500)" }}>sin datos previos</small>;
  if (!previous) return <small style={{ color: "var(--theme-success-500)" }}>nuevo</small>;
  const change = (current - previous) / previous;
  const color = change >= 0 ? "var(--theme-success-500)" : "var(--theme-error-500)";
  return <small style={{ color }}>{change >= 0 ? "▲" : "▼"} {pct(Math.abs(change))} vs. periodo anterior</small>;
}

const card: React.CSSProperties = { border: "1px solid var(--theme-elevation-150)", borderRadius: 8, padding: "14px 16px", background: "var(--theme-elevation-0)" };

function Kpi({ label, value, current, previous, note }: { label: string; value: ReactNode; current?: number; previous?: number; note?: string }) {
  return (
    <div style={card}>
      <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: ".04em", color: "var(--theme-elevation-600)" }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, margin: "4px 0" }}>{value}</div>
      {current !== undefined && previous !== undefined ? <Delta current={current} previous={previous} /> : null}
      {note ? <div style={{ fontSize: 12, color: "var(--theme-elevation-500)" }}>{note}</div> : null}
    </div>
  );
}

function Grid({ children, min = 180 }: { children: ReactNode; min?: number }) {
  return <div style={{ display: "grid", gap: 12, gridTemplateColumns: `repeat(auto-fit, minmax(${min}px, 1fr))` }}>{children}</div>;
}

function Section({ title, source, children }: { title: string; source: string; children: ReactNode }) {
  return (
    <section style={{ margin: "32px 0" }}>
      <h2 style={{ margin: "0 0 4px" }}>{title}</h2>
      <p style={{ margin: "0 0 14px", fontSize: 13, color: "var(--theme-elevation-500)" }}>Fuente: {source}</p>
      {children}
    </section>
  );
}

function Table({ head, rows }: { head: string[]; rows: (string | number)[][] }) {
  if (!rows.length) return <p style={{ color: "var(--theme-elevation-500)" }}>Sin datos en este periodo.</p>;
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
        <thead><tr>{head.map((cell, i) => <th key={cell} style={{ textAlign: i ? "right" : "left", padding: "6px 8px", borderBottom: "1px solid var(--theme-elevation-150)" }}>{cell}</th>)}</tr></thead>
        <tbody>{rows.map((row, r) => <tr key={r}>{row.map((cell, i) => <td key={i} style={{ textAlign: i ? "right" : "left", padding: "6px 8px", borderBottom: "1px solid var(--theme-elevation-100)", wordBreak: "break-word" }}>{typeof cell === "number" ? fmt.format(cell) : cell}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

function Notice({ children }: { children: ReactNode }) {
  return <div style={{ ...card, background: "var(--theme-elevation-50)" }}>{children}</div>;
}

function Funnel({ steps }: { steps: { label: string; value: number | null; source: string }[] }) {
  const max = Math.max(1, ...steps.map((step) => step.value ?? 0));
  return (
    <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 6 }}>
      {steps.map((step, i) => (
        <li key={step.label} style={{ display: "grid", gridTemplateColumns: "minmax(170px, 260px) 1fr 70px", gap: 10, alignItems: "center", fontSize: 14 }}>
          <span>{i + 1}. {step.label} <small style={{ color: "var(--theme-elevation-500)" }}>({step.source})</small></span>
          <span style={{ background: "var(--theme-elevation-100)", borderRadius: 4, height: 14 }}>
            <span style={{ display: "block", height: 14, borderRadius: 4, width: `${!step.value ? 0 : Math.max(2, (step.value / max) * 100)}%`, background: "var(--theme-success-500)" }} />
          </span>
          <b style={{ textAlign: "right" }}>{step.value === null ? "—" : fmt.format(step.value)}</b>
        </li>
      ))}
    </ol>
  );
}

const LINKS = (s: Awaited<ReturnType<typeof getAnalyticsSettings>>) => [
  { label: "Google Analytics 4", href: s.ga4PropertyId ? `https://analytics.google.com/analytics/web/#/p${s.ga4PropertyId.replace(/\D/g, "")}/reports/intelligenthome` : "https://analytics.google.com/" },
  { label: "Search Console", href: `https://search.google.com/search-console?resource_id=${encodeURIComponent(s.searchConsoleProperty || "sc-domain:limpiezasgranalva.com")}` },
  { label: "Microsoft Clarity", href: s.clarityProjectId ? `https://clarity.microsoft.com/projects/view/${s.clarityProjectId}/dashboard` : "https://clarity.microsoft.com/" },
  { label: "Cloudflare Web Analytics", href: "https://dash.cloudflare.com/?to=/:account/web-analytics" },
  { label: "Tag Manager", href: "https://tagmanager.google.com/" },
  { label: "Looker Studio", href: s.lookerStudioUrl || "https://lookerstudio.google.com/" },
];

export async function AnalyticsView({ initPageResult, params, searchParams }: AdminViewServerProps) {
  const { req, visibleEntities, permissions, locale } = initPageResult;
  const role = (req.user as { role?: string } | null)?.role;
  if (!req.user) redirect("/admin/login?redirect=%2Fadmin%2Fanalitica");
  const template = (children: ReactNode) => (
    <DefaultTemplate i18n={req.i18n} locale={locale} params={params} payload={req.payload} permissions={permissions} searchParams={searchParams} user={req.user ?? undefined} visibleEntities={visibleEntities}>
      <Gutter>{children}</Gutter>
    </DefaultTemplate>
  );
  if (role !== "owner" && role !== "admin") return template(<><h1>Analítica y rendimiento</h1><p>Solo el propietario y los administradores pueden ver esta sección.</p></>);

  const days = [7, 30, 90].includes(Number(searchParams?.periodo)) ? Number(searchParams?.periodo) : 30;
  const p = period(days);
  const payload = req.payload;
  const [settings, leads, ga, gsc, cf, errors7] = await Promise.all([
    getAnalyticsSettings(payload),
    leadStats(payload, p),
    ga4Stats(payload, p),
    searchConsoleStats(payload, p),
    cloudflareStats(payload, p),
    formErrorCount(payload, 7),
  ]);
  const L = leads.current;
  const Lp = leads.previous;
  const gaOk = ga.status === "ok" ? ga : null;
  const ev = (name: string) => gaOk?.events[name]?.current ?? 0;
  const evPrev = (name: string) => gaOk?.events[name]?.previous ?? 0;
  const cfOk = cf.status === "ok" ? cf : null;
  const cfVisits = cfOk?.current.total?.[0]?.sum?.visits ?? null;
  const cfVisitsPrev = cfOk?.previous.total?.[0]?.sum?.visits ?? 0;
  const cfViews = cfOk?.current.total?.[0]?.count ?? null;
  const vitals = cfOk?.current.vitals?.[0]?.quantiles;
  const gaSessions = gaOk?.current[0] ?? null;
  const visitsForRate = cfVisits ?? gaSessions;
  const notice = typeof searchParams?.google === "string" ? searchParams.google : null;

  return template(
    <>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "baseline", justifyContent: "space-between", marginTop: 24 }}>
        <h1 style={{ margin: 0 }}>Analítica y rendimiento</h1>
        <nav style={{ display: "flex", gap: 8 }} aria-label="Periodo">
          {[7, 30, 90].map((d) => (
            <a key={d} href={`/admin/analitica?periodo=${d}`} className={`btn btn--size-small ${d === days ? "btn--style-primary" : "btn--style-secondary"}`} aria-current={d === days ? "page" : undefined}>{d} días</a>
          ))}
        </nav>
      </div>
      <p style={{ color: "var(--theme-elevation-600)" }}>
        Últimos {days} días comparados con los {days} anteriores. Las cifras de cada fuente no coinciden entre sí: Cloudflare cuenta todas las visitas sin cookies;
        GA4 solo a quien acepta la analítica; las solicitudes salen del panel y son completas.
      </p>
      {notice ? <Notice>Conexión con Google: <b>{notice}</b></Notice> : null}
      {typeof searchParams?.informe === "string" ? <Notice>Informes: <b>{searchParams.informe}</b></Notice> : null}

      <Section title="Resumen" source="Cloudflare (visitas), GA4 (clics) y panel (solicitudes)">
        <Grid>
          <Kpi label="Visitas (Cloudflare)" value={cfVisits === null ? "—" : fmt.format(cfVisits)} current={cfVisits ?? undefined} previous={cfVisits === null ? undefined : cfVisitsPrev} note={cfVisits === null ? "Cloudflare sin conectar" : undefined} />
          <Kpi label="Páginas vistas (Cloudflare)" value={cfViews === null ? "—" : fmt.format(cfViews)} />
          <Kpi label="Sesiones medibles (GA4)" value={gaSessions === null ? "—" : fmt.format(gaSessions)} current={gaSessions ?? undefined} previous={gaOk?.previous[0]} />
          <Kpi label="Usuarios nuevos / totales (GA4)" value={gaOk ? `${fmt.format(gaOk.current[2])} / ${fmt.format(gaOk.current[1])}` : "—"} />
          <Kpi label="Solicitudes recibidas" value={fmt.format(L.total)} current={L.total} previous={Lp.total} note={L.spam ? `${L.spam} marcadas como spam (excluidas)` : undefined} />
          <Kpi label="Tasa de conversión" value={visitsForRate ? pct(L.total / visitsForRate) : "—"} note={visitsForRate ? `solicitudes / ${cfVisits !== null ? "visitas" : "sesiones GA4"}` : "Necesita Cloudflare o GA4"} />
          <Kpi label="Conversiones (eventos clave GA4)" value={gaOk ? fmt.format(gaOk.current[4]) : "—"} current={gaOk?.current[4]} previous={gaOk?.previous[4]} note="formulario, llamada, WhatsApp y app" />
          <Kpi label="Clientes ganados" value={fmt.format(L.won)} current={L.won} previous={Lp.won} note={L.wonAmount ? `${eur.format(L.wonAmount)} estimados` : undefined} />
        </Grid>
      </Section>

      <Section title="Contactos y clics" source="GA4 (solo visitantes que aceptan la analítica)">
        {ga.status !== "ok" ? <Notice>{ga.status === "sin-configurar" ? "Añade el ID de propiedad de GA4 en Analítica → Ajustes de analítica." : ga.status === "sin-conectar" ? <>Conecta Google para ver estos datos. {googleConfigured() ? <a href="/api/analitica/google/conectar">Conectar con la cuenta de Granalva →</a> : "Faltan las credenciales OAuth en Netlify (ver docs/ANALITICA.md)."}</> : <>No se pudo leer GA4: {ga.message}</>}</Notice> : (
          <Grid>
            {[["Clics en presupuesto", "quote_cta_click"], ["Clics en teléfono", "phone_click"], ["Clics en WhatsApp", "whatsapp_click"], ["Clics en correo", "email_click"], ["Aplicación de pedidos", "app_order_click"], ["Pedidos particulares", "order_cta_click"], ["Formularios correctos", "quote_form_success"], ["Formularios con error técnico", "quote_form_error"]].map(([label, name]) => (
              <Kpi key={name} label={label} value={fmt.format(ev(name))} current={ev(name)} previous={evPrev(name)} />
            ))}
          </Grid>
        )}
      </Section>

      <Section title="Embudo de conversión" source="pasos 1-7: GA4 · pasos 8-10: solicitudes del panel">
        <Funnel steps={[
          { label: "Visita a la web", value: gaOk ? gaOk.current[0] : null, source: "GA4" },
          { label: "Vista de servicio", value: gaOk ? ev("service_view") : null, source: "GA4" },
          { label: "Clic en «Solicitar presupuesto»", value: gaOk ? ev("quote_cta_click") : null, source: "GA4" },
          { label: "Formulario visto", value: gaOk ? ev("quote_form_view") : null, source: "GA4" },
          { label: "Formulario empezado", value: gaOk ? ev("quote_form_start") : null, source: "GA4" },
          { label: "Envío", value: gaOk ? ev("quote_form_submit") : null, source: "GA4" },
          { label: "Confirmación correcta", value: gaOk ? ev("quote_form_success") : L.total, source: gaOk ? "GA4" : "panel" },
          { label: "Solicitud gestionada", value: L.contacted, source: "panel" },
          { label: "Presupuesto enviado", value: L.quoted, source: "panel" },
          { label: "Cliente conseguido", value: L.won, source: "panel" },
        ]} />
        {gaOk ? <p style={{ fontSize: 13, color: "var(--theme-elevation-500)" }}>Abandono del formulario: {ev("quote_form_start") ? pct(1 - ev("quote_form_success") / ev("quote_form_start")) : "—"} de quienes lo empiezan no lo terminan (solo usuarios que aceptan la analítica).</p> : null}
      </Section>

      <Section title="Empresas, particulares y Sierra Nevada" source="solicitudes del panel">
        <Grid>
          <Kpi label="Empresas: solicitudes / ganadas" value={`${L.business.total} / ${L.business.won}`} current={L.business.total} previous={Lp.business.total} note={L.business.total ? `cierre ${pct(L.business.won / L.business.total)}` : undefined} />
          <Kpi label="Particulares: solicitudes / ganadas" value={`${L.private.total} / ${L.private.won}`} current={L.private.total} previous={Lp.private.total} note={L.private.total ? `cierre ${pct(L.private.won / L.private.total)}` : undefined} />
          <Kpi label="Sierra Nevada: solicitudes / ganadas" value={`${L.sierra.total} / ${L.sierra.won}`} current={L.sierra.total} previous={Lp.sierra.total} note={gaOk && ev("sierra_nevada_view") ? `${fmt.format(ev("sierra_nevada_view"))} vistas · conversión ${pct(L.sierra.total / ev("sierra_nevada_view"))}` : undefined} />
          <Kpi label="Ganadas / perdidas" value={`${L.won} / ${L.lost}`} note={L.lostReasons.length ? `Motivo principal: ${L.lostReasons[0][0]}` : undefined} />
        </Grid>
      </Section>

      <Section title="Origen de las solicitudes" source="atribución guardada en cada solicitud (interna, no se envía a terceros)">
        <Grid min={300}>
          <div><h3>Canales</h3><Table head={["Canal", "Solicitudes"]} rows={L.byChannel.slice(0, 10)} /></div>
          <div><h3>Campañas UTM</h3><Table head={["utm_campaign", "Solicitudes"]} rows={L.byCampaign.slice(0, 10)} /></div>
          <div><h3>Clientes ganados por origen</h3><Table head={["Campaña o canal", "Ganadas"]} rows={L.wonByCampaign.slice(0, 10)} /></div>
          <div><h3>Página de entrada</h3><Table head={["Página", "Solicitudes"]} rows={L.byLanding.slice(0, 10)} /></div>
          <div><h3>Página del formulario</h3><Table head={["Página", "Solicitudes"]} rows={L.byFormPage.slice(0, 10)} /></div>
          <div><h3>Servicio solicitado</h3><Table head={["Servicio", "Solicitudes"]} rows={L.byService.slice(0, 12).map(([slug, n]) => [serviceLabel(slug), n])} /></div>
        </Grid>
      </Section>

      {gaOk ? (
        <Section title="Tráfico y comportamiento" source="GA4">
          {gaOk.partialError ? <Notice>Algunos datos necesitan registrar las dimensiones personalizadas en GA4 (ver docs/ANALITICA.md): {gaOk.partialError}</Notice> : null}
          <Grid min={300}>
            <div><h3>Canales de adquisición</h3><Table head={["Canal", "Sesiones", "Conversiones"]} rows={gaOk.channels.map((r) => [r.dims[0], r.values[0], r.values[1]])} /></div>
            <div><h3>Campañas</h3><Table head={["Campaña", "Sesiones", "Conversiones"]} rows={gaOk.campaigns.filter((r) => !/^\((not set|direct|organic|referral)\)$/.test(r.dims[0])).map((r) => [r.dims[0], r.values[0], r.values[1]])} /></div>
            <div><h3>Servicios más vistos</h3><Table head={["Servicio", "Vistas"]} rows={gaOk.services.map((r) => [serviceLabel(r.dims[0]), r.values[0]])} /></div>
            <div><h3>Páginas más vistas</h3><Table head={["Página", "Vistas"]} rows={gaOk.pages.map((r) => [r.dims[0], r.values[0]])} /></div>
            <div><h3>Páginas de entrada con más conversiones</h3><Table head={["Página", "Sesiones", "Conversiones"]} rows={gaOk.landings.map((r) => [r.dims[0], r.values[0], r.values[1]])} /></div>
            <div><h3>Dispositivo</h3><Table head={["Dispositivo", "Sesiones", "Conversiones"]} rows={gaOk.devices.map((r) => [r.dims[0], r.values[0], r.values[1]])} /></div>
            <div><h3>Zonas (provincia o región)</h3><Table head={["Zona", "Sesiones"]} rows={gaOk.regions.map((r) => [r.dims[0], r.values[0]])} /></div>
            <div><h3>Errores</h3><Table head={["Indicador", "Total"]} rows={[["Páginas 404 vistas", gaOk.notFound], ["Formularios con error técnico", ev("quote_form_error")], ["Errores de validación", ev("quote_form_validation_error")], ["Incidencias del servidor (7 días, panel)", errors7]]} /></div>
          </Grid>
        </Section>
      ) : (
        <Section title="Errores" source="panel"><Table head={["Indicador", "Total"]} rows={[["Incidencias del servidor (7 días)", errors7]]} /></Section>
      )}

      <Section title="Google: búsquedas orgánicas" source={`Search Console${gsc.status === "ok" ? ` (${gsc.range}, datos con 2-3 días de retraso)` : ""}`}>
        {gsc.status !== "ok" ? <Notice>{gsc.status === "sin-conectar" ? "Conecta Google para ver las búsquedas." : <>No se pudo leer Search Console: {gsc.message}</>}</Notice> : (
          <>
            <Grid>
              <Kpi label="Clics" value={fmt.format(gsc.total?.clicks ?? 0)} current={gsc.total?.clicks ?? 0} previous={gsc.previous?.clicks ?? 0} />
              <Kpi label="Impresiones" value={fmt.format(gsc.total?.impressions ?? 0)} current={gsc.total?.impressions ?? 0} previous={gsc.previous?.impressions ?? 0} />
              <Kpi label="CTR" value={pct(gsc.total?.ctr ?? 0)} />
              <Kpi label="Posición media" value={(gsc.total?.position ?? 0).toLocaleString("es-ES", { maximumFractionDigits: 1 })} />
            </Grid>
            <Grid min={300}>
              <div><h3>Consultas principales</h3><Table head={["Consulta", "Clics", "Impr.", "Pos."]} rows={gsc.queries.map((r) => [r.keys?.[0] ?? "", r.clicks, r.impressions, r.position.toFixed(1)])} /></div>
              <div><h3>Páginas</h3><Table head={["Página", "Clics", "Impr."]} rows={gsc.pages.map((r) => [(r.keys?.[0] ?? "").replace(/^https:\/\/[^/]+/, ""), r.clicks, r.impressions])} /></div>
              <div><h3>Dispositivo</h3><Table head={["Dispositivo", "Clics", "Impr."]} rows={gsc.devices.map((r) => [r.keys?.[0] ?? "", r.clicks, r.impressions])} /></div>
            </Grid>
          </>
        )}
      </Section>

      <Section title="Visitas sin cookies y Core Web Vitals" source="Cloudflare Web Analytics (todas las visitas reales, sin bots)">
        {cf.status !== "ok" ? <Notice>{cf.status === "sin-configurar" ? "Falta el site tag en los ajustes de analítica o CF_ACCOUNT_ID / CF_API_TOKEN en Netlify." : <>No se pudo leer Cloudflare: {cf.message}</>}</Notice> : (
          <>
            <Grid>
              <Kpi label="LCP p75" value={vitals?.largestContentfulPaintP75 ? `${(vitals.largestContentfulPaintP75 / 1000).toFixed(2)} s` : "—"} note="bueno ≤ 2,5 s" />
              <Kpi label="INP p75" value={vitals?.interactionToNextPaintP75 ? `${Math.round(vitals.interactionToNextPaintP75)} ms` : "—"} note="bueno ≤ 200 ms" />
              <Kpi label="CLS p75" value={vitals?.cumulativeLayoutShiftP75 !== undefined ? vitals.cumulativeLayoutShiftP75.toFixed(3) : "—"} note="bueno ≤ 0,1" />
            </Grid>
            <Grid min={300}>
              <div><h3>Páginas</h3><Table head={["Página", "Vistas"]} rows={(cfOk?.current.pages ?? []).map((r) => [r.dimensions?.requestPath ?? "", r.count ?? 0])} /></div>
              <div><h3>Referentes</h3><Table head={["Origen", "Visitas"]} rows={(cfOk?.current.referers ?? []).map((r) => [r.dimensions?.refererHost || "(directo)", r.sum?.visits ?? 0])} /></div>
              <div><h3>Países</h3><Table head={["País", "Visitas"]} rows={(cfOk?.current.countries ?? []).map((r) => [r.dimensions?.countryName ?? "", r.sum?.visits ?? 0])} /></div>
              <div><h3>Dispositivo</h3><Table head={["Tipo", "Visitas"]} rows={(cfOk?.current.devices ?? []).map((r) => [r.dimensions?.deviceType ?? "", r.sum?.visits ?? 0])} /></div>
            </Grid>
          </>
        )}
      </Section>

      <Section title="Herramientas y conexión" source="cuentas propiedad de Granalva">
        <Grid>
          {LINKS(settings).map((link) => <a key={link.label} style={{ ...card, display: "block", textDecoration: "none" }} href={link.href} target="_blank" rel="noreferrer">{link.label} ↗</a>)}
        </Grid>
        <p style={{ marginTop: 16 }}>
          Google: {settings.googleConnected ? <>conectado con <b>{settings.googleConnectedEmail}</b>. </> : "sin conectar. "}
          {googleConfigured() ? (settings.googleConnected ? null : <a href="/api/analitica/google/conectar">Conectar con la cuenta de Granalva</a>) : "Faltan las credenciales OAuth en Netlify."}
        </p>
        {settings.googleConnected ? <form method="post" action="/api/analitica/google/desconectar"><button className="btn btn--style-secondary btn--size-small" type="submit">Desconectar Google</button></form> : null}
        <p><a href="/admin/globals/analytics-settings">Ajustes de analítica (identificadores, destinatarios y alertas) →</a></p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {(["semanal", "mensual", "alertas"] as const).map((tipo) => (
            <form key={tipo} method="post" action={`/api/analitica/informes?tipo=${tipo}`}><button className="btn btn--style-secondary btn--size-small" type="submit">Enviar ahora: {tipo === "alertas" ? "comprobar alertas" : `informe ${tipo}`}</button></form>
          ))}
        </div>
      </Section>
    </>,
  );
}
