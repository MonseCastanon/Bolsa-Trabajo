/**
 * src/pages/Vacantes.js — Listado público de vacantes con filtro por tipo.
 *
 * Monserrat deja la estructura base.
 * Gilberto completa los filtros y la lógica de postulación en semana 2.
 */

import { vacantes } from "../services/api.js";
import { renderVacanteCard } from "../components/VacanteCard.js";
import { renderFooter } from "../components/Footer.js";

export async function renderVacantes() {
  let listaVacantes = [];
  let error = null;

  try {
    const res = await vacantes.listar();
    listaVacantes = res.vacantes;
  } catch (err) {
    error = err.message;
  }

  const cards = listaVacantes.length
    ? listaVacantes.map((v) => renderVacanteCard(v)).join("")
    : `<p class="text-gray-400 col-span-full text-center py-10">No hay vacantes disponibles.</p>`;

  // Conectar filtro después de que el DOM se inserte
  setTimeout(() => {
    const filtro = document.getElementById("filtro-tipo");
    if (!filtro) return;

    filtro.addEventListener("change", async () => {
      const tipo = filtro.value || null;
      const grid = document.getElementById("grid-vacantes");
      grid.innerHTML = `<p class="text-gray-400 col-span-full text-center py-10">Cargando...</p>`;

      try {
        const res = await vacantes.listar(tipo);
        grid.innerHTML = res.vacantes.length
          ? res.vacantes.map((v) => renderVacanteCard(v)).join("")
          : `<p class="text-gray-400 col-span-full text-center py-10">Sin resultados para este filtro.</p>`;
      } catch {
        grid.innerHTML = `<p class="text-red-400 col-span-full text-center py-10">Error al cargar vacantes.</p>`;
      }
    });
  }, 0);

  return `
    <main class="max-w-5xl mx-auto px-6 py-10">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Vacantes disponibles</h1>
          <p class="text-sm text-gray-500 mt-1">${listaVacantes.length} oportunidad(es) activa(s)</p>
        </div>

        <!-- Filtro por tipo -->
        <div>
          <select id="filtro-tipo"
            class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Todos los tipos</option>
            <option value="empleo">Empleo</option>
            <option value="practica">Prácticas profesionales</option>
          </select>
        </div>
      </div>

      ${error ? `<div class="flash flash-error">${error}</div>` : ""}

      <div id="grid-vacantes" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        ${cards}
      </div>
    </main>
    ${renderFooter()}
  `;
}
