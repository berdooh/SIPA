"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [cargando, setCargando] = useState(true);
  const router = useRouter();

  // Al cargar la app, verificar si hay sesión guardada
  useEffect(() => {
    const tokenGuardado = localStorage.getItem("sipa_token");
    const usuarioGuardado = localStorage.getItem("sipa_usuario");
    if (tokenGuardado && usuarioGuardado) {
      setToken(tokenGuardado);
      setUsuario(JSON.parse(usuarioGuardado));
    }
    setCargando(false);
  }, []);

  const iniciarSesion = (datos) => {
    const { token, usuario } = datos;
    setToken(token);
    setUsuario(usuario);
    localStorage.setItem("sipa_token", token);
    localStorage.setItem("sipa_usuario", JSON.stringify(usuario));

    // Redirigir según el rol
    if (usuario.rol === "Administrador") router.push("/dashboard");
    else if (usuario.rol === "Secretaria") router.push("/dashboard");
    else if (usuario.rol === "Docente") router.push("/docentes/carga");
    else router.push("/dashboard");
  };

  const cerrarSesion = () => {
    setToken(null);
    setUsuario(null);
    localStorage.removeItem("sipa_token");
    localStorage.removeItem("sipa_usuario");
    router.push("/auth/login");
  };

  const estaAutenticado = !!token && !!usuario;

  const tieneRol = (roles) => {
    if (!usuario) return false;
    if (typeof roles === "string") return usuario.rol === roles;
    return roles.includes(usuario.rol);
  };

  return (
    <AuthContext.Provider value={{ usuario, token, cargando, estaAutenticado, iniciarSesion, cerrarSesion, tieneRol }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
}
