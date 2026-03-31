/**
 * src/main.js — Punto de entrada del frontend.
 *
 * Responsabilidades de Monserrat (semana 1):
 *   1. Router SPA mínimo basado en hash (#/ruta)
 *   2. Inyectar el componente correcto en #app
 *   3. Verificar si el usuario está autenticado al cargar
 *
 * En semanas 2-3 Gilberto y Juan Diego solo importan y registran
 * sus páginas en el objeto ROUTES de abajo — no tocan el router.
 */

import { renderNavbar } from "./components/Navbar.js";
import { renderHome } from "./pages/Home.js";
import { renderLogin } from "./pages/Login.js";
import { renderRegister } from "./pages/Register.js";
import { renderVacantes } from "./pages/Vacantes.js";
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

// ── Estado global mínimo ────────────────────────────────────────────────────
// Se guarda en sessionStorage para sobrevivir recargas en la misma sesión.

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

// ── Mapa de rutas ───────────────────────────────────────────────────────────
// Formato: "#/ruta" → función que devuelve HTML string o nodo DOM.
// Para añadir una ruta nueva, solo agregar una entrada aquí.

const ROUTES = {
  "#/":              renderHome,
  "#/login":         renderLogin,
  "#/registro":      renderRegister,
  "#/vacantes":      renderVacantes,
  "#/dashboard":     renderDashboard,
  // Gilberto agrega sus rutas aquí en semana 2:
  // "#/vacantes/nueva": renderNuevaVacante,
  // Juan Diego agrega las suyas:
  // "#/admin":       renderAdmin,
};

// ── Router ──────────────────────────────────────────────────────────────────

function getRoute() {
  const hash = window.location.hash || "#/";
  // Soporta rutas con parámetro: #/vacantes/5
  if (hash.startsWith("#/vacantes/")) return "#/vacantes/:id";
  return hash;
}

async function renderPage() {
  const app = document.getElementById("app");
  const route = getRoute();

  // Navbar siempre presente
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

  // Delegar eventos del router a links con data-route
  app.querySelectorAll("[data-route]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.hash = el.dataset.route;
    });
  });
}

// ── Inicialización ──────────────────────────────────────────────────────────

async function init() {
  // Verificar sesión activa en el backend al cargar la página
  if (!estado.estaAutenticado()) {
    try {
      const res = await auth.me();
      estado.setUsuario(res.usuario);
    } catch {
      // No hay sesión activa — normal para visitantes
    }
  }

  await renderPage();
}

// Navegar cuando cambia el hash
window.addEventListener("hashchange", renderPage);

// Arrancar
init();
