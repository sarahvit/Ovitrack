export type Imagem = {
     id: number,
    ovitrampa_id: number,
    operator_id: number,
    capture_date: string,
    epidemiological_week: string,
    file_path: string,
    processed_file_path?: string,
    content_b64?: string,
    processed_content_b64?: string,
    status: string,
    error_detail?: string,
    created_at: string,
}
export type ImagemList = {
    items: Imagem[],
    page: number,
    size: number,
    total: number,
}