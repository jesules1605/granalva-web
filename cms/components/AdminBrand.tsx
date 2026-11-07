// Identidad Granalva en el panel de Payload (logotipo real, estático y sin deformar).
/* eslint-disable @next/next/no-img-element -- componente del panel, fuera del sitio público */
export function AdminLogo() {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 14 }}>
      <img src="/granalva-logo.jpg" alt="Granalva" width={56} height={56} style={{ borderRadius: "50%" }} />
      <span style={{ fontFamily: "Georgia, serif", fontSize: 26, letterSpacing: ".06em", color: "#123d92" }}>GRANALVA</span>
    </span>
  );
}

export function AdminIcon() {
  return <img src="/granalva-logo.jpg" alt="Granalva" width={26} height={26} style={{ borderRadius: "50%" }} />;
}
