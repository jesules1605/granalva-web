import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from "payload";

// Regenera las páginas estáticas afectadas cuando cambia el contenido del panel.
// Fuera de Next (CLI de migraciones, scripts) revalidatePath no existe: se ignora.
export async function revalidate(paths: string[]) {
  try {
    const { revalidatePath } = await import("next/cache");
    for (const path of paths) revalidatePath(path, path.endsWith("]") ? "page" : undefined);
    revalidatePath("/", "layout");
  } catch {
    // Sin contexto de Next: no hay caché que invalidar.
  }
}

export const revalidateSite =
  (paths: string[] = ["/"]): CollectionAfterChangeHook =>
  async ({ doc }) => {
    await revalidate(paths);
    return doc;
  };

export const revalidateSiteOnDelete =
  (paths: string[] = ["/"]): CollectionAfterDeleteHook =>
  async ({ doc }) => {
    await revalidate(paths);
    return doc;
  };

export const revalidateGlobal: GlobalAfterChangeHook = async ({ doc }) => {
  await revalidate(["/"]);
  return doc;
};
