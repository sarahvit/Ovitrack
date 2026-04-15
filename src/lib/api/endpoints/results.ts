import { apiClient } from "@/lib/api/client";
import {
    PublicResultDashboardRead,
    PublicResultFilterOptionsRead,
    ResultListItem,
    ResultListResponse,
} from "@/types/result";

export async function listResults(params?: {
    page?: number;
    size?: number;
    sort?: string;
    ovitrap_id?: number;
    epidemiological_week?: number;
    operator_id?: number;
    location_id?: number;
    model_status?: string;
    ovitrap_scanned?: boolean;
    has_processing?: boolean;
}): Promise<ResultListResponse> {
    const { data } = await apiClient.get<ResultListResponse>("/results/", {
        params,
    });

    return data;
}

export async function getResultByInspection(
    inspectionId: number
): Promise<ResultListItem> {
    const { data } = await apiClient.get<ResultListItem>(`/results/${inspectionId}`);
    return data;
}

export async function getPublicResultFilters(): Promise<PublicResultFilterOptionsRead> {
    const { data } = await apiClient.get<PublicResultFilterOptionsRead>(
        "/results/public/filters"
    );
    return data;
}

export async function getPublicDashboard(params: {
    year: number;
    epidemiological_week?: number;
}): Promise<PublicResultDashboardRead> {
    const { data } = await apiClient.get<PublicResultDashboardRead>(
        "/results/public/dashboard",
        {
            params,
        }
    );

    return data;
}