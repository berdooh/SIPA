"use client";

import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";

const salasIniciales = [
  { id: 1, nombre: "Sala PC-01", edificio: "Bloque C", piso: 1, capacidad: 30, pcs: 30, software: ["Windows 11", "Visual Studio Code", "MySQL Workbench"], estado: "Disponible", descripcion: "Sala principal de programación" },
  { id: 2, nombre: "Sala PC-02", edificio: "Bloque C", piso: 1, capacidad: 25, pcs: 25, software: ["Windows 11", "AutoCAD", "Microsoft Office"], estado: "Ocupado", descripcion: "Sala para diseño e ingeniería" },
  { id: 3, nombre: "Sala PC-03", edificio: "Bloque C", piso: 2, capacidad: 20, pcs: 18, software: ["Windows 11", "Python", "MATLAB"], estado: "Disponible", descripcion: "2 PCs en mantenimiento" },
  { id: 4, nombre: "Sala PC-04", edificio: "Bloque A", piso: 4, capacidad: 35, pcs: 35, software: ["Windows 11", "Visual Studio", "Oracle DB"], estado: "Mantenimiento", descripcion: "Actualización de equipos" },
];

const edificios = ["Bloque A", "Bloque B", "Bloque C"];
const softwareOpciones = ["Windows 11", "Visual Studio Code", "Visual Studio", "MySQL Workbench", "Oracle DB", "Python", "MATLAB", "AutoCAD", "Microsoft Office", "NetBeans", "Eclipse", "Android Studio"];

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

export default function SalasComputoPage() {
  const [salas, setSalas] = useState(salasIniciales);
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [softwareInput, setSoftwareInput] = useState("");
  const [form, setForm] = useState({ nombre: "", edificio: edificios[0], piso: 1, capacidad: 30, pcs: 30, software: [], estado: "Disponible", descripcion: "" });
  const [errors, setErrors] = useState({});

  const abrirCrear = () => {
    setEditando(null);
    setForm({ nombre: "", edificio: edificios[0], piso: 1, capacidad: 30, pcs: 30, software: [], estado: "Disponible", descripcion: "" });
    setSoftwareInput("");
    setErrors({});
    setModalOpen(true);
  };

  const abrirEditar = (s) => {
    setEditando(s.id);
    setForm({ ...s });
    setSoftwareInput("");
    setErrors({});
    setModalOpen(true);
  };

  const cerrarModal = () => { setModalOpen(false); setEditando(null); setErrors({}); setSoftwareInput(""); };

  const toggleSoftware = (sw) => {
    setForm((prev) => ({
      ...prev,
      software: prev.software.includes(sw)
        ? prev.software.filter((s) => s !== sw)
        : [...prev.software, sw],
    }));
  };

  const validar = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = "El nombre es obligatorio";
    if (form.capacidad < 1) e.capacidad = "La capacidad debe ser mayor a 0";
    if (form.pcs > form.capacidad) e.pcs = "No puede superar la capacidad";
    return e;
  };

  const guardar = () => {
    const e = validar();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    if (editando) {
      setSalas((prev) => prev.map((s) => s.id === editando ? { ...form, id: editando } : s));
    } else {
      setSalas((prev) => [...prev, { ...form, id: Date.now() }]);
    }
    cerrarModal();
  };

  const eliminar = (id) => { setSalas((prev) => prev.filter((s) => s.id !== id)); setConfirmDelete(null); };

  const filtradas = salas.filter((s) => {
    const matchBusqueda = s.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const matchEstado = filtroEstado ? s.estado === filtroEstado : true;
    return matchBusqueda && matchEstado;
  });

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Salas de Cómputo</h1>
          <p className="text-gray-400 text-sm mt-1">Gestión de salas de cómputo y su software instalado</p>
        </div>
        <button onClick={abrirCrear} className="flex items-center gap-2 px-4 py-2.5 bg-red-700 hover:bg-red-800 text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-red-200">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Nueva Sala
        </button>
      </div>

      {/* Tarjetas resumen */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Salas", value: salas.length, color: "bg-red-700" },
          { label: "Disponibles", value: salas.filter((s) => s.estado === "Disponible").length, color: "bg-emerald-600" },
          { label: "Total PCs", value: salas.reduce((a, s) => a + s.pcs, 0), color: "bg-blue-600" },
          { label: "Mantenimiento", value: salas.filter((s) => s.estado === "Mantenimiento").length, color: "bg-amber-500" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
            <div className={`${s.color} w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-lg flex-shrink-0`}>{s.value}</div>
            <p className="text-sm font-semibold text-gray-600">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Cards visuales de salas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
        {salas.filter((s) => s.estado === "Disponible").map((s) => (
          <div key={s.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">{s.nombre}</p>
                  <p className="text-xs text-gray-400">{s.edificio} · Piso {s.piso}</p>
                </div>
              </div>
              <span className={estadoBadge(s.estado)}>{s.estado}</span>
            </div>
            <div className="flex items-center gap-4 mb-3">
              <div className="text-center">
                <p className="text-xl font-black text-gray-800">{s.pcs}</p>
                <p className="text-xs text-gray-400">PCs</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-black text-gray-800">{s.capacidad}</p>
                <p className="text-xs text-gray-400">Capacidad</p>
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap gap-1">
                  {s.software.slice(0, 3).map((sw) => (
                    <span key={sw} className="px-1.5 py-0.5 bg-blue-50 text-blue-600 text-xs rounded font-medium">{sw}</span>
                  ))}
                  {s.software.length > 3 && <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-xs rounded font-medium">+{s.software.length - 3}</span>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" placeholder="Buscar sala..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50" />
          </div>
          <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 text-gray-600">
            <option value="">Todos los estados</option>
            {["Disponible", "Ocupado", "Mantenimiento"].map((e) => <option key={e}>{e}</option>)}
          </select>
          <span className="text-sm text-gray-400">{filtradas.length} resultado(s)</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Sala", "Ubicación", "PCs / Capacidad", "Software", "Estado", "Acciones"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtradas.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-gray-400 text-sm">No se encontraron salas</td></tr>
              ) : (
                filtradas.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{s.nombre}</p>
                          <p className="text-xs text-gray-400 max-w-32 truncate">{s.descripcion}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">{s.edificio} · Piso {s.piso}</td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-bold text-gray-800">{s.pcs}</span>
                      <span className="text-sm text-gray-400"> / {s.capacidad}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1">
                        {s.software.slice(0, 2).map((sw) => (
                          <span key={sw} className="px-1.5 py-0.5 bg-blue-50 text-blue-600 text-xs rounded font-medium">{sw}</span>
                        ))}
                        {s.software.length > 2 && <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">+{s.software.length - 2}</span>}
                      </div>
                    </td>
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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h2 className="text-lg font-black text-gray-800">{editando ? "Editar Sala" : "Nueva Sala de Cómputo"}</h2>
              <button onClick={cerrarModal} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nombre de la Sala</label>
                <input type="text" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Ej: Sala PC-01" className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 ${errors.nombre ? "border-red-400" : "border-gray-200"}`} />
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
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">PCs disponibles</label>
                  <input type="number" value={form.pcs} onChange={(e) => setForm({ ...form, pcs: Number(e.target.value) })} min={0} className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 ${errors.pcs ? "border-red-400" : "border-gray-200"}`} />
                  {errors.pcs && <p className="text-xs text-red-500 mt-1">{errors.pcs}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Software instalado</label>
                <div className="flex flex-wrap gap-2 p-3 border border-gray-200 rounded-xl bg-gray-50 min-h-12">
                  {softwareOpciones.map((sw) => (
                    <button key={sw} type="button" onClick={() => toggleSoftware(sw)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${form.software.includes(sw) ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600"}`}>
                      {sw}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Estado</label>
                <select value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50">
                  {["Disponible", "Ocupado", "Mantenimiento"].map((e) => <option key={e}>{e}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Descripción (opcional)</label>
                <textarea value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} placeholder="Ej: Sala principal de programación" rows={2} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 resize-none" />
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={cerrarModal} className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors">Cancelar</button>
              <button onClick={guardar} className="flex-1 py-2.5 bg-red-700 hover:bg-red-800 text-white text-sm font-semibold rounded-xl transition-colors">{editando ? "Guardar Cambios" : "Crear Sala"}</button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h3 className="text-lg font-black text-gray-800 text-center">¿Eliminar sala?</h3>
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