import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function apiServer(
    path: string,
    options: RequestInit = {}
) {
    const token = (await cookies()).get("token")?.value;

    return fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            ...(options.headers || {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        cache: "no-store",
    });
}
