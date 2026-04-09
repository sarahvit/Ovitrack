"use client";
import Image from "next/image";
import seta from "@/components/sidebar/seta.png"
import users from "@/components/sidebar/Users.png"
import ovo1 from "@/components/sidebar/ovo1.png"
import ovo2 from "@/components/sidebar/ovo2.png"
import engrenagem from "@/components/sidebar/engrenagem.png"
import check from "@/components/sidebar/check.png"
import mapa from "@/components/sidebar/Map.png"
import relatorio from "@/components/sidebar/relatorio.png"
import gestao from "@/components/sidebar/gestao.png"
import { useState } from "react";
import home from "@/components/sidebar/Home.png"
import hamburguer from "@/components/sidebar/hamburguer_inside.png"
import Link from "next/link";
interface SidebarProps {
    open: boolean;
    onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
    const [expandedOutrampas, setExpandedOutrampas] = useState(true);
    const [expandedRelatorios, setExpandedRelatorios] = useState(false);

    if (!open) return null;

    return (
        <>

            <div
                className="fixed inset-0 bg-black/30 z-40"
                onClick={onClose}
            />
            <aside className="fixed left-0 top-0 h-screen w-70 bg-[#E9EDF3] z-50 flex flex-col shadow-lg">

                <div className="px-4 py-4 border-b border-gray-300">
                    <button
                        onClick={onClose}
                        className="p-2 rounded-md hover:bg-gray-200 transition">
                        <div className="space-y-1">
                            <Image src={hamburguer} alt="icone para fechar sidebar do gestor" className="h-[30px] w-auto block" />
                        </div>
                    </button>
                </div>
                <nav className="flex-1 overflow-y-auto text-[15px]  text-[#0B285D] ">

                    <Link className="flex items-center gap-3 px-5 py-4 border-b border-gray-300 hover:bg-[#DDE3EC] transition font-semibold" href="/">
                        <span><Image src={home} alt="icone home" className="h-[25px] w-auto block" /></span>
                        Página inicial
                    </Link>

                    <Link className="flex items-center gap-3 px-5 py-4 border-b font-semibold border-gray-300 hover:bg-[#DDE3EC] transition" href="/users">
                        <span><Image src={users} alt="icone gestão de usuários" className="h-[25px] w-auto block" /></span>
                        Gestão de usuários
                    </Link>
                    <div>
                        <button
                            onClick={() => setExpandedOutrampas(!expandedOutrampas)}
                            className="w-full flex items-center gap-3 px-5 py-4  border-b  border-gray-300 font-semibold hover:bg-[#DDE3EC]">
                            <span className={`transition-transform ${expandedOutrampas ? "rotate-90" : ""}`}>
                                <Image src={seta} alt="seta" />
                            </span>
                            <Image src={gestao} alt="icone gestão de usuários" className="h-[20px] w-auto block " />
                            <span>Gestão de ovitrampas</span>
                        </button>

                        {expandedOutrampas && (
                            <div className="bg-[#DCE3EE] text-[13px]  text-sm">
                                <div className="flex flex-row items-center hover:bg-[#CCD6E6]">
                                    <Image src={engrenagem} alt="icone gestão de usuários" className="h-[30px] w-auto block pl-15 " />
                                    <Link className="block pl-2 pr-6 py-3 border-b border-gray-300" href={"/ovitrampas/gerenciamento"}>
                                        Resultados de leituras
                                    </Link>
                                </div>
                                <div className="flex flex-row items-center hover:bg-[#CCD6E6]">
                                    <Image src={check} alt="icone gestão de usuários" className="h-[30px] w-auto block pl-15 " />
                                    <Link className="block pl-2 pr-6 py-3 border-b border-gray-300" href={"/ovitrampas/cadastro"}>
                                        Ovitrampas cadastradas
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Relatórios */}
                    <div>
                        <button
                            onClick={() => setExpandedRelatorios(!expandedRelatorios)}
                            className="w-full flex items-center gap-3 px-5 py-4  border-b  border-gray-300 font-semibold hover:bg-[#DDE3EC]"
                        >
                            <span className={`transition-transform ${expandedRelatorios ? "rotate-90" : ""}`}>
                                <Image src={seta} alt="seta" />
                            </span>
                            <div className="flex flex-row items-center  font-semibold">
                                <Image src={relatorio} alt="icone relatorios" className="h-[20px] w-auto block " />
                                <Link className="block pl-1 pr-6 py-3 border-gray-300" href={"/"}>
                                    Relatórios
                                </Link>
                            </div>
                            
                        </button>

                        {expandedRelatorios && (
                            <div className="bg-[#DCE3EE] text-[14px] ">
                            <div className=" pl-10 hover:bg-[#CCD6E6] border-b border-gray-300">
                                <Link className="block px-10 py-3 "href={"/relatorios/consolidados"}>
                                    Relatório consolidado
                                </Link>
                            </div>
                            <div className="bg-[#DCE3EE] text-[14px] pl-10 hover:bg-[#CCD6E6]  border-b border-gray-300">
                                <Link className="block px-10 py-3 " href={"/relatorios/detalhados"}>
                                    Relatório detalhado
                                </Link>
                            </div>
                            </div>
                        )}
                    </div>

                    {/* Mapa */}
                    <div className="flex flex-row items-center hover:bg-[#CCD6E6] font-semibold pl-5">
                        <span className={`transition-transform ${expandedRelatorios ? "rotate-90" : ""}`}>
                                <Image src={seta} alt="seta" />
                            </span>
                        <Image src={mapa} alt="icone mapas" className="h-5 w-auto block  pl-4" />
                        <Link className="block pl-1 pr-6 py-3 border-gray-300" href={"/"}>
                            Mapa
                        </Link>
                    </div>
                </nav>

            </aside>
        </>
    );
}
