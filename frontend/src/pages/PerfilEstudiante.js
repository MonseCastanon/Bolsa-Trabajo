/**
 * src/pages/PerfilEstudiante.js — Página de perfil del estudiante.
 * Diseño profesional, sin emojis.
 */

import { perfil as perfilApi } from "../services/api.js";
import { flash }               from "../components/FlashMessage.js";
import { renderFooter }        from "../components/Footer.js";

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function PerfilPage() {
  let data;
  try {
    data = await perfilApi.ver();
  } catch (err) {
    return `
      <main class="page-container-sm" style="text-align:center;padding-top:4rem;">
        <p style="color:#dc2626;margin-bottom:1rem;">${err.message}</p>
        <a href="#/login" class="btn btn-primary">Iniciar sesión</a>
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
        nombre:   form.nombre.value.trim(),
        apellido: form.apellido.value.trim(),
        carrera:  form.carrera.value.trim(),
        semestre: form.semestre.value ? parseInt(form.semestre.value, 10) : null,
        cv_url:   form.cv_url.value.trim(),
        bio:      form.bio.value.trim(),
      };

      Object.keys(body).forEach((k) => body[k] === null && delete body[k]);

      try {
        await perfilApi.editarEstudiante(body);
        flash("Perfil actualizado correctamente.", "success");
      } catch (err) {
        flash(err.message || "Error al guardar.", "error");
      } finally {
        btn.disabled = false;
        btn.textContent = "Guardar cambios";
      }
    });
  }, 0);

  const initial = (p.nombre || p.email || "U")[0].toUpperCase();

  return `
    <main class="page-container-sm">
      <a href="#/dashboard" class="back-link">
        <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>
        Volver al panel
      </a>

      <!-- Header -->
      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:2rem;">
        <div class="avatar avatar-lg">${initial}</div>
        <div>
          <h1 style="font-size:1.375rem;margin-bottom:.2rem;">Mi perfil</h1>
          <p style="font-size:.875rem;color:var(--muted);">${p.email || ""}</p>
        </div>
      </div>

      <div class="card card-body" style="border-radius:14px;">
        <form id="perfil-form" novalidate>

          <!-- Información general -->
          <p class="section-label">Información general</p>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:.5rem;">
            <div class="form-group">
              <label for="p-nombre" class="form-label">Nombre <span class="req">*</span></label>
              <input type="text" id="p-nombre" name="nombre" required
                value="${escapeHtml(p.nombre || "")}"
                class="form-input" autocomplete="given-name" />
            </div>
            <div class="form-group">
              <label for="p-apellido" class="form-label">Apellido <span class="req">*</span></label>
              <input type="text" id="p-apellido" name="apellido" required
                value="${escapeHtml(p.apellido || "")}"
                class="form-input" autocomplete="family-name" />
            </div>
          </div>

          <!-- Información académica -->
          <p class="section-label" style="margin-top:1rem;">Información académica</p>

          <div style="display:grid;grid-template-columns:1fr auto;gap:1rem;align-items:end;">
            <div class="form-group">
              <label for="p-carrera" class="form-label">Carrera</label>
              <input type="text" id="p-carrera" name="carrera"
                value="${escapeHtml(p.carrera || "")}"
                class="form-input" placeholder="Ej. Ingeniería en Sistemas" />
            </div>
            <div class="form-group">
              <label for="p-semestre" class="form-label">Semestre</label>
              <input type="number" id="p-semestre" name="semestre" min="1" max="12"
                value="${p.semestre || ""}"
                class="form-input" style="width:90px;" placeholder="1–12" />
            </div>
          </div>

          <!-- Perfil profesional -->
          <p class="section-label" style="margin-top:1rem;">Perfil profesional</p>

          <div class="form-group">
            <label for="p-cv" class="form-label">URL del CV</label>
            <input type="url" id="p-cv" name="cv_url"
              value="${escapeHtml(p.cv_url || "")}"
              class="form-input" placeholder="https://drive.google.com/..." />
            <p class="form-hint">Enlace a Google Drive, PDF público u otro servicio.</p>
          </div>

          <div class="form-group" style="margin-bottom:1.75rem;">
            <label for="p-bio" class="form-label">Acerca de mí</label>
            <textarea id="p-bio" name="bio" rows="4" class="form-textarea"
              placeholder="Breve descripción de tus habilidades, intereses y objetivos...">${escapeHtml(p.bio || "")}</textarea>
          </div>

          <div style="display:flex;gap:.75rem;justify-content:flex-end;padding-top:.75rem;border-top:1px solid var(--border);">
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