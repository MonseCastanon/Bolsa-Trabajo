/**
 * src/pages/Register.js — Página de registro con selector de rol.
 */

import { auth } from "../services/api.js";
import { flash } from "../components/FlashMessage.js";

export function renderRegister() {
  setTimeout(() => {
    const form = document.getElementById("form-registro");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = form.querySelector("button[type=submit]");

      if (form.password.value !== form.confirmar_password.value) {
        flash("Las contraseñas no coinciden", "error");
        return;
      }

      btn.disabled = true;
      btn.textContent = "Creando cuenta...";

      try {
        await auth.register({
          email: form.email.value,
          password: form.password.value,
          confirmar_password: form.confirmar_password.value,
          rol: form.rol.value,
        });

        flash("Cuenta creada. Ahora inicia sesión.", "success");
        window.location.hash = "#/login";
      } catch (err) {
        flash(err.message, "error");
        btn.disabled = false;
        btn.textContent = "Crear cuenta";
      }
    });
  }, 0);

  return `
    <main class="flex items-center justify-center min-h-[80vh] px-4 py-10">
      <div class="w-full max-w-sm bg-white border border-gray-200 rounded-xl shadow-sm p-8">
        <h1 class="text-2xl font-bold text-gray-900 mb-1">Crear cuenta</h1>
        <p class="text-sm text-gray-500 mb-6">Elige tu tipo de cuenta para comenzar</p>

        <form id="form-registro" novalidate>

          <!-- Selector de rol -->
          <div class="mb-5">
            <p class="text-sm font-medium text-gray-700 mb-2">Tipo de cuenta</p>
            <div class="grid grid-cols-2 gap-2">
              <label class="cursor-pointer">
                <input type="radio" name="rol" value="estudiante" class="sr-only peer" checked />
                <div class="border-2 rounded-lg p-3 text-center text-sm peer-checked:border-blue-500 peer-checked:bg-blue-50 transition">
                  🎓 Estudiante
                </div>
              </label>
              <label class="cursor-pointer">
                <input type="radio" name="rol" value="empresa" class="sr-only peer" />
                <div class="border-2 rounded-lg p-3 text-center text-sm peer-checked:border-blue-500 peer-checked:bg-blue-50 transition">
                  🏢 Empresa
                </div>
              </label>
            </div>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
            <input type="email" name="email" required
              class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="tu@correo.edu" />
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input type="password" name="password" required minlength="8"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <p class="text-xs text-gray-400 mt-1">Mínimo 8 caracteres</p>
          </div>

          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-1">Confirmar contraseña</label>
            <input type="password" name="confirmar_password" required
              class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <button type="submit"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-sm">
            Crear cuenta
          </button>
        </form>

        <p class="text-center text-sm text-gray-500 mt-4">
          ¿Ya tienes cuenta?
          <a href="#/login" class="text-blue-600 hover:underline font-medium">Inicia sesión</a>
        </p>
      </div>
    </main>
  `;
}
