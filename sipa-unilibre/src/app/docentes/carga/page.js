"use client";

import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";

const docentesData = [
  {
    id: 1, nombre: "Carlos Gómez", tipo: "Tiempo Completo", programa: "Ingeniería de Sistemas",
    horasMax: 20,
    asignaciones: [
      { id: 1, asignatura: "Cálculo I", grupo: "IS-101A", salon: "Salón 305", horario: "Lunes 7:00 - 9:00", horas: 4, semestre: "2026-1" },
      { id: 2, asignatura: "Cálculo II", grupo: "IS-201A", salon: "Salón 201", horario: "Miércoles 9:00 - 11:00", horas: 4, semestre: "2026-1" },
      { id: 3, asignatura: "Álgebra Lineal", grupo: "IS-301A", salon: "Salón 102", horario: "Viernes 14:00 - 16:00", horas: 4, semestre: "2026-1" },
    ],
  },
  {
    id: 2, nombre: "María Torres", tipo: "Medio Tiempo", programa: "Ingeniería Industrial",
    horasMax: 12,
    asignaciones: [
      { id: 4, asignatura: "Física I", grupo: "II-101A", salon: "Lab. Física", horario: "Martes 18:00 - 20:00", horas: 4, semestre: "2026-1" },
      { id: 5, asignatura: "Física II", grupo: "II-201A", salon: "Lab. Física", horario: "Jueves 18:00 - 20:00", horas: 4, semestre: "2026-1" },
    ],
  },
  {
    id: 3, nombre: "Juan Pérez", tipo: "Catedrático", programa: "Ingeniería de Sistemas",
    horasMax: 8,
    asignaciones: [
      { id: 6, asignatura: "Programación Web", grupo: "IS-401A", salon: "Sala PC-01", horario: "Sábado 8:00 - 10:00", horas: 4, semestre: "2026-1" },
    ],
  },
  {
    id: 4, nombre: "Ana Martínez", tipo: "Tiempo Completo", programa: "Ingeniería Industrial",
    horasMax: 20,
    asignaciones: [
      { id: 7, asignatura: "Inv. de Operaciones", grupo: "II-401A", salon: "Salón 204", horario: "Lunes 8:00 - 10:00", horas: 4, semestre: "2026-1" },
      { id: 8, asignatura: "Estadística I", grupo: "II-201B", salon: "Salón 301", horario: "Miércoles 8:00 - 10:00", horas: 4, semestre: "2026-1" },
      { id: 9, asignatura: "Estadística II", grupo: "II-301A", salon: "Salón 301", horario: "Viernes 8:00 - 10:00", horas: 4, semestre: "2026-1" },
      { id: 10, asignatura: "Simulación", grupo: "II-501A", salon: "Sala PC-02", horario: "Jueves 8:00 - 10:00", horas: 4, semestre: "2026-1" },
    ],
  },
  {
    id: 5, nombre: "Luis Herrera", tipo: "Catedrático", programa: "Ingeniería de Sistemas",
    horasMax: 8,
    asignaciones: [],
  },
];

const avatarColor = (id) => {
  const colores = ["bg-red-600", "bg-blue-600", "bg-emerald-600", "bg-purple-600", "bg-amber-600"];
  return colores[id % colores.length];
};

const iniciales = (nombre) => nombre.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();

const tipoBadge = (tipo) => {
  const base = "px-2.5 py-1 rounded-full text-xs font-bold";
  if (tipo === "Tiempo Completo") return `${base} bg-emerald-100 text-emerald-700`;
  if (tipo === "Medio Tiempo") return `${base} bg-blue-100 text-blue-700`;
  return `${base} bg-amber-100 text-amber-700`;
};

const cargaColor = (horas, max) => {
  const pct = (horas / max) * 100;
  if (pct >= 100) return "bg-red-500";
  if (pct >= 80) return "bg-amber-400";
  return "bg-emerald-500";
};

const cargaTexto = (horas, max) => {
  const pct = (horas / max) * 100;
  if (pct >= 100) return { texto: "Carga completa", color: "text-red-600 bg-red-50" };
  if (pct >= 80) return { texto: "Carga alta", color: "text-amber-600 bg-amber-50" };
  if (horas === 0) return { texto: "Sin asignaciones", color: "text-gray-500 bg-gray-50" };
  return { texto: "Carga normal", color: "text-emerald-600 bg-emerald-50" };
};

export default function CargaAcademicaPage() {
  const [docentes] = useState(docentesData);
  const [docenteSeleccionado, setDocenteSeleccionado] = useState(docentesData[0]);
  const [busqueda, setBusqueda] = useState("");

  const docente = docentes.find((d) => d.id === docenteSeleccionado.id);
  const horasAsignadas = docente.asignaciones.reduce((a, b) => a + b.horas, 0);
  const pctCarga = Math.min(Math.round((horasAsignadas / docente.horasMax) * 100), 100);
  const { texto, color } = cargaTexto(horasAsignadas, docente.horasMax);

  const docentesFiltrados = docentes.filter((d) =>
    d.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <MainLayout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-800">Carga Académica</h1>
        <p className="text-gray-400 text-sm mt-1">Resumen de asignaciones por docente — Semestre 2026-1</p>
      </div>

      {/* Tarjetas resumen global */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Docentes", value: docentes.length, color: "bg-red-700" },
          { label: "Con Carga Completa", value: docentes.filter((d) => d.asignaciones.reduce((a, b) => a + b.horas, 0) >= d.horasMax).length, color: "bg-red-500" },
          { label: "Carga Alta", value: docentes.filter((d) => { const h = d.asignaciones.reduce((a, b) => a + b.horas, 0); return h / d.horasMax >= 0.8 && h < d.horasMax; }).length, color: "bg-amber-500" },
          { label: "Sin Asignaciones", value: docentes.filter((d) => d.asignaciones.length === 0).length, color: "bg-gray-400" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
            <div className={`${s.color} w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-lg flex-shrink-0`}>
              {s.value}
            </div>
            <p className="text-sm font-semibold text-gray-600">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-6">
        {/* Panel izquierdo */}
        <div className="w-72 flex-shrink-0 space-y-3">
          {/* Buscador */}
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar docente..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white shadow-sm"
            />
          </div>

          {/* Lista */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="divide-y divide-gray-50">
              {docentesFiltrados.map((d) => {
                const horas = d.asignaciones.reduce((a, b) => a + b.horas, 0);
                const pct = Math.min(Math.round((horas / d.horasMax) * 100), 100);
                const isSelected = docenteSeleccionado.id === d.id;
                return (
                  <button
                    key={d.id}
                    onClick={() => setDocenteSeleccionado(d)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${isSelected ? "bg-red-50 border-l-4 border-red-700" : "hover:bg-gray-50 border-l-4 border-transparent"}`}
                  >
                    <div className={`${avatarColor(d.id)} w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0`}>
                      {iniciales(d.nombre)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate ${isSelected ? "text-red-700" : "text-gray-800"}`}>{d.nombre}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                          <div className={`${cargaColor(horas, d.horasMax)} h-1.5 rounded-full`} style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-gray-400">{horas}h</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Panel derecho - Detalle */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Tarjeta resumen del docente */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`${avatarColor(docente.id)} w-12 h-12 rounded-full flex items-center justify-center text-white font-black flex-shrink-0`}>
                  {iniciales(docente.nombre)}
                </div>
                <div>
                  <h2 className="font-black text-gray-800">{docente.nombre}</h2>
                  <p className="text-sm text-gray-400">{docente.programa}</p>
                  <span className={tipoBadge(docente.tipo)}>{docente.tipo}</span>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${color}`}>{texto}</span>
            </div>

            {/* Barra de carga */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-semibold text-gray-600">Horas asignadas</p>
                <p className="text-sm font-black text-gray-800">{horasAsignadas} / {docente.horasMax} horas ({pctCarga}%)</p>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div
                  className={`${cargaColor(horasAsignadas, docente.horasMax)} h-3 rounded-full transition-all duration-500`}
                  style={{ width: `${pctCarga}%` }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <p className="text-xs text-gray-400">0 horas</p>
                <p className="text-xs text-gray-400">Máx: {docente.horasMax} horas</p>
              </div>
            </div>

            {/* Stats rápidas */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              {[
                { label: "Asignaturas", value: docente.asignaciones.length },
                { label: "Horas/semana", value: `${horasAsignadas}h` },
                { label: "Disponibles", value: `${docente.horasMax - horasAsignadas}h` },
              ].map((s) => (
                <div key={s.label} className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-xl font-black text-gray-800">{s.value}</p>
                  <p className="text-xs text-gray-400">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tabla de asignaciones */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-800">Asignaciones del Semestre</h3>
              <span className="px-2.5 py-1 bg-red-50 text-red-700 text-xs font-bold rounded-full">
                {docente.asignaciones.length} materia(s)
              </span>
            </div>

            {docente.asignaciones.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-gray-400 text-sm font-medium">Sin asignaciones este semestre</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      {["Asignatura", "Grupo", "Salón", "Horario", "Horas/sem"].map((h) => (
                        <th key={h} className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {docente.asignaciones.map((a) => (
                      <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3 text-sm font-semibold text-gray-800">{a.asignatura}</td>
                        <td className="px-5 py-3">
                          <span className="px-2 py-1 bg-red-50 text-red-700 text-xs font-black rounded-lg">{a.grupo}</span>
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-500">{a.salon}</td>
                        <td className="px-5 py-3 text-sm text-gray-500">{a.horario}</td>
                        <td className="px-5 py-3">
                          <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg">{a.horas}h</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}