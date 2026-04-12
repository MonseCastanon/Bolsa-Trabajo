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
    // 401 → el router ya debería haber redirigido, pero por si acaso:
    return `
      <main class="page-container">
        <div class="card card--error">
          <p>${err.message}</p>
          <a href="#/login" class="btn btn--primary" style="display:inline-block;margin-top:1rem;">
            Iniciar sesión
          </a>
        </div>
      </main>
    `;
  }

  const p = data.perfil;

  // Listeners se adjuntan después de que el DOM se renderiza
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

      // Eliminar claves null para no fallar validación de semestre
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
    <main class="page-container">
      <div class="card perfil-card">

        <div class="perfil-header">
          <div class="perfil-avatar">${(p.nombre || "?")[0].toUpperCase()}</div>
          <div>
            <h1 class="perfil-nombre">${p.nombre || ""} ${p.apellido || ""}</h1>
            <p class="perfil-email">${p.email || ""}</p>
          </div>
        </div>

        <hr class="divider" />

        <form id="perfil-form" novalidate>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Nombre *</label>
              <input type="text" name="nombre" required
                value="${escapeHtml(p.nombre || "")}"
                placeholder="Tu nombre"
                class="form-input" />
            </div>
            <div class="form-group">
              <label class="form-label">Apellido *</label>
              <input type="text" name="apellido" required
                value="${escapeHtml(p.apellido || "")}"
                placeholder="Tu apellido"
                class="form-input" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Carrera</label>
            <input type="text" name="carrera"
              value="${escapeHtml(p.carrera || "")}"
              placeholder="Ej. Ingeniería en Sistemas"
              class="form-input" />
          </div>

          <div class="form-group">
            <label class="form-label">Semestre actual</label>
            <input type="number" name="semestre" min="1" max="12"
              value="${p.semestre || ""}"
              placeholder="1 – 12"
              class="form-input" style="max-width:120px;" />
          </div>

          <div class="form-group">
            <label class="form-label">Link a mi CV</label>
            <input type="url" name="cv_url"
              value="${escapeHtml(p.cv_url || "")}"
              placeholder="https://drive.google.com/..."
              class="form-input" />
          </div>

          <div class="form-group">
            <label class="form-label">Acerca de mí</label>
            <textarea name="bio" rows="4"
              placeholder="Cuéntanos un poco sobre ti..."
              class="form-input form-textarea">${escapeHtml(p.bio || "")}</textarea>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn--primary btn--block">
              Guardar cambios
            </button>
          </div>
        </form>

      </div>
    </main>

    <style>
      .perfil-header {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1.25rem;
      }
      .perfil-avatar {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: linear-gradient(135deg, #3b82f6, #6366f1);
        color: #fff;
        font-size: 1.6rem;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      .perfil-nombre {
        font-size: 1.2rem;
        font-weight: 700;
        color: #1e293b;
        margin: 0;
      }
      .perfil-email {
        font-size: 0.85rem;
        color: #64748b;
        margin: 0;
      }
      .divider {
        border: none;
        border-top: 1px solid #e2e8f0;
        margin: 1rem 0 1.5rem;
      }
        .page-container {
        padding: 2rem 1rem;
        margin-top: 2rem;
      }

      .perfil-card {
        max-width: 560px;
        margin: 0 auto;
        padding: 1.5rem;
      }

      .form-actions {
        margin-top: 1.5rem;
        display: flex;
        justify-content: center;
      }

      .btn--block {
        width: 100%;
        max-width: 280px;
        padding: 0.7rem 1rem;
        font-size: 0.95rem;
      }
      .btn--primary {
        background-color: #2563eb;
        color: #fff;
        border: none;
        border-radius: 0.5rem;
        cursor: pointer;
        transition: background-color 0.15s ease;
      }
      .btn--primary:hover {
        background-color: #1d4ed8;
      }
      .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
      }
      @media (max-width: 480px) {
        .form-row { grid-template-columns: 1fr; }
      }
      .form-group { margin-bottom: 1rem; }
      .form-label {
        display: block;
        font-size: 0.8rem;
        font-weight: 600;
        color: #475569;
        margin-bottom: 0.35rem;
      }
      .form-input {
        width: 100%;
        border: 1px solid #cbd5e1;
        border-radius: 0.5rem;
        padding: 0.55rem 0.75rem;
        font-size: 0.9rem;
        color: #1e293b;
        background: #f8fafc;
        box-sizing: border-box;
        transition: border-color 0.15s, box-shadow 0.15s;
      }
      .form-input:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59,130,246,0.15);
        background: #fff;
      }
      .form-textarea { resize: vertical; }
    </style>
  `;
}

// ── Helper ────────────────────────────────────────────────────────────────────
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
