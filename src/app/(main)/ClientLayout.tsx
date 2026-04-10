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
    "/configuracoes",
  ];

  const gestorOnlyRoutes = ["/users", "/configuracoes"];

  useEffect(() => {
    async function checkUser() {
    

      const isProtected = protectedRoutes.some((route) =>
        pathname.startsWith(route)
      );

      const isGestorOnly = gestorOnlyRoutes.some((route) =>
        pathname.startsWith(route)
      );


      const currentUser = await getMeClient();

      setUser(currentUser);

      if (!currentUser && (isProtected || isGestorOnly)) {
        router.replace("/login");
        return;
      }

      if (currentUser && isGestorOnly && currentUser.role !== "gestor") {
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