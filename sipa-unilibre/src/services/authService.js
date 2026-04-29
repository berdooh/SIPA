import api from "./api";

const authService = {
  // Iniciar sesión
  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
    // Respuesta esperada del backend:
    // { token: "jwt...", usuario: { id, nombre, email, rol } }
  },

  // Cerrar sesión (opcional si el backend maneja blacklist de tokens)
  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Si falla, igual limpiamos localmente
    }
  },

  // Verificar token actual
  verificarToken: async () => {
    const response = await api.get("/auth/verificar");
    return response.data;
  },
};

export default authService;
