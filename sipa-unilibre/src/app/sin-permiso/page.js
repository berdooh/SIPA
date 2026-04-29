"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function SinPermisoPage() {
  const router = useRouter();
  const { usuario, cerrarSesion } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1 className="text-xl font-black text-gray-800 mb-2">Acceso restringido</h1>
        <p className="text-gray-400 text-sm mb-1">
          Tu rol de <span className="font-semibold text-gray-600">{usuario?.rol || "usuario"}</span> no tiene permiso para acceder a esta sección.
        </p>
        <p className="text-gray-400 text-sm mb-8">Contacta al administrador si crees que es un error.</p>
        <div className="flex gap-3">
          <button onClick={() => router.back()} className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors">
            Volver
          </button>
          <button onClick={() => router.push("/dashboard")} className="flex-1 py-2.5 bg-red-700 hover:bg-red-800 text-white text-sm font-semibold rounded-xl transition-colors">
            Ir al inicio
          </button>
        </div>
        <button onClick={cerrarSesion} className="mt-4 text-xs text-gray-400 hover:text-red-600 transition-colors">
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
