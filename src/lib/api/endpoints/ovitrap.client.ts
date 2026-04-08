import { apiClient } from "../client";

export interface Ovitrap {
    id: number;
    code?: string;
    location_lat?: number;
    location_lng?: number,
    week_epidemiological?: string;
    quar?: string;
    neighborhood?: string;
    street_name?: string;
    street_number?: string;
    macro?: string;
    micro?: string;
    zone?: string;
    agent?: string;
    processed?: boolean;
    status?: string;
    reason?: string;
    created_at: string;
}
export interface Process{
    id: number;
    image_id: number;
    egg_count: number;
    confidence: number;
    
}


export async function processResults(){
    const { data } = await apiClient.get(`/process-results/`);
    return data;
}
export async function listOvitrampas() {
    const { data } = await apiClient.get("/ovitraps/");
    return data.items ?? data;
}

export async function getOvitrampa(id: number) {
    const { data } = await apiClient.get(`/ovitraps/${id}`);
    return data;
}
export async function createOvitrampa(payload: Partial<Ovitrap>) {
    const { data } = await apiClient.post("/ovitraps/", payload);
    return data;
}
export async function updateOvitrampa(id: number, payload: Partial<Ovitrap>) {
    const { data } = await apiClient.put(`/ovitraps/${id}`, payload);
    return data;
}
export async function deleteOvitrampa(id: number) {
    await apiClient.delete(`/ovitraps/${id}`);
}



