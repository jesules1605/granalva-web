// Build en Vercel: aplica las migraciones pendientes de la base de datos (si hay
// DATABASE_URL) y después compila. Si una migración falla, el despliegue se detiene
// y la versión anterior sigue en línea.
import { execSync } from "node:child_process";

const run = (command) => execSync(command, { stdio: "inherit", env: process.env });
if (process.env.DATABASE_URL) {
  console.log("[build] Aplicando migraciones de Payload…");
  run("npx payload migrate");
} else {
  console.log("[build] Sin DATABASE_URL: se omite la migración (la web usa los valores por defecto).");
}
run("npx next build");
