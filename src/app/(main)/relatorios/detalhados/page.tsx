"use client";

import { useEffect, useMemo, useState } from "react";
import {
    downloadReportPdf,
    downloadReportXlsx,
    getReport,
    getReportFilterOptions,
} from "@/lib/api/endpoints/reports";
import {
    ReportDetailMode,
    ReportFilterOptionsRead,
    ReportQueryParams,
    ReportRead,
} from "@/types/report";

type FormState = {
    year: string;
    epidemiological_week_start: string;
    epidemiological_week_end: string;
    comparison_year: string;
    comparison_epidemiological_week_start: string;
    comparison_epidemiological_week_end: string;
    ovitrap_id: string;
    ovitrap_code: string;
    macro_zone: string;
    micro_zone: string;
    neighbourhood: string;
    block: string;
    is_active: string;
    has_processing: string;
    ovitrap_scanned: string;
    detail_mode: ReportDetailMode;
    page: string;
    size: string;
    sort: string;
};

const INITIAL_FORM: FormState = {
    year: "",
    epidemiological_week_start: "",
    epidemiological_week_end: "",
    comparison_year: "",
    comparison_epidemiological_week_start: "",
    comparison_epidemiological_week_end: "",
    ovitrap_id: "",
    ovitrap_code: "",
    macro_zone: "",
    micro_zone: "",
    neighbourhood: "",
    block: "",
    is_active: "",
    has_processing: "",
    ovitrap_scanned: "",
    detail_mode: "inspection",
    page: "1",
    size: "20",
    sort: "-capture_date",
};

function parseOptionalNumber(value: string): number | undefined {
    if (!value.trim()) return undefined;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
}

function parseOptionalBoolean(value: string): boolean | undefined {
    if (value === "true") return true;
    if (value === "false") return false;
    return undefined;
}

function buildQueryParams(form: FormState): ReportQueryParams {
    return {
        year: parseOptionalNumber(form.year),
        epidemiological_week_start: parseOptionalNumber(
            form.epidemiological_week_start
        ),
        epidemiological_week_end: parseOptionalNumber(form.epidemiological_week_end),
        comparison_year: parseOptionalNumber(form.comparison_year),
        comparison_epidemiological_week_start: parseOptionalNumber(
            form.comparison_epidemiological_week_start
        ),
        comparison_epidemiological_week_end: parseOptionalNumber(
            form.comparison_epidemiological_week_end
        ),
        ovitrap_id: parseOptionalNumber(form.ovitrap_id),
        ovitrap_code: form.ovitrap_code || undefined,
        macro_zone: form.macro_zone || undefined,
        micro_zone: form.micro_zone || undefined,
        neighbourhood: form.neighbourhood || undefined,
        block: form.block || undefined,
        is_active: parseOptionalBoolean(form.is_active),
        has_processing: parseOptionalBoolean(form.has_processing),
        ovitrap_scanned: parseOptionalBoolean(form.ovitrap_scanned),
        detail_mode: form.detail_mode,
        page: parseOptionalNumber(form.page) ?? 1,
        size: parseOptionalNumber(form.size) ?? 20,
        sort: form.sort || "-capture_date",
    };
}

function formatBoolean(value: boolean | null | undefined) {
    if (value === null || value === undefined) return "—";
    return value ? "Sim" : "Não";
}

export default function Page() {
    const [form, setForm] = useState<FormState>(INITIAL_FORM);
    const [filters, setFilters] = useState<ReportFilterOptionsRead | null>(null);
    const [report, setReport] = useState<ReportRead | null>(null);
    const [loading, setLoading] = useState(false);
    const [downloadingXlsx, setDownloadingXlsx] = useState(false);
    const [downloadingPdf, setDownloadingPdf] = useState(false);
    const [error, setError] = useState("");

    const queryParams = useMemo(() => buildQueryParams(form), [form]);

    async function loadFilterOptions() {
        try {
            const data = await getReportFilterOptions();
            setFilters(data);

            setForm((prev) => ({
                ...prev,
                year:
                    prev.year || (data.years.length > 0 ? String(data.years[0]) : prev.year),
            }));
        } catch {
            setError("Não foi possível carregar as opções de filtro.");
        }
    }

    async function loadReport(customParams?: ReportQueryParams) {
        try {
            setLoading(true);
            setError("");
            const data = await getReport(customParams ?? queryParams);
            setReport(data);
        } catch {
            setError("Não foi possível carregar o relatório detalhado.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadFilterOptions();
    }, []);

    useEffect(() => {
        if (!filters) return;
        loadReport();
    }, [filters]);

    function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
        setForm((prev) => ({
            ...prev,
            [key]: value,
        }));
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const nextParams = {
            ...queryParams,
            page: 1,
        };
        setForm((prev) => ({ ...prev, page: "1" }));
        await loadReport(nextParams);
    }

    async function handlePageChange(nextPage: number) {
        const nextParams = {
            ...queryParams,
            page: nextPage,
        };
        setForm((prev) => ({ ...prev, page: String(nextPage) }));
        await loadReport(nextParams);
    }

    async function handleDownloadXlsx() {
        try {
            setDownloadingXlsx(true);
            await downloadReportXlsx(queryParams);
        } finally {
            setDownloadingXlsx(false);
        }
    }

    async function handleDownloadPdf() {
        try {
            setDownloadingPdf(true);
            await downloadReportPdf(queryParams);
        } finally {
            setDownloadingPdf(false);
        }
    }

    const currentPage = report?.details.page ?? Number(form.page);
    const totalPages =
        report && report.details.size > 0
            ? Math.max(1, Math.ceil(report.details.total / report.details.size))
            : 1;

    return (
        <main style={{ padding: 24, color: "black", background: "white" }}>
            <h1>Relatório detalhado</h1>

            <form
                onSubmit={handleSubmit}
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                    gap: 12,
                    marginTop: 16,
                    marginBottom: 24,
                }}
            >
                <div>
                    <label>Modo de detalhe</label>
                    <select
                        value={form.detail_mode}
                        onChange={(e) =>
                            updateField("detail_mode", e.target.value as ReportDetailMode)
                        }
                        style={{ width: "100%" }}
                    >
                        <option value="inspection">Por inspeção</option>
                        <option value="ovitrap_period">Por ovitrampa/período</option>
                    </select>
                </div>

                <div>
                    <label>Ano</label>
                    <select
                        value={form.year}
                        onChange={(e) => updateField("year", e.target.value)}
                        style={{ width: "100%" }}
                    >
                        <option value="">Todos</option>
                        {filters?.years.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Semana inicial</label>
                    <select
                        value={form.epidemiological_week_start}
                        onChange={(e) =>
                            updateField("epidemiological_week_start", e.target.value)
                        }
                        style={{ width: "100%" }}
                    >
                        <option value="">Todas</option>
                        {filters?.epidemiological_weeks.map((week) => (
                            <option key={week} value={week}>
                                {week}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Semana final</label>
                    <select
                        value={form.epidemiological_week_end}
                        onChange={(e) =>
                            updateField("epidemiological_week_end", e.target.value)
                        }
                        style={{ width: "100%" }}
                    >
                        <option value="">Todas</option>
                        {filters?.epidemiological_weeks.map((week) => (
                            <option key={week} value={week}>
                                {week}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Ovitrampa</label>
                    <select
                        value={form.ovitrap_id}
                        onChange={(e) => updateField("ovitrap_id", e.target.value)}
                        style={{ width: "100%" }}
                    >
                        <option value="">Todas</option>
                        {filters?.ovitraps.map((ovitrap) => (
                            <option key={ovitrap.id} value={ovitrap.id}>
                                {ovitrap.code}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Código da ovitrampa</label>
                    <input
                        value={form.ovitrap_code}
                        onChange={(e) => updateField("ovitrap_code", e.target.value)}
                        style={{ width: "100%" }}
                    />
                </div>

                <div>
                    <label>Macro</label>
                    <select
                        value={form.macro_zone}
                        onChange={(e) => updateField("macro_zone", e.target.value)}
                        style={{ width: "100%" }}
                    >
                        <option value="">Todas</option>
                        {filters?.macro_zones.map((item) => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Micro</label>
                    <select
                        value={form.micro_zone}
                        onChange={(e) => updateField("micro_zone", e.target.value)}
                        style={{ width: "100%" }}
                    >
                        <option value="">Todas</option>
                        {filters?.micro_zones.map((item) => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Bairro</label>
                    <select
                        value={form.neighbourhood}
                        onChange={(e) => updateField("neighbourhood", e.target.value)}
                        style={{ width: "100%" }}
                    >
                        <option value="">Todos</option>
                        {filters?.neighbourhoods.map((item) => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Quadra</label>
                    <select
                        value={form.block}
                        onChange={(e) => updateField("block", e.target.value)}
                        style={{ width: "100%" }}
                    >
                        <option value="">Todas</option>
                        {filters?.blocks.map((item) => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Ovitrampa ativa</label>
                    <select
                        value={form.is_active}
                        onChange={(e) => updateField("is_active", e.target.value)}
                        style={{ width: "100%" }}
                    >
                        <option value="">Todas</option>
                        <option value="true">Sim</option>
                        <option value="false">Não</option>
                    </select>
                </div>

                <div>
                    <label>Tem processamento</label>
                    <select
                        value={form.has_processing}
                        onChange={(e) => updateField("has_processing", e.target.value)}
                        style={{ width: "100%" }}
                    >
                        <option value="">Todos</option>
                        <option value="true">Sim</option>
                        <option value="false">Não</option>
                    </select>
                </div>

                <div>
                    <label>Teve captura</label>
                    <select
                        value={form.ovitrap_scanned}
                        onChange={(e) => updateField("ovitrap_scanned", e.target.value)}
                        style={{ width: "100%" }}
                    >
                        <option value="">Todos</option>
                        <option value="true">Sim</option>
                        <option value="false">Não</option>
                    </select>
                </div>

                <div>
                    <label>Tamanho da página</label>
                    <select
                        value={form.size}
                        onChange={(e) => updateField("size", e.target.value)}
                        style={{ width: "100%" }}
                    >
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
                </div>

                <div>
                    <label>Ordenação</label>
                    <select
                        value={form.sort}
                        onChange={(e) => updateField("sort", e.target.value)}
                        style={{ width: "100%" }}
                    >
                        <option value="-capture_date">Data captura desc</option>
                        <option value="capture_date">Data captura asc</option>
                        <option value="-epidemiological_week">Semana desc</option>
                        <option value="epidemiological_week">Semana asc</option>
                        <option value="ovitrap_code">Código asc</option>
                        <option value="-egg_count">Ovos desc</option>
                        <option value="egg_count">Ovos asc</option>
                        <option value="macro_zone">Macro asc</option>
                        <option value="micro_zone">Micro asc</option>
                    </select>
                </div>

                <div style={{ display: "flex", gap: 8, alignItems: "end" }}>
                    <button type="submit" disabled={loading}>
                        {loading ? "Carregando..." : "Aplicar filtros"}
                    </button>
                    <button
                        type="button"
                        onClick={handleDownloadXlsx}
                        disabled={downloadingXlsx}
                    >
                        {downloadingXlsx ? "Baixando XLSX..." : "Baixar XLSX"}
                    </button>
                    <button
                        type="button"
                        onClick={handleDownloadPdf}
                        disabled={downloadingPdf}
                    >
                        {downloadingPdf ? "Baixando PDF..." : "Baixar PDF"}
                    </button>
                </div>
            </form>

            {error ? <p>{error}</p> : null}

            {report ? (
                <>
                    <section style={{ marginBottom: 16 }}>
                        <p>Total de linhas: {report.details.total}</p>
                        <p>
                            Página {report.details.page} de {totalPages}
                        </p>
                    </section>

                    <section style={{ marginBottom: 16, display: "flex", gap: 8 }}>
                        <button
                            type="button"
                            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                            disabled={loading || currentPage <= 1}
                        >
                            Página anterior
                        </button>
                        <button
                            type="button"
                            onClick={() =>
                                handlePageChange(Math.min(totalPages, currentPage + 1))
                            }
                            disabled={loading || currentPage >= totalPages}
                        >
                            Próxima página
                        </button>
                    </section>

                    {form.detail_mode === "inspection" ? (
                        <table
                            border={1}
                            cellPadding={8}
                            style={{ borderCollapse: "collapse", width: "100%" }}
                        >
                            <thead>
                                <tr>
                                    <th>Inspection ID</th>
                                    <th>Ovitrampa</th>
                                    <th>Código</th>
                                    <th>Ativa</th>
                                    <th>Operator ID</th>
                                    <th>Location ID</th>
                                    <th>Semana</th>
                                    <th>Data captura</th>
                                    <th>Capturada</th>
                                    <th>Status modelo</th>
                                    <th>Processamento</th>
                                    <th>Ovos</th>
                                    <th>Confiança</th>
                                    <th>Latitude</th>
                                    <th>Longitude</th>
                                    <th>Macro</th>
                                    <th>Micro</th>
                                    <th>Bairro</th>
                                    <th>Quadra</th>
                                    <th>Rua</th>
                                    <th>Número</th>
                                    <th>Justificativa</th>
                                </tr>
                            </thead>
                            <tbody>
                                {report.details.items.map((item, index) => {
                                    if (item.row_type !== "inspection") return null;

                                    return (
                                        <tr key={`${item.inspection_id}-${index}`}>
                                            <td>{item.inspection_id}</td>
                                            <td>{item.ovitrap_id}</td>
                                            <td>{item.ovitrap_code}</td>
                                            <td>{formatBoolean(item.ovitrap_is_active)}</td>
                                            <td>{item.operator_id}</td>
                                            <td>{item.location_id}</td>
                                            <td>{item.epidemiological_week}</td>
                                            <td>{item.capture_date}</td>
                                            <td>{formatBoolean(item.ovitrap_scanned)}</td>
                                            <td>{item.model_status}</td>
                                            <td>{item.processing_label}</td>
                                            <td>{item.egg_count ?? "—"}</td>
                                            <td>{item.confidence ?? "—"}</td>
                                            <td>{item.latitude}</td>
                                            <td>{item.longitude}</td>
                                            <td>{item.macro_zone ?? "—"}</td>
                                            <td>{item.micro_zone ?? "—"}</td>
                                            <td>{item.neighbourhood ?? "—"}</td>
                                            <td>{item.block ?? "—"}</td>
                                            <td>{item.street_name ?? "—"}</td>
                                            <td>{item.street_number ?? "—"}</td>
                                            <td>{item.justification ?? "—"}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    ) : (
                        <table
                            border={1}
                            cellPadding={8}
                            style={{ borderCollapse: "collapse", width: "100%" }}
                        >
                            <thead>
                                <tr>
                                    <th>Ovitrampa</th>
                                    <th>Código</th>
                                    <th>Ativa</th>
                                    <th>Semana</th>
                                    <th>Existe inspeção</th>
                                    <th>Inspection ID</th>
                                    <th>Data captura</th>
                                    <th>Capturada</th>
                                    <th>Status modelo</th>
                                    <th>Processamento</th>
                                    <th>Ovos</th>
                                    <th>Confiança</th>
                                    <th>Latitude</th>
                                    <th>Longitude</th>
                                    <th>Macro</th>
                                    <th>Micro</th>
                                    <th>Bairro</th>
                                    <th>Quadra</th>
                                    <th>Rua</th>
                                    <th>Número</th>
                                </tr>
                            </thead>
                            <tbody>
                                {report.details.items.map((item, index) => {
                                    if (item.row_type !== "ovitrap_period") return null;

                                    return (
                                        <tr key={`${item.ovitrap_id}-${item.epidemiological_week}-${index}`}>
                                            <td>{item.ovitrap_id}</td>
                                            <td>{item.ovitrap_code}</td>
                                            <td>{formatBoolean(item.ovitrap_is_active)}</td>
                                            <td>{item.epidemiological_week}</td>
                                            <td>{formatBoolean(item.inspection_exists)}</td>
                                            <td>{item.inspection_id ?? "—"}</td>
                                            <td>{item.capture_date ?? "—"}</td>
                                            <td>{formatBoolean(item.ovitrap_scanned)}</td>
                                            <td>{item.model_status ?? "—"}</td>
                                            <td>{item.processing_label}</td>
                                            <td>{item.egg_count ?? "—"}</td>
                                            <td>{item.confidence ?? "—"}</td>
                                            <td>{item.latitude ?? "—"}</td>
                                            <td>{item.longitude ?? "—"}</td>
                                            <td>{item.macro_zone ?? "—"}</td>
                                            <td>{item.micro_zone ?? "—"}</td>
                                            <td>{item.neighbourhood ?? "—"}</td>
                                            <td>{item.block ?? "—"}</td>
                                            <td>{item.street_name ?? "—"}</td>
                                            <td>{item.street_number ?? "—"}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </>
            ) : null}
        </main>
    );
}