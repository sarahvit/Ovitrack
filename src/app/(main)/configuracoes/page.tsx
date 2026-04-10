"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Montserrat, Poppins } from "next/font/google";
import { getMeClient, updateUser } from "@/lib/api/endpoints/users.client";
import { User } from "@/types/user";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["600", "700"] });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600"] });

function formatDate(value: string) {
    try {
        return new Date(value).toLocaleString("pt-BR");
    } catch {
        return value;
    }
}

export default function ConfiguracoesPage() {
    const router = useRouter();

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        name: "",
        password: "",
    });

    useEffect(() => {
        async function loadUser() {
            try {
                const currentUser = await getMeClient();

                if (!currentUser) {
                    router.replace("/login");
                    return;
                }

                if (currentUser.role !== "gestor") {
                    router.replace("/");
                    return;
                }

                setUser(currentUser);
                setForm({
                    name: currentUser.name ?? "",
                    password: "",
                });
            } catch (error) {
                console.error("Erro ao carregar usuário:", error);
                router.replace("/login");
            } finally {
                setLoading(false);
            }
        }

        loadUser();
    }, [router]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!user) return;

        try {
            setSaving(true);

            const payload: { name?: string; password?: string } = {};

            if (form.name.trim() && form.name.trim() !== user.name) {
                payload.name = form.name.trim();
            }

            if (form.password.trim()) {
                payload.password = form.password.trim();
            }

            if (!payload.name && !payload.password) {
                return;
            }

            await updateUser(user.id, payload);

            const refreshedUser = await getMeClient();
            setUser(refreshedUser);

            if (refreshedUser) {
                setForm({
                    name: refreshedUser.name ?? "",
                    password: "",
                });
            }

            alert("Configurações atualizadas com sucesso.");
        } catch (error) {
            console.error("Erro ao atualizar usuário:", error);
            alert("Erro ao atualizar configurações.");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <main className={`${poppins.className} min-h-screen bg-[#F6F8FC] p-10`}>
                <div className="mx-auto max-w-4xl">
                    <p className="text-[#172B72]">Carregando configurações...</p>
                </div>
            </main>
        );
    }

    if (!user) return null;

    return (
        <main className={`${poppins.className} min-h-screen bg-[#F6F8FC] p-10`}>
            <div className="mx-auto max-w-4xl">
                <h1
                    className={`${montserrat.className} mb-8 text-center text-4xl font-bold text-[#172B72]`}
                >
                    Configurações da conta
                </h1>

                <div className="rounded-2xl border bg-white p-8 shadow-sm">
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold text-[#172B72]">
                            Perfil do usuário
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Atualize seus dados de acesso.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <section>
                            <h3 className="mb-4 text-lg font-semibold text-[#172B72]">
                                Dados principais
                            </h3>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-sm text-gray-700">
                                        Nome
                                    </label>
                                    <input
                                        value={form.name}
                                        onChange={(e) =>
                                            setForm((prev) => ({ ...prev, name: e.target.value }))
                                        }
                                        className="w-full rounded-lg border px-3 py-2 text-black"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm text-gray-700">
                                        E-mail
                                    </label>
                                    <input
                                        value={user.email}
                                        readOnly
                                        disabled
                                        className="w-full rounded-lg border bg-gray-100 px-3 py-2 text-gray-500"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm text-gray-700">
                                        Perfil
                                    </label>
                                    <input
                                        value={user.role}
                                        readOnly
                                        disabled
                                        className="w-full rounded-lg border bg-gray-100 px-3 py-2 text-gray-500"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm text-gray-700">
                                        Verificado
                                    </label>
                                    <input
                                        value={user.is_verified ? "Sim" : "Não"}
                                        readOnly
                                        disabled
                                        className="w-full rounded-lg border bg-gray-100 px-3 py-2 text-gray-500"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="mb-1 block text-sm text-gray-700">
                                        Criado em
                                    </label>
                                    <input
                                        value={formatDate(user.created_at)}
                                        readOnly
                                        disabled
                                        className="w-full rounded-lg border bg-gray-100 px-3 py-2 text-gray-500"
                                    />
                                </div>
                            </div>
                        </section>

                        <section>
                            <h3 className="mb-4 text-lg font-semibold text-[#172B72]">
                                Segurança
                            </h3>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-sm text-gray-700">
                                        Nova senha
                                    </label>
                                    <input
                                        type="password"
                                        value={form.password}
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                password: e.target.value,
                                            }))
                                        }
                                        placeholder="Digite uma nova senha"
                                        className="w-full rounded-lg border px-3 py-2 text-black"
                                    />
                                </div>
                            </div>
                        </section>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={saving}
                                className="rounded-lg bg-[#172B72] px-5 py-2.5 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                            >
                                {saving ? "Salvando..." : "Salvar alterações"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}