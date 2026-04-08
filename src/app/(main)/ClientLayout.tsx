"use client";

import "@/app/globals.css";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getMeClient } from "@/lib/api/endpoints/users.client";
import { User } from "@/types/user";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const router = useRouter();
  const pathname = usePathname();

  const authPages = ["/login"];
  const isAuthPage = authPages.includes(pathname);

  const protectedRoutes = [
    "/ovitrampas",
    "/relatorios",
    "/locations",
    "/inspections",
    "/results",
    "/process-results",
  ];

  const gestorOnlyRoutes = ["/users"];

  useEffect(() => {
    async function checkUser() {
      console.log("pathname:", pathname);

      const isProtected = protectedRoutes.some((route) =>
        pathname.startsWith(route)
      );

      const isGestorOnly = gestorOnlyRoutes.some((route) =>
        pathname.startsWith(route)
      );

      console.log("isProtected:", isProtected);
      console.log("isGestorOnly:", isGestorOnly);

      const currentUser = await getMeClient();
      console.log("currentUser:", currentUser);

      setUser(currentUser);

      if (!currentUser && (isProtected || isGestorOnly)) {
        console.log("sem usuário, redirecionando pro login");
        router.replace("/login");
        return;
      }

      if (currentUser && isGestorOnly && currentUser.role !== "gestor") {
        console.log("usuário sem permissão de gestor, redirecionando pra /");
        router.replace("/");
        return;
      }

      setLoading(false);
    }

    checkUser();
  }, [pathname, router]);

  if (loading) return null;

  const isAuthenticated = !!user;
  const showHeader = !isAuthPage;
  const showSidebar = isAuthenticated && !isAuthPage;
  const showHamburger = isAuthenticated && !isAuthPage;
  console.log("layout user state:", user);
  console.log("showHamburger:", showHamburger);
  console.log("isAuthenticated:", !!user);
  return (
    <>
      {showSidebar && (
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      )}

      {showHeader && (
        <Header
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          showHamburger={showHamburger}
          user={user}
        />
      )}

      {children}
    </>
  );
}