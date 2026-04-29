"use client";

import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";

const docentesIniciales = [
  { id: 1, nombre: "Carlos Gómez", email: "cgomez@unilibre.edu.co", telefono: "3001234567", tipo: "Tiempo Completo", programa: "Ingeniería de Sistemas", estado: "Activo", materias: 3 },
  { id: 2, nombre: "María Torres", email: "mtorres@unilibre.edu.co", telefono: "3109876543", tipo: "Medio Tiempo", programa: "Ingeniería Industrial", estado: "Activo", materias: 2 },
  { id: 3, nombre: "Juan Pérez", email: "jperez@unilibre.edu.co", telefono: "3205551234", tipo: "Catedrático", programa: "Ingeniería de Sistemas", estado: "Activo", materias: 1 },
  { id: 4, nombre: "Ana Martínez", email: "amartinez@unilibre.edu.co", telefono: "3154449876", tipo: "Tiempo Completo", programa: "Ingeniería Industrial", estado: "Activo", materias: 4 },
  { id: 5, nombre: "Luis Herrera", email: "lherrera@unilibre.edu.co", telefono: "3007778899", tipo: "Catedrático", programa: "Ingeniería de Sistemas", estado: "Inactivo", materias: 0 },
];

const programas = ["Ingeniería de Sistemas", "Ingeniería Industrial"];
const tipos = ["Tiempo Completo", "Medio Tiempo", "Catedrático"];

const tipoBadge = (tipo) => {
  const base = "px-2.5 py-1 rounded-full text-xs font-bold";
  if (tipo === "Tiempo Completo") return `${base} bg-emerald-100 text-emerald-700`;
  if (tipo === "Medio Tiempo") return `${base} bg-blue-100 text-blue-700`;
  return `${base} bg-amber-100 text-amber-700`;
};

const estadoBadge = (estado) => {
  const base = "px-2.5 py-1 rounded-full text-xs font-bold";
  return estado === "Activo"
    ? `${base} bg-emerald-100 text-emerald-700`
    : `${base} bg-gray-100 text-gray-500`;
};

const iniciales = (nombre) => nombre.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();

const avatarColor = (id) => {
  const colores = ["bg-red-600", "bg-blue-600", "bg-emerald-600", "bg-purple-600", "bg-amber-600"];
  return colores[id % colores.length];
};

export default function DocentesPage() {
  const [docentes, setDocentes] = useState(docentesIniciales);
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtroPrograma, setFiltroPrograma] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [form, setForm] = useState({ nombre: "", email: "", telefono: "", tipo: tipos[0], programa: programas[0], estado: "Activo" });
  const [errors, setErrors] = useState({});

  const abrirCrear = () => {
    setEditando(null);
    setForm({ nombre: "", email: "", telefono: "", tipo: tipos[0], programa: programas[0], estado: "Activo" });
    setErrors({});
    setModalOpen(true);
  };

  const abrirEditar = (d) => {
    setEditando(d.id);
    setForm({ nombre: d.nombre, email: d.email, telefono: d.telefono, tipo: d.tipo, programa: d.programa, estado: d.estado });
    setErrors({});
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setEditando(null);
    setErrors({});
  };

  const validar = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = "El nombre es obligatorio";
    if (!form.email.trim()) e.email = "El correo es obligatorio";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Correo inválido";
    return e;
  };

  const guardar = () => {
    const e = validar();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    if (editando) {
      setDocentes((prev) => prev.map((d) => d.id === editando ? { ...d, ...form } : d));
    } else {
      setDocentes((prev) => [...prev, { ...form, id: Date.now(), materias: 0 }]);
    }
    cerrarModal();
  };

  const eliminar = (id) => {
    setDocentes((prev) => prev.filter((d) => d.id !== id));
    setConfirmDelete(null);
  };

  const filtrados = docentes.filter((d) => {
    const matchBusqueda = d.nombre.toLowerCase().includes(busqueda.toLowerCase()) || d.email.toLowerCase().includes(busqueda.toLowerCase());
    const matchPrograma = filtroPrograma ? d.programa === filtroPrograma : true;
    const matchTipo = filtroTipo ? d.tipo === filtroTipo : true;
    return matchBusqueda && matchPrograma && matchTipo;
  });

  return (
    <MainLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Docentes</h1>
          <p className="text-gray-400 text-sm mt-1">Gestión del cuerpo docente de la Facultad</p>
        </div>
        <button
          onClick={abrirCrear}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-700 hover:bg-red-800 text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-red-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Docente
        </button>
      </div>

      {/* Tarjetas resumen */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Docentes", value: docentes.length, color: "bg-red-700" },
          { label: "Tiempo Completo", value: docentes.filter((d) => d.tipo === "Tiempo Completo").length, color: "bg-emerald-600" },
          { label: "Medio Tiempo", value: docentes.filter((d) => d.tipo === "Medio Tiempo").length, color: "bg-blue-600" },
          { label: "Catedráticos", value: docentes.filter((d) => d.tipo === "Catedrático").length, color: "bg-amber-500" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
            <div className={`${s.color} w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-lg flex-shrink-0`}>
              {s.value}
            </div>
            <p className="text-sm font-semibold text-gray-600">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Filtros */}
        <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar por nombre o correo..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50"
            />
          </div>
          <select value={filtroPrograma} onChange={(e) => setFiltroPrograma(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 text-gray-600">
            <option value="">Todos los programas</option>
            {programas.map((p) => <option key={p}>{p}</option>)}
          </select>
          <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 text-gray-600">
            <option value="">Todos los tipos</option>
            {tipos.map((t) => <option key={t}>{t}</option>)}
          </select>
          <span className="text-sm text-gray-400">{filtrados.length} resultado(s)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Docente", "Contacto", "Programa", "Tipo", "Materias", "Estado", "Acciones"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtrados.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-gray-400 text-sm">No se encontraron docentes</td>
                </tr>
              ) : (
                filtrados.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`${avatarColor(d.id)} w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0`}>
                          {iniciales(d.nombre)}
                        </div>
                        <span className="text-sm font-semibold text-gray-800">{d.nombre}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-gray-600">{d.email}</p>
                      <p className="text-xs text-gray-400">{d.telefono}</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500">{d.programa}</td>
                    <td className="px-5 py-4"><span className={tipoBadge(d.tipo)}>{d.tipo}</span></td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg">{d.materias} materia(s)</span>
                    </td>
                    <td className="px-5 py-4"><span className={estadoBadge(d.estado)}>{d.estado}</span></td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => abrirEditar(d)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button onClick={() => setConfirmDelete(d.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal crear/editar */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-black text-gray-800">{editando ? "Editar Docente" : "Nuevo Docente"}</h2>
              <button onClick={cerrarModal} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nombre Completo</label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  placeholder="Ej: Carlos Gómez"
                  className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 ${errors.nombre ? "border-red-400" : "border-gray-200"}`}
                />
                {errors.nombre && <p className="text-xs text-red-500 mt-1">{errors.nombre}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Correo Institucional</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="correo@unilibre.edu.co"
                    className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 ${errors.email ? "border-red-400" : "border-gray-200"}`}
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Teléfono</label>
                  <input
                    type="text"
                    value={form.telefono}
                    onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                    placeholder="300 000 0000"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tipo de Vinculación</label>
                  <select
                    value={form.tipo}
                    onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50"
                  >
                    {tipos.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Programa</label>
                  <select
                    value={form.programa}
                    onChange={(e) => setForm({ ...form, programa: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50"
                  >
                    {programas.map((p) => <option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Estado</label>
                <select
                  value={form.estado}
                  onChange={(e) => setForm({ ...form, estado: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50"
                >
                  <option>Activo</option>
                  <option>Inactivo</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={cerrarModal} className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors">Cancelar</button>
              <button onClick={guardar} className="flex-1 py-2.5 bg-red-700 hover:bg-red-800 text-white text-sm font-semibold rounded-xl transition-colors">
                {editando ? "Guardar Cambios" : "Crear Docente"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal confirmar eliminación */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-black text-gray-800 text-center">¿Eliminar docente?</h3>
            <p className="text-sm text-gray-400 text-center mt-1">Esta acción no se puede deshacer.</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors">Cancelar</button>
              <button onClick={() => eliminar(confirmDelete)} className="flex-1 py-2.5 bg-red-700 hover:bg-red-800 text-white text-sm font-semibold rounded-xl transition-colors">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}