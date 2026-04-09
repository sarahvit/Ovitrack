"use client";

import { useEffect, useMemo, useState } from "react";
import {
    createOvitrampa,
    deleteOvitrampa,
    getOvitrampa,
    listOvitrampaLocationHistory,
    listOvitrampasPaged,
    relocateOvitrampa,
    updateOvitrampa,
    Ovitrap,
    OvitrapLocationHistoryItem,
} from "@/lib/api/endpoints/ovitrap.client";

import { Montserrat, Poppins } from "next/font/google";
import Image from "next/image";
import search from "@/app/(main)/ovitrampas/cadastro/search.png";
import caneta from "@/app/(main)/ovitrampas/cadastro/caneta.png";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["600", "700"] });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600"] });

const colOdd = "bg-[#D5DAF0]/33";
const colEven = "bg-white";

type FormState = {
    code: string;
    is_active: boolean;
    latitude: string;
    longitude: string;
    block: string;
    neighbourhood: string;
    street_name: string;
    street_number: string;
    macro_zone: string;
    micro_zone: string;
    zone: string;
    start_date: string;
};

const emptyForm: FormState = {
    code: "",
    is_active: true,
    latitude: "",
    longitude: "",
    block: "",
    neighbourhood: "",
    street_name: "",
    street_number: "",
    macro_zone: "",
    micro_zone: "",
    zone: "",
    start_date: "",
};

function toDatetimeLocalValue(value?: string | null) {
    if (!value) return "";
    const date = new Date(value);
    const timezoneOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16);
}

function normalizeNullableString(value: string) {
    const trimmed = value.trim();
    return trimmed === "" ? null : trimmed;
}

function locationFromForm(form: FormState) {
    const latitude = Number(form.latitude);
    const longitude = Number(form.longitude);

    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
        throw new Error("Latitude e longitude devem ser números válidos.");
    }

    return {
        latitude,
        longitude,
        block: normalizeNullableString(form.block),
        neighbourhood: normalizeNullableString(form.neighbourhood),
        street_name: normalizeNullableString(form.street_name),
        street_number: normalizeNullableString(form.street_number),
        macro_zone: normalizeNullableString(form.macro_zone),
        micro_zone: normalizeNullableString(form.micro_zone),
        zone: normalizeNullableString(form.zone),
    };
}

function mapOvitrapToForm(ovitrap: Ovitrap): FormState {
    const location = ovitrap.current_location;

    return {
        code: ovitrap.code ?? "",
        is_active: ovitrap.is_active,
        latitude:
            location?.latitude !== null && location?.latitude !== undefined
                ? String(location.latitude)
                : "",
        longitude:
            location?.longitude !== null && location?.longitude !== undefined
                ? String(location.longitude)
                : "",
        block: location?.block ?? "",
        neighbourhood: location?.neighbourhood ?? "",
        street_name: location?.street_name ?? "",
        street_number: location?.street_number ?? "",
        macro_zone: location?.macro_zone ?? "",
        micro_zone: location?.micro_zone ?? "",
        zone: location?.zone ?? "",
        start_date: "",
    };
}

function locationChanged(form: FormState, ovitrap: Ovitrap | null) {
    if (!ovitrap?.current_location) {
        return (
            form.latitude.trim() !== "" ||
            form.longitude.trim() !== "" ||
            form.block.trim() !== "" ||
            form.neighbourhood.trim() !== "" ||
            form.street_name.trim() !== "" ||
            form.street_number.trim() !== "" ||
            form.macro_zone.trim() !== "" ||
            form.micro_zone.trim() !== "" ||
            form.zone.trim() !== ""
        );
    }

    const current = ovitrap.current_location;

    return (
        String(current.latitude ?? "") !== form.latitude.trim() ||
        String(current.longitude ?? "") !== form.longitude.trim() ||
        String(current.block ?? "") !== form.block.trim() ||
        String(current.neighbourhood ?? "") !== form.neighbourhood.trim() ||
        String(current.street_name ?? "") !== form.street_name.trim() ||
        String(current.street_number ?? "") !== form.street_number.trim() ||
        String(current.macro_zone ?? "") !== form.macro_zone.trim() ||
        String(current.micro_zone ?? "") !== form.micro_zone.trim() ||
        String(current.zone ?? "") !== form.zone.trim()
    );
}

export default function Page() {
    const [data, setData] = useState<Ovitrap[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState("");

    const [page, setPage] = useState(1);
    const [size] = useState(10);
    const [total, setTotal] = useState(0);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formMode, setFormMode] = useState<"create" | "edit">("create");
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingOvitrap, setEditingOvitrap] = useState<Ovitrap | null>(null);
    const [form, setForm] = useState<FormState>(emptyForm);

    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [historyItems, setHistoryItems] = useState<OvitrapLocationHistoryItem[]>([]);
    const [historyTitle, setHistoryTitle] = useState("");

    const totalPages = useMemo(() => {
        return Math.max(1, Math.ceil(total / size));
    }, [total, size]);

    useEffect(() => {
        fetchData(page);
    }, [page]);

    async function fetchData(pageToLoad = 1) {
        try {
            setLoading(true);
            setError(null);

            const response = await listOvitrampasPaged({
                page: pageToLoad,
                size,
                sort: "code",
            });

            setData(response.items);
            setTotal(response.total);
        } catch (err) {
            console.error(err);
            setError("Erro ao carregar ovitrampas");
        } finally {
            setLoading(false);
        }
    }

    function openCreateModal() {
        setFormMode("create");
        setEditingId(null);
        setEditingOvitrap(null);
        setForm({
            ...emptyForm,
            start_date: toDatetimeLocalValue(new Date().toISOString()),
        });
        setIsFormOpen(true);
    }

    async function openEditModal(id: number) {
        try {
            const ovitrampa = await getOvitrampa(id);
            setFormMode("edit");
            setEditingId(id);
            setEditingOvitrap(ovitrampa);
            setForm(mapOvitrapToForm(ovitrampa));
            setIsFormOpen(true);
        } catch (err) {
            console.error(err);
            alert("Erro ao buscar ovitrampa.");
        }
    }

    function closeFormModal() {
        setIsFormOpen(false);
        setFormMode("create");
        setEditingId(null);
        setEditingOvitrap(null);
        setForm(emptyForm);
    }

    async function handleDelete(id: number) {
        if (!confirm("Deseja remover essa ovitrampa?")) return;

        try {
            await deleteOvitrampa(id);

            const shouldGoBackOnePage = data.length === 1 && page > 1;
            const nextPage = shouldGoBackOnePage ? page - 1 : page;

            setPage(nextPage);
            await fetchData(nextPage);
        } catch (err) {
            console.error(err);
            alert("Erro ao deletar ovitrampa.");
        }
    }

    async function handleOpenHistory(row: Ovitrap) {
        try {
            setHistoryLoading(true);
            setHistoryItems([]);
            setHistoryTitle(`Histórico da ovitrampa ${row.code}`);
            setIsHistoryOpen(true);

            const items = await listOvitrampaLocationHistory(row.id);
            setHistoryItems(items);
        } catch (err) {
            console.error(err);
            alert("Erro ao carregar histórico de localizações.");
            setIsHistoryOpen(false);
        } finally {
            setHistoryLoading(false);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        try {
            setSaving(true);

            if (!form.code.trim()) {
                alert("Informe o código da ovitrampa.");
                return;
            }

            if (formMode === "create") {
                const location = locationFromForm(form);

                await createOvitrampa({
                    code: form.code.trim(),
                    is_active: form.is_active,
                    location,
                    start_date: form.start_date
                        ? new Date(form.start_date).toISOString()
                        : new Date().toISOString(),
                });

                closeFormModal();
                setPage(1);
                await fetchData(1);
                return;
            }

            if (!editingId || !editingOvitrap) {
                alert("Nenhuma ovitrampa selecionada para edição.");
                return;
            }

            const basicChanged =
                form.code.trim() !== editingOvitrap.code ||
                form.is_active !== editingOvitrap.is_active;

            const relocationChanged = locationChanged(form, editingOvitrap);

            if (!basicChanged && !relocationChanged) {
                closeFormModal();
                return;
            }

            if (basicChanged) {
                await updateOvitrampa(editingId, {
                    code: form.code.trim(),
                    is_active: form.is_active,
                });
            }

            if (relocationChanged) {
                if (!form.start_date) {
                    alert("Informe a data de início para a realocação.");
                    return;
                }

                const location = locationFromForm(form);

                await relocateOvitrampa(editingId, {
                    location,
                    start_date: new Date(form.start_date).toISOString(),
                });
            }

            closeFormModal();
            await fetchData(page);
        } catch (err: any) {
            console.error(err);
            const message =
                err?.response?.data?.detail?.[0]?.msg ||
                err?.response?.data?.message ||
                err?.message ||
                "Erro ao salvar ovitrampa.";
            alert(message);
        } finally {
            setSaving(false);
        }
    }

    const filteredData = data.filter((item) => {
        const term = filter.trim().toLowerCase();
        if (!term) return true;

        const location = item.current_location;

        return (
            item.code.toLowerCase().includes(term) ||
            String(item.id).includes(term) ||
            (location?.neighbourhood ?? "").toLowerCase().includes(term) ||
            (location?.street_name ?? "").toLowerCase().includes(term) ||
            (location?.block ?? "").toLowerCase().includes(term) ||
            (location?.macro_zone ?? "").toLowerCase().includes(term)
        );
    });

    return (
        <div className={`${poppins.className} p-10 bg-[#F6F8FC] min-h-screen`}>
            <h1
                className={`${montserrat.className} text-4xl font-bold text-[#172B72] text-center mb-8`}
            >
                Ovitrampas cadastradas
            </h1>

            <div className="bg-white rounded-2xl border shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4 justify-between">
                    <div className="relative w-1/2">
                        <input
                            placeholder="Filtrar por bairro, rua ou código"
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

                    <button
                        onClick={openCreateModal}
                        className="bg-[#172B72] text-white px-4 py-2 rounded-lg hover:opacity-90"
                    >
                        Nova ovitrampa
                    </button>
                </div>

                <p
                    className={`${montserrat.className} text-center text-[#172B72] text-base font-semibold underline tracking-wide mb-4`}
                >
                    EXIBINDO {filteredData.length} OVITRAMPAS NESTA PÁGINA
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
                                            Ovit
                                        </th>
                                        <th className="py-3 px-4 text-center font-semibold">MAC</th>
                                        <th className="py-3 px-4 text-center font-semibold">QUART</th>
                                        <th className="py-3 px-4 text-center font-semibold">Bairro</th>
                                        <th className="py-3 px-4 text-center font-semibold">Endereço</th>
                                        <th className="py-3 px-4 text-center font-semibold">Status</th>
                                        <th className="py-3 px-4 text-center font-semibold">
                                            Data de Criação
                                        </th>
                                        <th className="py-3 px-4 text-center font-semibold rounded-tr-lg">
                                            Ações
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredData.map((row) => {
                                        const location = row.current_location;

                                        return (
                                            <tr
                                                key={row.id}
                                                className="border-b border-gray-100 text-center text-gray-700"
                                            >
                                                <td className={`py-3 px-4 ${colOdd}`}>{row.code}</td>

                                                <td className={`py-3 px-4 ${colEven}`}>
                                                    {location?.macro_zone ?? "-"}
                                                </td>

                                                <td className={`py-3 px-4 ${colOdd}`}>
                                                    {location?.block ?? "-"}
                                                </td>

                                                <td className={`py-3 px-4 ${colEven}`}>
                                                    {location?.neighbourhood ?? "-"}
                                                </td>

                                                <td className={`py-3 px-4 ${colOdd}`}>
                                                    {[location?.street_name, location?.street_number]
                                                        .filter(Boolean)
                                                        .join(" ") || "-"}
                                                </td>

                                                <td className={`py-3 px-4 ${colEven}`}>
                                                    {row.is_active ? "Ativa" : "Inativa"}
                                                </td>

                                                <td className={`py-3 px-4 ${colOdd}`}>
                                                    {new Date(row.created_at).toLocaleDateString()}
                                                </td>

                                                <td className={`py-3 px-4 ${colEven}`}>
                                                    <div className="flex justify-center gap-2">
                                                        <button
                                                            onClick={() => openEditModal(row.id)}
                                                            className="p-2 border border-[#CBCBCB] rounded-md hover:bg-gray-100 bg-white"
                                                            title="Editar"
                                                        >
                                                            <Image
                                                                src={caneta}
                                                                alt="Editar"
                                                                width={14}
                                                                height={14}
                                                            />
                                                        </button>

                                                        <button
                                                            onClick={() => handleOpenHistory(row)}
                                                            className="p-2 border border-[#CBCBCB] rounded-md hover:bg-gray-100 bg-white text-xs"
                                                            title="Histórico"
                                                        >
                                                            🕘
                                                        </button>

                                                        <button
                                                            onClick={() => handleDelete(row.id)}
                                                            className="p-2 border cursor-pointer border-gray-200 rounded-md text-red-400 hover:bg-red-50 hover:text-red-600 font-bold text-xs bg-white"
                                                            title="Excluir"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}

                                    {filteredData.length === 0 && (
                                        <tr>
                                            <td colSpan={8} className="py-6 text-center text-gray-400">
                                                Nenhuma ovitrampa encontrada
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

                            <div className="flex gap-2 text-blue-700">
                                <button
                                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                                    disabled={page === 1}
                                    className="px-4 py-2 rounded-md border bg-white disabled:opacity-50 hover:bg-gray-100/70 cursor-pointer"
                                >
                                    Anterior
                                </button>

                                <button
                                    onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                                    disabled={page >= totalPages}
                                    className="px-4 py-2 rounded-md border hover:bg-gray-100/70 cursor-pointer bg-white disabled:opacity-50"
                                >
                                    Próxima
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {isFormOpen && (
                <div onClick={closeFormModal} className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 " >
                    <div onClick={(e) => e.stopPropagation()} className="bg-white w-full max-w-5xl rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between px-6 py-4 border-b">
                            <h2 className={`${montserrat.className} text-2xl text-[#172B72]`}>
                                {formMode === "create" ? "Nova ovitrampa" : "Editar ovitrampa"}
                            </h2>
                            <button onClick={closeFormModal} className="text-2xl text-gray-500 cursor-pointer">
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-8">
                            <section>
                                <h3 className="text-lg font-semibold text-[#172B72] mb-4">
                                    Dados básicos
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-700 mb-1">Código</label>
                                        <input
                                            value={form.code}
                                            onChange={(e) =>
                                                setForm((prev) => ({ ...prev, code: e.target.value }))
                                            }
                                            className="w-full border rounded-lg px-3 py-2 text-black"
                                            required
                                        />
                                    </div>

                                    <div className="flex items-end">
                                        <label className="flex items-center gap-2 text-sm text-gray-700">
                                            <input
                                                type="checkbox"
                                                checked={form.is_active}
                                                onChange={(e) =>
                                                    setForm((prev) => ({
                                                        ...prev,
                                                        is_active: e.target.checked,
                                                    }))
                                                }
                                            />
                                            Ovitrampa ativa
                                        </label>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h3 className="text-lg font-semibold text-[#172B72] mb-4">
                                    Localização {formMode === "edit" ? "/ realocação" : "inicial"}
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-700 mb-1">Latitude</label>
                                        <input
                                            value={form.latitude}
                                            onChange={(e) =>
                                                setForm((prev) => ({ ...prev, latitude: e.target.value }))
                                            }
                                            className="w-full border rounded-lg px-3 py-2 text-black"
                                            placeholder="-16.123456"
                                            required={formMode === "create"}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm text-gray-700 mb-1">Longitude</label>
                                        <input
                                            value={form.longitude}
                                            onChange={(e) =>
                                                setForm((prev) => ({ ...prev, longitude: e.target.value }))
                                            }
                                            className="w-full border rounded-lg px-3 py-2 text-black"
                                            placeholder="-43.123456"
                                            required={formMode === "create"}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm text-gray-700 mb-1">Quarteirão</label>
                                        <input
                                            value={form.block}
                                            onChange={(e) =>
                                                setForm((prev) => ({ ...prev, block: e.target.value }))
                                            }
                                            className="w-full border rounded-lg px-3 py-2 text-black"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm text-gray-700 mb-1">Bairro</label>
                                        <input
                                            value={form.neighbourhood}
                                            onChange={(e) =>
                                                setForm((prev) => ({
                                                    ...prev,
                                                    neighbourhood: e.target.value,
                                                }))
                                            }
                                            className="w-full border rounded-lg px-3 py-2 text-black"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm text-gray-700 mb-1">Rua</label>
                                        <input
                                            value={form.street_name}
                                            onChange={(e) =>
                                                setForm((prev) => ({
                                                    ...prev,
                                                    street_name: e.target.value,
                                                }))
                                            }
                                            className="w-full border rounded-lg px-3 py-2 text-black"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm text-gray-700 mb-1">Número</label>
                                        <input
                                            value={form.street_number}
                                            onChange={(e) =>
                                                setForm((prev) => ({
                                                    ...prev,
                                                    street_number: e.target.value,
                                                }))
                                            }
                                            className="w-full border rounded-lg px-3 py-2 text-black"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm text-gray-700 mb-1">Macro zona</label>
                                        <input
                                            value={form.macro_zone}
                                            onChange={(e) =>
                                                setForm((prev) => ({
                                                    ...prev,
                                                    macro_zone: e.target.value,
                                                }))
                                            }
                                            className="w-full border rounded-lg px-3 py-2 text-black"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm text-gray-700 mb-1">Micro zona</label>
                                        <input
                                            value={form.micro_zone}
                                            onChange={(e) =>
                                                setForm((prev) => ({
                                                    ...prev,
                                                    micro_zone: e.target.value,
                                                }))
                                            }
                                            className="w-full border rounded-lg px-3 py-2 text-black"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm text-gray-700 mb-1">Zona</label>
                                        <input
                                            value={form.zone}
                                            onChange={(e) =>
                                                setForm((prev) => ({ ...prev, zone: e.target.value }))
                                            }
                                            className="w-full border rounded-lg px-3 py-2 text-black"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm text-gray-700 mb-1">
                                            Data de início da localização
                                        </label>
                                        <input
                                            type="datetime-local"
                                            value={form.start_date}
                                            onChange={(e) =>
                                                setForm((prev) => ({
                                                    ...prev,
                                                    start_date: e.target.value,
                                                }))
                                            }
                                            className="w-full border rounded-lg px-3 py-2 text-black"
                                        />
                                        {formMode === "edit" && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                Preencha essa data se quiser registrar realocação.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </section>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={closeFormModal}
                                    className="px-4 py-2 rounded-lg border bg-white text-blue-800 hover:bg-gray-100/70 cursor-pointer"
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-4 py-2 rounded-lg bg-[#172B72] text-white disabled:opacity-50 cursor-pointer"
                                >
                                    {saving ? "Salvando..." : "Salvar"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isHistoryOpen && (
                <div onClick={() => setIsHistoryOpen(false)} className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" >
                    <div onClick={(e) => e.stopPropagation()} className="bg-white w-full max-w-4xl rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto" >
                        <div className="flex items-center justify-between px-6 py-4 border-b">
                            <h2 className={`${montserrat.className} text-2xl text-[#172B72]`}>
                                {historyTitle}
                            </h2>
                            <button
                                onClick={() => setIsHistoryOpen(false)}
                                className="text-2xl text-gray-500 cursor-pointer"
                            >
                                ×
                            </button>
                        </div>

                        <div className="p-6">
                            {historyLoading && <p>Carregando histórico...</p>}

                            {!historyLoading && historyItems.length === 0 && (
                                <p className="text-gray-500">Nenhum histórico encontrado.</p>
                            )}

                            {!historyLoading && historyItems.length > 0 && (
                                <div className="space-y-4">
                                    {historyItems.map((item) => (
                                        <div
                                            key={item.id}
                                            className="border rounded-xl p-4 bg-[#F9FAFC]"
                                        >
                                            <p className="text-sm text-gray-700">
                                                <strong>Início:</strong>{" "}
                                                {new Date(item.start_date).toLocaleString()}
                                            </p>
                                            <p className="text-sm text-gray-700">
                                                <strong>Status:</strong> {item.end_date ? "Encerrada" : "Localização atual"}
                                            </p>
                                            <p className="text-sm text-gray-700">
                                                <strong>Endereço:</strong>{" "}
                                                {[
                                                    item.location.street_name,
                                                    item.location.street_number,
                                                    item.location.neighbourhood,
                                                ]
                                                    .filter(Boolean)
                                                    .join(" - ") || "-"}
                                            </p>
                                            <p className="text-sm text-gray-700">
                                                <strong>Macro/Micro:</strong>{" "}
                                                {item.location.macro_zone ?? "-"} /{" "}
                                                {item.location.micro_zone ?? "-"}
                                            </p>
                                            <p className="text-sm text-gray-700">
                                                <strong>Coordenadas:</strong> {item.location.latitude},{" "}
                                                {item.location.longitude}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}