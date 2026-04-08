"use client";

import { useEffect, useState } from "react";
import {
    listOvitrampas,
    getOvitrampa,
    deleteOvitrampa,
    Ovitrap,
} from "@/lib/api/endpoints/ovitrap.client";

import { Montserrat, Poppins } from "next/font/google";
import Image from "next/image";
import search from "@/app/(main)/ovitrampas/cadastro/search.png";
import caneta from "@/app/(main)/ovitrampas/cadastro/caneta.png";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["600", "700"] });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600"] });

const colOdd = "bg-[#D5DAF0]/33";
const colEven = "bg-white";

export default function Page() {
    const [data, setData] = useState<Ovitrap[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            const response = await listOvitrampas();
            setData(response);
        } catch {
            setError("Erro ao carregar ovitrampas");
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: number) {
        if (!confirm("Deseja remover essa ovitrampa?")) return;

        try {
            await deleteOvitrampa(id);
            fetchData();
        } catch {
            alert("Erro ao deletar ovitrampa");
        }
    }

    async function handleEdit(id: number) {
        try {
            const ovitrampa = await getOvitrampa(id);
            console.log("Ovitrampa para editar:", ovitrampa);
            // aqui depois você pode abrir modal ou redirecionar
        } catch {
            alert("Erro ao buscar ovitrampa");
        }
    }

    const filteredData = data.filter((item) =>
       ( item.id ?? "")
    );

    return (
        <div className={`${poppins.className} p-10 bg-[#F6F8FC] min-h-screen`}>
            <h1
                className={`${montserrat.className} text-4xl font-bold text-[#172B72] text-center mb-8`}
            >
                Ovitrampas cadastradas
            </h1>

            <div className="bg-white rounded-2xl border shadow-sm p-6">
                {/* Barra de pesquisa */}
                <div className="flex items-center gap-3 mb-4 justify-between">
                    <div className="relative w-1/2">
                        <input
                            placeholder="Filtrar por bairro"
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
                </div>

                {/* Contador */}
                <p
                    className={`${montserrat.className} text-center text-[#172B72] text-base font-semibold underline tracking-wide mb-4`}
                >
                    EXIBINDO {filteredData.length} OVITRAMPAS
                </p>

                {/* Loading */}
                {loading && <p className="text-center py-6">Carregando...</p>}

                {/* Error */}
                {error && <p className="text-center text-red-500">{error}</p>}

                {/* Tabela */}
                {!loading && !error && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                            <thead>
                                <tr className="bg-[#172B72] text-white">
                                    <th className="py-3 px-4 text-center font-semibold rounded-tl-lg">
                                        Ovit
                                    </th>
                                    <th className="py-3 px-4 text-center font-semibold">MAC</th>
                                    <th className="py-3 px-4 text-center font-semibold">QUART</th>
                                    <th className="py-3 px-4 text-center font-semibold">
                                        Bairro
                                    </th>
                                    <th className="py-3 px-4 text-center font-semibold">
                                        Endereço
                                    </th>
                                    <th className="py-3 px-4 text-center font-semibold">
                                        Data de Criação
                                    </th>
                                    <th className="py-3 px-4 text-center font-semibold rounded-tr-lg">
                                        Ações
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredData.map((row, index) => (
                                    <tr
                                        key={row.id}
                                        className="border-b border-gray-100 text-center text-gray-700"
                                    >
                                        <td className={`py-3 px-4 ${colOdd}`}>
                                            {row.code}
                                        </td>
                                        <td className={`py-3 px-4 ${colEven}`}>
                                            {row.macro}
                                        </td>
                                        <td className={`py-3 px-4 ${colOdd}`}>
                                            {row.quar}
                                        </td>
                                        <td className={`py-3 px-4 ${colEven}`}>
                                            {row.neighborhood}
                                        </td>
                                        <td className={`py-3 px-4 ${colOdd}`}>
                                            {row.street_name} {row.street_number}
                                        </td>
                                        <td className={`py-3 px-4 ${colEven}`}>
                                            {new Date(row.created_at).toLocaleDateString()}
                                        </td>

                                        <td className={`py-3 px-4 ${colEven}`}>
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => handleEdit(row.id)}
                                                    className="p-2 border border-[#CBCBCB] rounded-md hover:bg-gray-100 bg-white"
                                                >
                                                    <Image
                                                        src={caneta}
                                                        alt="Editar"
                                                        width={14}
                                                        height={14}
                                                    />
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(row.id)}
                                                    className="p-2 border border-gray-200 rounded-md text-red-400 hover:bg-red-50 hover:text-red-600 font-bold text-xs bg-white"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {filteredData.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="py-6 text-center text-gray-400"
                                        >
                                            Nenhuma ovitrampa encontrada
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}