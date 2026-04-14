/**
 * src/pages/admin/Postulaciones.js — Gestión de postulaciones del admin.
 * Diseño profesional, sin emojis, sin alert().
 */

import { admin }  from "../../services/api.js";
import { estado } from "../../main.js";
import { flash }  from "../../components/FlashMessage.js";

const STATUS_LABELS = {
  pendiente: "Pendiente",
  revisado:  "Revisado",
  aceptado:  "Aceptado",
  rechazado: "Rechazado",
};

export async function renderAdminPostulaciones() {
  if (!estado.usuario || estado.usuario.rol !== "admin") {
    window.location.hash = "#/login";
    return "";
  }

  let listaPostulaciones = [];
  try {
    const res = await admin.listarPostulaciones();
    listaPostulaciones = res.postulaciones || [];
  } catch (e) {
    console.error(e);
  }

  const rows = listaPostulaciones.length
    ? listaPostulaciones.map((p) => {
        const estadoKey = p.estado || "pendiente";
        const fechaRaw  = p.fecha_postulacion || p.fecha || p.postulado_en;
        const fecha     = fechaRaw
          ? new Date(fechaRaw).toLocaleDateString("es-MX", { year:"numeric", month:"short", day:"numeric" })
          : "–";

        return `
          <tr>
            <td style="color:var(--muted);font-size:.8rem;">#${p.id}</td>
            <td style="font-weight:500;font-size:.875rem;">#${p.postulante_id || p.estudiante_id || p.estudiante || "–"}</td>
            <td>
              <a href="#/vacantes/${p.vacante_id || p.vacante}" style="color:var(--primary);font-weight:500;font-size:.875rem;text-decoration:none;"
                 onmouseover="this.style.textDecoration='underline';" onmouseout="this.style.textDecoration='none';">
                Vacante #${p.vacante_id || p.vacante || "–"}
              </a>
            </td>
            <td style="font-size:.8rem;color:var(--muted);">${fecha}</td>
            <td><span class="status status-${estadoKey}">${STATUS_LABELS[estadoKey] || estadoKey}</span></td>
            <td style="text-align:center;">
              <button data-pid="${p.id}" class="btn btn-sm btn-toggle-post"
                style="background:#f1f5f9;color:var(--slate);border:1.5px solid var(--border-mid);"
                aria-label="Cambiar estado de postulación #${p.id}">
                Cambiar estado
              </button>
            </td>
          </tr>
        `;
      }).join("")
    : `<tr><td colspan="6">
        <div class="empty-state">
          <h3>Sin postulaciones</h3>
          <p>No hay postulaciones en el sistema todavía.</p>
        </div>
       </td></tr>`;

  const html = `
    <main class="page-container">
      <a href="#/admin/panel" class="back-link">
        <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>
        Volver al panel
      </a>

      <div class="page-header">
        <h1>Postulaciones</h1>
        <p>${listaPostulaciones.length} postulación(ones) registrada(s) en el sistema</p>
      </div>

      <div class="card" style="overflow:hidden;">
        <div style="overflow-x:auto;">
          <table class="data-table" aria-label="Lista de postulaciones (admin)">
            <thead>
              <tr>
                <th>ID</th>
                <th>Estudiante</th>
                <th>Vacante</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th style="text-align:center;">Acciones</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>
    </main>
  `;

  setTimeout(() => {
    document.querySelectorAll(".btn-toggle-post").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const pid = btn.dataset.pid;
        btn.disabled = true;
        btn.textContent = "...";
        try {
          await admin.togglePostulacion(pid);
          flash("Estado de postulación actualizado.", "success");
          const app = document.getElementById("app");
          if (app) app.innerHTML = await renderAdminPostulaciones();
        } catch (e) {
          flash(e.message, "error");
          const app = document.getElementById("app");
          if (app) app.innerHTML = await renderAdminPostulaciones();
        }
      });
    });
  }, 0);

  return html;
}