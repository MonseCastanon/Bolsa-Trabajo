/**
 * src/pages/Login.js — Página de inicio de sesión.
 */

import { auth } from "../services/api.js";
import { estado } from "../main.js";
import { flash } from "../components/FlashMessage.js";

export function renderLogin() {
  // El evento de submit se enlaza después de que el DOM se inyecta
  setTimeout(() => {
    const form = document.getElementById("form-login");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = form.querySelector("button[type=submit]");
      btn.disabled = true;
      btn.textContent = "Iniciando...";

      try {
        const res = await auth.login({
          email: form.email.value,
          password: form.password.value,
        });

        estado.setUsuario(res.usuario);
        flash("Sesión iniciada correctamente", "success");
        window.location.hash = "#/";
      } catch (err) {
        flash(err.message, "error");
        btn.disabled = false;
        btn.textContent = "Iniciar sesión";
      }
    });
  }, 0);

  return `
    <main class="flex items-center justify-center min-h-[80vh] px-4">
      <div class="w-full max-w-sm bg-white border border-gray-200 rounded-xl shadow-sm p-8">
        <h1 class="text-2xl font-bold text-gray-900 mb-1">Iniciar sesión</h1>
        <p class="text-sm text-gray-500 mb-6">Accede a tu cuenta de la plataforma</p>

        <form id="form-login" novalidate>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Correo electrónico
            </label>
            <input type="email" name="email" required
              class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="tu@correo.edu" />
          </div>

          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input type="password" name="password" required
              class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <button type="submit"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-sm">
            Iniciar sesión
          </button>
        </form>

        <p class="text-center text-sm text-gray-500 mt-4">
          ¿No tienes cuenta?
          <a href="#/registro" class="text-blue-600 hover:underline font-medium">Regístrate</a>
        </p>
      </div>
    </main>
  `;
}
