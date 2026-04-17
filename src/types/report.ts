export type ReportDetailMode = "inspection" | "ovitrap_period";

export type ReportComparisonMetricRead = {
    label: string;
    current_value: number;
    comparison_value: number;
    absolute_difference: number;
    percentage_difference: number | null;
};

export type ReportSummaryRead = {
    total_eggs: number;
    average_eggs_per_collection: number;
    average_eggs_per_ovitrap: number;
    inspections_count: number;
    processed_count: number;
    without_processing_count: number;
    without_capture_count: number;
    ovitraps_with_collection_count: number;
    active_ovitraps_count: number;
};

export type ReportGroupingRowRead = {
    key: string;
    label: string;
    inspections_count: number;
    processed_count: number;
    without_processing_count: number;
    without_capture_count: number;
    ovitraps_count: number;
    total_eggs: number;
    average_eggs_per_collection: number;
    average_eggs_per_ovitrap: number;
};

export type ReportInspectionDetailRowRead = {
    row_type: "inspection";
    inspection_id: number;
    ovitrap_id: number;
    ovitrap_code: string;
    ovitrap_is_active: boolean;
    operator_id: number;
    location_id: number;
    epidemiological_week: number;
    capture_date: string;
    ovitrap_scanned: boolean;
    justification: string | null;
    model_status: string;
    processing_label: string;
    egg_count: number | null;
    confidence: number | null;
    latitude: number;
    longitude: number;
    block: string | null;
    neighbourhood: string | null;
    street_name: string | null;
    street_number: string | null;
    macro_zone: string | null;
    micro_zone: string | null;
};

export type ReportOvitrapPeriodDetailRowRead = {
    row_type: "ovitrap_period";
    ovitrap_id: number;
    ovitrap_code: string;
    ovitrap_is_active: boolean;
    epidemiological_week: number;
    inspection_exists: boolean;
    inspection_id: number | null;
    capture_date: string | null;
    ovitrap_scanned: boolean | null;
    model_status: string | null;
    processing_label: string;
    egg_count: number | null;
    confidence: number | null;
    latitude: number | null;
    longitude: number | null;
    block: string | null;
    neighbourhood: string | null;
    street_name: string | null;
    street_number: string | null;
    macro_zone: string | null;
    micro_zone: string | null;
};

export type ReportDetailRow =
    | ReportInspectionDetailRowRead
    | ReportOvitrapPeriodDetailRowRead;

export type ReportDetailPageRead = {
    items: ReportDetailRow[];
    page: number;
    size: number;
    total: number;
};

export type ReportGroupingsRead = {
    by_week: ReportGroupingRowRead[];
    by_ovitrap: ReportGroupingRowRead[];
    by_macro_zone: ReportGroupingRowRead[];
    by_micro_zone: ReportGroupingRowRead[];
    by_neighbourhood: ReportGroupingRowRead[];
    by_block: ReportGroupingRowRead[];
};

export type ReportAppliedFiltersRead = {
    year: number | null;
    epidemiological_week_start: number | null;
    epidemiological_week_end: number | null;
    capture_date_start: string | null;
    capture_date_end: string | null;
    comparison_year: number | null;
    comparison_epidemiological_week_start: number | null;
    comparison_epidemiological_week_end: number | null;
    comparison_capture_date_start: string | null;
    comparison_capture_date_end: string | null;
    ovitrap_id: number | null;
    ovitrap_code: string | null;
    macro_zone: string | null;
    micro_zone: string | null;
    neighbourhood: string | null;
    block: string | null;
    is_active: boolean | null;
    has_processing: boolean | null;
    ovitrap_scanned: boolean | null;
    detail_mode: ReportDetailMode;
    sort: string;
};

export type ReportRead = {
    summary: ReportSummaryRead;
    comparison: ReportComparisonMetricRead[];
    groupings: ReportGroupingsRead;
    details: ReportDetailPageRead;
    applied_filters: ReportAppliedFiltersRead;
};

export type ReportFilterOptionsRead = {
    years: number[];
    epidemiological_weeks: number[];
    macro_zones: string[];
    micro_zones: string[];
    neighbourhoods: string[];
    blocks: string[];
    ovitraps: Array<{ id: number; code: string }>;
    detail_modes: string[];
    sortable_fields: string[];
};

export type ReportQueryParams = {
    year?: number;
    epidemiological_week_start?: number;
    epidemiological_week_end?: number;
    capture_date_start?: string;
    capture_date_end?: string;
    comparison_year?: number;
    comparison_epidemiological_week_start?: number;
    comparison_epidemiological_week_end?: number;
    comparison_capture_date_start?: string;
    comparison_capture_date_end?: string;
    ovitrap_id?: number;
    ovitrap_code?: string;
    macro_zone?: string;
    micro_zone?: string;
    neighbourhood?: string;
    block?: string;
    is_active?: boolean;
    has_processing?: boolean;
    ovitrap_scanned?: boolean;
    detail_mode?: ReportDetailMode;
    page?: number;
    size?: number;
    sort?: string;
};