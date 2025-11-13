"use client";

import Image from "next/image";
import Link from "next/link";
import Bg from "@/components/header/background.png";
import Logo from "@/components/header/logo3.png";
import GoogleIcon from "@/components/header/Google.png";
import { FormEvent, useState } from "react";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    function onSubmit(e: FormEvent) {
        e.preventDefault();
        console.log({ email, password, confirmPassword });
    }

    return (
        <main className="relative min-h-dvh">
            {/* BACKGROUND */}
            <div className="absolute inset-0 -z-10">
                <Image src={Bg} alt="" fill priority className="object-cover" />
                <div className="absolute inset-0 bg-[#172B72]/12" />
            </div>

            {/* CARD */}
            <section className="mx-auto flex min-h-dvh items-center justify-center px-4">
                <div className="w-[538px] h-[630px] rounded-[20px] bg-white p-8 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">

                    {/* Logo */}
                    <div className="mb-6 flex justify-center">
                        <Image
                            src={Logo}
                            alt="OviTrack"
                            width={188}
                            height={50}
                            className="h-[50px] w-[188px] object-contain"
                            priority
                        />
                    </div>

                    {/* Título */}
                    <h1 className="mb-4 text-center text-[28px] font-bold leading-[1.2] tracking-[0.05em] text-[#172B72]">
                        Crie uma nova conta
                    </h1>

                    {/* FORM */}
                    <form onSubmit={onSubmit} className="mt-4 space-y-4">

                        {/* E-mail */}
                        <div className="mx-auto w-[400px]">
                            <label className="mb-2 block text-[14px] font-medium text-[#4D4D4D]">
                                E-mail
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="seuemail@exemplo.com"
                                className="h-[47px] w-full rounded-[10px] border border-[#B4CDE3] bg-white px-3 text-[14px] text-black outline-none transition focus:border-[#172B72] focus:ring-2 focus:ring-[#172B72]/20"
                            />
                        </div>

                        {/* Senha */}
                        <div className="mx-auto w-[400px]">
                            <label className="mb-2 block text-[14px] font-medium text-[#4D4D4D]">
                                Senha
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Digite sua senha"
                                className="h-[47px] w-full rounded-[10px] border border-[#B4CDE3] bg-white px-3 text-[14px] text-black outline-none transition focus:border-[#172B72] focus:ring-2 focus:ring-[#172B72]/20"
                            />
                        </div>

                        {/* Confirmar senha */}
                        <div className="mx-auto w-[400px]">
                            <label className="mb-2 block text-[14px] font-medium text-[#4D4D4D]">
                                Confirmar senha
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirme sua senha"
                                className="h-[47px] w-full rounded-[10px] border border-[#B4CDE3] bg-white px-3 text-[14px] text-black outline-none transition focus:border-[#172B72] focus:ring-2 focus:ring-[#172B72]/20"
                            />
                        </div>

                        {/* Botão Criar conta */}
                        <button
                            type="submit"
                            className="mx-auto mt-6 block h-[46px] w-[400px] rounded-[8px] bg-[#172B72] text-[16px] font-semibold tracking-[0.05em] text-white shadow-[0_8px_20px_rgba(0,0,0,0.12)] transition hover:opacity-95 active:scale-[0.99]"
                        >
                            Criar conta
                        </button>

                        {/* Google */}
                        <button
                            type="button"
                            className="mx-auto block h-[46px] w-[400px] rounded-[8px] bg-[#D1E9FF] text-[14px] font-semibold text-[#1570EF] ring-1 ring-[#C7DBF8] transition hover:bg-[#D8EBFF]"
                        >
                            <span className="mx-auto inline-flex items-center gap-2">
                                <Image
                                    src={GoogleIcon}
                                    alt="Google"
                                    width={18}
                                    height={18}
                                    className="h-[18px] w-[18px] object-contain"
                                />
                                Continue com o Google
                            </span>
                        </button>
                    </form>

                    {/* Rodapé */}
                    <div className="mt-6 text-center text-[14px] text-[#8a8a8a]">
                        Já tem uma conta?{" "}
                        <Link href="/login" className="font-semibold text-[#2D64B7] hover:underline">
                            Faça login
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
