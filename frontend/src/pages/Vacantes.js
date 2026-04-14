/**
 * src/pages/Vacantes.js — Listado público de vacantes con filtro por tipo.
 * Diseño profesional, sin emojis, accesible.
 */

import { vacantes }          from "../services/api.js";
import { renderVacanteCard } from "../components/VacanteCard.js";
import { renderFooter }      from "../components/Footer.js";
import { estado }            from "../main.js";

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
    : `<div class="empty-state" style="grid-column:1/-1;">
        <svg width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true" style="margin:0 auto 1rem;opacity:.3;">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <h3>Sin resultados</h3>
        <p>No hay vacantes activas para este filtro.</p>
      </div>`;

  // Conectar filtro después de que el DOM se inserte
  setTimeout(() => {
    const filtro = document.getElementById("filtro-tipo");
    if (!filtro) return;

    filtro.addEventListener("change", async () => {
      const tipo = filtro.value || null;
      const grid = document.getElementById("grid-vacantes");
      const counter = document.getElementById("vacantes-count");

      grid.innerHTML = `
        <div style="grid-column:1/-1;display:flex;align-items:center;justify-content:center;padding:3rem;gap:.75rem;color:var(--muted);">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation:spin 1s linear infinite;" aria-hidden="true"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/></svg>
          <style>@keyframes spin{to{transform:rotate(360deg)}}</style>
          Cargando vacantes...
        </div>`;

      try {
        const res = await vacantes.listar(tipo);
        const lista = res.vacantes;
        if (counter) counter.textContent = lista.length;
        grid.innerHTML = lista.length
          ? lista.map((v) => renderVacanteCard(v)).join("")
          : `<div class="empty-state" style="grid-column:1/-1;"><h3>Sin resultados</h3><p>No hay vacantes activas para el filtro seleccionado.</p></div>`;
      } catch {
        grid.innerHTML = `<p style="color:#dc2626;grid-column:1/-1;text-align:center;padding:2rem;">Error al cargar vacantes. Intenta de nuevo.</p>`;
      }
    });
  }, 0);

  return `
    <main class="page-container">
      <!-- Header -->
      ${estado.estaAutenticado() ? `
        <a href="#/dashboard" class="back-link">
          <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>
          Volver al panel
        </a>` : ""}

      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;margin-bottom:1.5rem;">
        <div class="page-header" style="margin-bottom:0;">
          <h1>Vacantes disponibles</h1>
          <p><span id="vacantes-count">${listaVacantes.length}</span> oportunidad(es) activa(s)</p>
        </div>

        <!-- Filtro -->
        <div style="display:flex;align-items:center;gap:.5rem;">
          <label for="filtro-tipo" style="font-size:.825rem;font-weight:500;color:var(--muted);white-space:nowrap;">Filtrar por tipo:</label>
          <select id="filtro-tipo" class="form-select" style="width:auto;min-width:160px;" aria-label="Filtrar vacantes por tipo">
            <option value="">Todos los tipos</option>
            <option value="empleo">Empleo</option>
            <option value="practica">Prácticas profesionales</option>
          </select>
        </div>
      </div>

      ${error ? `<div class="flash flash-error" role="alert">${error}</div>` : ""}

      <div id="grid-vacantes"
           style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1rem;"
           aria-label="Lista de vacantes">
        ${cards}
      </div>
    </main>
    ${renderFooter()}
  `;
}
