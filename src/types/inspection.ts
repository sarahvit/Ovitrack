export type InspectionModelStatus =
    | "no_image"
    | "unprocessed"
    | "queue"
    | "processed"
    | "failed";

export type InspectionLocation = {
    id: number;
    latitude: number;
    longitude: number;
    block: string | null;
    neighbourhood: string | null;
    street_name: string | null;
    street_number: string | null;
    macro_zone: string | null;
    micro_zone: string | null;
    zone: string | null;
    created_at: string;
};

export type InspectionProcessResult = {
    id: number;
    inspection_id: number;
    egg_count: number;
    confidence: number;
    processed_image_path: string | null;
    created_at: string;
};

export type Inspection = {
    id: number;
    ovitrap_id: number;
    operator_id: number;
    location_id: number;
    epidemiological_week: number;
    capture_date: string;
    ovitrap_scanned: boolean;
    justification: string | null;
    raw_image_path: string | null;
    model_status: InspectionModelStatus;
    created_at: string;
    location?: InspectionLocation;
    result?: InspectionProcessResult | null;
};

export type InspectionList = {
    items: Inspection[];
    page: number;
    size: number;
    total: number;
};

export type CreateInspectionInput = {
    ovitrap_id: number;
    ovitrap_scanned: boolean;
    capture_date?: string;
    justification?: string;
    file?: File | null;
};