// Botón de exportación en la lista de solicitudes del panel.
export function ExportCsvButton() {
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", margin: "0 0 18px" }}>
      <a className="btn btn--style-secondary btn--size-small" href="/api/contact-submissions/export.csv" download>
        Exportar todas (CSV)
      </a>
      <a className="btn btn--style-secondary btn--size-small" href="/api/contact-submissions/export.csv?status=nuevo" download>
        Exportar nuevas (CSV)
      </a>
    </div>
  );
}
