/**
 * src/components/Navbar.js
 *
 * Navbar con roles: muestra opciones distintas según si el usuario
 * es estudiante, empresa, admin, o visitante.
 *
 * Monserrat define la estructura base (semana 1).
 * Los demás compañeros NO modifican este archivo — solo heredan de él.
 */

export function renderNavbar(usuario) {
  const rolLinks = {
    estudiante: `
      <a href="#/vacantes" class="nav-link">Vacantes</a>
      <a href="#/dashboard" class="nav-link">Mis postulaciones</a>
      <a href="#/perfil" class="nav-link">Mi perfil</a>
    `,
    empresa: `
      <a href="#/vacantes" class="nav-link">Vacantes</a>
      <a href="#/mis-vacantes" class="nav-link">Mis vacantes</a>
      <a href="#/candidatos" class="nav-link">Candidatos</a>
    `,
    admin: `
      <a href="#/admin/panel" class="nav-link">Panel Admin</a>
      <a href="#/vacantes" class="nav-link">Vacantes</a>
    `,
  };

  const links = usuario ? (rolLinks[usuario.rol] || "") : `
    <a href="#/vacantes" class="nav-link">Vacantes</a>
  `;

  const authSection = usuario
    ? `
      <span class="text-sm text-gray-300 mr-3">${usuario.email}</span>
      <button id="btn-logout"
        class="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1.5 rounded">
        Salir
      </button>
    `
    : `
      <a href="#/login"
        class="bg-white text-blue-700 font-semibold text-sm px-4 py-1.5 rounded hover:bg-blue-50">
        Iniciar sesión
      </a>
      <a href="#/registro"
        class="ml-2 bg-blue-500 hover:bg-blue-400 text-white text-sm px-4 py-1.5 rounded">
        Registrarse
      </a>
    `;

  return `
    <nav class="bg-slate-900 text-white px-6 py-3 flex items-center justify-between shadow-md">
      <a href="#/" class="text-lg font-bold tracking-tight text-white hover:opacity-80">
        🎓 Bolsa de Trabajo
      </a>
      <div class="hidden md:flex items-center gap-4 text-sm">
        ${links}
      </div>
      <div class="flex items-center gap-2">
        ${authSection}
      </div>
    </nav>
    <style>
      .nav-link {
        color: #cbd5e1;
        text-decoration: none;
        font-size: 0.875rem;
        padding: 0.25rem 0;
        border-bottom: 2px solid transparent;
        transition: color 0.15s, border-color 0.15s;
      }
      .nav-link:hover {
        color: #fff;
        border-bottom-color: #3b82f6;
      }
    </style>
  `;
}
