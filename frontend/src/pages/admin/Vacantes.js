/**
 * src/pages/admin/Vacantes.js — Gestión de vacantes del admin.
 * Diseño profesional, sin emojis, sin alert().
 */

import { admin }  from "../../services/api.js";
import { estado } from "../../main.js";
import { flash }  from "../../components/FlashMessage.js";

export async function renderAdminVacantes() {
  if (!estado.usuario || estado.usuario.rol !== "admin") {
    window.location.hash = "#/login";
    return "";
  }

  let listaVacantes = [];
  try {
    const res = await admin.listarVacantes();
    listaVacantes = res.vacantes || [];
  } catch (e) {
    console.error(e);
  }

  const rows = listaVacantes.length
    ? listaVacantes.map((v) => {
        const estadoKey = v.estado || (v.activo ? "activa" : "cerrada");
        return `
          <tr>
            <td style="color:var(--muted);font-size:.8rem;">#${v.id}</td>
            <td style="font-size:.825rem;color:var(--slate);">${v.empresa_id || v.empresa || "–"}</td>
            <td>
              <a href="#/vacantes/${v.id}" style="color:var(--primary);font-weight:500;font-size:.875rem;text-decoration:none;"
                 onmouseover="this.style.textDecoration='underline';" onmouseout="this.style.textDecoration='none';">
                ${v.titulo}
              </a>
            </td>
            <td>
              <span class="badge ${v.tipo === 'empleo' ? 'badge-empleo' : 'badge-practica'}">${v.tipo === "empleo" ? "Empleo" : "Prácticas"}</span>
            </td>
            <td><span class="status status-${estadoKey}">${estadoKey.charAt(0).toUpperCase() + estadoKey.slice(1)}</span></td>
            <td style="text-align:center;">
              <button data-vid="${v.id}" data-estado="${estadoKey}"
                class="btn btn-sm btn-toggle-vacante"
                style="background:${estadoKey === 'activa' ? '#fee2e2' : '#dcfce7'};color:${estadoKey === 'activa' ? '#991b1b' : '#166534'};border:1.5px solid ${estadoKey === 'activa' ? '#fca5a5' : '#86efac'};"
                aria-label="${estadoKey === 'activa' ? 'Cerrar' : 'Activar'} vacante ${v.titulo}">
                ${estadoKey === "activa" ? "Cerrar" : "Activar"}
              </button>
            </td>
          </tr>
        `;
      }).join("")
    : `<tr><td colspan="6">
        <div class="empty-state">
          <h3>Sin vacantes</h3>
          <p>No hay vacantes registradas en el sistema.</p>
        </div>
       </td></tr>`;

  const html = `
    <main class="page-container">
      <a href="#/admin/panel" class="back-link">
        <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>
        Volver al panel
      </a>

      <div class="page-header">
        <h1>Vacantes</h1>
        <p>${listaVacantes.length} vacante(s) registrada(s)</p>
      </div>

      <div class="card" style="overflow:hidden;">
        <div style="overflow-x:auto;">
          <table class="data-table" aria-label="Lista de vacantes (admin)">
            <thead>
              <tr>
                <th>ID</th>
                <th>Empresa</th>
                <th>Título</th>
                <th>Tipo</th>
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
    document.querySelectorAll(".btn-toggle-vacante").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const vid = btn.dataset.vid;
        btn.disabled = true;
        btn.textContent = "...";
        try {
          await admin.toggleVacante(vid);
          flash("Estado de la vacante actualizado.", "success");
          const app = document.getElementById("app");
          if (app) app.innerHTML = await renderAdminVacantes();
        } catch (e) {
          flash(e.message || "Error al cambiar el estado.", "error");
          const app = document.getElementById("app");
          if (app) app.innerHTML = await renderAdminVacantes();
        }
      });
    });
  }, 0);

  return html;
}