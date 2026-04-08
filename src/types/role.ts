export const Roles = ["gestor", "tecnico"] as const;


export type Role = typeof Roles[number];