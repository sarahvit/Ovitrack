"use client";

import { useEffect, useState } from "react";
import { listUsers, deleteUser, updateUserRole, updateUser, createUser } from "@/lib/api/endpoints/users.client";
import { User } from "@/types/user";
import { Roles, Role } from "@/types/role";
import plus from "@/app/(main)/users/plus.png"
import search from "@/app/(main)/users/search.png"
import caneta from "@/app/(main)/users/caneta.png"
import exportar from "@/app/(main)/users/export.png"
import Image from "next/image";
import seta from "@/components/sidebar/seta.png"
import usuario from "@/components/sidebar/Users.png"
export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState(""); // texto da busca
    const [roleFilter, setRoleFilter] = useState<Role | "">("");
    const [filterOpen, setFilterOpen] = useState(false);

    const [form, setForm] = useState<{
        name: string;
        email: string;
        password: string;
        role: Role;
    }>({
        name: "",
        email: "",
        password: "",
        role: "tecnico"
    });
    async function fetchUsers() {
        try {
            setLoading(true);
            const data = await listUsers();
            setUsers(data);
        } catch (err) {
            setError("Erro ao carregar usuários");
        } finally {
            setLoading(false);
        }
    }
    
    useEffect(() => {
        fetchUsers();
    }, []);
    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRole = roleFilter === "" || user.role === roleFilter;

        return matchesSearch && matchesRole;
    });

    async function handleCreateUser() {
        try {
            const newUser = await createUser(form);

            setUsers(prev => [...prev, newUser]);

            setIsAddUserOpen(false);


            setForm({
                name: "",
                email: "",
                password: "",
                role: "tecnico"
            });

        } catch {
            alert("Erro ao criar usuário");
        }
    }
    async function handleUpdateUser() {
        if (!selectedUser) return;

        const payload: any = {
            name: form.name,
        };

        if (form.password && form.password.trim() !== "") {
            payload.password = form.password; // envia só se digitou
        }

        try {
            await updateUser(selectedUser.id, payload);

            // Atualiza role separadamente
            if (form.role && form.role !== selectedUser.role) {
                await updateUserRole(selectedUser.id, form.role);
            }

            setEditOpen(false);
            setSelectedUser(null);
            fetchUsers();
        } catch (err) {
            console.log(err);
        }
    }


    function openDeleteModal(id: number) {
        setUserToDelete(id);
        setDeleteModalOpen(true);
    }
    async function confirmDelete() {
        if (userToDelete !== null) {
            await handleDelete(userToDelete);
            setDeleteModalOpen(false);
            setUserToDelete(null);
        }
    }

    async function handleDelete(id: number) {
        try {
            await deleteUser(id);
            setUsers((prev) => prev.filter((user) => user.id !== id));
        } catch {
            alert("Erro ao deletar usuário");
        }
    }

    if (loading) {
        return (
            <div className="p-8">
                <p className="text-white">Carregando usuários...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="p-10 bg-[#F6F8FC] min-h-screen">

            <div className="flex items-start justify-between mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-[#172B72]">
                        Gestão de Usuários
                    </h1>
                    <p className="text-[#172B72] mt-1">
                        Gerencie as contas dos usuários, cargos e permissões
                    </p>
                </div>

                <button onClick={() => setIsAddUserOpen(true)} className="bg-[#CDE7F3] flex flex-row gap-2 text-[#172B72] px-5 py-4 rounded-xl text-sm font-semibold shadow-sm hover:bg-[#abdbf0]">
                    <Image src={plus} className="w-auto h-5" alt="Botão adicionar usuário" />
                    Adicionar usuário
                </button>
            </div>
            {isAddUserOpen && (
                <div className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center z-50" onClick={() => setIsAddUserOpen(false)} >

                    <div className="bg-white p-6 rounded-xl w-[400px] text-black space-y-3" onClick={(e) => e.stopPropagation()}>
                        <h1 className="font-bold text-2xl text-[#172B72]">Criar usuário</h1>
                        <input placeholder="Nome" className="w-full border p-2 rounded  border-gray-300" value={form.name}
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            } />
                        <input
                            placeholder="Email"
                            className="w-full border p-2 rounded border-gray-300"
                            value={form.email}
                            onChange={(e) =>
                                setForm({ ...form, email: e.target.value })
                            } />

                        <input
                            placeholder="Senha"
                            type="password"
                            className="w-full border p-2 rounded border-gray-300"
                            value={form.password}
                            onChange={(e) =>
                                setForm({ ...form, password: e.target.value })
                            } />

                        <select className="w-full border p-2 rounded border-gray-300" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as Role })}>
                            {Roles.map(role => (
                                <option key={role} value={role}>
                                    {role}
                                </option>
                            ))}
                        </select>

                        <button onClick={handleCreateUser} className="bg-blue-500 text-white px-4 py-2 rounded w-full">
                            Criar usuário
                        </button>

                    </div>
                </div>
            )}
            <div className="grid grid-cols-4 gap-6 mb-8 font-semibold ">
                <div className="bg-white border rounded-2xl p-5 shadow-sm ">
                    <p className="text-md text-black mb-2">Usuários Totais</p>
                    <p className="text-3xl font-bold text-black">
                        {users.length.toString().padStart(2, "0")}
                    </p>
                </div>
                <div className="bg-white border rounded-2xl p-5 shadow-sm">
                    <p className="text-sm text-black mb-2">Administradores</p>
                    <p className="text-3xl font-bold text-orange-500">
                        {users.filter(u => u.role === "gestor").length
                            .toString()
                            .padStart(2, "0")}
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border shadow-sm p-6">
                <div className="flex items-center justify-between mb-6 ">
                    <div className="relative w-full max-w-md">
                        <input placeholder="Procurar pelo usuário ou pelo e-mail" className="bg-gray-100 border border-gray-200 px-10 py-2 rounded-lg text-black text-sm w-full outline-none" value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)} />
                        <Image src={search} alt="Buscar" className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" width={16} height={16} />
                    </div>
                    <div className="flex gap-3 ml-4">
                        <div className="relative inline-block text-left">
                            <button
                                className="px-4 py-2 bg-gray-200 flex items-center gap-1 font-semibold text-black rounded-lg text-sm"
                                onClick={() => setFilterOpen(prev => !prev)}>
                                <span className={`transition-transform ${filterOpen ? "rotate-90" : ""}`}>
                                    <Image src={seta} alt="seta" className="w-auto h-5" />
                                </span>
                                Filtrar
                            </button>
                            <div className={`fixed inset-0 z-40 ${filterOpen ? "" : "hidden"}`}
                                onClick={() => setFilterOpen(false)} />

                            <div
                                className={`absolute right-0 mt-2 w-48 bg-white text-black border-gray-200 border rounded-lg shadow-lg z-50
                ${filterOpen ? "" : "hidden"}`}
                            >
                                <ul className="flex flex-col">
                                    <li>
                                        <button
                                            className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                            onClick={() => setRoleFilter("")}
                                        >
                                            Todos os cargos
                                        </button>
                                    </li>
                                    {Roles.map(role => (
                                        <li key={role}>
                                            <button
                                                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                                onClick={() => setRoleFilter(role)}>
                                                {role}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <button className="px-4 py-2 flex flex-row font-semibold gap-2 bg-[#CDE7F3] text-[#172B72] rounded-lg text-sm">
                            <Image alt="Botão exportar" src={exportar} className="w-auto h-4" />
                            Exportar
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-[#172B72] border-b border-gray-200 text-[18px]">
                                <th className="py-3 text-left">Usuário</th>
                                <th className="py-3 text-left">E-mail</th>
                                <th className="py-3 text-left">Cargo</th>
                                <th className="py-3 text-center">Ações</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="border-b hover:bg-gray-100">
                                    <td className="py-4 flex items-center gap-3">
                                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#172B72] text-white text-xs">
                                            {user.name.slice(0, 2).toUpperCase()}
                                        </div>
                                        <div className="text-black">
                                            {user.name}
                                        </div>
                                    </td>

                                    <td className="py-4 text-black">{user.email}</td>

                                    <td className="py-4">
                                        <div
                                            className=" text-black px-2 py-1 text-sm"
                                        >{user.role}
                                        </div>
                                    </td>

                                    <td className="py-4">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedUser(user);

                                                    setForm({
                                                        name: user.name,
                                                        email: user.email,
                                                        password: "",
                                                        role: user.role
                                                    });

                                                    setEditOpen(true);
                                                }} className="p-2 border border-[#CBCBCB] rounded-md" >
                                                <Image src={caneta} alt="Botão editar" />
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(user.id)} className="p-2 border rounded-md text-red-500 hover:bg-red-300 hover:text-white" >
                                                ✖
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {deleteModalOpen && (
                        <div
                            onClick={() => setDeleteModalOpen(false)}
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50"
                        >
                            <div
                                onClick={(e) => e.stopPropagation()}
                                className="bg-white p-6 rounded-2xl w-full max-w-sm shadow-lg"
                            >
                                <h2 className="text-xl font-bold text-[#172B72] mb-2">
                                    Confirmar exclusão
                                </h2>

                                <p className="text-gray-600 mb-6">
                                    Tem certeza que deseja deletar este usuário?
                                </p>

                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={() => setDeleteModalOpen(false)}
                                        className="px-4 py-2 bg-gray-400 text-white rounded-lg"
                                    >
                                        Cancelar
                                    </button>

                                    <button
                                        onClick={confirmDelete}
                                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                    >
                                        Deletar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {editOpen && selectedUser && (
                        <div
                            onClick={() => setEditOpen(false)}
                            className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center z-50"
                        >
                            <div
                                onClick={(e) => e.stopPropagation()}
                                className="bg-white p-6 rounded-xl w-[400px] text-black space-y-3"
                            >
                                <h1 className="font-bold text-2xl text-[#172B72]">
                                    Atualizar usuário
                                </h1>

                                <input
                                    placeholder="Nome"
                                    className="w-full border p-2 rounded border-gray-300"
                                    value={form.name}
                                    onChange={(e) =>
                                        setForm({ ...form, name: e.target.value })
                                    }
                                />
                                <input
                                    placeholder="Senha (opcional)"
                                    type="password"
                                    className="w-full border p-2 rounded border-gray-300"
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                />
                                <select
                                    className="w-full border p-2 rounded border-gray-300"
                                    value={form.role}
                                    onChange={(e) =>
                                        setForm({ ...form, role: e.target.value as Role })
                                    }
                                >
                                    {Roles.map(role => (
                                        <option key={role} value={role}>
                                            {role}
                                        </option>
                                    ))}
                                </select>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setEditOpen(false)}
                                        className="bg-gray-400 text-white px-4 py-2 rounded w-full"
                                    >
                                        Cancelar
                                    </button>

                                    <button
                                        onClick={handleUpdateUser}
                                        className="bg-blue-500 text-white px-4 py-2 rounded w-full"
                                    >
                                        Salvar alterações
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {users.length === 0 && (
                        <p className="text-center text-black py-6">
                            Nenhum usuário encontrado.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );

}
