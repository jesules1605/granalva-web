/* eslint-disable @next/next/no-html-link-for-pages -- enlaces del panel y de la API: navegación completa a propósito (OAuth y vistas de Payload). */
// Enlace a «Analítica y rendimiento» en el menú lateral del panel.
export function AnalyticsNavLink() {
  return (
    <a href="/admin/analitica" className="nav__link" style={{ display: "block", padding: "6px 0", fontWeight: 600 }}>
      Analítica y rendimiento
    </a>
  );
}
