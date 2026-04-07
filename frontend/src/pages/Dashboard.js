/**
 * src/pages/Dashboard.js — Panel del usuario autenticado.
 *
 * Muestra contenido distinto según el rol:
 *   estudiante → mis postulaciones
 *   empresa    → placeholder para mis vacantes (Gilberto, semana 2)
 *   admin      → link al panel de administración (Juan Diego, semana 3)
 */

import { estado } from "../main.js";
import { postulaciones } from "../services/api.js";
import { renderFooter } from "../components/Footer.js";

export async function renderDashboard() {
  if (!estado.estaAutenticado()) {
    window.location.hash = "#/login";
    return "";
  }

  const { rol, email } = estado.usuario;

  if (rol === "estudiante") {
    return await renderDashboardEstudiante(email);
  }

  if (rol === "empresa") {
    return renderDashboardEmpresa(email);
  }

  if (rol === "admin") {
    return renderDashboardAdmin(email);
  }

  return `<main class="p-10"><p>Rol desconocido.</p></main>`;
}


async function renderDashboardEstudiante(email) {
  let posts = [];
  try {
    const res = await postulaciones.misPostulaciones();
    posts = res.postulaciones;
  } catch {
    // No hay postulaciones o error de sesión
  }

  const estadoLabel = {
    pendiente: "⏳ Pendiente",
    revisado: "👁 Revisado",
    aceptado: "✅ Aceptado",
    rechazado: "❌ Rechazado",
  };

  const rows = posts.length
    ? posts.map((p) => `
        <tr class="border-b border-gray-100">
          <td class="py-3 text-sm text-blue-600 cursor-pointer hover:underline"
              onclick="window.location.hash='#/vacantes/${p.vacante_id}'">
            Ver vacante #${p.vacante_id}
          </td>
          <td class="py-3 text-sm estado-${p.estado}">${estadoLabel[p.estado] || p.estado}</td>
          <td class="py-3 text-xs text-gray-400">${new Date(p.postulado_en).toLocaleDateString("es-MX")}</td>
        </tr>
      `).join("")
    : `<tr><td colspan="3" class="py-8 text-center text-gray-400 text-sm">
         Aún no te has postulado a ninguna vacante.
         <a href="#/vacantes" class="text-blue-600 hover:underline ml-1">Ver vacantes →</a>
       </td></tr>`;

  return `
    <main class="max-w-3xl mx-auto px-6 py-10">
      <h1 class="text-2xl font-bold text-gray-900 mb-1">Mis postulaciones</h1>
      <p class="text-sm text-gray-500 mb-8">${email}</p>

      <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50 text-xs text-gray-500 uppercase">
            <tr>
              <th class="px-4 py-3 text-left">Vacante</th>
              <th class="px-4 py-3 text-left">Estado</th>
              <th class="px-4 py-3 text-left">Fecha</th>
            </tr>
          </thead>
          <tbody class="px-4">
            ${rows}
          </tbody>
        </table>
      </div>
    </main>
    ${renderFooter()}
  `;
}


function renderDashboardEmpresa(email) {
  return `
    <main class="max-w-3xl mx-auto px-6 py-10">
      <h1 class="text-2xl font-bold text-gray-900 mb-1">Panel de Empresa</h1>
      <p class="text-sm text-gray-500 mb-8">${email}</p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a href="#/perfil-empresa"
          class="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition text-center cursor-pointer">
          <div class="text-3xl mb-2">🏢</div>
          <p class="font-semibold text-gray-800">Mi Perfil Público</p>
          <p class="text-xs text-gray-400 mt-1">Editar logo, misión y sitio web</p>
        </a>
        <div class="bg-gray-50 border border-gray-200 rounded-xl p-6 transition text-center opacity-70">
          <div class="text-3xl mb-2">📄</div>
          <p class="font-semibold text-gray-800">Publicar Vacantes</p>
          <p class="text-xs text-gray-400 mt-1">Próximamente (Semana 2 - Gilberto)</p>
        </div>
      </div>
    </main>
    ${renderFooter()}
  `;
}


function renderDashboardAdmin(email) {
  return `
    <main class="max-w-3xl mx-auto px-6 py-10">
      <h1 class="text-2xl font-bold text-gray-900 mb-1">Panel Administrador</h1>
      <p class="text-sm text-gray-500 mb-8">${email}</p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <a href="#/admin/usuarios"
          class="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition text-center cursor-pointer">
          <div class="text-3xl mb-2">👥</div>
          <p class="font-semibold text-gray-800">Usuarios</p>
          <p class="text-xs text-gray-400 mt-1">Activar / desactivar cuentas</p>
        </a>
        <a href="#/admin/vacantes"
          class="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition text-center cursor-pointer">
          <div class="text-3xl mb-2">💼</div>
          <p class="font-semibold text-gray-800">Vacantes</p>
          <p class="text-xs text-gray-400 mt-1">Ver y gestionar publicaciones</p>
        </a>
        <a href="#/admin/postulaciones"
          class="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition text-center cursor-pointer">
          <div class="text-3xl mb-2">📬</div>
          <p class="font-semibold text-gray-800">Postulaciones</p>
          <p class="text-xs text-gray-400 mt-1">Ver todas las postulaciones</p>
        </a>
      </div>
    </main>
    ${renderFooter()}
  `;
}
