import { IndicadoresEpi } from "@/lib/api/endpoints/indicators"
import { useEffect, useState } from "react"
type CardProps = {
    indicadores: IndicadoresEpi | null
    loading: boolean
    periodType: "year" | "month" | "week"
}


export function Card({ indicadores, loading, periodType }: CardProps) {

    if (loading) return <div className="flex justify-center items-center text-black">Carregando indicadores...</div>
    if (!indicadores) return <div className="flex justify-center items-center text-black">Não foi possível carregar os indicadores</div>

    const periodoTexto = {
        year: "no ano",
        month: "no mês",
        week: "na semana",
    }[periodType]

    return (
        <div className="flex items-top justify-between gap-15 mx-20">
            <div className="bg-white shadow-md rounded-xl pb-5 pt-5 px-30  flex flex-col items-center text-center border border-gray-100 ">
                <h3 className="text-[#172B72] text-3xl font-semibold mb-3">
                    Descrição:
                </h3>
                <p className="text-gray-600 text-md mb-6">
                    Casos notificados {periodoTexto}
                </p>
                <p className="text-3xl font-extrabold text-gray-800">
                    {indicadores.notified_cases.toLocaleString()}
                </p>
            </div>
            <div className="bg-[#E8EAF0] shadow-md rounded-xl pb-5 pt-5 px-35  flex flex-col items-center text-center">
                <h3 className="text-[#172B72] font-semibold text-3xl mb-3">
                    Descrição:
                </h3>
                <p className="text-gray-600 text-md mb-6">
                    Casos confirmados {periodoTexto}
                </p>
                <p className="text-3xl font-extrabold text-gray-800">
                    {indicadores.confirmed_cases.toLocaleString()}

                </p>
            </div>
            <div className="bg-white shadow-md rounded-xl pb-5 pt-5 px-35  flex flex-col items-center text-center border border-gray-100 ">
                <h3 className="text-[#172B72] font-semibold text-3xl mb-3">
                    Descrição:
                </h3>
                <p className="text-gray-600 text-md mb-6">
                    Taxa de confirmação
                </p>
                <p className="text-3xl font-extrabold text-gray-800">
                    {(indicadores.confirmation_rate * 100).toFixed(2)}%

                </p>
            </div>
        </div>
    )
}
