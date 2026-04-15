export type ResultInspection = {
    id: number;
    ovitrap_id: number;
    operator_id: number;
    location_id: number;
    epidemiological_week: number;
    capture_date: string;
    ovitrap_scanned: boolean;
    justification: string | null;
    raw_image_path: string | null;
    model_status: string;
    created_at: string;
};

export type ResultOvitrap = {
    id: number;
    code: string;
    is_active: boolean;
};

export type ResultLocation = {
    id: number;
    latitude: number;
    longitude: number;
    block: string | null;
    neighbourhood: string | null;
    street_name: string | null;
    street_number: string | null;
    macro_zone: string | null;
    micro_zone: string | null;
};

export type ResultProcessing = {
    id: number;
    egg_count: number;
    confidence: number;
    processed_image_path: string | null;
    created_at: string;
} | null;

export type ResultListItem = {
    inspection: ResultInspection;
    ovitrap: ResultOvitrap;
    location: ResultLocation | null;
    processing: ResultProcessing;
};

export type ResultListResponse = {
    items: ResultListItem[];
    page: number;
    size: number;
    total: number;
};

export type PublicResultDistributionItem = {
    label: string;
    min_egg_count: number | null;
    max_egg_count: number | null;
    count: number;
};

export type PublicResultDashboardRead = {
    year: number;
    epidemiological_week: number | null;
    active_ovitraps: number;
    ovitraps_with_collection: number;
    total_eggs: number;
    average_eggs: number;
    distribution: PublicResultDistributionItem[];
};

export type PublicResultWeekOption = {
    value: number;
    label: string;
};

export type PublicResultFilterOptionsRead = {
    years: number[];
    weeks: PublicResultWeekOption[];
};