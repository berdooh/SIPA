"use client";

import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";

const asignacionesIniciales = [
  { id: 1, asignatura: "Cálculo I", grupo: "IS-101A", docente: "Carlos Gómez", espacio: "Salón 305", dia: "Lunes", franja: "7:00 - 9:00", jornada: "Diurna", programa: "Ing. Sistemas", semestre: "2026-1", estado: "Confirmada" },
  { id: 2, asignatura: "Programación I", grupo: "IS-201A", docente: "Juan Pérez", espacio: "Sala PC-01", dia: "Martes", franja: "8:00 - 10:00", jornada: "Diurna", programa: "Ing. Sistemas", semestre: "2026-1", estado: "Confirmada" },
  { id: 3, asignatura: "Física I", grupo: "II-101A", docente: "María Torres", espacio: "Lab. Física", dia: "Miércoles", franja: "18:00 - 20:00", jornada: "Nocturna", programa: "Ing. Industrial", semestre: "2026-1", estado: "Pendiente" },
  { id: 4, asignatura: "Bases de Datos", grupo: "IS-301A", docente: "Carlos Gómez", espacio: "Sala PC-02", dia: "Jueves", franja: "9:00 - 11:00", jornada: "Diurna", programa: "Ing. Sistemas", semestre: "2026-1", estado: "Confirmada" },
  { id: 5, asignatura: "Inv. Operaciones", grupo: "II-401A", docente: "Ana Martínez", espacio: "Salón 201", dia: "Viernes", franja: "8:00 - 10:00", jornada: "Diurna", programa: "Ing. Industrial", semestre: "2026-1", estado: "Pendiente" },
  { id: 6, asignatura: "Estadística I", grupo: "II-201B", docente: "Ana Martínez", espacio: "Salón 301", dia: "Lunes", franja: "19:00 - 21:00", jornada: "Nocturna", programa: "Ing. Industrial", semestre: "2026-1", estado: "Confirmada" },
];

const estadoBadge = (estado) => {
  const base = "px-2.5 py-1 rounded-full text-xs font-bold";
  if (estado === "Confirmada") return `${base} bg-emerald-100 text-emerald-700`;
  if (estado === "Pendiente") return `${base} bg-amber-100 text-amber-700`;
  return `${base} bg-red-100 text-red-700`;
};

const jornadaBadge = (jornada) => {
  const base = "px-2.5 py-1 rounded-full text-xs font-bold";
  return jornada === "Diurna" ? `${base} bg-amber-100 text-amber-700` : `${base} bg-indigo-100 text-indigo-700`;
};

const programaColor = (programa) =>
  programa === "Ing. Sistemas" ? "bg-red-50 text-red-700" : "bg-blue-50 text-blue-700";

export default function AsignacionesPage() {
  const [asignaciones, setAsignaciones] = useState(asignacionesIniciales);
  const [busqueda, setBusqueda] = useState("");
  const [filtroPrograma, setFiltroPrograma] = useState("");
  const [filtroJornada, setFiltroJornada] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [modalDetalle, setModalDetalle] = useState(null);

  const cambiarEstado = (id, nuevoEstado) => {
    setAsignaciones((prev) => prev.map((a) => a.id === id ? { ...a, estado: nuevoEstado } : a));
  };

  const eliminar = (id) => { setAsignaciones((prev) => prev.filter((a) => a.id !== id)); setConfirmDelete(null); };

  const filtradas = asignaciones.filter((a) => {
    const matchBusqueda = a.asignatura.toLowerCase().includes(busqueda.toLowerCase()) ||
      a.docente.toLowerCase().includes(busqueda.toLowerCase()) ||
      a.grupo.toLowerCase().includes(busqueda.toLowerCase());
    const matchPrograma = filtroPrograma ? a.programa === filtroPrograma : true;
    const matchJornada = filtroJornada ? a.jornada === filtroJornada : true;
    const matchEstado = filtroEstado ? a.estado === filtroEstado : true;
    return matchBusqueda && matchPrograma && matchJornada && matchEstado;
  });

  // Agrupar por día
  const porDia = dias => dias.reduce((acc, a) => {
    if (!acc[a.dia]) acc[a.dia] = [];
    acc[a.dia].push(a);
    return acc;
  }, {});

  const agrupadas = porDia(filtradas);
  const diasOrden = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Asignaciones</h1>
          <p className="text-gray-400 text-sm mt-1">Resumen de todas las asignaciones del semestre 2026-1</p>
        </div>
      </div>

      {/* Tarjetas resumen */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Asignaciones", value: asignaciones.length, color: "bg-red-700" },
          { label: "Confirmadas", value: asignaciones.filter((a) => a.estado === "Confirmada").length, color: "bg-emerald-600" },
          { label: "Pendientes", value: asignaciones.filter((a) => a.estado === "Pendiente").length, color: "bg-amber-500" },
          { label: "Canceladas", value: asignaciones.filter((a) => a.estado === "Cancelada").length, color: "bg-gray-400" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
            <div className={`${s.color} w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-lg flex-shrink-0`}>{s.value}</div>
            <p className="text-sm font-semibold text-gray-600">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-52">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="text" placeholder="Buscar asignatura, docente o grupo..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50" />
        </div>
        <select value={filtroPrograma} onChange={(e) => setFiltroPrograma(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 text-gray-600">
          <option value="">Todos los programas</option>
          <option>Ing. Sistemas</option>
          <option>Ing. Industrial</option>
        </select>
        <select value={filtroJornada} onChange={(e) => setFiltroJornada(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 text-gray-600">
          <option value="">Todas las jornadas</option>
          <option>Diurna</option>
          <option>Nocturna</option>
        </select>
        <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 text-gray-600">
          <option value="">Todos los estados</option>
          <option>Confirmada</option>
          <option>Pendiente</option>
          <option>Cancelada</option>
        </select>
        <span className="flex items-center text-sm text-gray-400">{filtradas.length} resultado(s)</span>
      </div>

      {/* Asignaciones agrupadas por día */}
      <div className="space-y-4">
        {diasOrden.map((dia) => {
          const items = agrupadas[dia];
          if (!items || items.length === 0) return null;
          return (
            <div key={dia} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-gray-700">{dia}</h3>
                <span className="px-2.5 py-1 bg-red-50 text-red-700 text-xs font-bold rounded-full">{items.length} clase(s)</span>
              </div>
              <div className="divide-y divide-gray-50">
                {items.sort((a, b) => a.franja.localeCompare(b.franja)).map((a) => (
                  <div key={a.id} className="px-5 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                    {/* Hora */}
                    <div className="w-24 flex-shrink-0">
                      <p className="text-xs font-bold text-gray-700">{a.franja}</p>
                      <span className={jornadaBadge(a.jornada)}>{a.jornada}</span>
                    </div>

                    {/* Info principal */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-bold text-gray-800">{a.asignatura}</p>
                        <span className={`px-2 py-0.5 rounded-lg text-xs font-black ${programaColor(a.programa)}`}>{a.grupo}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                          {a.docente}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                          {a.espacio}
                        </span>
                      </div>
                    </div>

                    {/* Estado + acciones */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className={estadoBadge(a.estado)}>{a.estado}</span>
                      <div className="flex items-center gap-1">
                        {a.estado === "Pendiente" && (
                          <button onClick={() => cambiarEstado(a.id, "Confirmada")} className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Confirmar">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          </button>
                        )}
                        {a.estado === "Confirmada" && (
                          <button onClick={() => cambiarEstado(a.id, "Pendiente")} className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Marcar pendiente">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          </button>
                        )}
                        <button onClick={() => setModalDetalle(a)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Ver detalle">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </button>
                        <button onClick={() => setConfirmDelete(a.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {filtradas.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <p className="text-gray-400 text-sm font-medium">No se encontraron asignaciones</p>
          </div>
        )}
      </div>

      {/* Modal detalle */}
      {modalDetalle && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-black text-gray-800">Detalle de Asignación</h2>
              <button onClick={() => setModalDetalle(null)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="px-6 py-5 space-y-3">
              {[
                { label: "Asignatura", value: modalDetalle.asignatura },
                { label: "Grupo", value: modalDetalle.grupo },
                { label: "Programa", value: modalDetalle.programa },
                { label: "Docente", value: modalDetalle.docente },
                { label: "Espacio", value: modalDetalle.espacio },
                { label: "Día", value: modalDetalle.dia },
                { label: "Franja", value: modalDetalle.franja },
                { label: "Jornada", value: modalDetalle.jornada },
                { label: "Semestre", value: modalDetalle.semestre },
                { label: "Estado", value: modalDetalle.estado },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-sm font-semibold text-gray-500">{item.label}</span>
                  <span className="text-sm font-bold text-gray-800">{item.value}</span>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-gray-100">
              <button onClick={() => setModalDetalle(null)} className="w-full py-2.5 bg-red-700 hover:bg-red-800 text-white text-sm font-semibold rounded-xl transition-colors">Cerrar</button>
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