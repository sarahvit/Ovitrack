import { apiServer } from "../server";
import { User } from "@/types/user";

export async function getMe(): Promise<User | null> {
    const res = await apiServer("/users/me");

    if (!res.ok) return null;

    return res.json();
}
