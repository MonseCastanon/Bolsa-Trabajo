/**
 * src/pages/Empresas.js — Directorio de empresas.
 * Diseño profesional, sin emojis.
 */

import { empresas }     from "../services/api.js";
import { renderFooter } from "../components/Footer.js";

export async function renderEmpresas() {
  let lista = [];
  try {
    const res = await empresas.listar();
    lista = res.empresas || [];
  } catch (e) {
    return `
      <main class="page-container" style="text-align:center;padding-top:4rem;">
        <p style="color:#dc2626;">Error al cargar empresas: ${e.message}</p>
      </main>`;
  }

  const placeholderIcon = `
    <div style="width:52px;height:52px;background:var(--bg-subtle);border-radius:10px;display:flex;align-items:center;justify-content:center;color:var(--muted);flex-shrink:0;">
      <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
      </svg>
    </div>`;

  const empresasHtml = lista.length
    ? lista.map((e) => `
        <div class="card card-body" style="display:flex;align-items:flex-start;gap:1rem;border-radius:12px;transition:box-shadow .15s,border-color .15s;border:1px solid var(--border);"
             onmouseover="this.style.borderColor='#bfdbfe';this.style.boxShadow='0 4px 16px rgba(0,0,0,.08)';"
             onmouseout="this.style.borderColor='var(--border)';this.style.boxShadow='';">
          ${e.logo_url
            ? `<img src="${e.logo_url}" alt="${e.nombre}" style="width:52px;height:52px;border-radius:10px;object-fit:cover;background:var(--bg-subtle);flex-shrink:0;" />`
            : `<div style="width:52px;height:52px;background:#1e293b;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.25rem;font-weight:700;color:#fff;flex-shrink:0;">${(e.nombre || "E")[0].toUpperCase()}</div>`}
          <div style="flex:1;min-width:0;">
            <h3 style="font-size:.9375rem;margin-bottom:.25rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${e.nombre}</h3>
            <p style="font-size:.8rem;color:var(--muted);margin-bottom:.75rem;">${e.sector || "Sector no especificado"}</p>
            <a href="#/empresas/${e.id}" class="btn btn-sm btn-ghost" style="padding:.3rem .75rem;">
              Ver perfil
              <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </a>
          </div>
        </div>
      `).join("")
    : `<div class="empty-state" style="grid-column:1/-1;">
        <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
        </svg>
        <h3>Sin empresas registradas</h3>
        <p>No hay empresas activas en el directorio todavía.</p>
      </div>`;

  return `
    <main class="page-container">
      <div class="page-header">
        <h1>Directorio de empresas</h1>
        <p>${lista.length} empresa(s) registrada(s) en la plataforma</p>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1rem;">
        ${empresasHtml}
      </div>
    </main>
    ${renderFooter()}
  `;
}
