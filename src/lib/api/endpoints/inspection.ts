import { apiClient } from "@/lib/api/client";
import {
    Inspection,
    InspectionList,
    CreateInspectionInput,
} from "@/types/inspection";

export async function createInspection(
    payload: CreateInspectionInput
): Promise<Inspection> {
    const formData = new FormData();

    formData.append("ovitrap_id", String(payload.ovitrap_id));
    formData.append("ovitrap_scanned", String(payload.ovitrap_scanned));

    if (payload.capture_date) {
        formData.append("capture_date", payload.capture_date);
    }

    if (payload.justification) {
        formData.append("justification", payload.justification);
    }

    if (payload.file) {
        formData.append("file", payload.file);
    }

    const { data } = await apiClient.post<Inspection>("/inspections/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    return data;
}

export async function listInspections(params?: {
    page?: number;
    size?: number;
    sort?: string;
    ovitrap_id?: number;
    operator_id?: number;
    location_id?: number;
    epidemiological_week?: number;
    model_status?: string;
    ovitrap_scanned?: boolean;
}): Promise<InspectionList> {
    const { data } = await apiClient.get<InspectionList>("/inspections/", {
        params,
    });

    return data;
}

export async function getInspection(id: number): Promise<Inspection> {
    const { data } = await apiClient.get<Inspection>(`/inspections/${id}`);
    return data;
}

export async function deleteInspection(id: number): Promise<{ message: string }> {
    const { data } = await apiClient.delete<{ message: string }>(
        `/inspections/${id}`
    );
    return data;
}