import { requireAuth } from "./requireAuth";

export async function requireGestor() {
    const user = await requireAuth();

    if (user.role !== "gestor") {
        throw new Error("Forbidden");
    }

    return user;
}
