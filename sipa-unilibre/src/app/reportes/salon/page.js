"use client";

import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";

const espaciosData = [
  {
    id: 1, nombre: "Salón 305", tipo: "Teórico", capacidad: 45, edificio: "Bloque B", estado: "Disponible",
    clases: [
      { asignatura: "Cálculo I", grupo: "IS-101A", docente: "Carlos Gómez", dia: "Lunes", franja: "7:00 - 9:00" },
      { asignatura: "Álgebra", grupo: "IS-201B", docente: "Carlos Gómez", dia: "Miércoles", franja: "10:00 - 12:00" },
    ],
  },
  {
    id: 2, nombre: "Sala PC-01", tipo: "Sala Cómputo", capacidad: 30, edificio: "Bloque C", estado: "Ocupado",
    clases: [
      { asignatura: "Programación Web", grupo: "IS-401A", docente: "Juan Pérez", dia: "Sábado", franja: "8:00 - 10:00" },
      { asignatura: "Bases de Datos", grupo: "IS-301B", docente: "Carlos Gómez", dia: "Martes", franja: "9:00 - 11:00" },
    ],
  },
  {
    id: 3, nombre: "Lab. Física", tipo: "Laboratorio", capacidad: 20, edificio: "Bloque B", estado: "Disponible",
    clases: [
      { asignatura: "Física I", grupo: "II-101A", docente: "María Torres", dia: "Martes", franja: "18:00 - 20:00" },
      { asignatura: "Física II", grupo: "II-201A", docente: "María Torres", dia: "Jueves", franja: "18:00 - 20:00" },
    ],
  },
  {
    id: 4, nombre: "Salón 201", tipo: "Teórico", capacidad: 35, edificio: "Bloque A", estado: "Disponible",
    clases: [
      { asignatura: "Inv. Operaciones", grupo: "II-401A", docente: "Ana Martínez", dia: "Viernes", franja: "8:00 - 10:00" },
    ],
  },
];

const diasOrden = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

const tipoIcono = (tipo) => {
  if (tipo === "Sala Cómputo") return "💻";
  if (tipo === "Laboratorio") return "🔬";
  return "🏫";
};

const tipoBadge = (tipo) => {
  if (tipo === "Sala Cómputo") return "bg-blue-100 text-blue-700";
  if (tipo === "Laboratorio") return "bg-purple-100 text-purple-700";
  return "bg-gray-100 text-gray-700";
};

export default function ReporteSalonPage() {
  const [espacioSeleccionado, setEspacioSeleccionado] = useState(espaciosData[0]);
  const [filtroTipo, setFiltroTipo] = useState("");

  const espacio = espaciosData.find((e) => e.id === espacioSeleccionado.id);
  const filtrados = espaciosData.filter((e) => !filtroTipo || e.tipo === filtroTipo);
  const ocupacion = Math.round((espacio.clases.length / 12) * 100);

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-800">Reporte por Salón</h1>
        <p className="text-gray-400 text-sm mt-1">Uso y ocupación de espacios — Semestre 2026-1</p>
      </div>

      <div className="flex gap-6">
        {/* Panel izquierdo */}
        <div className="w-64 flex-shrink-0 space-y-3">
          <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white shadow-sm text-gray-600">
            <option value="">Todos los tipos</option>
            <option>Teórico</option>
            <option>Sala Cómputo</option>
            <option>Laboratorio</option>
          </select>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {filtrados.map((e) => (
              <button key={e.id} onClick={() => setEspacioSeleccionado(e)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-l-4 ${espacioSeleccionado.id === e.id ? "bg-red-50 border-red-700" : "border-transparent hover:bg-gray-50"}`}>
                <span className="text-xl flex-shrink-0">{tipoIcono(e.tipo)}</span>
                <div className="min-w-0">
                  <p className={`text-sm font-semibold truncate ${espacioSeleccionado.id === e.id ? "text-red-700" : "text-gray-800"}`}>{e.nombre}</p>
                  <p className="text-xs text-gray-400">{e.clases.length} clase(s) asignadas</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Panel derecho */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Header espacio */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{tipoIcono(espacio.tipo)}</span>
                <div>
                  <h2 className="text-xl font-black text-gray-800">{espacio.nombre}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${tipoBadge(espacio.tipo)}`}>{espacio.tipo}</span>
                    <span className="text-xs text-gray-400">{espacio.edificio}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center mb-4">
              {[
                { label: "Capacidad", value: espacio.capacidad },
                { label: "Clases asignadas", value: espacio.clases.length },
                { label: "Ocupación", value: `${ocupacion}%` },
              ].map((s) => (
                <div key={s.label} className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xl font-black text-gray-800">{s.value}</p>
                  <p className="text-xs text-gray-400">{s.label}</p>
                </div>
              ))}
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <p className="text-xs font-semibold text-gray-500">Nivel de uso semanal</p>
                <p className="text-xs font-bold text-gray-700">{ocupacion}%</p>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className={`h-2 rounded-full ${ocupacion >= 80 ? "bg-red-500" : ocupacion >= 50 ? "bg-amber-400" : "bg-emerald-500"}`} style={{ width: `${ocupacion}%` }} />
              </div>
            </div>
          </div>

          {/* Clases por día */}
          <div className="space-y-3">
            {diasOrden.filter((d) => espacio.clases.some((c) => c.dia === d)).map((dia) => (
              <div key={dia} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
                  <h3 className="font-bold text-gray-700">{dia}</h3>
                </div>
                <div className="divide-y divide-gray-50">
                  {espacio.clases.filter((c) => c.dia === dia).map((c, i) => (
                    <div key={i} className="px-5 py-4 flex items-center gap-4">
                      <div className="w-24 flex-shrink-0">
                        <p className="text-xs font-bold text-gray-700">{c.franja}</p>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-800">{c.asignatura}</p>
                        <div className="flex gap-3 text-xs text-gray-400 mt-0.5">
                          <span>Grupo: <span className="font-semibold text-red-600">{c.grupo}</span></span>
                          <span>Docente: <span className="font-semibold text-gray-600">{c.docente}</span></span>
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