import type { Access, FieldAccess, PayloadRequest } from "payload";

// Roles del panel (docs/CMS-ADMIN-PLAN.md):
//  - owner: propietario, acceso total, gestiona usuarios.
//  - admin: gestiona contenido y solicitudes, sin tocar usuarios.
//  - editor: crea y edita contenido; no ve solicitudes ni usuarios.
export type Role = "owner" | "admin" | "editor";

const role = (req: PayloadRequest): Role | undefined => {
  const user = req.user as { role?: Role; active?: boolean } | null;
  if (!user || user.active === false) return undefined;
  return user.role;
};

export const isOwner: Access = ({ req }) => role(req) === "owner";
export const isOwnerOrAdmin: Access = ({ req }) => ["owner", "admin"].includes(role(req) ?? "");
/** Acceso al panel: cualquier cuenta activa con rol. */
export const canAccessAdmin = ({ req }: { req: PayloadRequest }): boolean => Boolean(role(req));
export const isOwnerOrSelf: Access = ({ req }) => (role(req) === "owner" ? true : req.user ? { id: { equals: req.user.id } } : false);
export const ownerOnlyField: FieldAccess = ({ req }) => role(req) === "owner";

/** Contenido editorial: cualquier rol del panel puede crear y editar. */
export const isEditor: Access = ({ req }) => Boolean(role(req));
/** Lectura pública solo de lo publicado; el equipo del panel ve también borradores. */
export const publishedOrEditor: Access = ({ req }) => (role(req) ? true : { _status: { equals: "published" } });
/** Lectura pública solo de lo marcado como visible (colecciones sin borradores). */
export const visibleOrEditor: Access = ({ req }) => (role(req) ? true : { visible: { equals: true } });
