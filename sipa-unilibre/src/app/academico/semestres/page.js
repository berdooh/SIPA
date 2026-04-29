"use client";

import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";

const semestresIniciales = [
  { id: 1, nombre: "2026-1", año: 2026, periodo: "1", fechaInicio: "2026-01-20", fechaFin: "2026-06-15", estado: "Activo" },
  { id: 2, nombre: "2025-2", año: 2025, periodo: "2", fechaInicio: "2025-07-15", fechaFin: "2025-12-10", estado: "Cerrado" },
  { id: 3, nombre: "2025-1", año: 2025, periodo: "1", fechaInicio: "2025-01-20", fechaFin: "2025-06-15", estado: "Cerrado" },
];

const estadoBadge = (estado) => {
  const base = "px-2.5 py-1 rounded-full text-xs font-bold";
  if (estado === "Activo") return `${base} bg-emerald-100 text-emerald-700`;
  if (estado === "Cerrado") return `${base} bg-gray-100 text-gray-500`;
  return `${base} bg-amber-100 text-amber-600`;
};

const estadoIcono = (estado) => {
  if (estado === "Activo") return "🟢";
  if (estado === "Cerrado") return "🔴";
  return "🟡";
};

export default function SemestresPage() {
  const [semestres, setSemestres] = useState(semestresIniciales);
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [form, setForm] = useState({ año: new Date().getFullYear(), periodo: "1", fechaInicio: "", fechaFin: "", estado: "Activo" });
  const [errors, setErrors] = useState({});

  const abrirCrear = () => {
    setEditando(null);
    setForm({ año: new Date().getFullYear(), periodo: "1", fechaInicio: "", fechaFin: "", estado: "Activo" });
    setErrors({});
    setModalOpen(true);
  };

  const abrirEditar = (s) => {
    setEditando(s.id);
    setForm({ año: s.año, periodo: s.periodo, fechaInicio: s.fechaInicio, fechaFin: s.fechaFin, estado: s.estado });
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
    if (!form.fechaInicio) e.fechaInicio = "La fecha de inicio es obligatoria";
    if (!form.fechaFin) e.fechaFin = "La fecha de fin es obligatoria";
    if (form.fechaInicio && form.fechaFin && form.fechaInicio >= form.fechaFin)
      e.fechaFin = "La fecha de fin debe ser mayor a la de inicio";
    return e;
  };

  const guardar = () => {
    const e = validar();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    const nombre = `${form.año}-${form.periodo}`;
    if (editando) {
      setSemestres((prev) => prev.map((s) => s.id === editando ? { ...form, nombre, id: editando } : s));
    } else {
      setSemestres((prev) => [...prev, { ...form, nombre, id: Date.now() }]);
    }
    cerrarModal();
  };

  const eliminar = (id) => {
    setSemestres((prev) => prev.filter((s) => s.id !== id));
    setConfirmDelete(null);
  };

  const activo = semestres.find((s) => s.estado === "Activo");

  return (
    <MainLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Semestres</h1>
          <p className="text-gray-400 text-sm mt-1">Gestión de periodos académicos</p>
        </div>
        <button
          onClick={abrirCrear}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-700 hover:bg-red-800 text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-red-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Semestre
        </button>
      </div>

      {/* Semestre activo destacado */}
      {activo && (
        <div className="bg-gradient-to-r from-red-700 to-red-600 rounded-2xl p-5 mb-6 text-white shadow-lg shadow-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-200 text-sm font-medium mb-1">Semestre en Curso</p>
              <h2 className="text-3xl font-black">{activo.nombre}</h2>
              <p className="text-red-200 text-sm mt-1">
                {new Date(activo.fechaInicio).toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" })} —{" "}
                {new Date(activo.fechaFin).toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" })}
              </p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Tarjetas resumen */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Semestres", value: semestres.length, color: "bg-red-700" },
          { label: "Activos", value: semestres.filter((s) => s.estado === "Activo").length, color: "bg-emerald-600" },
          { label: "Cerrados", value: semestres.filter((s) => s.estado === "Cerrado").length, color: "bg-gray-400" },
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
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800">Historial de Semestres</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Semestre", "Fecha Inicio", "Fecha Fin", "Duración", "Estado", "Acciones"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {semestres.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-gray-400 text-sm">No hay semestres registrados</td>
                </tr>
              ) : (
                semestres.map((s) => {
                  const inicio = new Date(s.fechaInicio);
                  const fin = new Date(s.fechaFin);
                  const dias = Math.round((fin - inicio) / (1000 * 60 * 60 * 24));
                  return (
                    <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span>{estadoIcono(s.estado)}</span>
                          <span className="text-sm font-bold text-gray-800">{s.nombre}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600">
                        {inicio.toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600">
                        {fin.toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600">{dias} días</td>
                      <td className="px-5 py-4"><span className={estadoBadge(s.estado)}>{s.estado}</span></td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => abrirEditar(s)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button onClick={() => setConfirmDelete(s.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal crear/editar */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-black text-gray-800">{editando ? "Editar Semestre" : "Nuevo Semestre"}</h2>
              <button onClick={cerrarModal} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              {/* Vista previa del nombre */}
              <div className="p-3 bg-red-50 rounded-xl border border-red-100 text-center">
                <p className="text-xs text-red-400 font-medium mb-1">Nombre del semestre</p>
                <p className="text-2xl font-black text-red-700">{form.año}-{form.periodo}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Año</label>
                  <input
                    type="number"
                    value={form.año}
                    onChange={(e) => setForm({ ...form, año: Number(e.target.value) })}
                    min={2020} max={2040}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Periodo</label>
                  <select
                    value={form.periodo}
                    onChange={(e) => setForm({ ...form, periodo: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50"
                  >
                    <option value="1">1 (Primer semestre)</option>
                    <option value="2">2 (Segundo semestre)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Fecha de Inicio</label>
                  <input
                    type="date"
                    value={form.fechaInicio}
                    onChange={(e) => setForm({ ...form, fechaInicio: e.target.value })}
                    className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 ${errors.fechaInicio ? "border-red-400" : "border-gray-200"}`}
                  />
                  {errors.fechaInicio && <p className="text-xs text-red-500 mt-1">{errors.fechaInicio}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Fecha de Fin</label>
                  <input
                    type="date"
                    value={form.fechaFin}
                    onChange={(e) => setForm({ ...form, fechaFin: e.target.value })}
                    className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 ${errors.fechaFin ? "border-red-400" : "border-gray-200"}`}
                  />
                  {errors.fechaFin && <p className="text-xs text-red-500 mt-1">{errors.fechaFin}</p>}
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
                  <option>Cerrado</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={cerrarModal} className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors">
                Cancelar
              </button>
              <button onClick={guardar} className="flex-1 py-2.5 bg-red-700 hover:bg-red-800 text-white text-sm font-semibold rounded-xl transition-colors">
                {editando ? "Guardar Cambios" : "Crear Semestre"}
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
            <h3 className="text-lg font-black text-gray-800 text-center">¿Eliminar semestre?</h3>
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