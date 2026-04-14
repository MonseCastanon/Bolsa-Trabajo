/**
 * src/pages/admin/Usuarios.js — Gestión de usuarios del admin.
 * Diseño profesional, sin emojis, sin alert().
 */

import { admin }  from "../../services/api.js";
import { estado } from "../../main.js";
import { flash }  from "../../components/FlashMessage.js";

const ROL_LABELS = { admin: "Admin", empresa: "Empresa", estudiante: "Estudiante" };

export async function renderAdminUsuarios() {
  if (!estado.usuario || estado.usuario.rol !== "admin") {
    window.location.hash = "#/login";
    return "";
  }

  let usuarios = [];
  try {
    const res = await admin.listarUsuarios();
    usuarios = res.usuarios || [];
  } catch (e) {
    console.error(e);
  }

  const rows = usuarios.length
    ? usuarios.map((u) => `
        <tr>
          <td style="color:var(--muted);font-size:.8rem;">#${u.id}</td>
          <td style="font-weight:500;font-size:.875rem;">${u.email}</td>
          <td>
            <span style="font-size:.78rem;font-weight:600;background:${u.rol === 'admin' ? '#fee2e2' : u.rol === 'empresa' ? '#dbeafe' : '#f0fdf4'};color:${u.rol === 'admin' ? '#dc2626' : u.rol === 'empresa' ? '#1d4ed8' : '#166534'};padding:.2rem .6rem;border-radius:99px;">
              ${ROL_LABELS[u.rol] || u.rol}
            </span>
          </td>
          <td>
            <span class="status status-${u.activo ? 'activa' : 'cerrada'}">${u.activo ? "Activo" : "Inactivo"}</span>
          </td>
          <td style="text-align:center;">
            <button data-uid="${u.id}" class="btn btn-sm btn-toggle-usuario"
              style="background:${u.activo ? '#fee2e2' : '#dcfce7'};color:${u.activo ? '#991b1b' : '#166534'};border:1.5px solid ${u.activo ? '#fca5a5' : '#86efac'};"
              aria-label="${u.activo ? 'Desactivar' : 'Activar'} cuenta de ${u.email}">
              ${u.activo ? "Desactivar" : "Activar"}
            </button>
          </td>
        </tr>
      `).join("")
    : `<tr><td colspan="5">
        <div class="empty-state">
          <h3>Sin usuarios</h3>
          <p>No hay usuarios registrados en el sistema.</p>
        </div>
       </td></tr>`;

  const html = `
    <main class="page-container">
      <a href="#/admin/panel" class="back-link">
        <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>
        Volver al panel
      </a>

      <div class="page-header">
        <h1>Usuarios</h1>
        <p>${usuarios.length} usuario(s) registrado(s) en el sistema</p>
      </div>

      <div class="card" style="overflow:hidden;">
        <div style="overflow-x:auto;">
          <table class="data-table" aria-label="Lista de usuarios">
            <thead>
              <tr>
                <th>ID</th>
                <th>Correo</th>
                <th>Rol</th>
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

  // Adjuntar eventos después del DOM
  setTimeout(() => {
    document.querySelectorAll(".btn-toggle-usuario").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const uid = btn.dataset.uid;
        btn.disabled = true;
        btn.textContent = "...";
        try {
          await admin.toggleUsuario(uid);
          flash("Estado del usuario actualizado.", "success");
          const app = document.getElementById("app");
          if (app) app.innerHTML = await renderAdminUsuarios();
        } catch (e) {
          flash(e.message || "Error al cambiar el estado.", "error");
          const app = document.getElementById("app");
          if (app) app.innerHTML = await renderAdminUsuarios();
        }
      });
    });
  }, 0);

  return html;
}