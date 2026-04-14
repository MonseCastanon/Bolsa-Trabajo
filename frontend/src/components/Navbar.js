/**
 * src/components/Navbar.js
 *
 * Navbar profesional — sin emojis, con iconos SVG.
 * Muestra links según el rol: visitante | estudiante | empresa | admin.
 */

// ── Iconos SVG ────────────────────────────────────────────────────────────────
const ICONS = {
  logo: `<svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect width="26" height="26" rx="6" fill="#2563eb"/>
    <path d="M5 20V10.5l8-4.5 8 4.5V20" stroke="#fff" stroke-width="2" stroke-linejoin="round"/>
    <rect x="9" y="13" width="8" height="7" rx="1" stroke="#fff" stroke-width="1.75"/>
  </svg>`,
  chevronDown: `<svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="2,4 6.5,9 11,4"/></svg>`,
};

// ── Links por rol ─────────────────────────────────────────────────────────────
function getLinks(usuario) {
  if (!usuario) {
    return `
      <a href="#/vacantes" class="nav-link">Vacantes</a>
    `;
  }

  switch (usuario.rol) {
    case "estudiante":
      return `
        <a href="#/vacantes"  class="nav-link">Vacantes</a>
        <a href="#/dashboard" class="nav-link">Mis postulaciones</a>
        <a href="#/perfil"    class="nav-link">Mi perfil</a>
      `;
    case "empresa":
      return `
        <a href="#/vacantes"      class="nav-link">Mis vacantes</a>
        <a href="#/candidatos"    class="nav-link">Candidatos</a>
        <a href="#/perfil-empresa" class="nav-link">Perfil empresa</a>
      `;
    case "admin":
      return `
        <a href="#/admin/panel"    class="nav-link">Panel admin</a>
        <a href="#/admin/usuarios" class="nav-link">Usuarios</a>
        <a href="#/admin/vacantes" class="nav-link">Vacantes</a>
      `;
    default:
      return `<a href="#/vacantes" class="nav-link">Vacantes</a>`;
  }
}

function getAuthSection(usuario) {
  if (usuario) {
    const initials = (usuario.email || "U")[0].toUpperCase();
    return `
      <div class="nav-user">
        <div class="nav-avatar" aria-hidden="true">${initials}</div>
        <span class="nav-email hide-mobile">${usuario.email}</span>
      </div>
      <button id="btn-logout" class="btn btn-sm nav-logout" aria-label="Cerrar sesión">
        Salir
      </button>
    `;
  }
  return `
    <a href="#/login"    class="btn btn-sm btn-secondary" style="font-weight:600;">Iniciar sesión</a>
    <a href="#/registro" class="btn btn-sm btn-primary">Crear cuenta</a>
  `;
}

const NAV_STYLES = `
  <style>
    #navbar {
      background: #0f172a;
      border-bottom: 1px solid rgba(255,255,255,.06);
      padding: 0 1.5rem;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 1px 12px rgba(0,0,0,.3);
      position: sticky;
      top: 0;
      z-index: 200;
    }
    .nav-brand {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      text-decoration: none;
      font-size: 1rem;
      font-weight: 700;
      color: #fff;
      letter-spacing: -0.01em;
      flex-shrink: 0;
    }
    .nav-brand-text { display: flex; flex-direction: column; line-height: 1.1; }
    .nav-brand-text span:first-child { font-size: 0.9rem; color: #fff; }
    .nav-brand-text span:last-child  { font-size: 0.68rem; color: #60a5fa; font-weight: 400; letter-spacing: 0.02em; }
    .nav-brand:hover { opacity: .85; }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }
    .nav-link {
      color: #94a3b8;
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 500;
      padding: 0.4rem 0.75rem;
      border-radius: 6px;
      transition: color .15s, background .15s;
      white-space: nowrap;
    }
    .nav-link:hover { color: #fff; background: rgba(255,255,255,.06); }
    .nav-link.active { color: #fff; background: rgba(37,99,235,.25); }

    .nav-auth {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .nav-user {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.25rem 0.5rem;
      border-radius: 8px;
    }
    .nav-avatar {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: #2563eb;
      color: #fff;
      font-weight: 700;
      font-size: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .nav-email {
      font-size: 0.8rem;
      color: #94a3b8;
      max-width: 160px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .nav-logout {
      background: transparent;
      border: 1px solid rgba(255,255,255,.15);
      color: #94a3b8;
      font-size: 0.8rem;
      padding: 0.3rem 0.75rem;
      border-radius: 6px;
      cursor: pointer;
      transition: background .15s, color .15s, border-color .15s;
    }
    .nav-logout:hover {
      background: rgba(220,38,38,.15);
      border-color: rgba(220,38,38,.4);
      color: #fca5a5;
    }

    @media (max-width: 768px) {
      .nav-links { gap: 0; }
      .nav-link  { padding: 0.35rem 0.5rem; font-size: 0.8125rem; }
    }
    @media (max-width: 640px) {
      .nav-links .nav-link:not(:first-child) { display: none; }
    }
  </style>
`;

// ── Export: función síncrona (usada por main.js router) ──────────────────────

/**
 * Devuelve el HTML del navbar como string.
 * Llamar attachNavbarListeners() después de insertar en el DOM.
 *
 * @param {Object|null} usuario  Objeto con { email, rol } o null para visitante.
 * @returns {string} HTML string del navbar.
 */
export function renderNavbar(usuario) {
  return `
    <nav id="navbar" role="navigation" aria-label="Navegación principal">
      <a href="#/" class="nav-brand" aria-label="Bolsa de Trabajo — Inicio">
        ${ICONS.logo}
        <div class="nav-brand-text">
          <span>Bolsa de Trabajo</span>
          <span>Prácticas Profesionales</span>
        </div>
      </a>
      <div class="nav-links">${getLinks(usuario)}</div>
      <div class="nav-auth">${getAuthSection(usuario)}</div>
    </nav>
    ${NAV_STYLES}
  `;
}

/**
 * Adjunta el listener de logout al botón #btn-logout.
 * Debe llamarse después de insertar renderNavbar() en el DOM.
 *
 * @param {Function} onLogout  Callback invocado tras hacer logout exitoso.
 */
export function attachNavbarListeners(onLogout) {
  const btn = document.getElementById("btn-logout");
  if (!btn) return;
  btn.addEventListener("click", async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (_) {
      // sin conexión: igual limpiamos estado local
    }
    if (typeof onLogout === "function") onLogout();
  });

  // Marcar link activo
  const currentHash = window.location.hash;
  document.querySelectorAll(".nav-link").forEach((link) => {
    const href = link.getAttribute("href");
    if (href && currentHash.startsWith(href) && href !== "#/") {
      link.classList.add("active");
    } else if (href === "#/" && (currentHash === "#/" || currentHash === "")) {
      link.classList.add("active");
    }
  });
}

// ── Export: inicializador async (uso standalone) ──────────────────────────────
export async function initNavbar() {
  let usuario = null;
  try {
    const res = await fetch("/api/auth/me", { credentials: "include" });
    if (res.ok) {
      const json = await res.json();
      usuario = json.usuario || null;
    }
  } catch (_) { /* sin backend */ }

  const container =
    document.getElementById("navbar-container") ||
    (() => {
      const div = document.createElement("div");
      document.body.insertBefore(div, document.body.firstChild);
      return div;
    })();

  container.innerHTML = renderNavbar(usuario);
  attachNavbarListeners(() => initNavbar());
}
