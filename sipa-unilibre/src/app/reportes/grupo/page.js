"use client";

import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";

const gruposData = [
  {
    id: 1, nombre: "IS-101A", asignatura: "Cálculo I", programa: "Ing. Sistemas", semestre: "2026-1", jornada: "Diurna", estudiantes: 35,
    clases: [
      { asignatura: "Cálculo I", docente: "Carlos Gómez", dia: "Lunes", franja: "7:00 - 9:00", espacio: "Salón 305" },
      { asignatura: "Física I", docente: "María Torres", dia: "Miércoles", franja: "9:00 - 11:00", espacio: "Lab. Física" },
      { asignatura: "Programación I", docente: "Juan Pérez", dia: "Viernes", franja: "8:00 - 10:00", espacio: "Sala PC-01" },
    ],
  },
  {
    id: 2, nombre: "IS-201A", asignatura: "Programación I", programa: "Ing. Sistemas", semestre: "2026-1", jornada: "Diurna", estudiantes: 30,
    clases: [
      { asignatura: "Bases de Datos", docente: "Carlos Gómez", dia: "Martes", franja: "8:00 - 10:00", espacio: "Sala PC-02" },
      { asignatura: "Algoritmos", docente: "Juan Pérez", dia: "Jueves", franja: "10:00 - 12:00", espacio: "Sala PC-01" },
    ],
  },
  {
    id: 3, nombre: "II-101A", asignatura: "Física I", programa: "Ing. Industrial", semestre: "2026-1", jornada: "Nocturna", estudiantes: 40,
    clases: [
      { asignatura: "Física I", docente: "María Torres", dia: "Martes", franja: "18:00 - 20:00", espacio: "Lab. Física" },
      { asignatura: "Química I", docente: "Ana Martínez", dia: "Jueves", franja: "18:00 - 20:00", espacio: "Lab. Química" },
    ],
  },
  {
    id: 4, nombre: "II-401A", asignatura: "Inv. Operaciones", programa: "Ing. Industrial", semestre: "2026-1", jornada: "Diurna", estudiantes: 22,
    clases: [
      { asignatura: "Inv. Operaciones", docente: "Ana Martínez", dia: "Lunes", franja: "8:00 - 10:00", espacio: "Salón 204" },
      { asignatura: "Simulación", docente: "Ana Martínez", dia: "Miércoles", franja: "8:00 - 10:00", espacio: "Sala PC-02" },
    ],
  },
];

const diasOrden = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

export default function ReporteGrupoPage() {
  const [grupoSeleccionado, setGrupoSeleccionado] = useState(gruposData[0]);
  const [filtroPrograma, setFiltroPrograma] = useState("");

  const grupo = gruposData.find((g) => g.id === grupoSeleccionado.id);
  const filtrados = gruposData.filter((g) => !filtroPrograma || g.programa === filtroPrograma);

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-800">Reporte por Grupo</h1>
        <p className="text-gray-400 text-sm mt-1">Horario completo por grupo — Semestre 2026-1</p>
      </div>

      <div className="flex gap-6">
        {/* Panel izquierdo */}
        <div className="w-64 flex-shrink-0 space-y-3">
          <select value={filtroPrograma} onChange={(e) => setFiltroPrograma(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white shadow-sm text-gray-600">
            <option value="">Todos los programas</option>
            <option>Ing. Sistemas</option>
            <option>Ing. Industrial</option>
          </select>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {filtrados.map((g) => (
              <button key={g.id} onClick={() => setGrupoSeleccionado(g)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-l-4 ${grupoSeleccionado.id === g.id ? "bg-red-50 border-red-700" : "border-transparent hover:bg-gray-50"}`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0 ${g.jornada === "Diurna" ? "bg-amber-100 text-amber-700" : "bg-indigo-100 text-indigo-700"}`}>
                  {g.jornada === "Diurna" ? "☀️" : "🌙"}
                </div>
                <div className="min-w-0">
                  <p className={`text-sm font-black truncate ${grupoSeleccionado.id === g.id ? "text-red-700" : "text-gray-800"}`}>{g.nombre}</p>
                  <p className="text-xs text-gray-400 truncate">{g.asignatura}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Panel derecho */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Header grupo */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-2xl font-black text-red-700">{grupo.nombre}</h2>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${grupo.jornada === "Diurna" ? "bg-amber-100 text-amber-700" : "bg-indigo-100 text-indigo-700"}`}>{grupo.jornada}</span>
                </div>
                <p className="text-sm text-gray-500">{grupo.asignatura} · {grupo.programa}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                { label: "Estudiantes", value: grupo.estudiantes },
                { label: "Materias", value: grupo.clases.length },
                { label: "Horas/sem", value: `${grupo.clases.length * 2}h` },
              ].map((s) => (
                <div key={s.label} className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xl font-black text-gray-800">{s.value}</p>
                  <p className="text-xs text-gray-400">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Clases por día */}
          <div className="space-y-3">
            {diasOrden.filter((d) => grupo.clases.some((c) => c.dia === d)).map((dia) => (
              <div key={dia} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
                  <h3 className="font-bold text-gray-700">{dia}</h3>
                </div>
                <div className="divide-y divide-gray-50">
                  {grupo.clases.filter((c) => c.dia === dia).map((c, i) => (
                    <div key={i} className="px-5 py-4 flex items-center gap-4">
                      <div className="w-24 flex-shrink-0">
                        <p className="text-xs font-bold text-gray-700">{c.franja}</p>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-800">{c.asignatura}</p>
                        <div className="flex gap-3 text-xs text-gray-400 mt-0.5">
                          <span>Docente: <span className="font-semibold text-gray-600">{c.docente}</span></span>
                          <span>Espacio: <span className="font-semibold text-gray-600">{c.espacio}</span></span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}