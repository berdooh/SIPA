"use client";

import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";

const laboratoriosIniciales = [
  { id: 1, nombre: "Lab. Física", edificio: "Bloque B", piso: 1, capacidad: 20, tipo: "Física", equipos: ["Osciloscopios", "Multímetros", "Fuentes de voltaje", "Protoboards"], estado: "Disponible", descripcion: "Laboratorio de física experimental" },
  { id: 2, nombre: "Lab. Química", edificio: "Bloque B", piso: 1, capacidad: 18, tipo: "Química", equipos: ["Mecheros Bunsen", "Microscopios", "Centrifugadoras", "Balanzas analíticas"], estado: "Ocupado", descripcion: "Laboratorio de química general" },
  { id: 3, nombre: "Lab. Electrónica", edificio: "Bloque C", piso: 2, capacidad: 24, tipo: "Electrónica", equipos: ["Osciloscopios digitales", "Soldadores", "Analizadores de espectro", "Generadores de señal"], estado: "Disponible", descripcion: "Laboratorio de circuitos y electrónica" },
  { id: 4, nombre: "Lab. Redes", edificio: "Bloque C", piso: 3, capacidad: 20, tipo: "Redes", equipos: ["Switches Cisco", "Routers", "Patch panels", "Analizadores de red"], estado: "Mantenimiento", descripcion: "Actualización de infraestructura de red" },
];

const edificios = ["Bloque A", "Bloque B", "Bloque C"];
const tiposLab = ["Física", "Química", "Electrónica", "Redes", "Mecánica", "Biología", "Otro"];
const equiposOpciones = {
  Física: ["Osciloscopios", "Multímetros", "Fuentes de voltaje", "Protoboards", "Sensores de movimiento", "Termómetros digitales"],
  Química: ["Mecheros Bunsen", "Microscopios", "Centrifugadoras", "Balanzas analíticas", "pH-metros", "Espectrofotómetros"],
  Electrónica: ["Osciloscopios digitales", "Soldadores", "Analizadores de espectro", "Generadores de señal", "Fuentes DC", "Multímetros"],
  Redes: ["Switches Cisco", "Routers", "Patch panels", "Analizadores de red", "Cables UTP", "Herramientas de crimpado"],
  Mecánica: ["Tornos", "Fresadoras", "Calibradores", "Micrómetros", "Taladros de columna"],
  Biología: ["Microscopios ópticos", "Autoclave", "Cabinas de bioseguridad", "Incubadoras", "Refrigeradores de laboratorio"],
  Otro: ["Equipos generales", "Herramientas manuales", "Material de seguridad"],
};

const estadoBadge = (estado) => {
  const base = "px-2.5 py-1 rounded-full text-xs font-bold";
  if (estado === "Disponible") return `${base} bg-emerald-100 text-emerald-700`;
  if (estado === "Ocupado") return `${base} bg-red-100 text-red-700`;
  return `${base} bg-amber-100 text-amber-700`;
};

const tipoColor = (tipo) => {
  const colores = { Física: "bg-purple-50 text-purple-700 border-purple-100", Química: "bg-green-50 text-green-700 border-green-100", Electrónica: "bg-blue-50 text-blue-700 border-blue-100", Redes: "bg-indigo-50 text-indigo-700 border-indigo-100", Mecánica: "bg-orange-50 text-orange-700 border-orange-100", Biología: "bg-teal-50 text-teal-700 border-teal-100" };
  return colores[tipo] || "bg-gray-50 text-gray-700 border-gray-100";
};

const tipoIcono = (tipo) => {
  const iconos = {
    Física: "⚡", Química: "🧪", Electrónica: "🔌", Redes: "🌐", Mecánica: "⚙️", Biología: "🔬",
  };
  return iconos[tipo] || "🔬";
};

export default function LaboratoriosPage() {
  const [laboratorios, setLaboratorios] = useState(laboratoriosIniciales);
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [form, setForm] = useState({ nombre: "", edificio: edificios[0], piso: 1, capacidad: 20, tipo: tiposLab[0], equipos: [], estado: "Disponible", descripcion: "" });
  const [errors, setErrors] = useState({});

  const abrirCrear = () => {
    setEditando(null);
    setForm({ nombre: "", edificio: edificios[0], piso: 1, capacidad: 20, tipo: tiposLab[0], equipos: [], estado: "Disponible", descripcion: "" });
    setErrors({});
    setModalOpen(true);
  };

  const abrirEditar = (l) => {
    setEditando(l.id);
    setForm({ ...l });
    setErrors({});
    setModalOpen(true);
  };

  const cerrarModal = () => { setModalOpen(false); setEditando(null); setErrors({}); };

  const toggleEquipo = (equipo) => {
    setForm((prev) => ({
      ...prev,
      equipos: prev.equipos.includes(equipo)
        ? prev.equipos.filter((e) => e !== equipo)
        : [...prev.equipos, equipo],
    }));
  };

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
      setLaboratorios((prev) => prev.map((l) => l.id === editando ? { ...form, id: editando } : l));
    } else {
      setLaboratorios((prev) => [...prev, { ...form, id: Date.now() }]);
    }
    cerrarModal();
  };

  const eliminar = (id) => { setLaboratorios((prev) => prev.filter((l) => l.id !== id)); setConfirmDelete(null); };

  const filtrados = laboratorios.filter((l) => {
    const matchBusqueda = l.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const matchTipo = filtroTipo ? l.tipo === filtroTipo : true;
    const matchEstado = filtroEstado ? l.estado === filtroEstado : true;
    return matchBusqueda && matchTipo && matchEstado;
  });

  const equiposActuales = equiposOpciones[form.tipo] || equiposOpciones["Otro"];

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Laboratorios</h1>
          <p className="text-gray-400 text-sm mt-1">Gestión de laboratorios y equipos especializados</p>
        </div>
        <button onClick={abrirCrear} className="flex items-center gap-2 px-4 py-2.5 bg-red-700 hover:bg-red-800 text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-red-200">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Nuevo Laboratorio
        </button>
      </div>

      {/* Tarjetas resumen */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Labs", value: laboratorios.length, color: "bg-red-700" },
          { label: "Disponibles", value: laboratorios.filter((l) => l.estado === "Disponible").length, color: "bg-emerald-600" },
          { label: "Ocupados", value: laboratorios.filter((l) => l.estado === "Ocupado").length, color: "bg-red-500" },
          { label: "Mantenimiento", value: laboratorios.filter((l) => l.estado === "Mantenimiento").length, color: "bg-amber-500" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
            <div className={`${s.color} w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-lg flex-shrink-0`}>{s.value}</div>
            <p className="text-sm font-semibold text-gray-600">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Cards visuales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {laboratorios.map((l) => (
          <div key={l.id} className={`bg-white rounded-2xl p-4 shadow-sm border-2 ${l.estado === "Disponible" ? "border-emerald-100" : l.estado === "Ocupado" ? "border-red-100" : "border-amber-100"} hover:shadow-md transition-shadow`}>
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl border ${tipoColor(l.tipo)}`}>
                {tipoIcono(l.tipo)}
              </div>
              <span className={estadoBadge(l.estado)}>{l.estado}</span>
            </div>
            <p className="text-sm font-bold text-gray-800 mb-0.5">{l.nombre}</p>
            <p className="text-xs text-gray-400 mb-3">{l.edificio} · Piso {l.piso}</p>
            <div className="flex items-center justify-between">
              <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold border ${tipoColor(l.tipo)}`}>{l.tipo}</span>
              <span className="text-xs text-gray-500 font-semibold">{l.capacidad} personas</span>
            </div>
          </div>
        ))}
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" placeholder="Buscar laboratorio..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50" />
          </div>
          <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 text-gray-600">
            <option value="">Todos los tipos</option>
            {tiposLab.map((t) => <option key={t}>{t}</option>)}
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
                {["Laboratorio", "Ubicación", "Tipo", "Capacidad", "Equipos", "Estado", "Acciones"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtrados.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-gray-400 text-sm">No se encontraron laboratorios</td></tr>
              ) : (
                filtrados.map((l) => (
                  <tr key={l.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg border ${tipoColor(l.tipo)}`}>
                          {tipoIcono(l.tipo)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{l.nombre}</p>
                          <p className="text-xs text-gray-400 max-w-36 truncate">{l.descripcion}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">{l.edificio} · Piso {l.piso}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${tipoColor(l.tipo)}`}>{l.tipo}</span>
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-gray-700">{l.capacidad}</td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1">
                        {l.equipos.slice(0, 2).map((e) => (
                          <span key={e} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded font-medium">{e}</span>
                        ))}
                        {l.equipos.length > 2 && <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">+{l.equipos.length - 2}</span>}
                      </div>
                    </td>
                    <td className="px-5 py-4"><span className={estadoBadge(l.estado)}>{l.estado}</span></td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => abrirEditar(l)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button onClick={() => setConfirmDelete(l.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
              <h2 className="text-lg font-black text-gray-800">{editando ? "Editar Laboratorio" : "Nuevo Laboratorio"}</h2>
              <button onClick={cerrarModal} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nombre del Laboratorio</label>
                <input type="text" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Ej: Lab. Física" className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 ${errors.nombre ? "border-red-400" : "border-gray-200"}`} />
                {errors.nombre && <p className="text-xs text-red-500 mt-1">{errors.nombre}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tipo</label>
                  <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value, equipos: [] })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50">
                    {tiposLab.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Capacidad</label>
                  <input type="number" value={form.capacidad} onChange={(e) => setForm({ ...form, capacidad: Number(e.target.value) })} min={1} className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 ${errors.capacidad ? "border-red-400" : "border-gray-200"}`} />
                  {errors.capacidad && <p className="text-xs text-red-500 mt-1">{errors.capacidad}</p>}
                </div>
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
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Equipos disponibles <span className="text-gray-400 font-normal">(según tipo seleccionado)</span></label>
                <div className="flex flex-wrap gap-2 p-3 border border-gray-200 rounded-xl bg-gray-50 min-h-12">
                  {equiposActuales.map((eq) => (
                    <button key={eq} type="button" onClick={() => toggleEquipo(eq)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${form.equipos.includes(eq) ? "bg-red-700 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-red-400 hover:text-red-600"}`}>
                      {eq}
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
                <textarea value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} placeholder="Ej: Laboratorio de física experimental" rows={2} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 resize-none" />
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={cerrarModal} className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors">Cancelar</button>
              <button onClick={guardar} className="flex-1 py-2.5 bg-red-700 hover:bg-red-800 text-white text-sm font-semibold rounded-xl transition-colors">{editando ? "Guardar Cambios" : "Crear Laboratorio"}</button>
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
            <h3 className="text-lg font-black text-gray-800 text-center">¿Eliminar laboratorio?</h3>
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