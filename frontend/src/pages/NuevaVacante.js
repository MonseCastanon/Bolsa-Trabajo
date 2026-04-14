/**
 * src/pages/NuevaVacante.js — Formulario para crear vacante.
 * Diseño profesional, sin emojis, validación en tiempo real.
 */

import { vacantes }     from "../services/api.js";
import { renderFooter } from "../components/Footer.js";
import { flash }        from "../components/FlashMessage.js";

export function renderNuevaVacante() {

  function setError(input, msg) {
    input.classList.add("is-error");
    input.classList.remove("is-valid");
    let err = input.parentNode.querySelector(".form-error");
    if (!err) {
      err = document.createElement("p");
      err.className = "form-error";
      input.parentNode.appendChild(err);
    }
    err.textContent = msg;
  }

  function clearError(input) {
    input.classList.remove("is-error");
    const err = input.parentNode.querySelector(".form-error");
    if (err) err.remove();
  }

  function setValid(input) {
    clearError(input);
    input.classList.add("is-valid");
  }

  function validar(form) {
    let ok = true;
    if (!form.titulo.value.trim()) {
      setError(form.titulo, "El título es obligatorio.");
      ok = false;
    } else { setValid(form.titulo); }

    if (!form.descripcion.value.trim()) {
      setError(form.descripcion, "La descripción es obligatoria.");
      ok = false;
    } else { setValid(form.descripcion); }

    return ok;
  }

  setTimeout(() => {
    const form = document.getElementById("form-vacante");
    if (!form) return;

    ["titulo", "descripcion"].forEach((campo) => {
      form[campo].addEventListener("input", () => {
        if (form[campo].value.trim()) setValid(form[campo]);
        else clearError(form[campo]);
      });
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!validar(form)) {
        flash("Corrige los campos marcados.", "warning");
        return;
      }

      const btn = form.querySelector("button[type=submit]");
      btn.disabled = true;
      btn.textContent = "Publicando...";

      const data = {
        titulo:      form.titulo.value.trim(),
        descripcion: form.descripcion.value.trim(),
        requisitos:  form.requisitos.value.trim(),
        tipo:        form.tipo.value,
        modalidad:   form.modalidad.value,
        cierra_en:   form.cierra_en.value || null,
      };

      try {
        await vacantes.crear(data);
        flash("Vacante publicada correctamente.", "success");
        setTimeout(() => { window.location.hash = "#/vacantes"; }, 1200);
      } catch (err) {
        flash(err.message, "error");
        btn.disabled = false;
        btn.textContent = "Publicar vacante";
      }
    });
  }, 0);

  return `
    <main class="page-container-sm">
      <a href="#/dashboard" class="back-link">
        <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>
        Volver al panel
      </a>

      <div class="page-header">
        <h1>Publicar nueva vacante</h1>
        <p>Completa la información del puesto para recibir postulaciones.</p>
      </div>

      <div class="card card-body" style="border-radius:14px;">
        <form id="form-vacante" novalidate>

          <div class="form-group">
            <label for="v-titulo" class="form-label">Título del puesto <span class="req">*</span></label>
            <input type="text" id="v-titulo" name="titulo" class="form-input"
              placeholder="Ej. Desarrollador Frontend Junior" autocomplete="off" />
          </div>

          <div class="form-group">
            <label for="v-desc" class="form-label">Descripción <span class="req">*</span></label>
            <textarea id="v-desc" name="descripcion" class="form-textarea" rows="5"
              placeholder="Describe las responsabilidades y el contexto del puesto..."></textarea>
          </div>

          <div class="form-group">
            <label for="v-req" class="form-label">Requisitos</label>
            <textarea id="v-req" name="requisitos" class="form-textarea" rows="4"
              placeholder="Ej. 2 años de experiencia, conocimiento en React..."></textarea>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
            <div class="form-group">
              <label for="v-tipo" class="form-label">Tipo de oportunidad</label>
              <div style="position:relative;">
                <select id="v-tipo" name="tipo" class="form-select">
                  <option value="empleo">Empleo</option>
                  <option value="practica">Prácticas profesionales</option>
                </select>
                <svg style="position:absolute;right:.75rem;top:50%;transform:translateY(-50%);pointer-events:none;color:var(--muted);" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
            </div>

            <div class="form-group">
              <label for="v-modal" class="form-label">Modalidad</label>
              <div style="position:relative;">
                <select id="v-modal" name="modalidad" class="form-select">
                  <option value="presencial">Presencial</option>
                  <option value="remoto">Remoto</option>
                  <option value="hibrido">Híbrido</option>
                </select>
                <svg style="position:absolute;right:.75rem;top:50%;transform:translateY(-50%);pointer-events:none;color:var(--muted);" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
            </div>
          </div>

          <div class="form-group" style="margin-bottom:1.75rem;">
            <label for="v-cierra" class="form-label">Fecha de cierre</label>
            <input type="date" id="v-cierra" name="cierra_en" class="form-input" style="width:auto;max-width:200px;" />
            <p class="form-hint">Opcional. Si no se especifica, la vacante permanece abierta.</p>
          </div>

          <div style="display:flex;gap:.75rem;justify-content:flex-end;">
            <a href="#/dashboard" class="btn btn-secondary">Cancelar</a>
            <button type="submit" class="btn btn-primary">
              <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              Publicar vacante
            </button>
          </div>

        </form>
      </div>
    </main>
    ${renderFooter()}
  `;
}