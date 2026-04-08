import { apiClient } from "@/lib/api/client"
import { ProcessResultResponse, ProcessResultList } from "@/types/process"

export async function listProcessResults(params: {
    page?: number;
    size?: number;
    sort?: string;
    image_id?: number;
    date_from?: string;
    date_to?: string;
    min_confidence?: number;
}): Promise<ProcessResultList> {
    const { data } = await apiClient.get("/process-results/", { params})

    return data
}

export async function getProcessResults(id: number): Promise<ProcessResultResponse> {
    const { data } = await apiClient.get(`/process-results/${id}`)

    return data
}


