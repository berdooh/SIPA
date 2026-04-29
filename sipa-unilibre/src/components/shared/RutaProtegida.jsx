"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function RutaProtegida({ children, rolesPermitidos }) {
  const { estaAutenticado, usuario, cargando } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (cargando) return;

    if (!estaAutenticado) {
      router.push("/auth/login");
      return;
    }

    if (rolesPermitidos && !rolesPermitidos.includes(usuario?.rol)) {
      router.push("/sin-permiso");
    }
  }, [estaAutenticado, usuario, cargando, rolesPermitidos, router]);

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-red-700 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  if (!estaAutenticado) return null;
  if (rolesPermitidos && !rolesPermitidos.includes(usuario?.rol)) return null;

  return children;
}
