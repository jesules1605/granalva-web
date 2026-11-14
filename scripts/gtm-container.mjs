// Genera el contenedor de Google Tag Manager importable (docs/gtm/granalva-gtm-contenedor.json)
// a partir del diccionario de eventos (app/lib/analytics/events.ts). Uso: node scripts/gtm-container.mjs
// Tras importarlo solo hay que escribir el ID de medición de GA4 en la variable «GA4 - ID de medición».
import { readFileSync, writeFileSync } from "node:fs";

const source = readFileSync(new URL("../app/lib/analytics/events.ts", import.meta.url), "utf8");
const block = source.slice(source.indexOf("export const EVENTS = {"), source.indexOf("} as const;"));
const events = [...block.matchAll(/^\s+([a-z0-9_]+):/gm)].map((m) => m[1]);
const params = [...source.slice(source.indexOf("export const ALLOWED_PARAMS = ["), source.indexOf("] as const;", source.indexOf("export const ALLOWED_PARAMS"))).matchAll(/"([a-z_]+)"/g)].map((m) => m[1]).filter((p) => p !== "page_path");

const t = (key, value) => ({ type: "TEMPLATE", key, value });
const ids = { account: "0", container: "0" };
const variables = [
  { variableId: "1", name: "GA4 - ID de medición", type: "c", parameter: [t("value", "G-XXXXXXXXXX")] },
  ...params.map((name, i) => ({ variableId: String(10 + i), name: `DLV - ${name}`, type: "v", parameter: [{ type: "INTEGER", key: "dataLayerVersion", value: "2" }, { type: "BOOLEAN", key: "setDefaultValue", value: "false" }, t("name", name)] })),
].map((v) => ({ accountId: ids.account, containerId: ids.container, ...v }));

const triggers = [
  {
    triggerId: "100",
    name: "CE - Eventos Granalva (diccionario)",
    type: "CUSTOM_EVENT",
    customEventFilter: [{ type: "MATCH_REGEX", parameter: [t("arg0", "{{_event}}"), t("arg1", `^(${events.join("|")})$`)] }],
  },
].map((v) => ({ accountId: ids.account, containerId: ids.container, ...v }));

const tags = [
  {
    tagId: "200",
    name: "Google tag - GA4 (sin page_view automático)",
    type: "googtag",
    parameter: [t("tagId", "{{GA4 - ID de medición}}"), { type: "LIST", key: "configSettingsTable", list: [{ type: "MAP", map: [t("parameter", "send_page_view"), t("parameterValue", "false")] }] }],
    firingTriggerId: ["2147479573"], // Initialization - All Pages
    tagFiringOption: "ONCE_PER_EVENT",
  },
  {
    tagId: "201",
    name: "GA4 - Evento del diccionario",
    type: "gaawe",
    parameter: [
      t("eventName", "{{Event}}"),
      t("measurementIdOverride", "{{GA4 - ID de medición}}"),
      { type: "LIST", key: "eventSettingsTable", list: params.map((name) => ({ type: "MAP", map: [t("parameter", name), t("parameterValue", `{{DLV - ${name}}}`)] })) },
    ],
    firingTriggerId: ["100"],
    tagFiringOption: "ONCE_PER_EVENT",
  },
].map((v) => ({ accountId: ids.account, containerId: ids.container, ...v }));

const container = {
  exportFormatVersion: 2,
  exportTime: "2026-11-14 00:00:00",
  containerVersion: {
    path: "accounts/0/containers/0/versions/0",
    accountId: ids.account,
    containerId: ids.container,
    containerVersionId: "0",
    container: { path: "accounts/0/containers/0", accountId: ids.account, containerId: ids.container, name: "limpiezasgranalva.com", publicId: "GTM-XXXXXXX", usageContext: ["WEB"] },
    tag: tags,
    trigger: triggers,
    variable: variables,
    builtInVariable: [{ accountId: ids.account, containerId: ids.container, type: "EVENT", name: "Event" }],
  },
};
writeFileSync(new URL("../docs/gtm/granalva-gtm-contenedor.json", import.meta.url), `${JSON.stringify(container, null, 2)}\n`);
console.log(`Contenedor: ${events.length} eventos, ${params.length} parámetros.`);
