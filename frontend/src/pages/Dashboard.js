/**
 * src/pages/Dashboard.js — Panel del usuario autenticado.
 * Diseño profesional, sin emojis, por roles.
 */

import { estado }         from "../main.js";
import { postulaciones }  from "../services/api.js";
import { renderFooter }   from "../components/Footer.js";

export async function renderDashboard() {
  if (!estado.estaAutenticado()) {
    window.location.hash = "#/login";
    return "";
  }

  const { rol, email } = estado.usuario;

  if (rol === "estudiante") return await renderDashboardEstudiante(email);
  if (rol === "empresa")    return renderDashboardEmpresa(email);
  if (rol === "admin")      return renderDashboardAdmin(email);

  return `<main class="page-container"><p>Rol desconocido.</p></main>`;
}


// ── Estudiante ────────────────────────────────────────────────────────────────
async function renderDashboardEstudiante(email) {
  let posts = [];
  try {
    const res = await postulaciones.misPostulaciones();
    posts = res.postulaciones;
  } catch {
    // Error de sesión o sin postulaciones
  }

  const statusLabelMap = {
    pendiente: "Pendiente",
    revisado:  "Revisado",
    aceptado:  "Aceptado",
    rechazado: "Rechazado",
  };

  const rows = posts.length
    ? posts.map((p) => `
        <tr>
          <td>
            <a href="#/vacantes/${p.vacante_id}" style="color:var(--primary);font-weight:500;font-size:.875rem;text-decoration:none;"
               onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">
              Vacante #${p.vacante_id}
            </a>
          </td>
          <td><span class="status status-${p.estado}">${statusLabelMap[p.estado] || p.estado}</span></td>
          <td style="color:var(--muted);font-size:.8rem;">${new Date(p.postulado_en).toLocaleDateString("es-MX", { year:"numeric", month:"short", day:"numeric" })}</td>
        </tr>
      `).join("")
    : `<tr><td colspan="3">
        <div class="empty-state">
          <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          <h3>Sin postulaciones aún</h3>
          <p>Explora las vacantes disponibles y da el primer paso.</p>
          <a href="#/vacantes" class="btn btn-primary btn-sm" style="margin-top:1rem;">Ver vacantes disponibles</a>
        </div>
       </td></tr>`;

  return `
    <main class="page-container-md">
      <!-- Header -->
      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:2rem;">
        <div class="avatar avatar-lg">${(email || "U")[0].toUpperCase()}</div>
        <div>
          <h1 style="font-size:1.375rem;margin-bottom:.2rem;">Mis postulaciones</h1>
          <p style="font-size:.875rem;color:var(--muted);">${email}</p>
        </div>
      </div>

      <!-- Quick actions -->
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:1rem;margin-bottom:2rem;">
        <a href="#/vacantes" style="text-decoration:none;">
          <div class="stat-card" style="transition:box-shadow .15s,border-color .15s;cursor:pointer;border:1.5px solid transparent;"
               onmouseover="this.style.borderColor='#bfdbfe';" onmouseout="this.style.borderColor='transparent';">
            <div style="display:flex;align-items:center;gap:.75rem;margin-bottom:.5rem;">
              <div style="width:36px;height:36px;background:#eff6ff;border-radius:8px;display:flex;align-items:center;justify-content:center;">
                <svg width="18" height="18" fill="none" stroke="#2563eb" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </div>
              <span style="font-size:.8rem;font-weight:600;color:var(--muted);">Explorar</span>
            </div>
            <p style="font-size:.9rem;font-weight:600;color:var(--navy-mid);">Buscar vacantes</p>
          </div>
        </a>
        <a href="#/perfil" style="text-decoration:none;">
          <div class="stat-card" style="transition:box-shadow .15s,border-color .15s;cursor:pointer;border:1.5px solid transparent;"
               onmouseover="this.style.borderColor='#bfdbfe';" onmouseout="this.style.borderColor='transparent';">
            <div style="display:flex;align-items:center;gap:.75rem;margin-bottom:.5rem;">
              <div style="width:36px;height:36px;background:#f0fdf4;border-radius:8px;display:flex;align-items:center;justify-content:center;">
                <svg width="18" height="18" fill="none" stroke="#16a34a" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <span style="font-size:.8rem;font-weight:600;color:var(--muted);">Perfil</span>
            </div>
            <p style="font-size:.9rem;font-weight:600;color:var(--navy-mid);">Editar mi perfil</p>
          </div>
        </a>
        <div class="stat-card">
          <div style="display:flex;align-items:center;gap:.75rem;margin-bottom:.5rem;">
            <div style="width:36px;height:36px;background:#faf5ff;border-radius:8px;display:flex;align-items:center;justify-content:center;">
              <svg width="18" height="18" fill="none" stroke="#7c3aed" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <span style="font-size:.8rem;font-weight:600;color:var(--muted);">Total</span>
          </div>
          <p class="stat-value">${posts.length}</p>
          <p class="stat-label">Postulaciones</p>
        </div>
      </div>

      <!-- Tabla de postulaciones -->
      <div class="card" style="overflow:hidden;">
        <div style="padding:1rem 1.25rem;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;">
          <h2 style="font-size:1rem;">Historial de postulaciones</h2>
        </div>
        <div style="overflow-x:auto;">
          <table class="data-table" aria-label="Mis postulaciones">
            <thead>
              <tr>
                <th>Vacante</th>
                <th>Estado</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>
    </main>
    ${renderFooter()}
  `;
}

// ── Empresa ───────────────────────────────────────────────────────────────────
function renderDashboardEmpresa(email) {
  const actions = [
    {
      href: "#/vacantes",
      icon: `<svg width="22" height="22" fill="none" stroke="#2563eb" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
      bg: "#eff6ff",
      title: "Ver mis vacantes",
      desc: "Consulta y gestiona tus publicaciones",
    },
    {
      href: "#/vacantes/nueva",
      icon: `<svg width="22" height="22" fill="none" stroke="#16a34a" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
      bg: "#f0fdf4",
      title: "Publicar vacante",
      desc: "Crea una nueva oportunidad de empleo",
    },
    {
      href: "#/candidatos",
      icon: `<svg width="22" height="22" fill="none" stroke="#7c3aed" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
      bg: "#faf5ff",
      title: "Ver candidatos",
      desc: "Revisa postulaciones a tus vacantes",
    },
    {
      href: "#/perfil-empresa",
      icon: `<svg width="22" height="22" fill="none" stroke="#d97706" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16"/><path d="M3 21h18M9 21v-4h6v4"/></svg>`,
      bg: "#fffbeb",
      title: "Perfil de empresa",
      desc: "Actualiza tu información corporativa",
    },
  ];

  return `
    <main class="page-container-md">
      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:2rem;">
        <div class="avatar avatar-lg avatar-company">${(email || "E")[0].toUpperCase()}</div>
        <div>
          <h1 style="font-size:1.375rem;margin-bottom:.2rem;">Panel de empresa</h1>
          <p style="font-size:.875rem;color:var(--muted);">${email}</p>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1rem;">
        ${actions.map(a => `
          <a href="${a.href}" style="text-decoration:none;">
            <div class="card card-body" style="border:1.5px solid transparent;transition:box-shadow .15s,border-color .15s;cursor:pointer;"
                 onmouseover="this.style.borderColor='#bfdbfe';this.style.boxShadow='0 4px 16px rgba(0,0,0,.08)';"
                 onmouseout="this.style.borderColor='transparent';this.style.boxShadow='';">
              <div style="width:48px;height:48px;background:${a.bg};border-radius:12px;display:flex;align-items:center;justify-content:center;margin-bottom:1rem;">
                ${a.icon}
              </div>
              <h3 style="font-size:.9375rem;margin-bottom:.25rem;">${a.title}</h3>
              <p style="font-size:.825rem;color:var(--muted);">${a.desc}</p>
            </div>
          </a>
        `).join("")}
      </div>
    </main>
    ${renderFooter()}
  `;
}

// ── Admin ─────────────────────────────────────────────────────────────────────
function renderDashboardAdmin(email) {
  const actions = [
    {
      href: "#/admin/usuarios",
      icon: `<svg width="22" height="22" fill="none" stroke="#2563eb" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
      bg: "#eff6ff",
      title: "Usuarios",
      desc: "Activar o desactivar cuentas",
    },
    {
      href: "#/admin/vacantes",
      icon: `<svg width="22" height="22" fill="none" stroke="#16a34a" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
      bg: "#f0fdf4",
      title: "Vacantes",
      desc: "Ver y gestionar publicaciones",
    },
    {
      href: "#/admin/postulaciones",
      icon: `<svg width="22" height="22" fill="none" stroke="#7c3aed" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
      bg: "#faf5ff",
      title: "Postulaciones",
      desc: "Ver todas las postulaciones",
    },
  ];

  return `
    <main class="page-container-md">
      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:2rem;">
        <div class="avatar avatar-lg" style="background:#0f172a;">${(email || "A")[0].toUpperCase()}</div>
        <div>
          <span style="font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#dc2626;background:#fee2e2;padding:.2rem .5rem;border-radius:4px;display:inline-block;margin-bottom:.25rem;">Administrador</span>
          <h1 style="font-size:1.375rem;margin-bottom:.2rem;">Panel de administración</h1>
          <p style="font-size:.875rem;color:var(--muted);">${email}</p>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1rem;">
        ${actions.map(a => `
          <a href="${a.href}" style="text-decoration:none;">
            <div class="card card-body" style="border:1.5px solid transparent;transition:box-shadow .15s,border-color .15s;cursor:pointer;"
                 onmouseover="this.style.borderColor='#bfdbfe';this.style.boxShadow='0 4px 16px rgba(0,0,0,.08)';"
                 onmouseout="this.style.borderColor='transparent';this.style.boxShadow='';">
              <div style="width:48px;height:48px;background:${a.bg};border-radius:12px;display:flex;align-items:center;justify-content:center;margin-bottom:1rem;">
                ${a.icon}
              </div>
              <h3 style="font-size:.9375rem;margin-bottom:.25rem;">${a.title}</h3>
              <p style="font-size:.825rem;color:var(--muted);">${a.desc}</p>
            </div>
          </a>
        `).join("")}
      </div>
    </main>
    ${renderFooter()}
  `;
}
