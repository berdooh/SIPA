"use client";

import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";

const docentes = [
  { id: 1, nombre: "Carlos Gómez", programa: "Ingeniería de Sistemas" },
  { id: 2, nombre: "María Torres", programa: "Ingeniería Industrial" },
  { id: 3, nombre: "Juan Pérez", programa: "Ingeniería de Sistemas" },
  { id: 4, nombre: "Ana Martínez", programa: "Ingeniería Industrial" },
  { id: 5, nombre: "Luis Herrera", programa: "Ingeniería de Sistemas" },
];

const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

const franjas = [
  "6:00 - 7:00",
  "7:00 - 8:00",
  "8:00 - 9:00",
  "9:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "12:00 - 13:00",
  "13:00 - 14:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00",
  "17:00 - 18:00",
  "18:00 - 19:00",
  "19:00 - 20:00",
  "20:00 - 21:00",
  "21:00 - 22:00",
];

const disponibilidadInicial = {
  1: { Lunes: ["7:00 - 8:00", "8:00 - 9:00", "9:00 - 10:00", "14:00 - 15:00", "15:00 - 16:00"], Martes: ["7:00 - 8:00", "8:00 - 9:00"], Miércoles: ["9:00 - 10:00", "10:00 - 11:00"], Jueves: [], Viernes: ["14:00 - 15:00"], Sábado: [] },
  2: { Lunes: ["18:00 - 19:00", "19:00 - 20:00", "20:00 - 21:00"], Martes: ["18:00 - 19:00", "19:00 - 20:00"], Miércoles: ["18:00 - 19:00", "19:00 - 20:00", "20:00 - 21:00"], Jueves: ["18:00 - 19:00"], Viernes: ["18:00 - 19:00", "19:00 - 20:00"], Sábado: ["8:00 - 9:00", "9:00 - 10:00"] },
  3: { Lunes: ["7:00 - 8:00", "8:00 - 9:00"], Martes: ["10:00 - 11:00", "11:00 - 12:00"], Miércoles: [], Jueves: ["7:00 - 8:00", "8:00 - 9:00", "9:00 - 10:00"], Viernes: [], Sábado: [] },
  4: { Lunes: ["8:00 - 9:00", "9:00 - 10:00", "10:00 - 11:00"], Martes: ["8:00 - 9:00", "9:00 - 10:00"], Miércoles: ["8:00 - 9:00", "9:00 - 10:00", "10:00 - 11:00"], Jueves: ["8:00 - 9:00"], Viernes: ["8:00 - 9:00", "9:00 - 10:00"], Sábado: [] },
  5: { Lunes: [], Martes: [], Miércoles: [], Jueves: [], Viernes: [], Sábado: [] },
};

const avatarColor = (id) => {
  const colores = ["bg-red-600", "bg-blue-600", "bg-emerald-600", "bg-purple-600", "bg-amber-600"];
  return colores[id % colores.length];
};

const iniciales = (nombre) => nombre.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();

export default function DisponibilidadPage() {
  const [docenteSeleccionado, setDocenteSeleccionado] = useState(docentes[0]);
  const [disponibilidad, setDisponibilidad] = useState(disponibilidadInicial);
  const [guardado, setGuardado] = useState(false);

  const toggleFranja = (dia, franja) => {
    setDisponibilidad((prev) => {
      const actual = prev[docenteSeleccionado.id][dia] || [];
      const existe = actual.includes(franja);
      return {
        ...prev,
        [docenteSeleccionado.id]: {
          ...prev[docenteSeleccionado.id],
          [dia]: existe ? actual.filter((f) => f !== franja) : [...actual, franja],
        },
      };
    });
    setGuardado(false);
  };

  const toggleDia = (dia) => {
    const actual = disponibilidad[docenteSeleccionado.id][dia] || [];
    const todosMarcados = franjas.every((f) => actual.includes(f));
    setDisponibilidad((prev) => ({
      ...prev,
      [docenteSeleccionado.id]: {
        ...prev[docenteSeleccionado.id],
        [dia]: todosMarcados ? [] : [...franjas],
      },
    }));
    setGuardado(false);
  };

  const limpiarTodo = () => {
    setDisponibilidad((prev) => ({
      ...prev,
      [docenteSeleccionado.id]: Object.fromEntries(dias.map((d) => [d, []])),
    }));
    setGuardado(false);
  };

  const guardar = () => {
    // Aquí irá la llamada a la API
    setGuardado(true);
    setTimeout(() => setGuardado(false), 3000);
  };

  const disponibilidadActual = disponibilidad[docenteSeleccionado.id] || {};
  const totalFranjas = Object.values(disponibilidadActual).flat().length;

  const estaDisponible = (dia, franja) =>
    (disponibilidadActual[dia] || []).includes(franja);

  return (
    <MainLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Disponibilidad Horaria</h1>
          <p className="text-gray-400 text-sm mt-1">Configura los horarios disponibles de cada docente</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={limpiarTodo}
            className="px-4 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors"
          >
            Limpiar todo
          </button>
          <button
            onClick={guardar}
            className={`flex items-center gap-2 px-4 py-2.5 text-white text-sm font-semibold rounded-xl transition-all shadow-lg ${guardado ? "bg-emerald-600 shadow-emerald-200" : "bg-red-700 hover:bg-red-800 shadow-red-200"}`}
          >
            {guardado ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Guardado
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Guardar
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Panel izquierdo - Lista de docentes */}
        <div className="w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-700">Seleccionar Docente</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {docentes.map((d) => {
                const franjas = Object.values(disponibilidad[d.id] || {}).flat().length;
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
                      <p className="text-xs text-gray-400">{franjas} franja(s)</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Panel derecho - Grilla de disponibilidad */}
        <div className="flex-1 min-w-0">
          {/* Info del docente seleccionado */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`${avatarColor(docenteSeleccionado.id)} w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-black`}>
                {iniciales(docenteSeleccionado.nombre)}
              </div>
              <div>
                <p className="font-bold text-gray-800">{docenteSeleccionado.nombre}</p>
                <p className="text-sm text-gray-400">{docenteSeleccionado.programa}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-red-700">{totalFranjas}</p>
              <p className="text-xs text-gray-400">franjas disponibles</p>
            </div>
          </div>

          {/* Leyenda */}
          <div className="flex items-center gap-4 mb-3 px-1">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 bg-red-700 rounded" />
              <span className="text-xs text-gray-500">Disponible</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 bg-gray-100 border border-gray-200 rounded" />
              <span className="text-xs text-gray-500">No disponible</span>
            </div>
            <p className="text-xs text-gray-400 ml-auto">Haz clic para marcar/desmarcar · Clic en el día para marcar todo</p>
          </div>

          {/* Grilla */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide w-32">Franja</th>
                    {dias.map((dia) => {
                      const todosSeleccionados = franjas.every((f) => estaDisponible(dia, f));
                      return (
                        <th key={dia} className="py-3 text-center">
                          <button
                            onClick={() => toggleDia(dia)}
                            className={`text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-lg transition-colors ${todosSeleccionados ? "bg-red-700 text-white" : "text-gray-500 hover:bg-red-50 hover:text-red-700"}`}
                          >
                            {dia}
                          </button>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {franjas.map((franja) => (
                    <tr key={franja} className="hover:bg-gray-50/50">
                      <td className="px-4 py-2 text-xs font-medium text-gray-500 whitespace-nowrap">{franja}</td>
                      {dias.map((dia) => {
                        const disponible = estaDisponible(dia, franja);
                        return (
                          <td key={dia} className="py-2 text-center">
                            <button
                              onClick={() => toggleFranja(dia, franja)}
                              className={`w-8 h-8 rounded-lg mx-auto transition-all duration-150 ${disponible
                                ? "bg-red-700 hover:bg-red-800 shadow-sm"
                                : "bg-gray-100 hover:bg-red-100 border border-gray-200 hover:border-red-300"
                                }`}
                            >
                              {disponible && (
                                <svg className="w-4 h-4 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}