"use client";

import { useEffect, useMemo, useState } from "react";
import { Montserrat, Poppins } from "next/font/google";
import Image from "next/image";
import search from "@/app/(main)/ovitrampas/cadastro/search.png";
import { listResults } from "@/lib/api/endpoints/results";
import { ResultListItem } from "@/types/result";
import { buildImageUrl } from "@/lib/utils/image";
import ProtectedNgrokImage from "@/components/results/NgrokBlobImage";
import NgrokBlobImage from "@/components/results/NgrokBlobImage";
const montserrat = Montserrat({ subsets: ["latin"], weight: ["600", "700"] });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600"] });

const colOdd = "bg-[#D5DAF0]/33";
const colEven = "bg-white";

function epiWeekNumberToString(value?: number | null) {
    if (!value) return "-";
    const raw = String(value);
    const year = raw.slice(0, 4);
    const week = raw.slice(4).padStart(2, "0");
    return `${year}-${week}`;
}

export default function Page() {
    const [data, setData] = useState<ResultListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState("");

    const [page, setPage] = useState(1);
    const [size] = useState(10);
    const [total, setTotal] = useState(0);

    const [selectedRow, setSelectedRow] = useState<ResultListItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedWeek, setSelectedWeek] = useState<string>("");
    const [availableWeeks, setAvailableWeeks] = useState<string[]>([]);
    const totalPages = useMemo(() => {
        return Math.max(1, Math.ceil(total / size));
    }, [total, size]);
    useEffect(() => {
        fetchData(page);
    }, [page, selectedWeek]);
    async function fetchData(pageToLoad = 1) {
        try {
            setLoading(true);
            setError(null);

            const response = await listResults({
                page: pageToLoad,
                size,
                sort: "-capture_date",
                ...(selectedWeek
                    ? { epidemiological_week: weekStringToNumber(selectedWeek) }
                    : {}),
            });

            setData(response.items ?? []);
            setTotal(response.total ?? 0);

            console.log("RESULTS RESPONSE:", response);
        } catch (err) {
            console.error(err);
            setError("Erro ao carregar resultados de leitura.");
            setData([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    }

    function openPreview(row: ResultListItem) {
        console.log("ROW:", row);
        console.log("RAW IMAGE:", row.inspection.raw_image_path);
        console.log("PROCESSED IMAGE:", row.processing?.processed_image_path);

        console.log("RAW URL:", buildImageUrl(row.inspection.raw_image_path));
        console.log("PROCESSED URL:", buildImageUrl(row.processing?.processed_image_path));

        setSelectedRow(row);
        setIsModalOpen(true);
    }

    function closePreview() {
        setSelectedRow(null);
        setIsModalOpen(false);
    }
    function epiWeekNumberToString(value?: number | null) {
        if (!value) return "-";
        const raw = String(value);
        const year = raw.slice(0, 4);
        const week = raw.slice(4).padStart(2, "0");
        return `${year}-${week}`;
    }

    function weekStringToNumber(value: string) {
        return Number(value.replace("-", ""));
    }
    const filteredData = data.filter((item) => {
        const term = filter.trim().toLowerCase();
        if (!term) return true;

        const code = item.ovitrap?.code ?? "";
        const neighbourhood = item.location?.neighbourhood ?? "";
        const street = item.location?.street_name ?? "";
        const block = item.location?.block ?? "";
        const status = item.inspection?.model_status ?? "";
        const eggs = String(item.processing?.egg_count ?? "");

        return (
            code.toLowerCase().includes(term) ||
            neighbourhood.toLowerCase().includes(term) ||
            street.toLowerCase().includes(term) ||
            block.toLowerCase().includes(term) ||
            status.toLowerCase().includes(term) ||
            eggs.includes(term)
        );
    });
    useEffect(() => {
        async function loadAvailableWeeks() {
            try {
                const response = await listResults({
                    page: 1,
                    size: 1000,
                    sort: "-capture_date",
                });

                const weeks = Array.from(
                    new Set(
                        (response.items ?? []).map((item) =>
                            epiWeekNumberToString(item.inspection.epidemiological_week)
                        )
                    )
                ).sort().reverse();

                setAvailableWeeks(weeks);
            } catch (error) {
                console.error("Erro ao carregar semanas disponíveis:", error);
                setAvailableWeeks([]);
            }
        }

        loadAvailableWeeks();
    }, []);
    return (
        <div className={`${poppins.className} p-10 bg-[#F6F8FC] min-h-screen`}>
            <h1
                className={`${montserrat.className} text-4xl font-bold text-[#172B72] text-center mb-8`}
            >
                Resultados de leitura
            </h1>

            <div className="bg-white rounded-2xl border shadow-sm p-6">
                <div className="flex items-center gap-3 mb-12">
                    <div className="relative w-1/2">
                        <input
                            placeholder="Filtrar por ovitrampa, bairro, rua, status ou ovos"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="bg-gray-100 border border-gray-200 px-10 py-2.5 rounded-lg text-black text-sm w-full outline-none"
                        />
                        <Image
                            src={search}
                            alt="Buscar"
                            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                            width={16}
                            height={16}
                        />

                    </div>
                    <select
                        value={selectedWeek}
                        onChange={(e) => {
                            setSelectedWeek(e.target.value);
                            setPage(1);
                        }}
                        className="bg-gray-100 border border-gray-200 px-3 py-2.5 rounded-lg text-black text-sm outline-none"
                    >
                        <option value="">Todas as semanas</option>
                        {availableWeeks.map((week) => (
                            <option key={week} value={week}>
                                Semana {week}
                            </option>
                        ))}
                    </select>
                </div>

                <p
                    className={`${montserrat.className} text-center text-[#172B72] text-base font-semibold underline tracking-wide mb-4`}
                >
                    EXIBINDO {filteredData.length} RESULTADOS NESTA PÁGINA
                </p>

                {loading && <p className="text-center py-6">Carregando...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}

                {!loading && !error && (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm border-collapse">
                                <thead>
                                    <tr className="bg-[#172B72] text-white">
                                        <th className="py-3 px-4 text-center font-semibold rounded-tl-lg">
                                            Ovitrampa
                                        </th>
                                        <th className="py-3 px-4 text-center font-semibold">Bairro</th>
                                        <th className="py-3 px-4 text-center font-semibold">
                                            Data da captura
                                        </th>
                                        <th className="py-3 px-4 text-center font-semibold">
                                            Semana epi
                                        </th>
                                        <th className="py-3 px-4 text-center font-semibold">Status</th>
                                        <th className="py-3 px-4 text-center font-semibold">Ovos</th>
                                        
                                        <th className="py-3 px-4 text-center font-semibold rounded-tr-lg">
                                            Ações
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredData.map((row) => (
                                        <tr
                                            key={row.inspection.id}
                                            className="border-b border-gray-100 text-center text-gray-700"
                                        >
                                            <td className={`py-3 px-4 ${colOdd}`}>
                                                {row.ovitrap?.code ?? row.inspection.ovitrap_id}
                                            </td>

                                            <td className={`py-3 px-4 ${colEven}`}>
                                                {row.location?.neighbourhood ?? "-"}
                                            </td>

                                            <td className={`py-3 px-4 ${colOdd}`}>
                                                {new Date(row.inspection.capture_date).toLocaleString()}
                                            </td>

                                            <td className={`py-3 px-4 ${colEven}`}>
                                                {epiWeekNumberToString(row.inspection.epidemiological_week)}
                                            </td>

                                            <td className={`py-3 px-4 ${colOdd}`}>
                                                {row.inspection.model_status ?? "-"}
                                            </td>

                                            <td className={`py-3 px-4 ${colEven}`}>
                                                {row.processing?.egg_count ?? 0}
                                            </td>

                                            

                                            <td className={`py-3 px-4 ${colEven}`}>
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        onClick={() => openPreview(row)}
                                                        className="p-2 border border-[#CBCBCB] rounded-md hover:bg-gray-100 bg-white text-xs"
                                                        title="Visualizar antes e depois"
                                                    >
                                                        👁️
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}

                                    {filteredData.length === 0 && (
                                        <tr>
                                            <td colSpan={8} className="py-6 text-center text-gray-400">
                                                Nenhum resultado encontrado
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex items-center justify-between mt-6">
                            <p className="text-sm text-gray-600">
                                Página {page} de {totalPages} — Total: {total}
                            </p>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                                    disabled={page === 1}
                                    className="px-4 py-2 rounded-md border bg-white disabled:opacity-50 text-blue-800 cursor-pointer hover:bg-gray-100/80"
                                >
                                    Anterior
                                </button>

                                <button
                                    onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                                    disabled={page >= totalPages}
                                    className="px-4 py-2 rounded-md border bg-white disabled:opacity-50 text-blue-800 cursor-pointer hover:bg-gray-100/80"
                                >
                                    Próxima
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {isModalOpen && selectedRow && (
                <div
                    onClick={closePreview}
                    className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white w-full max-w-6xl rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto"
                    >
                        <div className="flex items-center justify-between px-6 py-4 border-b">
                            <div>
                                <h2 className={`${montserrat.className} text-2xl text-[#172B72]`}>
                                    Resultado da leitura
                                </h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    Ovitrampa {selectedRow.ovitrap?.code ?? selectedRow.inspection.ovitrap_id}
                                </p>
                            </div>

                            <button
                                onClick={closePreview}
                                className="text-2xl text-gray-500 cursor-pointer"
                            >
                                ×
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                                <div className="bg-[#F9FAFC] border rounded-xl p-4">
                                    <p className="text-gray-500">Data da captura</p>
                                    <p className="font-semibold text-black">
                                        {new Date(selectedRow.inspection.capture_date).toLocaleString()}
                                    </p>
                                </div>

                                <div className="bg-[#F9FAFC] border rounded-xl p-4">
                                    <p className="text-gray-500">Semana epidemiológica</p>
                                    <p className="font-semibold text-black">
                                        {epiWeekNumberToString(selectedRow.inspection.epidemiological_week)}
                                    </p>
                                </div>

                                <div className="bg-[#F9FAFC] border rounded-xl p-4">
                                    <p className="text-gray-500">Ovos encontrados</p>
                                    <p className="font-semibold text-black">
                                        {selectedRow.processing?.egg_count ?? 0}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="border rounded-2xl p-4 bg-[#F9FAFC]">
                                    <h3 className="text-lg font-semibold text-[#172B72] mb-4">
                                        Antes
                                    </h3>
                                    <NgrokBlobImage
                                        path={selectedRow.inspection.raw_image_path}
                                        alt="Imagem original da ovitrampa"
                                        className="w-full max-h-[420px] object-contain rounded-xl border bg-white text-black"
                                        fallbackText="Imagem original indisponível"
                                    />
                                </div>

                                <div className="border rounded-2xl p-4 bg-[#F9FAFC]">
                                    <h3 className="text-lg font-semibold text-[#172B72] mb-4">
                                        Depois
                                    </h3>
                                    <NgrokBlobImage
                                        path={selectedRow.processing?.processed_image_path}
                                        alt="Imagem processada"
                                        className="w-full max-h-[420px] object-contain bg-white text-black"
                                        fallbackText="Imagem processada indisponível"
                                    />
                                </div>
                            </div>

                            <div className="border rounded-2xl p-4 bg-[#F9FAFC] text-sm text-gray-700">
                                <p>
                                    <strong>Bairro:</strong> {selectedRow.location?.neighbourhood ?? "-"}
                                </p>
                                <p>
                                    <strong>Endereço:</strong>{" "}
                                    {[
                                        selectedRow.location?.street_name,
                                        selectedRow.location?.street_number,
                                    ]
                                        .filter(Boolean)
                                        .join(" ") || "-"}
                                </p>
                                <p>
                                    <strong>Status do modelo:</strong>{" "}
                                    {selectedRow.inspection.model_status ?? "-"}
                                </p>
                                <p>
                                    <strong>Justificativa:</strong>{" "}
                                    {selectedRow.inspection.justification || "-"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}