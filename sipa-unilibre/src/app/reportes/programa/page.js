"use client";

import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";

const programasData = [
  {
    id: 1, nombre: "Ingeniería de Sistemas", codigo: "IS", semestre: "2026-1",
    stats: { grupos: 12, asignaturas: 68, docentes: 8, horasTotales: 136, asignadas: 124, capacidadPromedio: 35 },
    semestres: [
      { numero: 1, asignaturas: ["Cálculo I", "Álgebra Lineal", "Programación I", "Inglés I"], grupos: 2 },
      { numero: 2, asignaturas: ["Cálculo II", "Física I", "Programación II", "Inglés II"], grupos: 2 },
      { numero: 3, asignaturas: ["Cálculo III", "Física II", "Bases de Datos", "Estructuras"], grupos: 2 },
      { numero: 4, asignaturas: ["Ecuaciones Diferenciales", "Redes", "SO", "Ingeniería Software"], grupos: 2 },
      { numero: 5, asignaturas: ["Estadística", "Arquitectura", "Compiladores", "IA"], grupos: 1 },
    ],
    docentes: [
      { nombre: "Carlos Gómez", materias: 3, horas: 12 },
      { nombre: "Juan Pérez", materias: 1, horas: 4 },
      { nombre: "Luis Herrera", materias: 0, horas: 0 },
    ],
  },
  {
    id: 2, nombre: "Ingeniería Industrial", codigo: "II", semestre: "2026-1",
    stats: { grupos: 10, asignaturas: 56, docentes: 5, horasTotales: 112, asignadas: 100, capacidadPromedio: 38 },
    semestres: [
      { numero: 1, asignaturas: ["Cálculo I", "Física I", "Química I", "Inglés I"], grupos: 2 },
      { numero: 2, asignaturas: ["Cálculo II", "Física II", "Química II", "Inglés II"], grupos: 2 },
      { numero: 3, asignaturas: ["Estadística I", "Resistencia Materiales", "Termodinámica"], grupos: 2 },
      { numero: 4, asignaturas: ["Inv. Operaciones", "Producción I", "Estadística II"], grupos: 2 },
      { numero: 5, asignaturas: ["Simulación", "Gestión Calidad", "Logística"], grupos: 1 },
    ],
    docentes: [
      { nombre: "María Torres", materias: 2, horas: 8 },
      { nombre: "Ana Martínez", materias: 4, horas: 16 },
    ],
  },
];

export default function ReporteProgramaPage() {
  const [programaSeleccionado, setProgramaSeleccionado] = useState(programasData[0]);
  const programa = programasData.find((p) => p.id === programaSeleccionado.id);
  const pctAsignado = Math.round((programa.stats.asignadas / programa.stats.asignaturas) * 100);

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-800">Reporte por Programa</h1>
        <p className="text-gray-400 text-sm mt-1">Programación general por programa académico — Semestre 2026-1</p>
      </div>

      {/* Selector de programa */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {programasData.map((p) => (
          <button key={p.id} onClick={() => setProgramaSeleccionado(p)}
            className={`p-5 rounded-2xl border-2 text-left transition-all ${programaSeleccionado.id === p.id ? "border-red-700 bg-red-50" : "border-gray-200 bg-white hover:border-red-200"}`}>
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-black ${programaSeleccionado.id === p.id ? "bg-red-700" : "bg-gray-400"}`}>{p.codigo}</div>
              <p className={`font-black ${programaSeleccionado.id === p.id ? "text-red-700" : "text-gray-800"}`}>{p.nombre}</p>
            </div>
            <p className="text-xs text-gray-400">{p.stats.asignaturas} asignaturas · {p.stats.grupos} grupos · {p.stats.docentes} docentes</p>
          </button>
        ))}
      </div>

      {/* Estadísticas del programa */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Grupos", value: programa.stats.grupos, color: "bg-red-700" },
          { label: "Asignaturas", value: programa.stats.asignaturas, color: "bg-blue-600" },
          { label: "Docentes", value: programa.stats.docentes, color: "bg-emerald-600" },
          { label: "Horas/sem totales", value: `${programa.stats.horasTotales}h`, color: "bg-purple-600" },
          { label: "Asignadas", value: programa.stats.asignadas, color: "bg-amber-500" },
          { label: "Cap. Promedio", value: programa.stats.capacidadPromedio, color: "bg-indigo-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
            <div className={`${s.color} w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm flex-shrink-0`}>{s.value}</div>
            <p className="text-sm font-semibold text-gray-600">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Progreso de asignación */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-bold text-gray-800 mb-4">Progreso de Asignación</h3>
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <p className="text-sm text-gray-600">Materias asignadas</p>
              <p className="text-sm font-black text-gray-800">{programa.stats.asignadas}/{programa.stats.asignaturas} ({pctAsignado}%)</p>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3">
              <div className={`h-3 rounded-full ${pctAsignado >= 90 ? "bg-emerald-500" : pctAsignado >= 70 ? "bg-amber-400" : "bg-red-500"}`} style={{ width: `${pctAsignado}%` }} />
            </div>
          </div>

          {/* Por semestre */}
          <div className="space-y-3 mt-5">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Detalle por Semestre</p>
            {programa.semestres.map((s) => (
              <div key={s.numero} className="border border-gray-100 rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-gray-700">Semestre {s.numero}</span>
                  <span className="text-xs text-gray-400">{s.grupos} grupo(s) · {s.asignaturas.length} asignaturas</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {s.asignaturas.map((a) => (
                    <span key={a} className="px-2 py-0.5 bg-red-50 text-red-600 text-xs rounded-lg font-medium">{a}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Docentes del programa */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-bold text-gray-800 mb-4">Docentes del Programa</h3>
          <div className="space-y-3">
            {programa.docentes.map((d, i) => {
              const colores = ["bg-red-600", "bg-blue-600", "bg-emerald-600", "bg-purple-600"];
              const pct = Math.round((d.horas / 20) * 100);
              return (
                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className={`${colores[i % colores.length]} w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0`}>
                    {d.nombre.split(" ").map((n) => n[0]).join("").substring(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800">{d.nombre}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                        <div className={`${colores[i % colores.length]} h-1.5 rounded-full`} style={{ width: `${Math.min(pct, 100)}%` }} />
                      </div>
                      <span className="text-xs text-gray-500">{d.horas}h</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-black text-gray-800">{d.materias}</p>
                    <p className="text-xs text-gray-400">materia(s)</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}