/**
 * src/pages/PerfilEmpresa.js — Edición del perfil de empresa.
 * Diseño profesional, sin emojis.
 */

import { empresas }     from "../services/api.js";
import { flash }        from "../components/FlashMessage.js";
import { renderFooter } from "../components/Footer.js";

export async function renderPerfilEmpresa() {
  let empresa = {};
  try {
    const res = await empresas.miPerfil();
    empresa = res.empresa;
  } catch (e) {
    return `
      <main class="page-container-sm" style="text-align:center;padding-top:4rem;">
        <p style="color:#dc2626;">Error al cargar el perfil: ${e.message}</p>
        <a href="#/dashboard" class="btn btn-secondary" style="margin-top:1rem;">Volver al panel</a>
      </main>`;
  }

  setTimeout(() => {
    const form = document.getElementById("perfil-empresa-form");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.textContent = "Guardando...";

      try {
        await empresas.editarPerfil({
          nombre:      form.nombre.value.trim(),
          sector:      form.sector.value.trim(),
          descripcion: form.descripcion.value.trim(),
          sitio_web:   form.sitio_web.value.trim(),
          logo_url:    form.logo_url.value.trim(),
        });
        flash("Perfil actualizado correctamente.", "success");
      } catch (error) {
        flash(error.message, "error");
      } finally {
        btn.disabled = false;
        btn.textContent = "Guardar cambios";
      }
    });
  }, 0);

  const initial = (empresa.nombre || "E")[0].toUpperCase();

  return `
    <main class="page-container-sm">
      <a href="#/dashboard" class="back-link">
        <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>
        Volver al panel
      </a>

      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:2rem;">
        <div class="avatar avatar-lg avatar-company">${initial}</div>
        <div>
          <h1 style="font-size:1.375rem;margin-bottom:.2rem;">Perfil de empresa</h1>
          <p style="font-size:.875rem;color:var(--muted);">Actualiza la información pública de tu organización</p>
        </div>
      </div>

      <div class="card card-body" style="border-radius:14px;">
        <form id="perfil-empresa-form" novalidate>

          <div class="form-group">
            <label for="emp-nombre" class="form-label">Nombre comercial <span class="req">*</span></label>
            <input type="text" id="emp-nombre" name="nombre"
              value="${empresa.nombre || ""}"
              class="form-input" placeholder="Nombre de la empresa" autocomplete="organization" />
          </div>

          <div class="form-group">
            <label for="emp-sector" class="form-label">Sector</label>
            <input type="text" id="emp-sector" name="sector"
              value="${empresa.sector || ""}"
              class="form-input" placeholder="Ej. Tecnología, Salud, Finanzas..." />
          </div>

          <div class="form-group">
            <label for="emp-desc" class="form-label">Descripción corporativa</label>
            <textarea id="emp-desc" name="descripcion" class="form-textarea" rows="4"
              placeholder="Describe brevemente la misión y actividad de tu empresa...">${empresa.descripcion || ""}</textarea>
          </div>

          <div class="form-group">
            <label for="emp-web" class="form-label">Sitio web</label>
            <input type="url" id="emp-web" name="sitio_web"
              value="${empresa.sitio_web || ""}"
              class="form-input" placeholder="https://www.tuempresa.com" autocomplete="url" />
          </div>

          <div class="form-group" style="margin-bottom:1.75rem;">
            <label for="emp-logo" class="form-label">URL del logotipo</label>
            <input type="url" id="emp-logo" name="logo_url"
              value="${empresa.logo_url || ""}"
              class="form-input" placeholder="https://..." />
            <p class="form-hint">URL pública de la imagen del logo (jpeg, png o svg).</p>
          </div>

          <div style="display:flex;gap:.75rem;justify-content:flex-end;">
            <a href="#/dashboard" class="btn btn-secondary">Cancelar</a>
            <button type="submit" class="btn btn-primary">
              <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              Guardar cambios
            </button>
          </div>

        </form>
      </div>
    </main>
    ${renderFooter()}
  `;
}
