import { getMe } from "@/lib/api/endpoints/users";

export async function requireAuth() {
    const user = await getMe();

    if (!user) {
        throw new Error("Unauthorized");
    }

    return user;
}
