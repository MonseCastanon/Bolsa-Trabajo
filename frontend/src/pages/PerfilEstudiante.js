/**
 * src/pages/Perfil.js — Página de perfil del estudiante.
 *
 * Llama GET /api/perfil/ para cargar datos.
 * Permite editar vía PUT /api/perfil/estudiante.
 * Usa el proxy de Vite (/api → :5000), nunca URL absoluta.
 */

import { perfil as perfilApi } from "../services/api.js";
import { flash } from "../components/FlashMessage.js";

export async function PerfilPage() {
  let data;
  try {
    data = await perfilApi.ver();
  } catch (err) {
    return `
      <main class="p-10 text-center text-red-500">
        <p>${err.message}</p>
        <a href="#/login" class="text-blue-600 underline mt-4 inline-block">
          Iniciar sesión
        </a>
      </main>
    `;
  }

  const p = data.perfil;

  setTimeout(() => {
    const form = document.getElementById("perfil-form");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = form.querySelector("button[type=submit]");
      btn.disabled = true;
      btn.textContent = "Guardando...";

      const body = {
        nombre: form.nombre.value.trim(),
        apellido: form.apellido.value.trim(),
        carrera: form.carrera.value.trim(),
        semestre: form.semestre.value
          ? parseInt(form.semestre.value, 10)
          : null,
        cv_url: form.cv_url.value.trim(),
        bio: form.bio.value.trim(),
      };

      Object.keys(body).forEach((k) => body[k] === null && delete body[k]);

      try {
        await perfilApi.editarEstudiante(body);
        flash("Perfil actualizado correctamente", "success");
      } catch (err) {
        flash(err.message || "Error al guardar.", "error");
      } finally {
        btn.disabled = false;
        btn.textContent = "Guardar cambios";
      }
    });
  }, 0);

  return `
    <main class="max-w-3xl mx-auto px-6 py-10">
      
      <h1 class="text-2xl font-bold text-gray-900 mb-6">
        Mi perfil
      </h1>

      <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6">

        <!-- HEADER -->
        <div class="flex items-center gap-4 mb-6">
          <div class="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold">
            ${(p.nombre || "?")[0].toUpperCase()}
          </div>
          <div>
            <p class="font-semibold text-gray-900">
              ${p.nombre || ""} ${p.apellido || ""}
            </p>
            <p class="text-sm text-gray-500">
              ${p.email || ""}
            </p>
          </div>
        </div>

        <form id="perfil-form">

          <!-- INFORMACIÓN GENERAL -->
          <p class="text-xs font-semibold text-gray-400 uppercase mb-2">
            Información general
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm text-gray-600 mb-1">Nombre *</label>
              <input type="text" name="nombre" required
                value="${escapeHtml(p.nombre || "")}"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 outline-none" />
            </div>

            <div>
              <label class="block text-sm text-gray-600 mb-1">Apellido *</label>
              <input type="text" name="apellido" required
                value="${escapeHtml(p.apellido || "")}"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>

          <!-- ACADÉMICO -->
          <p class="text-xs font-semibold text-gray-400 uppercase mb-2">
            Información académica
          </p>

          <div class="mb-4">
            <label class="block text-sm text-gray-600 mb-1">Carrera</label>
            <input type="text" name="carrera"
              value="${escapeHtml(p.carrera || "")}"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 outline-none" />
          </div>

          <div class="mb-4">
            <label class="block text-sm text-gray-600 mb-1">Semestre</label>
            <input type="number" name="semestre" min="1" max="12"
              value="${p.semestre || ""}"
              class="border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 outline-none w-32" />
          </div>

          <!-- PERFIL PROFESIONAL -->
          <p class="text-xs font-semibold text-gray-400 uppercase mb-2">
            Perfil profesional
          </p>

          <div class="mb-4">
            <label class="block text-sm text-gray-600 mb-1">CV</label>
            <input type="url" name="cv_url"
              value="${escapeHtml(p.cv_url || "")}"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 outline-none" />
          </div>

          <div class="mb-6">
            <label class="block text-sm text-gray-600 mb-1">Acerca de mí</label>
            <textarea name="bio" rows="4"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 outline-none">${escapeHtml(p.bio || "")}</textarea>
          </div>

          <!-- ACTION -->
          <div class="pt-4 border-t border-gray-100">
            <button type="submit"
              class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition">
              Guardar cambios
            </button>
          </div>

        </form>
      </div>
    </main>
  `;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}