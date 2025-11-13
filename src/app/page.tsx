// src/app/page.tsx
import Image from "next/image";
import Bg from "@/components/header/background.png"; // <- sua imagem
import Logo from "@/components/header/logo3.png";
import Link from "next/link";

export default function Page() {
  return (
    <main className="relative min-h-dvh">
      {/* BACKGROUND */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={Bg}
          alt=""                 // decorativo
          fill                   // cobre toda a tela
          priority
          className="object-cover" // ajuste: cover/center
        />
      </div>

      {/* CONTEÚDO (seu card já pronto) */}
      <section className="mx-auto flex min-h-dvh items-center justify-center px-4">
        <div className="w-[538px] h-[498px] rounded-[20px] bg-white p-8 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
          <div className="mb-4 flex justify-center">
            <Image src={Logo} alt="OviTrack" width={188} height={50} className="h-[50px] w-[188px] object-contain" />
          </div>

          <h1 className="mt-10 text-center text-[38px] font-bold leading-[1.1] text-[#172B72]">
            Bem-vindo(a) ao<br />Projeto da Dengue
          </h1>

          <p className="mx-auto mt-12 w-[388px] text-center text-[22px] font-medium leading-[1.4] text-[#4D4D4D]">
            Escolha uma opção para continuar
          </p>

          <Link
            href="/login"
            className="mx-auto mt-5 block h-[53px] w-[400px] rounded-[8px] bg-[#172B72] text-center text-[16px] font-semibold tracking-[0.05em] leading-[53px] text-white shadow-[0_8px_20px_rgba(0,0,0,0.12)] hover:opacity-95 active:scale-[0.99]"
          >
            Faça seu Login
          </Link>

          <Link
            href="/register"
            className="mx-auto mt-4 block h-[53px] w-[400px] rounded-[8px] bg-[#B8E7EE] text-center text-[16px] font-semibold tracking-[0.05em] leading-[53px] text-[#172B72] ring-1 ring-[#9ad3e3]/60 shadow-[0_10px_24px_rgba(0,0,0,0.08)] hover:opacity-95 active:scale-[0.99]"
          >
            Faça seu Cadastro
          </Link>
        </div>
      </section>
    </main>
  );
}
