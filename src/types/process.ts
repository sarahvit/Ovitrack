export type ProcessResultResponse = {
    id: number,
    image_id: number,
    egg_count: number,
    confidence: number,
    created_at: string,
}

export type ProcessResultList = {
    items: ProcessResultResponse[],
    size: number,
    page: number,
    total: number,
}