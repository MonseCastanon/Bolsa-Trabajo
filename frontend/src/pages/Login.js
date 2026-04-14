/**
 * src/pages/Login.js — Página de inicio de sesión.
 * Diseño profesional, sin emojis.
 */

import { auth }   from "../services/api.js";
import { estado } from "../main.js";
import { flash }  from "../components/FlashMessage.js";

export async function renderLogin() {
  if (estado.estaAutenticado()) {
    window.location.hash = "#/dashboard";
    return "";
  }

  setTimeout(() => {
    const form = document.getElementById("form-login");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = form.querySelector("button[type=submit]");
      btn.disabled = true;
      btn.textContent = "Verificando...";

      try {
        const res = await auth.login({
          email:    form.email.value.trim(),
          password: form.password.value,
        });
        estado.setUsuario(res.usuario);
        flash("Sesión iniciada correctamente.", "success");
        window.location.hash = "#/dashboard";
      } catch (err) {
        flash(err.message, "error");
        btn.disabled = false;
        btn.textContent = "Iniciar sesión";
      }
    });
  }, 0);

  return `
    <main style="min-height:calc(100vh - 60px);display:flex;align-items:center;justify-content:center;padding:2rem 1rem;background:var(--bg);">
      <div style="width:100%;max-width:420px;">

        <!-- Header -->
        <div style="text-align:center;margin-bottom:2rem;">
          <div style="display:inline-flex;align-items:center;justify-content:center;width:52px;height:52px;background:#eff6ff;border-radius:14px;margin-bottom:1rem;">
            <svg width="26" height="26" fill="none" stroke="#2563eb" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h1 style="font-size:1.5rem;margin-bottom:.3rem;">Bienvenido de vuelta</h1>
          <p style="color:var(--muted);font-size:.9rem;">Inicia sesión en tu cuenta institucional</p>
        </div>

        <!-- Card -->
        <div class="card card-body" style="border-radius:14px;box-shadow:0 4px 20px rgba(0,0,0,.08);">
          <form id="form-login" novalidate>

            <div class="form-group">
              <label for="login-email" class="form-label">Correo electrónico</label>
              <input type="email" id="login-email" name="email" required
                class="form-input" placeholder="tu@correo.edu"
                autocomplete="email" />
            </div>

            <div class="form-group" style="margin-bottom:1.5rem;">
              <label for="login-password" class="form-label">Contraseña</label>
              <div class="input-wrapper">
                <input type="password" id="login-password" name="password" required
                  class="form-input" placeholder="••••••••"
                  autocomplete="current-password" />
                <button type="button" class="input-toggle-btn" aria-label="Mostrar/ocultar contraseña"
                  onclick="const i=document.getElementById('login-password');i.type=i.type==='password'?'text':'password';">
                  <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
              </div>
            </div>

            <button type="submit" class="btn btn-primary btn-lg btn-full">
              Iniciar sesión
            </button>

          </form>
        </div>

        <!-- Footer link -->
        <p style="text-align:center;font-size:.88rem;color:var(--muted);margin-top:1.25rem;">
          ¿No tienes cuenta?
          <a href="#/registro" style="color:var(--primary);font-weight:600;"> Regístrate aquí</a>
        </p>

      </div>
    </main>
  `;
}
