"use client";

import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";

const asignaturasIniciales = [
  { id: 1, nombre: "Cálculo I", codigo: "MAT101", programa: "Ingeniería de Sistemas", semestre: 1, creditos: 4, tipo: "Teórica", estado: "Activa" },
  { id: 2, nombre: "Programación I", codigo: "IS101", programa: "Ingeniería de Sistemas", semestre: 1, creditos: 3, tipo: "Práctica", estado: "Activa" },
  { id: 3, nombre: "Física I", codigo: "FIS101", programa: "Ingeniería Industrial", semestre: 1, creditos: 4, tipo: "Teórica", estado: "Activa" },
  { id: 4, nombre: "Bases de Datos", codigo: "IS301", programa: "Ingeniería de Sistemas", semestre: 3, creditos: 3, tipo: "Práctica", estado: "Activa" },
  { id: 5, nombre: "Investigación de Operaciones", codigo: "II401", programa: "Ingeniería Industrial", semestre: 4, creditos: 4, tipo: "Teórica", estado: "Activa" },
];

const programas = ["Ingeniería de Sistemas", "Ingeniería Industrial"];
const tipos = ["Teórica", "Práctica"];

const tipoBadge = (tipo) => {
  const base = "px-2.5 py-1 rounded-full text-xs font-bold";
  return tipo === "Práctica"
    ? `${base} bg-blue-100 text-blue-700`
    : `${base} bg-purple-100 text-purple-700`;
};

const estadoBadge = (estado) => {
  const base = "px-2.5 py-1 rounded-full text-xs font-bold";
  return estado === "Activa"
    ? `${base} bg-emerald-100 text-emerald-700`
    : `${base} bg-gray-100 text-gray-500`;
};

export default function AsignaturasPage() {
  const [asignaturas, setAsignaturas] = useState(asignaturasIniciales);
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtroPrograma, setFiltroPrograma] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [form, setForm] = useState({ nombre: "", codigo: "", programa: programas[0], semestre: 1, creditos: 3, tipo: "Teórica", estado: "Activa" });
  const [errors, setErrors] = useState({});

  const abrirCrear = () => {
    setEditando(null);
    setForm({ nombre: "", codigo: "", programa: programas[0], semestre: 1, creditos: 3, tipo: "Teórica", estado: "Activa" });
    setErrors({});
    setModalOpen(true);
  };

  const abrirEditar = (a) => {
    setEditando(a.id);
    setForm({ ...a });
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
    if (!form.codigo.trim()) e.codigo = "El código es obligatorio";
    return e;
  };

  const guardar = () => {
    const e = validar();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    if (editando) {
      setAsignaturas((prev) => prev.map((a) => (a.id === editando ? { ...form, id: editando } : a)));
    } else {
      setAsignaturas((prev) => [...prev, { ...form, id: Date.now() }]);
    }
    cerrarModal();
  };

  const eliminar = (id) => {
    setAsignaturas((prev) => prev.filter((a) => a.id !== id));
    setConfirmDelete(null);
  };

  const filtradas = asignaturas.filter((a) => {
    const matchBusqueda = a.nombre.toLowerCase().includes(busqueda.toLowerCase()) || a.codigo.toLowerCase().includes(busqueda.toLowerCase());
    const matchPrograma = filtroPrograma ? a.programa === filtroPrograma : true;
    const matchTipo = filtroTipo ? a.tipo === filtroTipo : true;
    return matchBusqueda && matchPrograma && matchTipo;
  });

  return (
    <MainLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Asignaturas</h1>
          <p className="text-gray-400 text-sm mt-1">Gestión de materias por programa académico</p>
        </div>
        <button
          onClick={abrirCrear}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-700 hover:bg-red-800 text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-red-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva Asignatura
        </button>
      </div>

      {/* Tarjetas resumen */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Asignaturas", value: asignaturas.length, color: "bg-red-700" },
          { label: "Teóricas", value: asignaturas.filter((a) => a.tipo === "Teórica").length, color: "bg-purple-600" },
          { label: "Prácticas", value: asignaturas.filter((a) => a.tipo === "Práctica").length, color: "bg-blue-600" },
          { label: "Activas", value: asignaturas.filter((a) => a.estado === "Activa").length, color: "bg-emerald-600" },
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
              placeholder="Buscar asignatura o código..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50"
            />
          </div>
          <select
            value={filtroPrograma}
            onChange={(e) => setFiltroPrograma(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 text-gray-600"
          >
            <option value="">Todos los programas</option>
            {programas.map((p) => <option key={p}>{p}</option>)}
          </select>
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 text-gray-600"
          >
            <option value="">Todos los tipos</option>
            {tipos.map((t) => <option key={t}>{t}</option>)}
          </select>
          <span className="text-sm text-gray-400">{filtradas.length} resultado(s)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Asignatura", "Código", "Programa", "Semestre", "Créditos", "Tipo", "Estado", "Acciones"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtradas.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-gray-400 text-sm">No se encontraron asignaturas</td>
                </tr>
              ) : (
                filtradas.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <span className="text-sm font-semibold text-gray-800">{a.nombre}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-mono rounded-lg">{a.codigo}</span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">{a.programa}</td>
                    <td className="px-5 py-4 text-sm text-gray-600 text-center">{a.semestre}</td>
                    <td className="px-5 py-4 text-sm text-gray-600 text-center">{a.creditos}</td>
                    <td className="px-5 py-4"><span className={tipoBadge(a.tipo)}>{a.tipo}</span></td>
                    <td className="px-5 py-4"><span className={estadoBadge(a.estado)}>{a.estado}</span></td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => abrirEditar(a)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button onClick={() => setConfirmDelete(a.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
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
              <h2 className="text-lg font-black text-gray-800">{editando ? "Editar Asignatura" : "Nueva Asignatura"}</h2>
              <button onClick={cerrarModal} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nombre de la Asignatura</label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  placeholder="Ej: Cálculo I"
                  className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 ${errors.nombre ? "border-red-400" : "border-gray-200"}`}
                />
                {errors.nombre && <p className="text-xs text-red-500 mt-1">{errors.nombre}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Código</label>
                  <input
                    type="text"
                    value={form.codigo}
                    onChange={(e) => setForm({ ...form, codigo: e.target.value.toUpperCase() })}
                    placeholder="Ej: IS101"
                    className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 ${errors.codigo ? "border-red-400" : "border-gray-200"}`}
                  />
                  {errors.codigo && <p className="text-xs text-red-500 mt-1">{errors.codigo}</p>}
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

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Semestre</label>
                  <input
                    type="number"
                    value={form.semestre}
                    onChange={(e) => setForm({ ...form, semestre: Number(e.target.value) })}
                    min={1} max={10}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Créditos</label>
                  <input
                    type="number"
                    value={form.creditos}
                    onChange={(e) => setForm({ ...form, creditos: Number(e.target.value) })}
                    min={1} max={8}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tipo</label>
                  <select
                    value={form.tipo}
                    onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50"
                  >
                    {tipos.map((t) => <option key={t}>{t}</option>)}
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
                  <option>Activa</option>
                  <option>Inactiva</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={cerrarModal} className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors">
                Cancelar
              </button>
              <button onClick={guardar} className="flex-1 py-2.5 bg-red-700 hover:bg-red-800 text-white text-sm font-semibold rounded-xl transition-colors">
                {editando ? "Guardar Cambios" : "Crear Asignatura"}
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
            <h3 className="text-lg font-black text-gray-800 text-center">¿Eliminar asignatura?</h3>
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