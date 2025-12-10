'use client'
import Image from "next/image";
import Bg from "@/components/guest/background.png"; 
import Logo from "@/components/header/logo3.png";
import Link from "next/link";
import {Header} from "@/components/header/index"
import {Slide} from "@/components/slide/index"

export default function Page() {
  return (
    <main className="relative min-h-dvh bg-white">
    <Header/>  
    <Slide/>
      <section className="mx-auto flex min-h-dvh justify-center">
        <div className="flex text-5xl text-blue-900 font-bold mt-10"><h2>Indicadores-Chave(KPIs)</h2></div>
        
      </section>
    </main>
  );
}
