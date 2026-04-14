/**
 * src/pages/admin/Panel.js — Panel principal del admin.
 * Diseño profesional, sin emojis.
 */

import { estado }       from "../../main.js";
import { renderFooter } from "../../components/Footer.js";

export function renderAdminPanel() {
  if (!estado.usuario || estado.usuario.rol !== "admin") {
    window.location.hash = "#/login";
    return "";
  }

  const { email } = estado.usuario;

  const actions = [
    {
      href: "#/admin/usuarios",
      icon: `<svg width="24" height="24" fill="none" stroke="#2563eb" stroke-width="1.75" viewBox="0 0 24 24" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
      bgIcon: "#eff6ff",
      title: "Usuarios",
      desc: "Activar o desactivar cuentas de la plataforma",
    },
    {
      href: "#/admin/vacantes",
      icon: `<svg width="24" height="24" fill="none" stroke="#16a34a" stroke-width="1.75" viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
      bgIcon: "#f0fdf4",
      title: "Vacantes",
      desc: "Ver y gestionar todas las publicaciones",
    },
    {
      href: "#/admin/postulaciones",
      icon: `<svg width="24" height="24" fill="none" stroke="#7c3aed" stroke-width="1.75" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
      bgIcon: "#faf5ff",
      title: "Postulaciones",
      desc: "Consultar todas las postulaciones del sistema",
    },
  ];

  return `
    <main class="page-container-md">
      <!-- Header -->
      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:2rem;">
        <div class="avatar avatar-lg" style="background:#0f172a;">${(email || "A")[0].toUpperCase()}</div>
        <div>
          <span style="display:inline-block;font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#dc2626;background:#fee2e2;padding:.15rem .5rem;border-radius:4px;margin-bottom:.3rem;">Admin</span>
          <h1 style="font-size:1.375rem;">Panel de administración</h1>
          <p style="font-size:.875rem;color:var(--muted);">${email}</p>
        </div>
      </div>

      <!-- Cards de navegación -->
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1.25rem;">
        ${actions.map(a => `
          <a href="${a.href}" style="text-decoration:none;">
            <div class="card card-body" style="border:1.5px solid transparent;transition:box-shadow .15s,border-color .15s;cursor:pointer;"
                 onmouseover="this.style.borderColor='#bfdbfe';this.style.boxShadow='0 4px 16px rgba(0,0,0,.08)';"
                 onmouseout="this.style.borderColor='transparent';this.style.boxShadow='';">
              <div style="width:52px;height:52px;background:${a.bgIcon};border-radius:12px;display:flex;align-items:center;justify-content:center;margin-bottom:1rem;">
                ${a.icon}
              </div>
              <h3 style="font-size:1rem;margin-bottom:.3rem;">${a.title}</h3>
              <p style="font-size:.825rem;color:var(--muted);">${a.desc}</p>
            </div>
          </a>
        `).join("")}
      </div>
    </main>
    ${renderFooter()}
  `;
}
