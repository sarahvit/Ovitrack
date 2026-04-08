"use client";
import { Montserrat, Poppins } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import seta_volta from "@/app/(main)/ovitrampas/cadastro/edit/seta_volta.png"

const montserrat = Montserrat({ subsets: ["latin"], weight: ["600", "700"] });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500"] });

export default function Page() {
    return (
        <main className="min-h-dvh bg-[#F0F4F8] flex flex-col items-center justify-center px-16 gap-5">

            <h1 className={`${montserrat.className} w-full max-w-4xl text-[40px] font-bold leading-[110%] text-[#172B72] text-center`}>
                Editar Ovitrampa: 1
            </h1>

            <div className="w-full max-w-3xl bg-white rounded-2xl shadow-md px-10 py-8 mt-2">

                {/* Voltar para lista */}
                <div className="flex flex-row items-center hover:opacity-70 transition w-fit mb-6">
                    <Image src={seta_volta} alt="Voltar" width={20} height={20} />
                    <Link className={`${poppins.className} block pl-2 text-[#172B72] text-[14px] underline`} href={"/ovitrampas/cadastro"}>
                        Voltar para lista
                    </Link>
                </div>

                <form className="space-y-4 px-10">

                    {/* Linha 1 — Código da Ovitrampa + Data de Criação */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className={`${poppins.className} block text-[15px] font-medium text-gray-800 mb-1`}>
                                Código da Ovitrampa:
                            </label>
                            <input
                                type="text"
                                className={`${poppins.className} w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none text-[15px]`}
                            />
                        </div>
                        <div>
                            <label className={`${poppins.className} block text-[15px] font-medium text-gray-800 mb-1`}>
                                Data de Criação:
                            </label>
                            <input
                                type="text"
                                className={`${poppins.className} w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none text-[15px]`}
                            />
                        </div>
                    </div>

                    {/* Linha 2 — Macro-área + Micro-área + Quarteirão */}
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className={`${poppins.className} block text-[15px] font-medium text-gray-800 mb-1`}>
                                Macro-área:
                            </label>
                            <input
                                type="text"
                                className={`${poppins.className} w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none text-[15px]`}
                            />
                        </div>
                        <div>
                            <label className={`${poppins.className} block text-[15px] font-medium text-gray-800 mb-1`}>
                                Micro-área:
                            </label>
                            <input
                                type="text"
                                className={`${poppins.className} w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none text-[15px]`}
                            />
                        </div>
                        <div>
                            <label className={`${poppins.className} block text-[15px] font-medium text-gray-800 mb-1`}>
                                Quarteirão:
                            </label>
                            <input
                                type="text"
                                className={`${poppins.className} w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none text-[15px]`}
                            />
                        </div>
                    </div>

                    {/* Linha 3 — Bairro + Rua */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className={`${poppins.className} block text-[15px] font-medium text-gray-800 mb-1`}>
                                Bairro:
                            </label>
                            <input
                                type="text"
                                className={`${poppins.className} w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none text-[15px]`}
                            />
                        </div>
                        <div>
                            <label className={`${poppins.className} block text-[15px] font-medium text-gray-800 mb-1`}>
                                Rua:
                            </label>
                            <input
                                type="text"
                                className={`${poppins.className} w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none text-[15px]`}
                            />
                        </div>
                    </div>

                    {/* Linha 4 — Número + Complemento */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className={`${poppins.className} block text-[15px] font-medium text-gray-800 mb-1`}>
                                Número:
                            </label>
                            <input
                                type="text"
                                className={`${poppins.className} w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none text-[15px]`}
                            />
                        </div>
                        <div>
                            <label className={`${poppins.className} block text-[15px] font-medium text-gray-800 mb-1`}>
                                Complemento:
                            </label>
                            <input
                                type="text"
                                className={`${poppins.className} w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none text-[15px]`}
                            />
                        </div>
                    </div>

                    {/* Linha 5 — Latitude + Longitude */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className={`${poppins.className} block text-[15px] font-medium text-gray-800 mb-1`}>
                                Latitude:
                            </label>
                            <input
                                type="text"
                                className={`${poppins.className} w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none text-[15px]`}
                            />
                        </div>
                        <div>
                            <label className={`${poppins.className} block text-[15px] font-medium text-gray-800 mb-1`}>
                                Longitude:
                            </label>
                            <input
                                type="text"
                                className={`${poppins.className} w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none text-[15px]`}
                            />
                        </div>
                    </div>

                    {/* Botão */}
                    <div className="pt-3 flex justify-center">
                        <button
                            type="submit"
                            className={`${montserrat.className} px-16 py-2.5 rounded-full bg-[#A9E0E8] text-[#172B72] text-[18px] font-semibold tracking-wide shadow-sm hover:opacity-90 transition`}
                        >
                            SALVAR ALTERAÇÕES
                        </button>
                    </div>

                </form>
            </div>
        </main>
    );
}