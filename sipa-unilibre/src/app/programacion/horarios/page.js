"use client";

import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";

const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const franjas = [
  "6:00 - 7:00", "7:00 - 8:00", "8:00 - 9:00", "9:00 - 10:00",
  "10:00 - 11:00", "11:00 - 12:00", "12:00 - 13:00", "13:00 - 14:00",
  "14:00 - 15:00", "15:00 - 16:00", "16:00 - 17:00", "17:00 - 18:00",
  "18:00 - 19:00", "19:00 - 20:00", "20:00 - 21:00", "21:00 - 22:00",
];

const asignacionesIniciales = [
  { id: 1, asignatura: "Cálculo I", grupo: "IS-101A", docente: "Carlos Gómez", espacio: "Salón 305", dia: "Lunes", franja: "7:00 - 8:00", jornada: "Diurna", programa: "Ing. Sistemas", color: "bg-red-600" },
  { id: 2, asignatura: "Programación I", grupo: "IS-201A", docente: "Juan Pérez", espacio: "Sala PC-01", dia: "Martes", franja: "8:00 - 9:00", jornada: "Diurna", programa: "Ing. Sistemas", color: "bg-blue-600" },
  { id: 3, asignatura: "Física I", grupo: "II-101A", docente: "María Torres", espacio: "Lab. Física", dia: "Miércoles", franja: "18:00 - 19:00", jornada: "Nocturna", programa: "Ing. Industrial", color: "bg-purple-600" },
  { id: 4, asignatura: "Bases de Datos", grupo: "IS-301A", docente: "Carlos Gómez", espacio: "Sala PC-02", dia: "Jueves", franja: "9:00 - 10:00", jornada: "Diurna", programa: "Ing. Sistemas", color: "bg-emerald-600" },
  { id: 5, asignatura: "Inv. Operaciones", grupo: "II-401A", docente: "Ana Martínez", espacio: "Salón 201", dia: "Viernes", franja: "8:00 - 9:00", jornada: "Diurna", programa: "Ing. Industrial", color: "bg-amber-600" },
  { id: 6, asignatura: "Estadística I", grupo: "II-201B", docente: "Ana Martínez", espacio: "Salón 301", dia: "Lunes", franja: "19:00 - 20:00", jornada: "Nocturna", programa: "Ing. Industrial", color: "bg-indigo-600" },
];

const coloresAsignatura = ["bg-red-600", "bg-blue-600", "bg-purple-600", "bg-emerald-600", "bg-amber-600", "bg-indigo-600", "bg-rose-600", "bg-teal-600"];
const docentes = ["Carlos Gómez", "María Torres", "Juan Pérez", "Ana Martínez", "Luis Herrera"];
const espacios = ["Salón 101", "Salón 201", "Salón 301", "Salón 305", "Sala PC-01", "Sala PC-02", "Lab. Física", "Lab. Electrónica"];
const grupos = ["IS-101A", "IS-101B", "IS-201A", "IS-301A", "II-101A", "II-201A", "II-401A"];
const asignaturas = ["Cálculo I", "Cálculo II", "Programación I", "Física I", "Bases de Datos", "Inv. Operaciones", "Estadística I", "Álgebra Lineal"];

export default function HorariosPage() {
  const [asignaciones, setAsignaciones] = useState(asignacionesIniciales);
  const [vista, setVista] = useState("grilla"); // grilla | lista
  const [filtroDia, setFiltroDia] = useState("");
  const [filtroJornada, setFiltroJornada] = useState("");
  const [filtroPrograma, setFiltroPrograma] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [celdaSeleccionada, setCeldaSeleccionada] = useState(null);
  const [editando, setEditando] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [form, setForm] = useState({ asignatura: asignaturas[0], grupo: grupos[0], docente: docentes[0], espacio: espacios[0], dia: dias[0], franja: franjas[2], jornada: "Diurna", programa: "Ing. Sistemas" });
  const [errors, setErrors] = useState({});

  const abrirModal = (dia = null, franja = null) => {
    setEditando(null);
    setCeldaSeleccionada({ dia, franja });
    setForm({ asignatura: asignaturas[0], grupo: grupos[0], docente: docentes[0], espacio: espacios[0], dia: dia || dias[0], franja: franja || franjas[2], jornada: "Diurna", programa: "Ing. Sistemas" });
    setErrors({});
    setModalOpen(true);
  };

  const abrirEditar = (a) => {
    setEditando(a.id);
    setForm({ asignatura: a.asignatura, grupo: a.grupo, docente: a.docente, espacio: a.espacio, dia: a.dia, franja: a.franja, jornada: a.jornada, programa: a.programa });
    setErrors({});
    setModalOpen(true);
  };

  const cerrarModal = () => { setModalOpen(false); setEditando(null); setCeldaSeleccionada(null); setErrors({}); };

  const validarConflictos = () => {
    const e = {};
    const otrasSinActual = asignaciones.filter((a) => a.id !== editando);
    const cruceDocente = otrasSinActual.find((a) => a.docente === form.docente && a.dia === form.dia && a.franja === form.franja);
    const cruceEspacio = otrasSinActual.find((a) => a.espacio === form.espacio && a.dia === form.dia && a.franja === form.franja);
    const cruceGrupo = otrasSinActual.find((a) => a.grupo === form.grupo && a.dia === form.dia && a.franja === form.franja);
    if (cruceDocente) e.conflicto = `⚠️ El docente "${form.docente}" ya tiene clase ese día y franja.`;
    else if (cruceEspacio) e.conflicto = `⚠️ El espacio "${form.espacio}" ya está ocupado ese día y franja.`;
    else if (cruceGrupo) e.conflicto = `⚠️ El grupo "${form.grupo}" ya tiene clase ese día y franja.`;
    return e;
  };

  const guardar = () => {
    const e = validarConflictos();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    const color = coloresAsignatura[asignaciones.length % coloresAsignatura.length];
    if (editando) {
      setAsignaciones((prev) => prev.map((a) => a.id === editando ? { ...a, ...form } : a));
    } else {
      setAsignaciones((prev) => [...prev, { ...form, id: Date.now(), color }]);
    }
    cerrarModal();
  };

  const eliminar = (id) => { setAsignaciones((prev) => prev.filter((a) => a.id !== id)); setConfirmDelete(null); };

  const getAsignacion = (dia, franja) => asignaciones.find((a) => a.dia === dia && a.franja === franja);

  const franjasVisibles = filtroJornada === "Diurna"
    ? franjas.filter((f) => parseInt(f) < 18)
    : filtroJornada === "Nocturna"
    ? franjas.filter((f) => parseInt(f) >= 18)
    : franjas;

  const diasVisibles = filtroDia ? [filtroDia] : dias;

  const asignacionesFiltradas = asignaciones.filter((a) => {
    const matchJornada = filtroJornada ? a.jornada === filtroJornada : true;
    const matchPrograma = filtroPrograma ? a.programa === filtroPrograma : true;
    const matchDia = filtroDia ? a.dia === filtroDia : true;
    return matchJornada && matchPrograma && matchDia;
  });

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Programación de Horarios</h1>
          <p className="text-gray-400 text-sm mt-1">Semestre 2026-1 · Asignación de clases por día y franja</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Toggle vista */}
          <div className="flex items-center bg-gray-100 rounded-xl p-1">
            <button onClick={() => setVista("grilla")} className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${vista === "grilla" ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18M10 3v18M14 3v18" /></svg>
            </button>
            <button onClick={() => setVista("lista")} className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${vista === "lista" ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
            </button>
          </div>
          <button onClick={() => abrirModal()} className="flex items-center gap-2 px-4 py-2.5 bg-red-700 hover:bg-red-800 text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-red-200">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Nueva Asignación
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select value={filtroDia} onChange={(e) => setFiltroDia(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white shadow-sm text-gray-600">
          <option value="">Todos los días</option>
          {dias.map((d) => <option key={d}>{d}</option>)}
        </select>
        <select value={filtroJornada} onChange={(e) => setFiltroJornada(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white shadow-sm text-gray-600">
          <option value="">Todas las jornadas</option>
          <option>Diurna</option>
          <option>Nocturna</option>
        </select>
        <select value={filtroPrograma} onChange={(e) => setFiltroPrograma(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white shadow-sm text-gray-600">
          <option value="">Todos los programas</option>
          <option>Ing. Sistemas</option>
          <option>Ing. Industrial</option>
        </select>
        <span className="flex items-center text-sm text-gray-400">{asignacionesFiltradas.length} asignación(es)</span>
      </div>

      {/* Vista Grilla */}
      {vista === "grilla" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full" style={{ minWidth: "900px" }}>
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase w-28">Franja</th>
                  {diasVisibles.map((dia) => (
                    <th key={dia} className="py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wide">{dia}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {franjasVisibles.map((franja) => (
                  <tr key={franja} className="hover:bg-gray-50/50">
                    <td className="px-4 py-2 text-xs font-medium text-gray-400 whitespace-nowrap">{franja}</td>
                    {diasVisibles.map((dia) => {
                      const asignacion = getAsignacion(dia, franja);
                      return (
                        <td key={dia} className="p-1">
                          {asignacion ? (
                            <div
                              className={`${asignacion.color} rounded-xl p-2 text-white cursor-pointer hover:opacity-90 transition-opacity group relative`}
                              onClick={() => abrirEditar(asignacion)}
                            >
                              <p className="text-xs font-bold truncate">{asignacion.asignatura}</p>
                              <p className="text-xs opacity-80 truncate">{asignacion.grupo}</p>
                              <p className="text-xs opacity-70 truncate">{asignacion.espacio}</p>
                              <button
                                onClick={(e) => { e.stopPropagation(); setConfirmDelete(asignacion.id); }}
                                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 w-4 h-4 bg-white/20 hover:bg-white/40 rounded flex items-center justify-center transition-all"
                              >
                                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => abrirModal(dia, franja)}
                              className="w-full h-10 rounded-xl border-2 border-dashed border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all flex items-center justify-center opacity-0 hover:opacity-100"
                            >
                              <svg className="w-3 h-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            </button>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Vista Lista */}
      {vista === "lista" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["Asignatura", "Grupo", "Docente", "Espacio", "Día", "Franja", "Jornada", "Acciones"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {asignacionesFiltradas.length === 0 ? (
                  <tr><td colSpan={8} className="px-5 py-12 text-center text-gray-400 text-sm">No hay asignaciones</td></tr>
                ) : (
                  asignacionesFiltradas.map((a) => (
                    <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-2.5 h-2.5 rounded-full ${a.color}`} />
                          <span className="text-sm font-semibold text-gray-800">{a.asignatura}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4"><span className="px-2 py-1 bg-red-50 text-red-700 text-xs font-black rounded-lg">{a.grupo}</span></td>
                      <td className="px-5 py-4 text-sm text-gray-600">{a.docente}</td>
                      <td className="px-5 py-4 text-sm text-gray-600">{a.espacio}</td>
                      <td className="px-5 py-4 text-sm text-gray-600">{a.dia}</td>
                      <td className="px-5 py-4 text-sm text-gray-600">{a.franja}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${a.jornada === "Diurna" ? "bg-amber-100 text-amber-700" : "bg-indigo-100 text-indigo-700"}`}>{a.jornada}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => abrirEditar(a)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                          </button>
                          <button onClick={() => setConfirmDelete(a.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
      )}

      {/* Modal crear/editar */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h2 className="text-lg font-black text-gray-800">{editando ? "Editar Asignación" : "Nueva Asignación"}</h2>
              <button onClick={cerrarModal} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {errors.conflicto && (
                <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                  <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  <p className="text-sm text-amber-700 font-medium">{errors.conflicto}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Asignatura</label>
                  <select value={form.asignatura} onChange={(e) => setForm({ ...form, asignatura: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50">
                    {asignaturas.map((a) => <option key={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Grupo</label>
                  <select value={form.grupo} onChange={(e) => setForm({ ...form, grupo: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50">
                    {grupos.map((g) => <option key={g}>{g}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Docente</label>
                <select value={form.docente} onChange={(e) => setForm({ ...form, docente: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50">
                  {docentes.map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Espacio (Salón / Sala / Lab)</label>
                <select value={form.espacio} onChange={(e) => setForm({ ...form, espacio: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50">
                  {espacios.map((e) => <option key={e}>{e}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Día</label>
                  <select value={form.dia} onChange={(e) => setForm({ ...form, dia: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50">
                    {dias.map((d) => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Franja Horaria</label>
                  <select value={form.franja} onChange={(e) => setForm({ ...form, franja: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50">
                    {franjas.map((f) => <option key={f}>{f}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Jornada</label>
                  <select value={form.jornada} onChange={(e) => setForm({ ...form, jornada: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50">
                    <option>Diurna</option>
                    <option>Nocturna</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Programa</label>
                  <select value={form.programa} onChange={(e) => setForm({ ...form, programa: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50">
                    <option>Ing. Sistemas</option>
                    <option>Ing. Industrial</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={cerrarModal} className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors">Cancelar</button>
              <button onClick={guardar} className="flex-1 py-2.5 bg-red-700 hover:bg-red-800 text-white text-sm font-semibold rounded-xl transition-colors">{editando ? "Guardar Cambios" : "Crear Asignación"}</button>
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
            <h3 className="text-lg font-black text-gray-800 text-center">¿Eliminar asignación?</h3>
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