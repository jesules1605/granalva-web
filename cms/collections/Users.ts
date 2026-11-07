import type { CollectionConfig } from "payload";
import { canAccessAdmin, isOwner, isOwnerOrSelf, ownerOnlyField } from "../access";

export const Users: CollectionConfig = {
  slug: "users",
  labels: { singular: "Usuario", plural: "Usuarios" },
  admin: { useAsTitle: "email", defaultColumns: ["name", "email", "role", "active"], group: "Administración" },
  auth: {
    // Bloqueo temporal tras 5 intentos fallidos y sesiones de 8 horas.
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000,
    tokenExpiration: 8 * 60 * 60,
    cookies: { secure: process.env.NODE_ENV === "production", sameSite: "Lax" },
  },
  access: {
    admin: canAccessAdmin,
    read: isOwnerOrSelf,
    create: isOwner,
    update: isOwnerOrSelf,
    delete: isOwner,
  },
  hooks: {
    beforeChange: [
      // La primera cuenta creada en /admin es siempre la del propietario.
      async ({ data, operation, req }) => {
        if (operation === "create") {
          const { totalDocs } = await req.payload.count({ collection: "users", overrideAccess: true, req });
          if (totalDocs === 0) return { ...data, role: "owner", active: true };
        }
        return data;
      },
    ],
  },
  fields: [
    { name: "name", label: "Nombre", type: "text", required: true },
    {
      name: "role",
      label: "Rol",
      type: "select",
      required: true,
      defaultValue: "editor",
      saveToJWT: true,
      options: [
        { label: "Propietario", value: "owner" },
        { label: "Administrador", value: "admin" },
        { label: "Editor", value: "editor" },
      ],
      access: { create: ownerOnlyField, update: ownerOnlyField },
    },
    {
      name: "active",
      label: "Cuenta activa",
      type: "checkbox",
      defaultValue: true,
      saveToJWT: true,
      access: { create: ownerOnlyField, update: ownerOnlyField },
      admin: { description: "Desactiva la cuenta para impedir el acceso sin borrar el historial." },
    },
  ],
};
