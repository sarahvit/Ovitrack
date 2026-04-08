export type ProcessResultResponse = {
    id: number;
    inspection_id: number;
    egg_count: number;
    confidence: number;
    processed_image_path?: string | null;
    created_at: string;
};

export type ProcessResultList = {
    items: ProcessResultResponse[];
    size: number;
    page: number;
    total: number;
};