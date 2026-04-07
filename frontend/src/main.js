/**
 * src/main.js — Punto de entrada del frontend (SPA con hash router).
 *
 * Responsabilidades:
 *   1. Estado global de sesión
 *   2. Router basado en hash (#/ruta)
 *   3. Protección de rutas privadas (requireAuth)
 *   4. Render del navbar + página activa
 *
 * Para agregar rutas: añadir entrada en ROUTES y, si es privada, en PRIVATE_ROUTES.
 */

import { renderNavbar, attachNavbarListeners } from "./components/Navbar.js";
import { PerfilPage }        from "./pages/Perfil.js";
import { renderHome }        from "./pages/Home.js";
import { renderLogin }       from "./pages/Login.js";
import { renderRegister }    from "./pages/Register.js";
import { renderVacantes }    from "./pages/Vacantes.js";
import { renderVacanteDetalle } from "./pages/VacanteDetalle.js";
import { renderDashboard } from "./pages/Dashboard.js";
import { auth } from "./services/api.js";
import { renderEmpresas } from "./pages/Empresas.js";
import { renderEmpresaDetalle } from "./pages/EmpresaDetalle.js";
import { renderPerfilEmpresa } from "./pages/PerfilEmpresa.js";
import { renderAdminPanel } from "./pages/admin/Panel.js";
import { renderAdminUsuarios } from "./pages/admin/Usuarios.js";
import { renderAdminVacantes } from "./pages/admin/Vacantes.js";
import { renderAdminPostulaciones } from "./pages/admin/Postulaciones.js";

// ── Estado global ─────────────────────────────────────────────────────────────
// sessionStorage sobrevive recarga pero no cierre de pestaña.

export const estado = {
  usuario: JSON.parse(sessionStorage.getItem("usuario") || "null"),

  setUsuario(u) {
    this.usuario = u;
    if (u) {
      sessionStorage.setItem("usuario", JSON.stringify(u));
    } else {
      sessionStorage.removeItem("usuario");
    }
  },

  estaAutenticado() {
    return this.usuario !== null;
  },
};

// ── Rutas ─────────────────────────────────────────────────────────────────────

const ROUTES = {
  "#/":              renderHome,
  "#/login":         renderLogin,
  "#/registro":      renderRegister,
  "#/vacantes":      renderVacantes,
  "#/dashboard":     renderDashboard,
  "#/perfil":    PerfilPage,
  // Gilberto agrega sus rutas aquí en semana 2:
  // "#/vacantes/nueva": renderNuevaVacante,
  // Juan Diego agrega las suyas:
  "#/admin/panel": renderAdminPanel,
  "#/admin/usuarios": renderAdminUsuarios,
  "#/admin/vacantes": renderAdminVacantes,
  "#/admin/postulaciones": renderAdminPostulaciones,
  "#/empresas":      renderEmpresas,
  "#/empresas/:id":  renderEmpresaDetalle,
  "#/perfil-empresa": renderPerfilEmpresa,
};
  // Gilberto agrega sus rutas aquí en semana 2
  // Juan Diego agrega las suyas en semana 3

// Rutas que requieren sesión activa
const PRIVATE_ROUTES = new Set(["#/perfil", "#/dashboard"]);

// ── Protección de rutas ───────────────────────────────────────────────────────

/**
 * Verifica sesión activa contra el backend.
 * Si no hay sesión, redirige a #/login y retorna false.
 *
 * @returns {boolean} true si hay sesión válida
 */
async function requireAuth() {
  // 1. Intentar con el estado local primero (evita round-trip innecesario)
  if (estado.estaAutenticado()) return true;

  // 2. Si no, consultar el backend (cookies pueden estar activas tras recarga)
  try {
    const res = await auth.me();
    if (res.ok && res.usuario) {
      estado.setUsuario(res.usuario);
      return true;
    }
  } catch {
    // 401 del backend o error de red
  }

  // 3. Sin sesión → redirigir
  window.location.hash = "#/login";
  return false;
}

// ── Router ────────────────────────────────────────────────────────────────────

function getRoute() {
  const hash = window.location.hash || "#/";
  // Soporta rutas con parámetro: #/vacantes/5, #/empresas/5
  if (hash.startsWith("#/vacantes/")) return "#/vacantes/:id";
  if (hash.startsWith("#/empresas/")) return "#/empresas/:id";
  return hash;
}

async function renderPage() {
  const app = document.getElementById("app");
  const route = getRoute();

  // Bloquear rutas privadas
  if (PRIVATE_ROUTES.has(route)) {
    const ok = await requireAuth();
    if (!ok) return; // requireAuth ya redirigió
  }

  // Navbar (síncrono, usa estado local)
  const navHtml = renderNavbar(estado.usuario);

  let pageHtml = "";
  if (route === "#/vacantes/:id") {
    const id = window.location.hash.split("/")[2];
    pageHtml = await renderVacanteDetalle(id);
  } else {
    const renderFn = ROUTES[route] || renderHome;
    pageHtml = await renderFn();
  }

  app.innerHTML = navHtml + pageHtml;

  // Listener de logout en navbar
  attachNavbarListeners(() => {
    estado.setUsuario(null);
    window.location.hash = "#/login";
  });

  // Delegación de clicks en links con data-route
  app.querySelectorAll("[data-route]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.hash = el.dataset.route;
    });
  });
}

// Evento de cierre de sesión
  const btnLogout = document.getElementById("btn-logout");
  if (btnLogout) {
    btnLogout.addEventListener("click", async () => {
      try {
        await auth.logout();
      } catch (e) {
        console.error(e);
      }
      estado.setUsuario(null);
      window.location.hash = "#/";
    });
  }

// ── Inicialización ──────────────────────────────────────────────────────────

async function init() {
  // Sincronizar sesión con el backend al cargar
  if (!estado.estaAutenticado()) {
    try {
      const res = await auth.me();
      if (res.ok && res.usuario) {
        estado.setUsuario(res.usuario);
      }
    } catch {
      // Sin sesión activa — normal para visitantes
    }
  }

  await renderPage();
}

window.addEventListener("hashchange", renderPage);
init();
