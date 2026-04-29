"use client";

import MainLayout from "@/components/layout/MainLayout";

const stats = [
  {
    label: "Total Docentes",
    value: "48",
    change: "+3 este semestre",
    positive: true,
    color: "bg-red-700",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    label: "Total Salones",
    value: "32",
    change: "8 disponibles ahora",
    positive: true,
    color: "bg-blue-600",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    label: "Materias Asignadas",
    value: "124",
    change: "de 130 en total",
    positive: true,
    color: "bg-emerald-600",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    label: "Conflictos",
    value: "3",
    change: "Requieren atención",
    positive: false,
    color: "bg-amber-500",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
  {
    label: "Salones Disponibles",
    value: "8",
    change: "en este momento",
    positive: true,
    color: "bg-purple-600",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: "Carga Académica",
    value: "87%",
    change: "capacidad utilizada",
    positive: true,
    color: "bg-rose-500",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
];

const conflictos = [
  { id: 1, tipo: "Cruce de horario", descripcion: "Docente Juan Pérez asignado dos grupos — Martes 8:00 AM", severidad: "alta" },
  { id: 2, tipo: "Sobrecupo", descripcion: "Salón 201 excede capacidad — Grupo IS-301 (45 estudiantes)", severidad: "media" },
  { id: 3, tipo: "Disponibilidad", descripcion: "Docente María Torres fuera de disponibilidad — Viernes 6:00 PM", severidad: "alta" },
];

const programas = [
  { nombre: "Ingeniería de Sistemas", asignadas: 68, total: 70, color: "bg-red-700" },
  { nombre: "Ingeniería Industrial", asignadas: 56, total: 60, color: "bg-blue-600" },
];

const actividadReciente = [
  { accion: "Asignación creada", detalle: "Cálculo I — Salón 305 — Lunes 7:00 AM", tiempo: "Hace 5 min" },
  { accion: "Docente actualizado", detalle: "Disponibilidad de Carlos Gómez modificada", tiempo: "Hace 20 min" },
  { accion: "Conflicto resuelto", detalle: "Cruce de horario en Física II solucionado", tiempo: "Hace 1 hora" },
  { accion: "Nuevo grupo", detalle: "Grupo IS-501B creado — Programación Web", tiempo: "Hace 2 horas" },
  { accion: "Salón habilitado", detalle: "Sala de cómputo SC-02 disponible nuevamente", tiempo: "Hace 3 horas" },
];

export default function DashboardPage() {
  return (
    <MainLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-800">Panel de Control</h1>
        <p className="text-gray-400 mt-1 text-sm">Semestre 2026-1 · Facultad de Ingeniería</p>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`${stat.color} w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-2xl font-black text-gray-800">{stat.value}</p>
              <p className="text-sm font-semibold text-gray-600">{stat.label}</p>
              <p className={`text-xs mt-0.5 ${stat.positive ? "text-emerald-500" : "text-amber-500"}`}>
                {stat.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Fila inferior */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Conflictos */}
        <div className="xl:col-span-1 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800">Conflictos Activos</h2>
            <span className="px-2.5 py-1 bg-amber-100 text-amber-600 text-xs font-bold rounded-full">
              {conflictos.length}
            </span>
          </div>
          <div className="space-y-3">
            {conflictos.map((c) => (
              <div key={c.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${c.severidad === "alta" ? "bg-red-500" : "bg-amber-400"}`} />
                <div>
                  <p className="text-xs font-bold text-gray-700">{c.tipo}</p>
                  <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{c.descripcion}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 rounded-xl transition-colors">
            Ver todos los conflictos →
          </button>
        </div>

        {/* Progreso por programa */}
        <div className="xl:col-span-1 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-800 mb-4">Progreso por Programa</h2>
          <div className="space-y-5">
            {programas.map((p) => {
              const porcentaje = Math.round((p.asignadas / p.total) * 100);
              return (
                <div key={p.nombre}>
                  <div className="flex justify-between items-center mb-1.5">
                    <p className="text-sm font-semibold text-gray-700">{p.nombre}</p>
                    <span className="text-sm font-bold text-gray-800">{porcentaje}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div
                      className={`${p.color} h-2.5 rounded-full transition-all duration-500`}
                      style={{ width: `${porcentaje}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{p.asignadas} de {p.total} materias asignadas</p>
                </div>
              );
            })}
          </div>

          {/* Uso de espacios */}
          <div className="mt-6 pt-5 border-t border-gray-100">
            <h3 className="text-sm font-bold text-gray-700 mb-3">Uso de Espacios</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Salones", usado: 24, total: 32 },
                { label: "Salas PC", usado: 5, total: 8 },
                { label: "Labs", usado: 3, total: 4 },
              ].map((e) => (
                <div key={e.label} className="text-center p-2 bg-gray-50 rounded-xl">
                  <p className="text-lg font-black text-gray-800">{e.usado}<span className="text-xs text-gray-400">/{e.total}</span></p>
                  <p className="text-xs text-gray-400">{e.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actividad reciente */}
        <div className="xl:col-span-1 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-800 mb-4">Actividad Reciente</h2>
          <div className="space-y-3">
            {actividadReciente.map((a, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="w-1.5 h-1.5 bg-red-700 rounded-full mt-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-700">{a.accion}</p>
                  <p className="text-xs text-gray-400 truncate">{a.detalle}</p>
                </div>
                <span className="text-xs text-gray-300 flex-shrink-0">{a.tiempo}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </MainLayout>
  );
}
