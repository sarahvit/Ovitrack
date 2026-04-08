import { apiClient } from "../client";

type LoginDTO = {
    email: string;
    password: string;
};

type LoginResponse = {
    access_token: string;
    token_type: string;
    expires_in: number;

}

export async function login(data: LoginDTO) {
    const res = await apiClient.post<LoginResponse>("auth/login", data);

    const token = res.data.access_token;

    if(!token){
        throw new Error("Token não retornado");
    }

    localStorage.setItem("token", token);

    return token;
}


export function logout() {
    localStorage.removeItem("token");
}