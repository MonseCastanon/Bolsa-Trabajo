/**
 * src/pages/Candidatos.js — Vista de candidatos por vacante (empresa).
 * Diseño profesional, sin emojis.
 */

import { vacantes, postulaciones } from "../services/api.js";
import { renderFooter }            from "../components/Footer.js";
import { flash }                   from "../components/FlashMessage.js";
import { estado }                  from "../main.js";

const STATUS_LABELS = {
  pendiente: "Pendiente",
  revisado:  "Revisado",
  aceptado:  "Aceptado",
  rechazado: "Rechazado",
};

export async function renderCandidatos() {
  let listaVacantes = [];
  let contenido = "";

  try {
    // Obtener solo las vacantes de este empresa (endpoint privado)
    const resVacantes = await vacantes.misVacantes();
    listaVacantes = resVacantes.vacantes;

    for (const v of listaVacantes) {
      try {
        const res = await postulaciones.candidatosPorVacante(v.id);
        const candidatos = res.candidatos || [];

        if (!candidatos.length) continue;

        contenido += `
          <section style="margin-bottom:2rem;">
            <div style="display:flex;align-items:center;gap:.75rem;margin-bottom:1rem;">
              <div style="width:8px;height:8px;background:#2563eb;border-radius:50%;flex-shrink:0;"></div>
              <h2 style="font-size:1.0625rem;">${v.titulo}</h2>
              <span class="badge ${v.tipo === 'empleo' ? 'badge-empleo' : 'badge-practica'}">${v.tipo === 'empleo' ? 'Empleo' : 'Prácticas'}</span>
              <span style="font-size:.78rem;color:var(--muted);margin-left:auto;">${candidatos.length} candidato(s)</span>
            </div>
            <div class="card" style="overflow:hidden;">
              <div style="overflow-x:auto;">
                <table class="data-table" aria-label="Candidatos para ${v.titulo}">
                  <thead>
                    <tr>
                      <th>Candidato ID</th>
                      <th>Mensaje</th>
                      <th>Fecha</th>
                      <th>Estado</th>
                      <th style="text-align:center;">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${candidatos.map(c => `
                      <tr>
                        <td>
                          <span style="font-weight:600;color:var(--navy-mid);">#${c.estudiante_id}</span>
                        </td>
                        <td style="max-width:240px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${c.mensaje || ''}">
                          ${c.mensaje || '<span style="color:var(--muted);font-style:italic;">Sin mensaje</span>'}
                        </td>
                        <td style="white-space:nowrap;">
                          ${new Date(c.postulado_en).toLocaleDateString("es-MX", { year:"numeric", month:"short", day:"numeric" })}
                        </td>
                        <td>
                          <span class="status status-${c.estado}">${STATUS_LABELS[c.estado] || c.estado}</span>
                        </td>
                        <td style="text-align:center;">
                          <div style="display:flex;gap:.4rem;justify-content:center;flex-wrap:wrap;">
                            <button data-id="${c.id}" data-estado="aceptado"
                              class="btn btn-success btn-sm btn-candidate"
                              aria-label="Aceptar candidato #${c.estudiante_id}">
                              Admitir
                            </button>
                            <button data-id="${c.id}" data-estado="rechazado"
                              class="btn btn-danger btn-sm btn-candidate"
                              aria-label="Rechazar candidato #${c.estudiante_id}">
                              Rechazar
                            </button>
                          </div>
                        </td>
                      </tr>
                    `).join("")}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        `;
      } catch (e) {
        console.error("Error al cargar candidatos para vacante", v.id, e);
      }
    }

  } catch (e) {
    return `
      <main class="page-container" style="text-align:center;padding-top:4rem;">
        <p style="color:#dc2626;">Error al cargar la información: ${e.message}</p>
        <a href="#/dashboard" class="btn btn-secondary" style="margin-top:1rem;">Volver al panel</a>
      </main>`;
  }

  if (!contenido) {
    contenido = `
      <div class="empty-state">
        <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
        <h3>Sin candidatos</h3>
        <p>Aún no has recibido postulaciones para tus vacantes activas.</p>
        <a href="#/vacantes/nueva" class="btn btn-primary btn-sm" style="margin-top:1rem;">Publicar una vacante</a>
      </div>`;
  }

  // Eventos de los botones de cambio de estado
  setTimeout(() => {
    document.querySelectorAll(".btn-candidate").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id     = btn.dataset.id;
        const estado = btn.dataset.estado;

        btn.disabled = true;
        btn.textContent = "...";

        try {
          await postulaciones.cambiarEstado(id, estado);
          flash("Estado actualizado correctamente.", "success");
          setTimeout(() => { window.location.hash = "#/candidatos"; }, 800);
        } catch (e) {
          flash(e.message, "error");
          btn.disabled = false;
          btn.textContent = estado === "aceptado" ? "Admitir" : "Rechazar";
        }
      });
    });
  }, 0);

  return `
    <main class="page-container">
      <a href="#/dashboard" class="back-link">
        <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>
        Volver al panel
      </a>

      <div class="page-header">
        <h1>Candidatos</h1>
        <p>Postulaciones recibidas para tus vacantes publicadas</p>
      </div>

      ${contenido}
    </main>
    ${renderFooter()}
  `;
}