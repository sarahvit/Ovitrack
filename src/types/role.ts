export const Roles = ["gestor", "técnico"] as const;


export type Role = typeof Roles[number];