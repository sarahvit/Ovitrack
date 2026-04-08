"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/types/user";
import { logout } from "@/lib/api/endpoints/auth.client";

import hamburguer from "./hamburguer.png";
import logo from "./logo.png";
import bolaVermelha from "./bola_vermelha.png";
import sairIcon from "@/components/header/sair.png";

type DropdownView = "menu" | "logout";

type HeaderProps = {
  onToggleSidebar: () => void;
  showHamburger: boolean;
  user: User | null;
};

export function Header({
  onToggleSidebar,
  showHamburger,
  user,
}: HeaderProps) {
  console.log("HEADER USER:", user);
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [view, setView] = useState<DropdownView>("menu");

  const menuRef = useRef<HTMLDivElement | null>(null);

  const closeDropdown = useCallback(() => {
    setMenuOpen(false);
    setView("menu");
  }, []);

  const toggleDropdown = () => {
    setMenuOpen((prev) => !prev);
    setView("menu");
  };

  useEffect(() => {
    if (!menuOpen) return;

    const onClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        closeDropdown();
      }
    };

    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDropdown();
    };

    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);

    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, [menuOpen, closeDropdown]);

  const goToLogin = () => {
    closeDropdown();
    router.push("/login");
  };

  const goToConfig = () => {
    closeDropdown();
    router.push("/configuracoes");
  };

  const openLogoutConfirm = () => setView("logout");
  const cancelLogout = () => setView("menu");

  const confirmLogout = () => {
    logout();
    closeDropdown();
    router.replace("/login");
  };

  return (
    <header className="flex h-[100px] justify-between bg-[#001C3F] px-6 py-4">
      <div className="flex items-center gap-20">
        {showHamburger && (
          <button
            onClick={onToggleSidebar}
            className="mr-4 text-white"
            aria-label="Abrir menu"
          >
            <Image
              src={hamburguer}
              alt="Ícone para abrir a sidebar"
              className="block h-[30px] w-auto"
            />
          </button>
        )}

        <Image src={logo} alt="Logo Ovitrack" className="h-[70px] w-auto" />
      </div>

      <div className="relative" ref={menuRef}>
        <button
          onClick={toggleDropdown}
          aria-expanded={menuOpen}
          aria-haspopup="menu"
          aria-label="Abrir menu do usuário"
          className="rounded-full p-2 text-white hover:bg-white/10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="50" height="35" fill="currentColor" viewBox="0 0 16 16">
            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
            <path
              fillRule="evenodd"
              d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
            />
          </svg>
        </button>

        {menuOpen && (
          <div className="absolute right-0 z-50 mt-4 w-[289px] rounded-2xl bg-white shadow-[0_24px_80px_rgba(0,0,0,0.20)]">
            {!user && (
              <div className="flex flex-col gap-4 p-6">
                <div className="rounded-xl border border-gray-300 px-4 py-3">
                  <p className="font-semibold text-gray-700">Usuário visitante</p>
                  <p className="text-sm text-gray-500">
                    Faça login para acessar sua conta
                  </p>
                </div>

                <button
                  onClick={goToLogin}
                  className="flex h-11 w-[248px] items-center justify-center rounded-lg border border-gray-300 bg-white px-[18px] py-2.5 text-base font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-300 active:scale-95 active:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Fazer login
                </button>
              </div>
            )}

            {user && view === "menu" && (
              <div className="flex flex-col gap-4 p-6">
                <div className="flex max-w-40 flex-col overflow-hidden">
                  <p className="truncate text-sm font-bold text-gray-700">{user.email}</p>
                  <p className="truncate text-sm text-gray-600">{user.role}</p>
                </div>

                <button
                  type="button"
                  onClick={goToConfig}
                  className="group flex h-11 w-[248px] items-center justify-center gap-2 rounded-lg border border-gray-300 transition-colors hover:bg-gray-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="text-gray-700 transition-transform duration-300 ease-in-out group-hover:rotate-90"
                  >
                    <path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>

                  <span className="text-base font-semibold leading-6 text-gray-700">
                    Configurações
                  </span>
                </button>

                <button
                  onClick={openLogoutConfirm}
                  className="h-11 w-[248px] rounded-lg border border-red-100 font-semibold text-red-600 transition-all duration-200 hover:bg-red-50 hover:text-red-700 active:scale-95 active:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-300"
                >
                  Sair
                </button>
              </div>
            )}

            {user && view === "logout" && (
              <div className="relative h-[274px] w-full rounded-2xl border bg-white">
                <div className="absolute left-4 top-5 h-12 w-12">
                  <Image src={bolaVermelha} alt="Alerta" fill className="object-contain" />
                  <div className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2">
                    <Image src={sairIcon} alt="Sair" fill className="object-contain" />
                  </div>
                </div>

                <div className="absolute left-5 top-20 w-[219px] whitespace-normal text-[17px] font-semibold leading-[18px] text-[#111827]">
                  Deseja sair do seu perfil?
                </div>

                <div className="absolute left-5 top-28 w-[253px] whitespace-normal text-[13px] leading-5 text-gray-600">
                  Você precisará fazer login novamente para acessar seus dados.
                </div>

                <button
                  type="button"
                  onClick={confirmLogout}
                  className="absolute left-23 top-42 w-28 rounded-lg px-4 py-2 text-[18px] font-semibold text-red-600 transition-all duration-200 hover:bg-red-50 hover:text-red-700 active:scale-95 active:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-300"
                >
                  Sair
                </button>

                <button
                  type="button"
                  onClick={cancelLogout}
                  className="absolute left-[92px] top-[216px] rounded-lg px-4 py-2 text-[18px] font-semibold text-gray-800 transition-all duration-200 hover:bg-gray-100 active:scale-95 active:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}