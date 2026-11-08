import config from "@payload-config";
import { draftMode, headers } from "next/headers";
import { redirect } from "next/navigation";
import { getPayload } from "payload";

// Vista previa de borradores: solo para usuarios con sesión en el panel.
// GET /api/preview?path=/blog/mi-articulo
export async function GET(request: Request) {
  const path = new URL(request.url).searchParams.get("path") ?? "/";
  if (!/^\/(blog|servicios)\/[a-z0-9-]+$/.test(path)) return new Response("Ruta de vista previa no válida", { status: 400 });
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await headers() });
  if (!user) return new Response("Inicia sesión en el panel para ver la vista previa", { status: 401 });
  (await draftMode()).enable();
  redirect(path);
}
