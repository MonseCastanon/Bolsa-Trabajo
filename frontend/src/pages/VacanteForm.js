/**
 * src/pages/VacanteForm.js — Formulario de edición de vacante.
 * Diseño profesional, sin emojis.
 */

import { vacantes }     from "../services/api.js";
import { renderFooter } from "../components/Footer.js";
import { flash }        from "../components/FlashMessage.js";

export async function renderFormularioVacante(id = null) {
  let vacante = null;

  if (id) {
    try {
      const res = await vacantes.detalle(id);
      vacante = res.vacante;
    } catch (e) {
      return `
        <main class="page-container-sm" style="text-align:center;padding-top:4rem;">
          <p style="color:#dc2626;">Error al cargar la vacante: ${e.message}</p>
          <a href="#/vacantes" class="btn btn-secondary" style="margin-top:1rem;">Volver</a>
        </main>`;
    }
  }

  const esEdicion = !!vacante;
  const v = {
    titulo:      vacante?.titulo || "",
    descripcion: vacante?.descripcion || "",
    requisitos:  vacante?.requisitos || "",
    tipo:        vacante?.tipo || "empleo",
    modalidad:   vacante?.modalidad || "presencial",
    cierra_en:   vacante?.cierra_en ? vacante.cierra_en.split("T")[0] : "",
  };

  function setError(input, msg) {
    input.classList.add("is-error");
    let err = input.parentNode.querySelector(".form-error");
    if (!err) {
      err = document.createElement("p");
      err.className = "form-error";
      input.parentNode.insertBefore(err, input.nextSibling);
    }
    err.textContent = msg;
  }

  function clearError(input) {
    input.classList.remove("is-error");
    const err = input.parentNode.querySelector(".form-error");
    if (err) err.remove();
  }

  setTimeout(() => {
    const form = document.getElementById("form-vacante-edit");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      let ok = true;

      [...form.elements].forEach((el) => clearError(el));

      if (!form.titulo.value || form.titulo.value.trim().length < 5) {
        setError(form.titulo, "Mínimo 5 caracteres.");
        ok = false;
      }
      if (!form.descripcion.value || form.descripcion.value.trim().length < 10) {
        setError(form.descripcion, "Mínimo 10 caracteres.");
        ok = false;
      }

      if (!ok) return;

      const btn = form.querySelector("button[type=submit]");
      btn.disabled = true;
      btn.textContent = esEdicion ? "Actualizando..." : "Publicando...";

      const data = {
        titulo:      form.titulo.value.trim(),
        descripcion: form.descripcion.value.trim(),
        requisitos:  form.requisitos.value.trim(),
        tipo:        form.tipo.value,
        modalidad:   form.modalidad.value,
        cierra_en:   form.cierra_en.value || null,
      };

      try {
        if (esEdicion) {
          await vacantes.editar(id, data);
          flash("Vacante actualizada correctamente.", "success");
          setTimeout(() => { window.location.hash = `#/vacantes/${id}`; }, 800);
        } else {
          await vacantes.crear(data);
          flash("Vacante publicada correctamente.", "success");
          setTimeout(() => { window.location.hash = "#/vacantes"; }, 800);
        }
      } catch (err) {
        flash(err.message, "error");
        btn.disabled = false;
        btn.textContent = esEdicion ? "Guardar cambios" : "Publicar vacante";
      }
    });

    const btnCancelar = document.getElementById("btn-cancelar-vf");
    if (btnCancelar) {
      btnCancelar.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.hash = esEdicion ? `#/vacantes/${id}` : "#/vacantes";
      });
    }
  }, 0);

  const sel = (name, opts) => opts.map(([val, lab]) =>
    `<option value="${val}" ${v[name] === val ? "selected" : ""}>${lab}</option>`
  ).join("");

  return `
    <main class="page-container-sm">
      <a href="${esEdicion ? `#/vacantes/${id}` : "#/vacantes"}" class="back-link">
        <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>
        ${esEdicion ? "Volver al detalle" : "Volver a vacantes"}
      </a>

      <div class="page-header">
        <h1>${esEdicion ? "Editar vacante" : "Nueva vacante"}</h1>
        <p>${esEdicion ? "Modifica los datos del puesto publicado." : "Completa la información del nuevo puesto."}</p>
      </div>

      <div class="card card-body" style="border-radius:14px;">
        <form id="form-vacante-edit" novalidate>

          <div class="form-group">
            <label for="vf-titulo" class="form-label">Título <span class="req">*</span></label>
            <input type="text" id="vf-titulo" name="titulo" class="form-input"
              value="${v.titulo}" placeholder="Ej. Analista de datos Senior" autocomplete="off" />
          </div>

          <div class="form-group">
            <label for="vf-desc" class="form-label">Descripción <span class="req">*</span></label>
            <textarea id="vf-desc" name="descripcion" class="form-textarea" rows="5">${v.descripcion}</textarea>
          </div>

          <div class="form-group">
            <label for="vf-req" class="form-label">Requisitos</label>
            <textarea id="vf-req" name="requisitos" class="form-textarea" rows="4">${v.requisitos}</textarea>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
            <div class="form-group">
              <label for="vf-tipo" class="form-label">Tipo</label>
              <div style="position:relative;">
                <select id="vf-tipo" name="tipo" class="form-select">
                  ${sel("tipo", [["empleo","Empleo"],["practica","Prácticas profesionales"]])}
                </select>
                <svg style="position:absolute;right:.75rem;top:50%;transform:translateY(-50%);pointer-events:none;color:var(--muted);" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
            </div>
            <div class="form-group">
              <label for="vf-modal" class="form-label">Modalidad</label>
              <div style="position:relative;">
                <select id="vf-modal" name="modalidad" class="form-select">
                  ${sel("modalidad", [["presencial","Presencial"],["remoto","Remoto"],["hibrido","Híbrido"]])}
                </select>
                <svg style="position:absolute;right:.75rem;top:50%;transform:translateY(-50%);pointer-events:none;color:var(--muted);" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
            </div>
          </div>

          <div class="form-group" style="margin-bottom:1.75rem;">
            <label for="vf-cierra" class="form-label">Fecha de cierre</label>
            <input type="date" id="vf-cierra" name="cierra_en" class="form-input"
              value="${v.cierra_en}" style="width:auto;max-width:200px;" />
            <p class="form-hint">Dejar en blanco para vacante abierta.</p>
          </div>

          <div style="display:flex;gap:.75rem;justify-content:flex-end;">
            <button id="btn-cancelar-vf" class="btn btn-secondary" type="button">Cancelar</button>
            <button type="submit" class="btn btn-primary">
              ${esEdicion ? "Guardar cambios" : "Publicar vacante"}
            </button>
          </div>

        </form>
      </div>
    </main>
    ${renderFooter()}
  `;
}