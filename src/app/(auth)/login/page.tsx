"use client";
import Image from "next/image";
import Link from "next/link";
import Bg from "@/components/guest/background.png";
import Logo from "@/components/header/logo3.png";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api/endpoints/auth.client";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [isLoanding, setIsLoanding] = useState(false);
    const router = useRouter();
    async function onSubmit(e: FormEvent) {

        e.preventDefault();
        setSuccess("");
        setError("");

        if (!email.trim()) {
            setError("Digite seu email!");
            return;
        }
        if (!password.trim()) {
            setError("Digite sua senha!");
            return;
        }

        setIsLoanding(true);
        try {
            await login({ email, password });
            setSuccess("Login realizado com sucesso!")

            setTimeout(() => {
                router.push("/")
            }, 800);
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || err.response?.data?.message || 'Erro ao realizar login. Tente novamente';
            setError(errorMessage);

        } finally {
            setIsLoanding(false);
        }

    }
    return (
        <main className="relative min-h-dvh overflow-hidden">
            {/* BACKGROUND */}
            <div className="absolute inset-0 z-0">
                <Image src={Bg} alt="" fill priority className="object-cover" />
                <div className="absolute inset-0 bg-[#172B72]/12" />
            </div>

            {/* CARD */}
            <section className=" relative mx-auto flex min-h-dvh items-center justify-center px-4 z-10">
                <div className="w-[538px] h-[500px] rounded-[20px] bg-white p-8 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
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
                    <h1 className="text-center text-[28px] font-bold leading-[1.2] tracking-[0.05em] text-[#172B72]">
                        Faça login na sua conta
                    </h1>
                    {error && (
                        <div className="mx-auto mb-4 w-[400px] rounded-lg bg-red-50 p-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    {/* Mensagem de sucesso */}
                    {success && (
                        <div className="mx-auto mb-4 w-[400px] rounded-lg bg-green-50 p-3 text-sm text-green-600">
                            {success}
                        </div>
                    )}
                    {/* FORM */}
                    <form onSubmit={onSubmit} className="mt-6 ">
                        {/* E-mail */}
                        <div className="mx-auto w-[400px]">
                            <label htmlFor="email" className="mb-2 block text-[14px] font-medium text-[#4D4D4D]">
                                E-mail
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="seuemail@exemplo.com"
                                className="h-[47px] w-full rounded-[10px] border border-[#B4CDE3] bg-white px-3 text-[14px] text-black outline-none transition focus:border-[#172B72] focus:ring-2 focus:ring-[#172B72]/20"
                            />
                        </div>

                        {/* Senha */}
                        <div className="mx-auto w-[400px] mt-6">
                            <label htmlFor="password" className="mb-2 block text-[14px] font-medium text-[#4D4D4D]">
                                Senha
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Digite sua senha"
                                className="h-[47px] w-full rounded-[10px] border border-[#B4CDE3] bg-white px-3 text-[14px] text-black outline-none transition focus:border-[#172B72] focus:ring-2 focus:ring-[#172B72]/20"
                            />
                        </div>
                    {/* Botão Login */}
                    <button
                        type="submit"
                        className="mx-auto mt-8 block h-[46px] w-[400px] cursor-pointer rounded-[8px] bg-[#172B72] text-center text-[16px] font-semibold tracking-[0.05em] text-white shadow-[0_8px_20px_rgba(0,0,0,0.12)] transition hover:opacity-95 active:scale-[0.99]"
                    >
                        Login
                    </button>
                </form>
            </div>
        </section>
        </main >
    );
}
