"use client";

import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";

const docentesData = [
  {
    id: 1, nombre: "Carlos Gómez", tipo: "Tiempo Completo", programa: "Ing. Sistemas",
    clases: [
      { asignatura: "Cálculo I", grupo: "IS-101A", dia: "Lunes", franja: "7:00 - 9:00", espacio: "Salón 305", jornada: "Diurna" },
      { asignatura: "Cálculo II", grupo: "IS-201A", dia: "Miércoles", franja: "9:00 - 11:00", espacio: "Salón 201", jornada: "Diurna" },
      { asignatura: "Bases de Datos", grupo: "IS-301A", dia: "Jueves", franja: "9:00 - 11:00", espacio: "Sala PC-02", jornada: "Diurna" },
    ],
  },
  {
    id: 2, nombre: "María Torres", tipo: "Medio Tiempo", programa: "Ing. Industrial",
    clases: [
      { asignatura: "Física I", grupo: "II-101A", dia: "Martes", franja: "18:00 - 20:00", espacio: "Lab. Física", jornada: "Nocturna" },
      { asignatura: "Física II", grupo: "II-201A", dia: "Jueves", franja: "18:00 - 20:00", espacio: "Lab. Física", jornada: "Nocturna" },
    ],
  },
  {
    id: 3, nombre: "Juan Pérez", tipo: "Catedrático", programa: "Ing. Sistemas",
    clases: [
      { asignatura: "Programación Web", grupo: "IS-401A", dia: "Sábado", franja: "8:00 - 10:00", espacio: "Sala PC-01", jornada: "Diurna" },
    ],
  },
  {
    id: 4, nombre: "Ana Martínez", tipo: "Tiempo Completo", programa: "Ing. Industrial",
    clases: [
      { asignatura: "Inv. Operaciones", grupo: "II-401A", dia: "Lunes", franja: "8:00 - 10:00", espacio: "Salón 204", jornada: "Diurna" },
      { asignatura: "Estadística I", grupo: "II-201B", dia: "Miércoles", franja: "8:00 - 10:00", espacio: "Salón 301", jornada: "Diurna" },
      { asignatura: "Estadística II", grupo: "II-301A", dia: "Viernes", franja: "8:00 - 10:00", espacio: "Salón 301", jornada: "Diurna" },
      { asignatura: "Simulación", grupo: "II-501A", dia: "Jueves", franja: "8:00 - 10:00", espacio: "Sala PC-02", jornada: "Diurna" },
    ],
  },
];

const diasOrden = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const avatarColor = (id) => ["bg-red-600", "bg-blue-600", "bg-emerald-600", "bg-purple-600"][id % 4];
const iniciales = (nombre) => nombre.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();

export default function ReporteDocentePage() {
  const [docenteSeleccionado, setDocenteSeleccionado] = useState(docentesData[0]);
  const [busqueda, setBusqueda] = useState("");

  const docente = docentesData.find((d) => d.id === docenteSeleccionado.id);
  const diasConClases = [...new Set(docente.clases.map((c) => c.dia))];
  const horasTotal = docente.clases.length * 2;

  const filtrados = docentesData.filter((d) => d.nombre.toLowerCase().includes(busqueda.toLowerCase()));

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-800">Reporte por Docente</h1>
        <p className="text-gray-400 text-sm mt-1">Horario completo por docente — Semestre 2026-1</p>
      </div>

      <div className="flex gap-6">
        {/* Panel izquierdo */}
        <div className="w-64 flex-shrink-0 space-y-3">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" placeholder="Buscar docente..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white shadow-sm" />
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {filtrados.map((d) => (
              <button key={d.id} onClick={() => setDocenteSeleccionado(d)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-l-4 ${docenteSeleccionado.id === d.id ? "bg-red-50 border-red-700" : "border-transparent hover:bg-gray-50"}`}>
                <div className={`${avatarColor(d.id)} w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0`}>{iniciales(d.nombre)}</div>
                <div className="min-w-0">
                  <p className={`text-sm font-semibold truncate ${docenteSeleccionado.id === d.id ? "text-red-700" : "text-gray-800"}`}>{d.nombre}</p>
                  <p className="text-xs text-gray-400">{d.clases.length} clase(s)</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Panel derecho */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Header docente */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`${avatarColor(docente.id)} w-14 h-14 rounded-full flex items-center justify-center text-white font-black text-lg`}>{iniciales(docente.nombre)}</div>
              <div>
                <h2 className="text-xl font-black text-gray-800">{docente.nombre}</h2>
                <p className="text-sm text-gray-400">{docente.tipo} · {docente.programa}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                { label: "Materias", value: docente.clases.length },
                { label: "Horas/sem", value: `${horasTotal}h` },
                { label: "Días activos", value: diasConClases.length },
              ].map((s) => (
                <div key={s.label} className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xl font-black text-gray-800">{s.value}</p>
                  <p className="text-xs text-gray-400">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Horario agrupado por día */}
          <div className="space-y-3">
            {diasOrden.filter((d) => docente.clases.some((c) => c.dia === d)).map((dia) => (
              <div key={dia} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-bold text-gray-700">{dia}</h3>
                  <span className="text-xs text-gray-400">{docente.clases.filter((c) => c.dia === dia).length} clase(s)</span>
                </div>
                <div className="divide-y divide-gray-50">
                  {docente.clases.filter((c) => c.dia === dia).map((c, i) => (
                    <div key={i} className="px-5 py-4 flex items-center gap-4">
                      <div className="w-24 flex-shrink-0">
                        <p className="text-xs font-bold text-gray-700">{c.franja}</p>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${c.jornada === "Diurna" ? "bg-amber-100 text-amber-700" : "bg-indigo-100 text-indigo-700"}`}>{c.jornada}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-800">{c.asignatura}</p>
                        <div className="flex gap-3 text-xs text-gray-400 mt-0.5">
                          <span>Grupo: <span className="font-semibold text-red-600">{c.grupo}</span></span>
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