import { apiClient } from "@/lib/api/client";
import {
    ReportFilterOptionsRead,
    ReportQueryParams,
    ReportRead,
} from "@/types/report";

function sanitizeParams(params?: ReportQueryParams) {
    if (!params) return undefined;

    const entries = Object.entries(params).filter(([, value]) => {
        if (value === undefined || value === null) return false;
        if (typeof value === "string" && value.trim() === "") return false;
        return true;
    });

    return Object.fromEntries(entries);
}

export async function getReportFilterOptions(): Promise<ReportFilterOptionsRead> {
    const { data } = await apiClient.get<ReportFilterOptionsRead>(
        "/reports/filter-options"
    );
    return data;
}

export async function getReport(params?: ReportQueryParams): Promise<ReportRead> {
    const { data } = await apiClient.get<ReportRead>("/reports/", {
        params: sanitizeParams(params),
    });
    return data;
}

export async function downloadReportXlsx(params?: ReportQueryParams): Promise<void> {
    const response = await apiClient.get("/reports/export.xlsx", {
        params: sanitizeParams(params),
        responseType: "blob",
    });

    const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "relatorio_ovitrampas.xlsx";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
}

export async function downloadReportPdf(params?: ReportQueryParams): Promise<void> {
    const response = await apiClient.get("/reports/export.pdf", {
        params: sanitizeParams(params),
        responseType: "blob",
    });

    const blob = new Blob([response.data], {
        type: "application/pdf",
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "relatorio_ovitrampas.pdf";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
}