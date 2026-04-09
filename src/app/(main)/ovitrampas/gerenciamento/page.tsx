"use client"
import { Montserrat, Poppins } from "next/font/google";
import Image from "next/image";
import caneta from "@/app/(main)/ovitrampas/gerenciamento/caneta.png"
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api/client";
import { listOvitrampas, Ovitrap, processResults, Process } from "@/lib/api/endpoints/ovitrap.client"
const montserrat = Montserrat({ subsets: ["latin"], weight: ["600", "700"] });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600"] });
import Link from "next/link";
import search from "@/app/(main)/ovitrampas/cadastro/search.png";
const colOdd = "bg-[#D5DAF0]/33";
const colEven = "bg-white";

export default function Page() {
    const [data, setData] = useState<Ovitrap[]>([]);
    const [dataProcess, setDataProcess] = useState<Process[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("");
    useEffect(() => {
        async function fetchOvitrampas() {
            const data = await listOvitrampas();
            console.log("API RESPONSE:", data);
            setData(data);
        }

        fetchOvitrampas();
    }, []);
    // useEffect(() => {
    //     async function fetchProcess() {
    //         const dataProcess = await processResults();
    //         console.log("API process:", dataProcess);
    //         setData(dataProcess);
    //     }

    //     fetchProcess();
    // }, []);

    return (
        <div className={`${poppins.className} p-10 bg-[#F6F8FC] min-h-screen`}>

            <h1 className={`${montserrat.className} text-4xl font-bold text-[#172B72] text-center mb-8`}>
                Resultados de leitura 
            </h1>

            <div className="bg-white rounded-2xl border shadow-sm p-6">
                <div className="flex items-center gap-3 mb-8 justify-between">
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
                {/* Tabela */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="bg-[#172B72] text-white">
                                <th className={`py-3 px-4 text-center font-semibold rounded-tl-lg`}>Ovitrampa</th>
                                <th className={`py-3 px-4 text-center font-semibold`}>Ovos encontrados</th>
                                <th className={`py-3 px-4 text-center font-semibold rounded-tr-lg`}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row) => (
                                <tr key={row.id} className="border-b border-gray-100 text-center text-gray-700">
                                    <td className={`py-3 px-4 ${colOdd}`}>{row.id}</td>
                                    {/* <td className={`py-3 px-4 ${colEven}`}>{row.egg_count}</td> */}
                                    <td className={`py-3 px-4 ${colEven}`}>
                                        <div className="flex justify-center gap-2">
                                            <button className="p-2 border border-[#CBCBCB] rounded-md hover:bg-gray-100 bg-white">
                                                <Image src={caneta} alt="Editar" width={14} height={14} />
                                            </button>
                                            <Link href="/ovitrampas/leitura">
                                                <button className="p-2 border border-gray-200 rounded-md text-red-400 hover:bg-red-50 hover:text-red-600 font-bold text-xs bg-white">
                                                    ✕
                                                </button>
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {/* {dataProcess.map((row) => (
                                <tr key={row.id} className="border-b border-gray-100 text-center text-gray-700">
                                    <td className={`py-3 px-4 ${colEven}`}>{row.egg_count}</td>
                                </tr>
                            ))} */}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
