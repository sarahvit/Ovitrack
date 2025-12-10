import Image from "next/image"
import logo from "@/components/header/logo.png"
import Seta from "@/components/header/seta_baixo.png"
export function Header() {

    return (

        <header className="flex h-[100px] px-6 py-4 bg-[#081750] justify-between ">
            <div>
                <Image src={logo} className="w-auto h-[70px] p-2" alt="Logo Ovitrack" />
            </div>
            <div className="flex items-center gap-3">
                <div className="relative">
                    <select name="" id="" className="appearance-none bg-white text-gray-700 px-4 py-2 pr-8 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-md">
                        <option value="">Tipo de dado</option>
                        <option value="opcao1">Ovos</option>
                        <option value="opcao2">Casos confirmados</option>
                    </select>
                    <div className="absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none text-blue-950">
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="16" fill="currentColor" className="bi bi-caret-down-fill" viewBox="0 0 16 16">
                        <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                    </svg>
                    </div>
                </div>
                <div className="relative">
                <select name="" id="" className="appearance-none bg-white text-gray-700 pl-4 pr-10 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-md min-w-[120px]">
                    <option value="">Período</option>
                    <option value="opcao1">Semanal</option>
                    <option value="opcao2">Mensal</option>
                    <option value="opcao2">Anual</option>
                </select>
                <div className="absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none text-blue-950">
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="16" fill="currentColor" className="bi bi-caret-down-fill" viewBox="0 0 16 16">
                        <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                    </svg>
                    </div>
                </div>
            
                <div className="ml-10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="35" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                        <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                    </svg>
                </div>
            </div>
        </header>
    )
}