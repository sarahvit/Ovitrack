import { apiClient } from "@/lib/api/client";
import { ProcessResultResponse, ProcessResultList } from "@/types/process";

type ApiProcessResultResponse = {
    id: number;
    inspection_id: number;
    egg_count: number;
    confidence: number;
    processed_image_path?: string | null;
    created_at: string;
};

type ApiProcessResultList = {
    items: ApiProcessResultResponse[];
    size: number;
    page: number;
    total: number;
};

function mapProcessResult(
    item: ApiProcessResultResponse
): ProcessResultResponse {
    return {
        id: item.id,
        inspection_id: item.inspection_id,
        egg_count: item.egg_count,
        confidence: item.confidence,
        processed_image_path: item.processed_image_path,
        created_at: item.created_at,
    };
}

export async function listProcessResults(params: {
    page?: number;
    size?: number;
    sort?: string;
    image_id?: number;
    inspection_id?: number;
}): Promise<ProcessResultList> {
    const { image_id, inspection_id, ...rest } = params;

    const queryParams = {
        ...rest,
        inspection_id: inspection_id ?? image_id,
    };

    const { data } = await apiClient.get<ApiProcessResultList>(
        "/process-results/",
        { params: queryParams }
    );

    return {
        ...data,
        items: (data.items ?? []).map(mapProcessResult),
    };
}

export async function getProcessResults(
    id: number
): Promise<ProcessResultResponse> {
    const { data } = await apiClient.get<ApiProcessResultResponse>(
        `/process-results/${id}`
    );

    return mapProcessResult(data);
}

export async function getProcessResultByInspection(
    inspectionId: number
): Promise<ProcessResultResponse> {
    const { data } = await apiClient.get<ApiProcessResultResponse>(
        `/process-results/inspection/${inspectionId}`
    );

    return mapProcessResult(data);
}