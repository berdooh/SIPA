"use client";

import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";

const gruposIniciales = [
  { id: 1, nombre: "IS-101A", asignatura: "Cálculo I", programa: "Ingeniería de Sistemas", semestre: "2026-1", jornada: "Diurna", estudiantes: 35, capacidad: 40, estado: "Activo" },
  { id: 2, nombre: "IS-101B", asignatura: "Cálculo I", programa: "Ingeniería de Sistemas", semestre: "2026-1", jornada: "Nocturna", estudiantes: 28, capacidad: 40, estado: "Activo" },
  { id: 3, nombre: "IS-201A", asignatura: "Programación I", programa: "Ingeniería de Sistemas", semestre: "2026-1", jornada: "Diurna", estudiantes: 30, capacidad: 30, estado: "Activo" },
  { id: 4, nombre: "II-101A", asignatura: "Física I", programa: "Ingeniería Industrial", semestre: "2026-1", jornada: "Diurna", estudiantes: 40, capacidad: 45, estado: "Activo" },
  { id: 5, nombre: "II-301A", asignatura: "Investigación de Operaciones", programa: "Ingeniería Industrial", semestre: "2026-1", jornada: "Nocturna", estudiantes: 22, capacidad: 35, estado: "Activo" },
];

const programas = ["Ingeniería de Sistemas", "Ingeniería Industrial"];
const jornadas = ["Diurna", "Nocturna"];
const semestresOpciones = ["2026-1", "2025-2", "2025-1"];
const asignaturas = ["Cálculo I", "Programación I", "Física I", "Bases de Datos", "Investigación de Operaciones"];

const jornadaBadge = (jornada) => {
  const base = "px-2.5 py-1 rounded-full text-xs font-bold";
  return jornada === "Diurna"
    ? `${base} bg-amber-100 text-amber-700`
    : `${base} bg-indigo-100 text-indigo-700`;
};

const ocupacionColor = (estudiantes, capacidad) => {
  const pct = (estudiantes / capacidad) * 100;
  if (pct >= 100) return "bg-red-500";
  if (pct >= 80) return "bg-amber-400";
  return "bg-emerald-500";
};

export default function GruposPage() {
  const [grupos, setGrupos] = useState(gruposIniciales);
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtroPrograma, setFiltroPrograma] = useState("");
  const [filtroJornada, setFiltroJornada] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [form, setForm] = useState({
    nombre: "", asignatura: asignaturas[0], programa: programas[0],
    semestre: semestresOpciones[0], jornada: "Diurna", estudiantes: 0, capacidad: 40, estado: "Activo",
  });
  const [errors, setErrors] = useState({});

  const abrirCrear = () => {
    setEditando(null);
    setForm({ nombre: "", asignatura: asignaturas[0], programa: programas[0], semestre: semestresOpciones[0], jornada: "Diurna", estudiantes: 0, capacidad: 40, estado: "Activo" });
    setErrors({});
    setModalOpen(true);
  };

  const abrirEditar = (g) => {
    setEditando(g.id);
    setForm({ ...g });
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
    if (form.estudiantes > form.capacidad) e.estudiantes = "No puede superar la capacidad";
    if (form.capacidad < 1) e.capacidad = "La capacidad debe ser mayor a 0";
    return e;
  };

  const guardar = () => {
    const e = validar();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    if (editando) {
      setGrupos((prev) => prev.map((g) => g.id === editando ? { ...form, id: editando } : g));
    } else {
      setGrupos((prev) => [...prev, { ...form, id: Date.now() }]);
    }
    cerrarModal();
  };

  const eliminar = (id) => {
    setGrupos((prev) => prev.filter((g) => g.id !== id));
    setConfirmDelete(null);
  };

  const filtrados = grupos.filter((g) => {
    const matchBusqueda = g.nombre.toLowerCase().includes(busqueda.toLowerCase()) || g.asignatura.toLowerCase().includes(busqueda.toLowerCase());
    const matchPrograma = filtroPrograma ? g.programa === filtroPrograma : true;
    const matchJornada = filtroJornada ? g.jornada === filtroJornada : true;
    return matchBusqueda && matchPrograma && matchJornada;
  });

  return (
    <MainLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Grupos</h1>
          <p className="text-gray-400 text-sm mt-1">Gestión de grupos por asignatura y jornada</p>
        </div>
        <button
          onClick={abrirCrear}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-700 hover:bg-red-800 text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-red-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Grupo
        </button>
      </div>

      {/* Tarjetas resumen */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Grupos", value: grupos.length, color: "bg-red-700" },
          { label: "Jornada Diurna", value: grupos.filter((g) => g.jornada === "Diurna").length, color: "bg-amber-500" },
          { label: "Jornada Nocturna", value: grupos.filter((g) => g.jornada === "Nocturna").length, color: "bg-indigo-600" },
          { label: "Grupos Llenos", value: grupos.filter((g) => g.estudiantes >= g.capacidad).length, color: "bg-rose-500" },
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
              placeholder="Buscar grupo o asignatura..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50"
            />
          </div>
          <select value={filtroPrograma} onChange={(e) => setFiltroPrograma(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 text-gray-600">
            <option value="">Todos los programas</option>
            {programas.map((p) => <option key={p}>{p}</option>)}
          </select>
          <select value={filtroJornada} onChange={(e) => setFiltroJornada(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 text-gray-600">
            <option value="">Todas las jornadas</option>
            {jornadas.map((j) => <option key={j}>{j}</option>)}
          </select>
          <span className="text-sm text-gray-400">{filtrados.length} resultado(s)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Grupo", "Asignatura", "Programa", "Semestre", "Jornada", "Ocupación", "Acciones"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtrados.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-gray-400 text-sm">No se encontraron grupos</td>
                </tr>
              ) : (
                filtrados.map((g) => {
                  const pct = Math.round((g.estudiantes / g.capacidad) * 100);
                  return (
                    <tr key={g.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <span className="px-2.5 py-1 bg-red-50 text-red-700 text-xs font-black rounded-lg">{g.nombre}</span>
                      </td>
                      <td className="px-5 py-4 text-sm font-medium text-gray-800">{g.asignatura}</td>
                      <td className="px-5 py-4 text-sm text-gray-500">{g.programa}</td>
                      <td className="px-5 py-4 text-sm text-gray-500">{g.semestre}</td>
                      <td className="px-5 py-4"><span className={jornadaBadge(g.jornada)}>{g.jornada}</span></td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 min-w-32">
                          <div className="flex-1 bg-gray-100 rounded-full h-2">
                            <div
                              className={`${ocupacionColor(g.estudiantes, g.capacidad)} h-2 rounded-full transition-all`}
                              style={{ width: `${Math.min(pct, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-gray-600 w-16 text-right">
                            {g.estudiantes}/{g.capacidad}
                          </span>
                        </div>
                        {g.estudiantes >= g.capacidad && (
                          <p className="text-xs text-red-500 font-semibold mt-0.5">Grupo lleno</p>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => abrirEditar(g)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button onClick={() => setConfirmDelete(g.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h2 className="text-lg font-black text-gray-800">{editando ? "Editar Grupo" : "Nuevo Grupo"}</h2>
              <button onClick={cerrarModal} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nombre del Grupo</label>
                  <input
                    type="text"
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value.toUpperCase() })}
                    placeholder="Ej: IS-101A"
                    className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 ${errors.nombre ? "border-red-400" : "border-gray-200"}`}
                  />
                  {errors.nombre && <p className="text-xs text-red-500 mt-1">{errors.nombre}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Semestre</label>
                  <select
                    value={form.semestre}
                    onChange={(e) => setForm({ ...form, semestre: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50"
                  >
                    {semestresOpciones.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Asignatura</label>
                <select
                  value={form.asignatura}
                  onChange={(e) => setForm({ ...form, asignatura: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50"
                >
                  {asignaturas.map((a) => <option key={a}>{a}</option>)}
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Jornada</label>
                  <select
                    value={form.jornada}
                    onChange={(e) => setForm({ ...form, jornada: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50"
                  >
                    {jornadas.map((j) => <option key={j}>{j}</option>)}
                  </select>
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nº Estudiantes</label>
                  <input
                    type="number"
                    value={form.estudiantes}
                    onChange={(e) => setForm({ ...form, estudiantes: Number(e.target.value) })}
                    min={0}
                    className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 ${errors.estudiantes ? "border-red-400" : "border-gray-200"}`}
                  />
                  {errors.estudiantes && <p className="text-xs text-red-500 mt-1">{errors.estudiantes}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Capacidad Máx.</label>
                  <input
                    type="number"
                    value={form.capacidad}
                    onChange={(e) => setForm({ ...form, capacidad: Number(e.target.value) })}
                    min={1}
                    className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 ${errors.capacidad ? "border-red-400" : "border-gray-200"}`}
                  />
                  {errors.capacidad && <p className="text-xs text-red-500 mt-1">{errors.capacidad}</p>}
                </div>
              </div>

              {/* Barra de ocupación en tiempo real */}
              {form.capacidad > 0 && (
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex justify-between items-center mb-1.5">
                    <p className="text-xs font-semibold text-gray-500">Ocupación actual</p>
                    <p className="text-xs font-bold text-gray-700">{form.estudiantes}/{form.capacidad} ({Math.min(Math.round((form.estudiantes / form.capacidad) * 100), 100)}%)</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${ocupacionColor(form.estudiantes, form.capacidad)} h-2 rounded-full transition-all`}
                      style={{ width: `${Math.min((form.estudiantes / form.capacidad) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={cerrarModal} className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors">
                Cancelar
              </button>
              <button onClick={guardar} className="flex-1 py-2.5 bg-red-700 hover:bg-red-800 text-white text-sm font-semibold rounded-xl transition-colors">
                {editando ? "Guardar Cambios" : "Crear Grupo"}
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
            <h3 className="text-lg font-black text-gray-800 text-center">¿Eliminar grupo?</h3>
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