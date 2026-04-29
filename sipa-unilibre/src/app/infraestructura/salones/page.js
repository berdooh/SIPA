"use client";

import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";

const salonesIniciales = [
  { id: 1, nombre: "Salón 101", edificio: "Bloque A", piso: 1, capacidad: 40, tipo: "Teórico", estado: "Disponible", descripcion: "Salón con videobeam y tablero acrílico" },
  { id: 2, nombre: "Salón 201", edificio: "Bloque A", piso: 2, capacidad: 35, tipo: "Teórico", estado: "Ocupado", descripcion: "Salón con aire acondicionado" },
  { id: 3, nombre: "Salón 301", edificio: "Bloque B", piso: 3, capacidad: 50, tipo: "Teórico", estado: "Disponible", descripcion: "Salón amplio para grupos grandes" },
  { id: 4, nombre: "Salón 102", edificio: "Bloque A", piso: 1, capacidad: 30, tipo: "Teórico", estado: "Disponible", descripcion: "Salón estándar" },
  { id: 5, nombre: "Salón 305", edificio: "Bloque B", piso: 3, capacidad: 45, tipo: "Teórico", estado: "Mantenimiento", descripcion: "En reparación de planta eléctrica" },
];

const edificios = ["Bloque A", "Bloque B", "Bloque C"];

const estadoBadge = (estado) => {
  const base = "px-2.5 py-1 rounded-full text-xs font-bold";
  if (estado === "Disponible") return `${base} bg-emerald-100 text-emerald-700`;
  if (estado === "Ocupado") return `${base} bg-red-100 text-red-700`;
  return `${base} bg-amber-100 text-amber-700`;
};

const estadoIcono = (estado) => {
  if (estado === "Disponible") return "🟢";
  if (estado === "Ocupado") return "🔴";
  return "🟡";
};

export default function SalonesPage() {
  const [salones, setSalones] = useState(salonesIniciales);
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEdificio, setFiltroEdificio] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [form, setForm] = useState({ nombre: "", edificio: edificios[0], piso: 1, capacidad: 30, tipo: "Teórico", estado: "Disponible", descripcion: "" });
  const [errors, setErrors] = useState({});

  const abrirCrear = () => {
    setEditando(null);
    setForm({ nombre: "", edificio: edificios[0], piso: 1, capacidad: 30, tipo: "Teórico", estado: "Disponible", descripcion: "" });
    setErrors({});
    setModalOpen(true);
  };

  const abrirEditar = (s) => {
    setEditando(s.id);
    setForm({ ...s });
    setErrors({});
    setModalOpen(true);
  };

  const cerrarModal = () => { setModalOpen(false); setEditando(null); setErrors({}); };

  const validar = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = "El nombre es obligatorio";
    if (form.capacidad < 1) e.capacidad = "La capacidad debe ser mayor a 0";
    return e;
  };

  const guardar = () => {
    const e = validar();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    if (editando) {
      setSalones((prev) => prev.map((s) => s.id === editando ? { ...form, id: editando } : s));
    } else {
      setSalones((prev) => [...prev, { ...form, id: Date.now() }]);
    }
    cerrarModal();
  };

  const eliminar = (id) => { setSalones((prev) => prev.filter((s) => s.id !== id)); setConfirmDelete(null); };

  const filtrados = salones.filter((s) => {
    const matchBusqueda = s.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const matchEdificio = filtroEdificio ? s.edificio === filtroEdificio : true;
    const matchEstado = filtroEstado ? s.estado === filtroEstado : true;
    return matchBusqueda && matchEdificio && matchEstado;
  });

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Salones</h1>
          <p className="text-gray-400 text-sm mt-1">Gestión de salones de clase teóricos</p>
        </div>
        <button onClick={abrirCrear} className="flex items-center gap-2 px-4 py-2.5 bg-red-700 hover:bg-red-800 text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-red-200">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Nuevo Salón
        </button>
      </div>

      {/* Tarjetas resumen */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Salones", value: salones.length, color: "bg-red-700" },
          { label: "Disponibles", value: salones.filter((s) => s.estado === "Disponible").length, color: "bg-emerald-600" },
          { label: "Ocupados", value: salones.filter((s) => s.estado === "Ocupado").length, color: "bg-red-500" },
          { label: "Mantenimiento", value: salones.filter((s) => s.estado === "Mantenimiento").length, color: "bg-amber-500" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
            <div className={`${s.color} w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-lg flex-shrink-0`}>{s.value}</div>
            <p className="text-sm font-semibold text-gray-600">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Cards de salones */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" placeholder="Buscar salón..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50" />
          </div>
          <select value={filtroEdificio} onChange={(e) => setFiltroEdificio(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 text-gray-600">
            <option value="">Todos los edificios</option>
            {edificios.map((e) => <option key={e}>{e}</option>)}
          </select>
          <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 text-gray-600">
            <option value="">Todos los estados</option>
            {["Disponible", "Ocupado", "Mantenimiento"].map((e) => <option key={e}>{e}</option>)}
          </select>
          <span className="text-sm text-gray-400">{filtrados.length} resultado(s)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Salón", "Edificio", "Piso", "Capacidad", "Tipo", "Estado", "Acciones"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtrados.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-gray-400 text-sm">No se encontraron salones</td></tr>
              ) : (
                filtrados.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-red-50 border border-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{s.nombre}</p>
                          <p className="text-xs text-gray-400 truncate max-w-32">{s.descripcion}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">{s.edificio}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">Piso {s.piso}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        <span className="text-sm font-semibold text-gray-700">{s.capacidad}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">{s.tipo}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <span>{estadoIcono(s.estado)}</span>
                        <span className={estadoBadge(s.estado)}>{s.estado}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => abrirEditar(s)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button onClick={() => setConfirmDelete(s.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
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
              <h2 className="text-lg font-black text-gray-800">{editando ? "Editar Salón" : "Nuevo Salón"}</h2>
              <button onClick={cerrarModal} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nombre del Salón</label>
                <input type="text" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Ej: Salón 101" className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 ${errors.nombre ? "border-red-400" : "border-gray-200"}`} />
                {errors.nombre && <p className="text-xs text-red-500 mt-1">{errors.nombre}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Edificio</label>
                  <select value={form.edificio} onChange={(e) => setForm({ ...form, edificio: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50">
                    {edificios.map((e) => <option key={e}>{e}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Piso</label>
                  <input type="number" value={form.piso} onChange={(e) => setForm({ ...form, piso: Number(e.target.value) })} min={1} max={10} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Capacidad</label>
                  <input type="number" value={form.capacidad} onChange={(e) => setForm({ ...form, capacidad: Number(e.target.value) })} min={1} className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 ${errors.capacidad ? "border-red-400" : "border-gray-200"}`} />
                  {errors.capacidad && <p className="text-xs text-red-500 mt-1">{errors.capacidad}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Estado</label>
                  <select value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50">
                    {["Disponible", "Ocupado", "Mantenimiento"].map((e) => <option key={e}>{e}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Descripción (opcional)</label>
                <textarea value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} placeholder="Ej: Salón con videobeam y aire acondicionado" rows={2} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 resize-none" />
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={cerrarModal} className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors">Cancelar</button>
              <button onClick={guardar} className="flex-1 py-2.5 bg-red-700 hover:bg-red-800 text-white text-sm font-semibold rounded-xl transition-colors">{editando ? "Guardar Cambios" : "Crear Salón"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal confirmar eliminación */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h3 className="text-lg font-black text-gray-800 text-center">¿Eliminar salón?</h3>
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