"use client";

import { useEffect, useMemo, useState } from "react";
import {
    downloadReportPdf,
    downloadReportXlsx,
    getReport,
    getReportFilterOptions,
} from "@/lib/api/endpoints/reports";
import {
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
        detail_mode: "inspection",
        page: 1,
        size: 20,
        sort: form.sort || "-capture_date",
    };
}

function renderAppliedValue(value: unknown) {
    if (value === null || value === undefined || value === "") return "—";
    if (typeof value === "boolean") return value ? "Sim" : "Não";
    return String(value);
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
            setError("Não foi possível carregar o relatório consolidado.");
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
        await loadReport(queryParams);
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

    return (
        <main style={{ padding: 24, color: "black", background: "white" }}>
            <h1>Relatório consolidado</h1>

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
                    <label>Ano de comparação</label>
                    <select
                        value={form.comparison_year}
                        onChange={(e) => updateField("comparison_year", e.target.value)}
                        style={{ width: "100%" }}
                    >
                        <option value="">Automático</option>
                        {filters?.years.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Semana comparação inicial</label>
                    <select
                        value={form.comparison_epidemiological_week_start}
                        onChange={(e) =>
                            updateField("comparison_epidemiological_week_start", e.target.value)
                        }
                        style={{ width: "100%" }}
                    >
                        <option value="">Automático</option>
                        {filters?.epidemiological_weeks.map((week) => (
                            <option key={week} value={week}>
                                {week}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Semana comparação final</label>
                    <select
                        value={form.comparison_epidemiological_week_end}
                        onChange={(e) =>
                            updateField("comparison_epidemiological_week_end", e.target.value)
                        }
                        style={{ width: "100%" }}
                    >
                        <option value="">Automático</option>
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
                    <section style={{ marginBottom: 24 }}>
                        <h2>Resumo</h2>
                        <table border={1} cellPadding={8} style={{ borderCollapse: "collapse" }}>
                            <tbody>
                                <tr>
                                    <td>Total de ovos</td>
                                    <td>{report.summary.total_eggs}</td>
                                </tr>
                                <tr>
                                    <td>Média por coleta</td>
                                    <td>{report.summary.average_eggs_per_collection}</td>
                                </tr>
                                <tr>
                                    <td>Média por ovitrampa</td>
                                    <td>{report.summary.average_eggs_per_ovitrap}</td>
                                </tr>
                                <tr>
                                    <td>Inspeções</td>
                                    <td>{report.summary.inspections_count}</td>
                                </tr>
                                <tr>
                                    <td>Processadas</td>
                                    <td>{report.summary.processed_count}</td>
                                </tr>
                                <tr>
                                    <td>Sem processamento</td>
                                    <td>{report.summary.without_processing_count}</td>
                                </tr>
                                <tr>
                                    <td>Sem captura</td>
                                    <td>{report.summary.without_capture_count}</td>
                                </tr>
                                <tr>
                                    <td>Ovitrampas com coleta</td>
                                    <td>{report.summary.ovitraps_with_collection_count}</td>
                                </tr>
                                <tr>
                                    <td>Ovitrampas ativas</td>
                                    <td>{report.summary.active_ovitraps_count}</td>
                                </tr>
                            </tbody>
                        </table>
                    </section>

                    <section style={{ marginBottom: 24 }}>
                        <h2>Comparativo</h2>
                        <table border={1} cellPadding={8} style={{ borderCollapse: "collapse", width: "100%" }}>
                            <thead>
                                <tr>
                                    <th>Indicador</th>
                                    <th>Atual</th>
                                    <th>Comparado</th>
                                    <th>Diferença</th>
                                    <th>%</th>
                                </tr>
                            </thead>
                            <tbody>
                                {report.comparison.length === 0 ? (
                                    <tr>
                                        <td colSpan={5}>Nenhum comparativo disponível.</td>
                                    </tr>
                                ) : (
                                    report.comparison.map((item) => (
                                        <tr key={item.label}>
                                            <td>{item.label}</td>
                                            <td>{item.current_value}</td>
                                            <td>{item.comparison_value}</td>
                                            <td>{item.absolute_difference}</td>
                                            <td>
                                                {item.percentage_difference === null
                                                    ? "—"
                                                    : `${item.percentage_difference}%`}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </section>

                    <section style={{ marginBottom: 24 }}>
                        <h2>Filtros aplicados</h2>
                        <table border={1} cellPadding={8} style={{ borderCollapse: "collapse", width: "100%" }}>
                            <thead>
                                <tr>
                                    <th>Filtro</th>
                                    <th>Valor</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(report.applied_filters).map(([key, value]) => (
                                    <tr key={key}>
                                        <td>{key}</td>
                                        <td>{renderAppliedValue(value)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>

                    <section style={{ marginBottom: 24 }}>
                        <h2>Por semana</h2>
                        <table border={1} cellPadding={8} style={{ borderCollapse: "collapse", width: "100%" }}>
                            <thead>
                                <tr>
                                    <th>Semana</th>
                                    <th>Inspeções</th>
                                    <th>Processadas</th>
                                    <th>Sem processamento</th>
                                    <th>Sem captura</th>
                                    <th>Ovitrampas</th>
                                    <th>Total ovos</th>
                                    <th>Média por coleta</th>
                                    <th>Média por ovitrampa</th>
                                </tr>
                            </thead>
                            <tbody>
                                {report.groupings.by_week.map((item) => (
                                    <tr key={item.key}>
                                        <td>{item.label}</td>
                                        <td>{item.inspections_count}</td>
                                        <td>{item.processed_count}</td>
                                        <td>{item.without_processing_count}</td>
                                        <td>{item.without_capture_count}</td>
                                        <td>{item.ovitraps_count}</td>
                                        <td>{item.total_eggs}</td>
                                        <td>{item.average_eggs_per_collection}</td>
                                        <td>{item.average_eggs_per_ovitrap}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>

                    <section style={{ marginBottom: 24 }}>
                        <h2>Por ovitrampa</h2>
                        <table border={1} cellPadding={8} style={{ borderCollapse: "collapse", width: "100%" }}>
                            <thead>
                                <tr>
                                    <th>Ovitrampa</th>
                                    <th>Inspeções</th>
                                    <th>Processadas</th>
                                    <th>Sem processamento</th>
                                    <th>Sem captura</th>
                                    <th>Total ovos</th>
                                </tr>
                            </thead>
                            <tbody>
                                {report.groupings.by_ovitrap.map((item) => (
                                    <tr key={item.key}>
                                        <td>{item.label}</td>
                                        <td>{item.inspections_count}</td>
                                        <td>{item.processed_count}</td>
                                        <td>{item.without_processing_count}</td>
                                        <td>{item.without_capture_count}</td>
                                        <td>{item.total_eggs}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>

                    <section style={{ marginBottom: 24 }}>
                        <h2>Por macro</h2>
                        <table border={1} cellPadding={8} style={{ borderCollapse: "collapse", width: "100%" }}>
                            <thead>
                                <tr>
                                    <th>Macro</th>
                                    <th>Inspeções</th>
                                    <th>Processadas</th>
                                    <th>Sem processamento</th>
                                    <th>Total ovos</th>
                                </tr>
                            </thead>
                            <tbody>
                                {report.groupings.by_macro_zone.map((item) => (
                                    <tr key={item.key}>
                                        <td>{item.label}</td>
                                        <td>{item.inspections_count}</td>
                                        <td>{item.processed_count}</td>
                                        <td>{item.without_processing_count}</td>
                                        <td>{item.total_eggs}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>

                    <section style={{ marginBottom: 24 }}>
                        <h2>Por micro</h2>
                        <table border={1} cellPadding={8} style={{ borderCollapse: "collapse", width: "100%" }}>
                            <thead>
                                <tr>
                                    <th>Micro</th>
                                    <th>Inspeções</th>
                                    <th>Processadas</th>
                                    <th>Sem processamento</th>
                                    <th>Total ovos</th>
                                </tr>
                            </thead>
                            <tbody>
                                {report.groupings.by_micro_zone.map((item) => (
                                    <tr key={item.key}>
                                        <td>{item.label}</td>
                                        <td>{item.inspections_count}</td>
                                        <td>{item.processed_count}</td>
                                        <td>{item.without_processing_count}</td>
                                        <td>{item.total_eggs}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>

                    <section style={{ marginBottom: 24 }}>
                        <h2>Por bairro</h2>
                        <table border={1} cellPadding={8} style={{ borderCollapse: "collapse", width: "100%" }}>
                            <thead>
                                <tr>
                                    <th>Bairro</th>
                                    <th>Inspeções</th>
                                    <th>Processadas</th>
                                    <th>Sem processamento</th>
                                    <th>Total ovos</th>
                                </tr>
                            </thead>
                            <tbody>
                                {report.groupings.by_neighbourhood.map((item) => (
                                    <tr key={item.key}>
                                        <td>{item.label}</td>
                                        <td>{item.inspections_count}</td>
                                        <td>{item.processed_count}</td>
                                        <td>{item.without_processing_count}</td>
                                        <td>{item.total_eggs}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>

                    <section>
                        <h2>Por quadra</h2>
                        <table border={1} cellPadding={8} style={{ borderCollapse: "collapse", width: "100%" }}>
                            <thead>
                                <tr>
                                    <th>Quadra</th>
                                    <th>Inspeções</th>
                                    <th>Processadas</th>
                                    <th>Sem processamento</th>
                                    <th>Total ovos</th>
                                </tr>
                            </thead>
                            <tbody>
                                {report.groupings.by_block.map((item) => (
                                    <tr key={item.key}>
                                        <td>{item.label}</td>
                                        <td>{item.inspections_count}</td>
                                        <td>{item.processed_count}</td>
                                        <td>{item.without_processing_count}</td>
                                        <td>{item.total_eggs}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
                </>
            ) : null}
        </main>
    );
}