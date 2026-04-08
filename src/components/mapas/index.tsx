"use client"
import { useState } from "react";
import {MapaComPontos} from "@/components/mapas/ponto/index";
import { MapaDeCalor } from "@/components/mapas/calor/index";
export function Mapas() {
    const [tab, setTab] = useState<"pontos" | "calor">("pontos");

    return (
        <div className="w-full flex justify-center flex-col px-15">
            {/* Abas */}
            <div className="flex gap-6 border-b border-gray-500 mb-6">
                <button
                    className={`pb-2  text-2xl ${tab === "pontos"
                            ? "text-[#0B285D] font-semibold border-b-4 border-[#0B285D]"
                            : "text-black"
                        }`}
                    onClick={() => setTab("pontos")}
                >
                    Mapa de calor
                </button>

                <button
                    className={`pb-2  font-medium text-2xl ${tab === "calor"
                            ? "text-[#0B285D] font-semibold border-b-4 border-[#0B285D]"
                            : "text-black"
                        }`}
                    onClick={() => setTab("calor")}
                >
                    Mapa com pontos
                </button>
            </div>

            {/* Conteúdo baseado na aba */}
            <div className="mt-4">
                {tab === "pontos" && <MapaComPontos />}
                {tab === "calor" && <MapaDeCalor />}
            </div>
        </div>

    )
}

