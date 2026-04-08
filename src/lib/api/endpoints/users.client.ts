import { Role } from "@/types/role";
import { apiClient } from "../client";
import { User } from "@/types/user";

export type CreateUserDTO = {
    name: string;
    email: string;
    password: string;
    role: Role;
};

export async function getMeClient(): Promise<User | null> {
    try {
        const { data } = await apiClient.get<User>("/users/me");
        return data;
    } catch {
        return null;
    }
}

export async function createUser(payload: CreateUserDTO): Promise<User> {
    const { data } = await apiClient.post<User>("/users/", payload);
    return data;
}

export async function listUsers(): Promise<User[]> {
    const { data } = await apiClient.get<{
        items: User[];
        page: number;
        size: number;
        total: number;
    }>("/users/");

    return data.items;
}
export async function updateUser(
    id: number,
    payload: { name?: string; password?: string }
) {
    const body: any = {};
    if (payload.name) body.name = payload.name;
    if (payload.password) body.password = payload.password;

    await apiClient.patch(`/users/${id}`, body);
}


export async function deleteUser(id: number) {
    await apiClient.delete(`/users/${id}`);
}
export async function updateUserRole(id: number, role: Role) {
    await apiClient.patch(`/users/${id}/role`, { role });
}
