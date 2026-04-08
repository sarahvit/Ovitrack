import { Montserrat, Poppins } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import seta_volta from "@/app/(main)/ovitrampas/gerenciamento/edit/seta_volta.png"

const montserrat = Montserrat({ subsets: ["latin"], weight: ["600", "700"] });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500"] });

export default function Page() {
    return (
        <main className="min-h-dvh bg-[#F0F4F8] flex flex-col items-center justify-center px-16 gap-5">

            <h1 className={`${montserrat.className} w-full max-w-4xl text-[40px] font-bold leading-[110%] text-[#172B72] text-center`}>
                Editar leitura de ovos
            </h1>

            <div className="w-full max-w-3xl bg-white rounded-2xl shadow-md px-10 py-8 mt-2">

                {/* Voltar para lista */}
                <div className="flex flex-row items-center hover:opacity-70 transition w-fit mb-6">
                    <Image src={seta_volta} alt="Voltar" width={20} height={20} />
                    <Link className={`${poppins.className} block pl-2 text-[#172B72] text-[14px] underline`} href={"/ovitrampas/gerenciamento"}>
                        Voltar para lista
                    </Link>
                </div>

                <form className="space-y-4 px-24">

                    {/* Ovitrampa — somente leitura */}
                    <div className={`${poppins.className} w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-gray-100 text-gray-800 text-[16px]`}>
                        Ovitrampa: 1
                    </div>

                    {/* Ano — somente leitura */}
                    <div className={`${poppins.className} w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-gray-100 text-gray-800 text-[16px]`}>
                        Ano: 2025
                    </div>

                    {/* Semana — somente leitura */}
                    <div className={`${poppins.className} w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-gray-100 text-gray-800 text-[16px]`}>
                        Semana: 46
                    </div>

                    {/* Spacer */}
                    <div className="pt-1" />

                    {/* Contagem de ovos */}
                    <div>
                        <label className={`${poppins.className} block text-[16px] font-medium text-gray-800 mb-1`}>
                            Contagem de ovos:
                        </label>
                        <input
                            type="number"
                            className={`${poppins.className} w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none text-[16px] bg-white`}
                        />
                    </div>

                    {/* Ocorrência */}
                    <div>
                        <label className={`${poppins.className} block text-[16px] font-medium text-gray-800 mb-1`}>
                            Ocorrência:
                        </label>
                        <input
                            type="text"
                            className={`${poppins.className} w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none text-[16px] bg-white`}
                        />
                    </div>

                    {/* Botão */}
                    <div className="pt-3 flex justify-center">
                        <button
                            type="submit"
                            className={`${montserrat.className} px-16 py-2.5 rounded-full bg-[#A9E0E8] text-[#172B72] text-[18px] font-semibold tracking-wide shadow-sm hover:opacity-90 transition`}
                        >
                            ATUALIZAR LEITURA
                        </button>
                    </div>

                </form>
            </div>
        </main>
    );
}