/**
 * src/pages/EmpresaDetalle.js — Detalle público de una empresa.
 * Diseño profesional, sin emojis.
 */

import { empresas }     from "../services/api.js";
import { renderFooter } from "../components/Footer.js";

export async function renderEmpresaDetalle() {
  const id = window.location.hash.split("/")[2];
  try {
    const res     = await empresas.detalle(id);
    const empresa = res.empresa;

    return `
      <main class="page-container-md">
        <a href="#/empresas" class="back-link">
          <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>
          Volver al directorio
        </a>

        <!-- Cabecera empresa -->
        <div class="card card-body" style="margin-bottom:1.25rem;display:flex;align-items:center;gap:1.25rem;flex-wrap:wrap;border-radius:14px;">
          ${empresa.logo_url
            ? `<img src="${empresa.logo_url}" alt="${empresa.nombre}" style="width:72px;height:72px;border-radius:12px;object-fit:cover;background:var(--bg-subtle);flex-shrink:0;" />`
            : `<div style="width:72px;height:72px;background:#1e293b;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.75rem;font-weight:700;color:#fff;flex-shrink:0;">${(empresa.nombre || "E")[0].toUpperCase()}</div>`}
          <div>
            <h1 style="font-size:1.5rem;margin-bottom:.25rem;">${empresa.nombre}</h1>
            ${empresa.sector ? `<span class="badge badge-presencial" style="font-size:.78rem;">${empresa.sector}</span>` : ""}
          </div>
        </div>

        <!-- Info -->
        <div class="card card-body" style="border-radius:14px;">
          ${empresa.descripcion ? `
            <div style="margin-bottom:1.5rem;">
              <p class="section-label">Acerca de la empresa</p>
              <p style="font-size:.9rem;line-height:1.8;white-space:pre-line;">${empresa.descripcion}</p>
            </div>
          ` : ""}

          <div style="display:flex;flex-wrap:wrap;gap:1.5rem;align-items:center;">
            ${empresa.sitio_web ? `
              <a href="${empresa.sitio_web}" target="_blank" rel="noopener noreferrer"
                 class="btn btn-secondary btn-sm">
                <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                Visitar sitio web
              </a>
            ` : ""}
            <a href="#/vacantes" class="btn btn-primary btn-sm">
              <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              Ver vacantes de esta empresa
            </a>
          </div>
        </div>
      </main>
      ${renderFooter()}
    `;
  } catch (e) {
    return `
      <main class="page-container" style="text-align:center;padding-top:4rem;">
        <p style="color:#dc2626;margin-bottom:1rem;">Error al cargar la empresa.</p>
        <a href="#/empresas" class="btn btn-secondary">Volver al directorio</a>
      </main>`;
  }
}
