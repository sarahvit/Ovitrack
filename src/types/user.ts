import { Role } from "./role";

export type User = {
    id: number;
    name: string;
    email: string;
    role: Role;
    is_verified: boolean;
    created_at: string;
};


