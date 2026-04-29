"use client";

import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";

const conflictosIniciales = [
  {
    id: 1,
    tipo: "Cruce de Docente",
    severidad: "Alta",
    estado: "Pendiente",
    descripcion: "El docente Carlos Gómez tiene dos grupos asignados al mismo tiempo.",
    detalle: {
      asignatura1: "Cálculo I", grupo1: "IS-101A", espacio1: "Salón 305",
      asignatura2: "Álgebra Lineal", grupo2: "IS-301B", espacio2: "Salón 102",
      dia: "Lunes", franja: "7:00 - 9:00", docente: "Carlos Gómez",
    },
  },
  {
    id: 2,
    tipo: "Sobrecupo",
    severidad: "Media",
    estado: "Pendiente",
    descripcion: "El grupo IS-201A tiene 45 estudiantes pero el Salón 201 tiene capacidad para 35.",
    detalle: {
      asignatura1: "Programación I", grupo1: "IS-201A", espacio1: "Salón 201",
      dia: "Martes", franja: "8:00 - 10:00", docente: "Juan Pérez",
      estudiantes: 45, capacidad: 35,
    },
  },
  {
    id: 3,
    tipo: "Disponibilidad Docente",
    severidad: "Alta",
    estado: "Pendiente",
    descripcion: "La docente María Torres está asignada fuera de su horario disponible.",
    detalle: {
      asignatura1: "Física II", grupo1: "II-201A", espacio1: "Lab. Física",
      dia: "Viernes", franja: "20:00 - 22:00", docente: "María Torres",
    },
  },
  {
    id: 4,
    tipo: "Cruce de Espacio",
    severidad: "Alta",
    estado: "Resuelto",
    descripcion: "La Sala PC-01 estaba asignada a dos grupos diferentes en el mismo horario.",
    detalle: {
      asignatura1: "Bases de Datos", grupo1: "IS-301A",
      asignatura2: "Programación Web", grupo2: "IS-401A",
      espacio1: "Sala PC-01", dia: "Jueves", franja: "9:00 - 11:00",
    },
  },
  {
    id: 5,
    tipo: "Cruce de Grupo",
    severidad: "Media",
    estado: "Ignorado",
    descripcion: "El grupo II-101A tiene dos materias asignadas al mismo tiempo.",
    detalle: {
      asignatura1: "Física I", grupo1: "II-101A", espacio1: "Lab. Física",
      asignatura2: "Química I", grupo2: "II-101A", espacio2: "Lab. Química",
      dia: "Miércoles", franja: "18:00 - 20:00",
    },
  },
];

const severidadConfig = {
  Alta: { badge: "bg-red-100 text-red-700", icono: "🔴", borde: "border-red-200" },
  Media: { badge: "bg-amber-100 text-amber-700", icono: "🟡", borde: "border-amber-200" },
  Baja: { badge: "bg-blue-100 text-blue-700", icono: "🔵", borde: "border-blue-200" },
};

const estadoConfig = {
  Pendiente: { badge: "bg-amber-100 text-amber-700", icono: "⏳" },
  Resuelto: { badge: "bg-emerald-100 text-emerald-700", icono: "✅" },
  Ignorado: { badge: "bg-gray-100 text-gray-500", icono: "⏭️" },
};

const tipoIcono = {
  "Cruce de Docente": "👨‍🏫",
  "Sobrecupo": "👥",
  "Disponibilidad Docente": "🕐",
  "Cruce de Espacio": "🏫",
  "Cruce de Grupo": "📚",
};

export default function ConflictosPage() {
  const [conflictos, setConflictos] = useState(conflictosIniciales);
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroSeveridad, setFiltroSeveridad] = useState("");
  const [modalDetalle, setModalDetalle] = useState(null);

  const cambiarEstado = (id, nuevoEstado) => {
    setConflictos((prev) => prev.map((c) => c.id === id ? { ...c, estado: nuevoEstado } : c));
  };

  const filtrados = conflictos.filter((c) => {
    const matchEstado = filtroEstado ? c.estado === filtroEstado : true;
    const matchSeveridad = filtroSeveridad ? c.severidad === filtroSeveridad : true;
    return matchEstado && matchSeveridad;
  });

  const pendientes = conflictos.filter((c) => c.estado === "Pendiente");
  const resueltos = conflictos.filter((c) => c.estado === "Resuelto");
  const altas = conflictos.filter((c) => c.severidad === "Alta" && c.estado === "Pendiente");

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Conflictos de Horario</h1>
          <p className="text-gray-400 text-sm mt-1">Detección y resolución de conflictos en la programación</p>
        </div>
        {altas.length > 0 && (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl">
            <span className="text-red-600 text-sm font-bold">⚠️ {altas.length} conflicto(s) de alta severidad sin resolver</span>
          </div>
        )}
      </div>

      {/* Tarjetas resumen */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Conflictos", value: conflictos.length, color: "bg-red-700" },
          { label: "Pendientes", value: pendientes.length, color: "bg-amber-500" },
          { label: "Resueltos", value: resueltos.length, color: "bg-emerald-600" },
          { label: "Alta Severidad", value: altas.length, color: "bg-red-500" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
            <div className={`${s.color} w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-lg flex-shrink-0`}>{s.value}</div>
            <p className="text-sm font-semibold text-gray-600">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white shadow-sm text-gray-600">
          <option value="">Todos los estados</option>
          <option>Pendiente</option>
          <option>Resuelto</option>
          <option>Ignorado</option>
        </select>
        <select value={filtroSeveridad} onChange={(e) => setFiltroSeveridad(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white shadow-sm text-gray-600">
          <option value="">Todas las severidades</option>
          <option>Alta</option>
          <option>Media</option>
          <option>Baja</option>
        </select>
        <span className="flex items-center text-sm text-gray-400">{filtrados.length} conflicto(s)</span>
      </div>

      {/* Lista de conflictos */}
      <div className="space-y-3">
        {filtrados.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-7 h-7 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <p className="text-gray-600 font-bold">¡Sin conflictos!</p>
            <p className="text-gray-400 text-sm mt-1">No hay conflictos que coincidan con los filtros seleccionados.</p>
          </div>
        ) : (
          filtrados.map((c) => {
            const sev = severidadConfig[c.severidad] || severidadConfig.Baja;
            const est = estadoConfig[c.estado];
            return (
              <div key={c.id} className={`bg-white rounded-2xl shadow-sm border-2 ${c.estado === "Pendiente" ? sev.borde : "border-gray-100"} overflow-hidden`}>
                <div className="px-5 py-4 flex items-start gap-4">
                  {/* Icono tipo */}
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                    {tipoIcono[c.tipo] || "⚠️"}
                  </div>

                  {/* Contenido */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="text-sm font-black text-gray-800">{c.tipo}</p>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${sev.badge}`}>
                        {sev.icono} {c.severidad}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${est.badge}`}>
                        {est.icono} {c.estado}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{c.descripcion}</p>

                    {/* Detalle rápido */}
                    <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                      {c.detalle.dia && (
                        <span className="flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          {c.detalle.dia} · {c.detalle.franja}
                        </span>
                      )}
                      {c.detalle.docente && (
                        <span className="flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                          {c.detalle.docente}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => setModalDetalle(c)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Ver detalle">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    </button>
                    {c.estado === "Pendiente" && (
                      <>
                        <button onClick={() => cambiarEstado(c.id, "Resuelto")} className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          Resolver
                        </button>
                        <button onClick={() => cambiarEstado(c.id, "Ignorado")} className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-semibold rounded-lg transition-colors">
                          Ignorar
                        </button>
                      </>
                    )}
                    {c.estado !== "Pendiente" && (
                      <button onClick={() => cambiarEstado(c.id, "Pendiente")} className="flex items-center gap-1 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-700 text-xs font-semibold rounded-lg transition-colors">
                        Reabrir
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal detalle */}
      {modalDetalle && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-xl">{tipoIcono[modalDetalle.tipo]}</span>
                <h2 className="text-lg font-black text-gray-800">{modalDetalle.tipo}</h2>
              </div>
              <button onClick={() => setModalDetalle(null)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <p className="text-sm text-gray-600 bg-amber-50 border border-amber-100 rounded-xl p-3">{modalDetalle.descripcion}</p>

              <div className="space-y-2">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Información del conflicto</p>
                {Object.entries(modalDetalle.detalle).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center py-1.5 border-b border-gray-50">
                    <span className="text-xs font-semibold text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').replace(/\d/, ' $&')}</span>
                    <span className="text-xs font-bold text-gray-800">{value}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${severidadConfig[modalDetalle.severidad]?.badge}`}>
                  Severidad: {modalDetalle.severidad}
                </span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${estadoConfig[modalDetalle.estado]?.badge}`}>
                  {modalDetalle.estado}
                </span>
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
              {modalDetalle.estado === "Pendiente" && (
                <button
                  onClick={() => { cambiarEstado(modalDetalle.id, "Resuelto"); setModalDetalle(null); }}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-colors"
                >
                  Marcar como Resuelto
                </button>
              )}
              <button onClick={() => setModalDetalle(null)} className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors">Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}