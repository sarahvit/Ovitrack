import { apiClient } from "../client";

export interface LocationInput {
    latitude: number;
    longitude: number;
    block?: string | null;
    neighbourhood?: string | null;
    street_name?: string | null;
    street_number?: string | null;
    macro_zone?: string | null;
    micro_zone?: string | null;
}

export interface LocationRead extends LocationInput {
    id: number;
    created_at: string;
}

export interface Ovitrap {
    id: number;
    code: string;
    is_active: boolean;
    created_at: string;
    current_location: LocationRead | null;
}

export interface OvitrapCreatePayload {
    code: string;
    is_active?: boolean;
    location: LocationInput;
    start_date?: string;
}

export interface OvitrapUpdatePayload {
    code?: string;
    is_active?: boolean;
}

export interface OvitrapRelocatePayload {
    location: LocationInput;
    start_date: string;
}

export interface OvitrapLocationHistoryItem {
    id: number;
    ovitrap_id: number;
    location_id: number;
    start_date: string;
    end_date: string | null;
    created_at: string;
    location: LocationRead;
}

export interface OvitrapListResponse {
    items: Ovitrap[];
    page: number;
    size: number;
    total: number;
}

export interface Process {
    id: number;
    inspection_id: number;
    egg_count: number;
    confidence: number;
    processed_image_path?: string | null;
    created_at: string;
}

export async function processResults(): Promise<Process[]> {
    const { data } = await apiClient.get("/process-results/");
    return data.items ?? data;
}

export async function listOvitrampasPaged(params?: {
    page?: number;
    size?: number;
    sort?: string;
    code?: string;
    is_active?: boolean;
}): Promise<OvitrapListResponse> {
    const { data } = await apiClient.get("/ovitraps/", { params });

    if (Array.isArray(data)) {
        return {
            items: data,
            page: params?.page ?? 1,
            size: params?.size ?? data.length,
            total: data.length,
        };
    }

    return {
        items: data.items ?? [],
        page: data.page ?? params?.page ?? 1,
        size: data.size ?? params?.size ?? 20,
        total: data.total ?? 0,
    };
}

export async function listOvitrampas(params?: {
    page?: number;
    size?: number;
    sort?: string;
    code?: string;
    is_active?: boolean;
}): Promise<Ovitrap[]> {
    const data = await listOvitrampasPaged(params);
    return data.items;
}

export async function getOvitrampa(id: number): Promise<Ovitrap> {
    const { data } = await apiClient.get(`/ovitraps/${id}`);
    return data;
}

export async function createOvitrampa(
    payload: OvitrapCreatePayload
): Promise<Ovitrap> {
    const { data } = await apiClient.post("/ovitraps/", payload);
    return data;
}

export async function updateOvitrampa(
    id: number,
    payload: OvitrapUpdatePayload
): Promise<Ovitrap> {
    const { data } = await apiClient.patch(`/ovitraps/${id}`, payload);
    return data;
}

export async function relocateOvitrampa(
    id: number,
    payload: OvitrapRelocatePayload
): Promise<OvitrapLocationHistoryItem> {
    const { data } = await apiClient.post(`/ovitraps/${id}/locations`, payload);
    return data;
}

export async function listOvitrampaLocationHistory(
    id: number
): Promise<OvitrapLocationHistoryItem[]> {
    const { data } = await apiClient.get(`/ovitraps/${id}/locations`);
    return data ?? [];
}

export async function deleteOvitrampa(id: number) {
    await apiClient.delete(`/ovitraps/${id}`);
}