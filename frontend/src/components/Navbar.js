/**
 * src/components/Navbar.js
 *
 * Exports:
 *   renderNavbar(usuario)  — usado por el router de main.js (síncrono)
 *   initNavbar()           — consulta /api/auth/me y monta el navbar (async)
 *
 * Muestra links según el rol: visitante | estudiante | empresa | admin.
 *
 * Responsable: Monserrat.
 * Los demás compañeros NO modifican este archivo.
 */

const API_BASE = "http://localhost:5000/api";

// ── Links por rol ─────────────────────────────────────────────────────────────

function getLinks(usuario) {
  if (!usuario) {
    return `<a href="#/vacantes" class="nav-link">Vacantes</a>`;
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
        <a href="#/vacantes"     class="nav-link">Mis Vacantes</a>
        <a href="#/candidatos"   class="nav-link">Candidatos</a>
        <a href="#/perfil-empresa"  class="nav-link">Perfil</a>
      `;
    case "admin":
      return `
        <a href="#/admin"    class="nav-link">Panel Admin</a>
        <a href="#/vacantes" class="nav-link">Vacantes</a>
      `;
    default:
      return `<a href="#/vacantes" class="nav-link">Vacantes</a>`;
  }
}

function getAuthSection(usuario) {
  if (usuario) {
    return `
      <span class="nav-email">${usuario.email}</span>
      <button id="btn-logout" class="btn-logout">Salir</button>
    `;
  }
  return `
    <a href="#/login"    class="btn-login">Iniciar sesión</a>
    <a href="#/registro" class="btn-register">Registrarse</a>
  `;
}

const NAV_STYLES = `
  <style>
    #navbar {
      background: #0f172a;
      color: #fff;
      padding: 0.75rem 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 2px 8px rgba(0,0,0,0.4);
      position: sticky;
      top: 0;
      z-index: 200;
    }
    .nav-brand {
      font-size: 1.1rem;
      font-weight: 700;
      color: #fff;
      text-decoration: none;
      letter-spacing: -0.01em;
    }
    .nav-brand:hover { opacity: 0.8; }
    .nav-links {
      display: flex;
      gap: 1.25rem;
      align-items: center;
    }
    .nav-link {
      color: #94a3b8;
      text-decoration: none;
      font-size: 0.875rem;
      border-bottom: 2px solid transparent;
      padding-bottom: 2px;
      transition: color 0.15s, border-color 0.15s;
    }
    .nav-link:hover {
      color: #fff;
      border-bottom-color: #3b82f6;
    }
    .nav-auth {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .nav-email {
      font-size: 0.8rem;
      color: #94a3b8;
    }
    .btn-logout {
      background: #dc2626;
      color: #fff;
      border: none;
      border-radius: 0.375rem;
      padding: 0.35rem 0.75rem;
      font-size: 0.8rem;
      cursor: pointer;
      transition: background 0.15s;
    }
    .btn-logout:hover { background: #b91c1c; }
    .btn-login {
      background: #fff;
      color: #1d4ed8;
      font-weight: 600;
      font-size: 0.8rem;
      padding: 0.35rem 0.85rem;
      border-radius: 0.375rem;
      text-decoration: none;
      transition: background 0.15s;
    }
    .btn-login:hover { background: #eff6ff; }
    .btn-register {
      background: #3b82f6;
      color: #fff;
      font-size: 0.8rem;
      padding: 0.35rem 0.85rem;
      border-radius: 0.375rem;
      text-decoration: none;
      transition: background 0.15s;
    }
    .btn-register:hover { background: #2563eb; }
    @media (max-width: 640px) {
      .nav-links { display: none; }
      .nav-email  { display: none; }
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
    <nav id="navbar">
      <a href="#/" class="nav-brand">🎓 Bolsa de Trabajo</a>
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
      await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (_) {
      // Sin conexión: igual limpiamos estado local
    }
    if (typeof onLogout === "function") onLogout();
  });
}

// ── Export: inicializador async (uso standalone) ──────────────────────────────

/**
 * Consulta /api/auth/me, monta el navbar y adjunta listeners.
 * Útil si se usa el navbar fuera del router de main.js.
 */
export async function initNavbar() {
  let usuario = null;
  try {
    const res = await fetch(`${API_BASE}/auth/me`, { credentials: "include" });
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
