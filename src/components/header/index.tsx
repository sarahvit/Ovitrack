import Image from "next/image"
import logo from "@/components/header/logo.png"
export function Header(){

    return(

        <header className="flex h-[93px] px-6 py-4 bg-[#172B72]">
        <div>
                <Image src={logo} className="w-auto h-[58px] p-2" alt="Logo Ovitrack" />
        </div>
        </header>
    )
}