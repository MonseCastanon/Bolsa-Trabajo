/**
 * src/pages/VacanteDetalle.js — Detalle de una vacante específica.
 * Diseño profesional, sin emojis, con iconos SVG.
 */

import { vacantes, empresas, postulaciones } from "../services/api.js";
import { estado }       from "../main.js";
import { renderFooter } from "../components/Footer.js";
import { flash }        from "../components/FlashMessage.js";

const MODAL_ICONS = {
  presencial: `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16"/><path d="M3 21h18M9 21v-4h6v4"/></svg>`,
  remoto:     `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
  hibrido:    `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
};

export async function renderVacanteDetalle(id) {
  let vacante = null;
  let empresa = null;
  let error   = null;

  try {
    const resV = await vacantes.detalle(id);
    vacante = resV.vacante;
    const resE = await empresas.detalle(vacante.empresa_id);
    empresa = resE.empresa;
  } catch (err) {
    error = err.message;
  }

  if (error || !vacante) {
    return `
      <main class="page-container-sm" style="text-align:center;padding-top:4rem;">
        <div style="width:52px;height:52px;background:#fee2e2;border-radius:12px;display:flex;align-items:center;justify-content:center;margin:0 auto 1rem;">
          <svg width="24" height="24" fill="none" stroke="#dc2626" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <h2 style="font-size:1.25rem;margin-bottom:.5rem;">Vacante no encontrada</h2>
        <p style="color:var(--muted);font-size:.9rem;margin-bottom:1.5rem;">${error || "La vacante que buscas no existe o ya no está disponible."}</p>
        <a href="#/vacantes" class="btn btn-secondary">Volver al listado</a>
      </main>
    `;
  }

  const tipoBadge = `<span class="badge ${vacante.tipo === "empleo" ? "badge-empleo" : "badge-practica"}">${vacante.tipo === "empleo" ? "Empleo" : "Prácticas profesionales"}</span>`;
  const modalBadge = `<span class="badge ${vacante.modalidad === "presencial" ? "badge-presencial" : vacante.modalidad === "remoto" ? "badge-remoto" : "badge-hibrido"}" style="display:inline-flex;align-items:center;gap:.3rem;">${MODAL_ICONS[vacante.modalidad] || ""}${vacante.modalidad.charAt(0).toUpperCase() + vacante.modalidad.slice(1)}</span>`;

  // -- Acción principal (postularse o link login)
  const esEstudiante = estado.estaAutenticado() && estado.usuario.rol === "estudiante";
  const esEmpresa    = estado.estaAutenticado() && estado.usuario.rol === "empresa";

  const botonPostular = esEstudiante
    ? `<button id="btn-postular" class="btn btn-primary btn-lg">
        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        Postularme a esta vacante
       </button>`
    : !estado.estaAutenticado()
      ? `<a href="#/login" class="btn btn-primary btn-lg">Inicia sesión para postularte</a>`
      : "";

  const accionesEmpresa = esEmpresa ? `
    <div style="display:flex;gap:.75rem;margin-top:.5rem;flex-wrap:wrap;">
      <button id="btn-editar" class="btn btn-secondary">
        <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        Editar vacante
      </button>
      <button id="btn-eliminar" class="btn btn-danger">
        <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
        Cerrar vacante
      </button>
    </div>` : "";

  // Adjuntar eventos después del render
  setTimeout(() => {
    const btnPostular = document.getElementById("btn-postular");
    if (btnPostular) {
      btnPostular.addEventListener("click", async () => {
        btnPostular.disabled = true;
        btnPostular.textContent = "Enviando...";
        try {
          await postulaciones.postularse(id, { mensaje: "Interesado en la vacante." });
          flash("Postulación enviada correctamente.", "success");
          btnPostular.textContent = "Postulación enviada";
        } catch (e) {
          flash(e.message, "error");
          btnPostular.disabled = false;
          btnPostular.innerHTML = `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Postularme a esta vacante`;
        }
      });
    }

    const btnEditar = document.getElementById("btn-editar");
    if (btnEditar) {
      btnEditar.addEventListener("click", () => {
        window.location.hash = `#/vacantes/${id}/editar`;
      });
    }

    const btnEliminar = document.getElementById("btn-eliminar");
    if (btnEliminar) {
      btnEliminar.addEventListener("click", async () => {
        if (!confirm("¿Confirmas que deseas cerrar esta vacante?")) return;
        try {
          await vacantes.eliminar(id);
          flash("Vacante cerrada correctamente.", "success");
          setTimeout(() => { window.location.hash = "#/vacantes"; }, 1200);
        } catch (e) {
          flash(e.message, "error");
        }
      });
    }
  }, 0);

  return `
    <main class="page-container-md">
      <a href="#/vacantes" class="back-link">
        <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>
        Volver a vacantes
      </a>

      <article>
        <!-- Header de la vacante -->
        <div class="card card-body" style="margin-bottom:1.25rem;">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;flex-wrap:wrap;margin-bottom:1rem;">
            <div style="flex:1;min-width:200px;">
              ${empresa ? `
                <div style="display:flex;align-items:center;gap:.6rem;margin-bottom:.6rem;">
                  <div class="avatar avatar-company" style="width:36px;height:36px;font-size:.85rem;">${(empresa.nombre || "E")[0].toUpperCase()}</div>
                  <div>
                    <p style="font-size:.875rem;font-weight:600;color:#1d4ed8;line-height:1.2;">${empresa.nombre}</p>
                    ${empresa.sector ? `<p style="font-size:.75rem;color:var(--muted);">${empresa.sector}</p>` : ""}
                  </div>
                </div>
              ` : ""}
              <h1 style="font-size:1.5rem;line-height:1.3;margin-bottom:.75rem;">${vacante.titulo}</h1>
              <div style="display:flex;flex-wrap:wrap;gap:.5rem;align-items:center;">
                ${tipoBadge}
                ${modalBadge}
                <span style="font-size:.78rem;color:var(--muted);display:inline-flex;align-items:center;gap:.3rem;">
                  <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  ${new Date(vacante.publicada_en).toLocaleDateString("es-MX", { year:"numeric", month:"long", day:"numeric" })}
                </span>
                ${vacante.cierra_en ? `
                  <span style="font-size:.78rem;color:#854d0e;background:#fef9c3;padding:.15rem .5rem;border-radius:99px;border:1px solid #fde047;">
                    Cierra: ${new Date(vacante.cierra_en).toLocaleDateString("es-MX", { month:"short", day:"numeric" })}
                  </span>` : ""}
              </div>
            </div>

            <div class="hide-mobile" style="flex-shrink:0;">
              <span class="status status-activa">${vacante.estado.charAt(0).toUpperCase() + vacante.estado.slice(1)}</span>
            </div>
          </div>
        </div>

        <!-- Contenido -->
        <div style="display:grid;grid-template-columns:1fr auto;gap:1.25rem;align-items:start;">
          <div>
            <div class="card card-body" style="margin-bottom:1rem;">
              <h2 style="font-size:1rem;margin-bottom:.75rem;">Descripción del puesto</h2>
              <p style="white-space:pre-line;font-size:.9rem;line-height:1.8;color:var(--slate);">${vacante.descripcion}</p>
            </div>

            ${vacante.requisitos ? `
              <div class="card card-body" style="margin-bottom:1rem;">
                <h2 style="font-size:1rem;margin-bottom:.75rem;">Requisitos</h2>
                <p style="white-space:pre-line;font-size:.9rem;line-height:1.8;color:var(--slate);">${vacante.requisitos}</p>
              </div>
            ` : ""}
          </div>

          <!-- Sidebar -->
          <div style="min-width:220px;max-width:260px;">
            <div class="card card-body" style="padding:1.25rem;position:sticky;top:80px;">
              <h3 style="font-size:.875rem;font-weight:600;margin-bottom:1rem;color:var(--navy-mid);">Aplicar a esta vacante</h3>
              ${botonPostular}
              ${accionesEmpresa}
              ${empresa && empresa.sitio_web ? `
                <hr class="divider" style="margin:1rem 0;">
                <a href="${empresa.sitio_web}" target="_blank" rel="noopener noreferrer"
                   style="display:inline-flex;align-items:center;gap:.4rem;font-size:.825rem;font-weight:500;color:var(--primary);">
                  <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  Sitio web de la empresa
                </a>
              ` : ""}
            </div>
          </div>
        </div>
      </article>
    </main>
    ${renderFooter()}
  `;
}
