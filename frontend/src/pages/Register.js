/**
 * src/pages/Register.js — Registro con validación en tiempo real
 */

import { auth } from "../services/api.js";
import { flash } from "../components/FlashMessage.js";

/* ── Estilos de validación ────────────────────────────────────────── */

const BORDER_DEFAULT = "border-gray-300";
const BORDER_ERROR   = "border-red-500";
const BORDER_SUCCESS = "border-green-500";

const LABEL_CLASS = "block text-sm font-medium text-gray-700 mb-1";

/** SVG de ojo abierto */
const EYE_OPEN = `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7s-8.268-2.943-9.542-7z"/></svg>`;

/** SVG de ojo cerrado */
const EYE_CLOSED = `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.97 9.97 0 012.31-3.775M6.938 6.938A9.966 9.966 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.97 9.97 0 01-4.043 5.062M6.938 6.938L3 3m3.938 3.938l3.124 3.124m6.876 6.876L21 21m-3.938-3.938l-3.124-3.124m0 0a3 3 0 10-4.243-4.243m4.243 4.243L9.88 9.88"/></svg>`;

/**
 * Obtiene el contenedor correcto para insertar mensajes de error.
 * Si el campo está dentro de un .password-wrapper, usa el wrapper como referencia
 * para que el error se inserte FUERA del wrapper (no junto al botón del ojo).
 */
function getErrorContainer(field) {
  const wrapper = field.closest(".password-wrapper");
  return wrapper || field;
}

/** Pinta borde rojo + mensaje de error debajo del campo */
function mostrarError(field, mensaje) {
  field.classList.remove(BORDER_DEFAULT, BORDER_SUCCESS);
  field.classList.add(BORDER_ERROR);

  const container = getErrorContainer(field);
  // Quitar mensaje anterior si existe
  const prev = container.parentElement.querySelector(".field-error");
  if (prev) prev.remove();

  if (mensaje) {
    const span = document.createElement("span");
    span.className = "field-error text-red-500 text-xs mt-1 block";
    span.textContent = mensaje;
    container.insertAdjacentElement("afterend", span);
  }
}

/** Quita borde rojo + mensaje de error */
function limpiarError(field) {
  field.classList.remove(BORDER_ERROR);
  field.classList.add(BORDER_DEFAULT);

  const container = getErrorContainer(field);
  const prev = container.parentElement.querySelector(".field-error");
  if (prev) prev.remove();
}

/** Pinta borde verde (campo válido) */
function marcarValido(field) {
  field.classList.remove(BORDER_DEFAULT, BORDER_ERROR);
  field.classList.add(BORDER_SUCCESS);

  const container = getErrorContainer(field);
  const prev = container.parentElement.querySelector(".field-error");
  if (prev) prev.remove();
}

/* ── Campos dinámicos ─────────────────────────────────────────────── */

function camposEstudiante() {
  return `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem;">
      <div class="form-group">
        <label class="form-label">Nombre <span class="req">*</span></label>
        <input type="text" name="nombre" placeholder="Ej. Juan" class="form-input" autocomplete="given-name" />
      </div>
      <div class="form-group">
        <label class="form-label">Apellido <span class="req">*</span></label>
        <input type="text" name="apellido" placeholder="Ej. Pérez" class="form-input" autocomplete="family-name" />
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr auto;gap:.75rem;align-items:end;">
      <div class="form-group">
        <label class="form-label">Carrera</label>
        <input type="text" name="carrera" placeholder="Ej. Ing. en Sistemas" class="form-input" />
      </div>
      <div class="form-group">
        <label class="form-label">Semestre</label>
        <div style="position:relative;">
          <select name="semestre" class="form-select" style="width:90px;">
            <option value="">—</option>
            ${[1,2,3,4,5,6,7,8,9,10,11,12].map(s => `<option value="${s}">${s}°</option>`).join("")}
          </select>
        </div>
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">URL del CV</label>
      <input type="url" name="cv_url" placeholder="https://mi-cv.com (opcional)" class="form-input" />
    </div>

    <div class="form-group">
      <label class="form-label">Acerca de ti</label>
      <textarea name="bio" rows="3" placeholder="Cuéntanos sobre ti (opcional)" class="form-textarea"></textarea>
    </div>
  `;
}

function camposEmpresa() {
  return `
    <div class="form-group">
      <label class="form-label">Nombre de empresa <span class="req">*</span></label>
      <input type="text" name="nombre_empresa" placeholder="Ej. Tech Solutions SA" class="form-input" autocomplete="organization" />
    </div>

    <div class="form-group">
      <label class="form-label">Sector</label>
      <div style="position:relative;">
        <select name="sector" class="form-select">
          <option value="">Seleccionar sector</option>
          <option value="Tecnología">Tecnología</option>
          <option value="Salud">Salud</option>
          <option value="Educación">Educación</option>
          <option value="Finanzas">Finanzas</option>
          <option value="Manufactura">Manufactura</option>
          <option value="Otro">Otro</option>
        </select>
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">Descripción</label>
      <textarea name="descripcion" rows="3" placeholder="Describe tu empresa (opcional)" class="form-textarea"></textarea>
    </div>

    <div class="form-group">
      <label class="form-label">Sitio web</label>
      <input type="url" name="sitio_web" placeholder="https://tu-empresa.com" class="form-input" />
    </div>
  `;
}

/* ── Toggle mostrar/ocultar contraseña ──────────────────────────────── */

function setupPasswordToggle(form) {
  form.querySelectorAll(".toggle-password").forEach(btn => {
    btn.addEventListener("click", () => {
      const input = btn.parentElement.querySelector("input");
      const isPassword = input.type === "password";
      input.type = isPassword ? "text" : "password";
      btn.innerHTML = isPassword ? EYE_CLOSED : EYE_OPEN;
    });
  });
}

/* ── Validación en tiempo real de contraseña ───────────────────────── */

function setupPasswordValidation(form) {
  const password = form.querySelector('[name="password"]');
  const confirm  = form.querySelector('[name="confirmar_password"]');

  // Contenedor de requisitos debajo del wrapper de password
  const passWrapper = password.closest(".password-wrapper");
  const reqContainer = document.createElement("div");
  reqContainer.id = "password-reqs";
  reqContainer.className = "mb-2 text-xs space-y-0.5";
  passWrapper.parentElement.appendChild(reqContainer);

  function renderRequisitos() {
    const val = password.value;
    const checks = [
      { ok: val.length >= 8,           label: "Mínimo 8 caracteres" },
      { ok: /[A-Z]/.test(val),         label: "Al menos una mayúscula" },
      { ok: /[0-9]/.test(val),         label: "Al menos un número" },
    ];

  reqContainer.innerHTML = checks
      .map(c => `
        <div style="display:flex;align-items:center;gap:.35rem;font-size:.78rem;color:${c.ok ? '#166534' : '#991b1b'};">
          <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true">${c.ok ? '<polyline points="20 6 9 17 4 12"/>' : '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>'}</svg>
          <span>${c.label}</span>
        </div>
      `)
      .join("");
  }

  function validarPassword() {
    const val = password.value;

    if (!val) {
      limpiarError(password);
      reqContainer.innerHTML = "";
      return;
    }

    renderRequisitos();

    const esValida = val.length >= 8 && /[A-Z]/.test(val) && /[0-9]/.test(val);

    if (esValida) {
      marcarValido(password);
    } else {
      password.classList.remove(BORDER_DEFAULT, BORDER_SUCCESS);
      password.classList.add(BORDER_ERROR);
    }

    // Si ya hay texto en confirmar, re-validar coincidencia
    if (confirm.value) validarConfirm();
  }

  function validarConfirm() {
    const val = confirm.value;

    if (!val) {
      limpiarError(confirm);
      return;
    }

    if (val !== password.value) {
      mostrarError(confirm, "Las contraseñas no coinciden");
    } else {
      marcarValido(confirm);
    }
  }

  password.addEventListener("input", validarPassword);
  confirm.addEventListener("input", validarConfirm);
}

/* ── Validación completa al enviar ─────────────────────────────────── */

function validarFormularioCompleto(form) {
  const data = Object.fromEntries(new FormData(form));
  let hayErrores = false;

  // Limpiar todos los errores previos
  form.querySelectorAll(`.${BORDER_ERROR}`).forEach(f => limpiarError(f));
  form.querySelectorAll(".field-error").forEach(e => e.remove());

  // Email
  const emailField = form.querySelector('[name="email"]');
  if (!data.email || !data.email.trim()) {
    mostrarError(emailField, "El correo es obligatorio");
    hayErrores = true;
  } else if (!data.email.includes("@") || !data.email.includes(".")) {
    mostrarError(emailField, "Ingresa un correo válido");
    hayErrores = true;
  } else {
    marcarValido(emailField);
  }

  // Password
  const passField = form.querySelector('[name="password"]');
  if (!data.password) {
    mostrarError(passField, "La contraseña es obligatoria");
    hayErrores = true;
  } else if (data.password.length < 8) {
    mostrarError(passField, "Mínimo 8 caracteres");
    hayErrores = true;
  } else if (!/[A-Z]/.test(data.password)) {
    mostrarError(passField, "Debe contener al menos una mayúscula");
    hayErrores = true;
  } else if (!/[0-9]/.test(data.password)) {
    mostrarError(passField, "Debe contener al menos un número");
    hayErrores = true;
  }

  // Confirmar password
  const confirmField = form.querySelector('[name="confirmar_password"]');
  if (!data.confirmar_password) {
    mostrarError(confirmField, "Confirma tu contraseña");
    hayErrores = true;
  } else if (data.password !== data.confirmar_password) {
    mostrarError(confirmField, "Las contraseñas no coinciden");
    hayErrores = true;
  }

  // Campos según rol
  if (data.rol === "estudiante") {
    const nombre = form.querySelector('[name="nombre"]');
    const apellido = form.querySelector('[name="apellido"]');

    if (!data.nombre || !data.nombre.trim()) {
      mostrarError(nombre, "El nombre es obligatorio");
      hayErrores = true;
    }

    if (!data.apellido || !data.apellido.trim()) {
      mostrarError(apellido, "El apellido es obligatorio");
      hayErrores = true;
    }
  }

  if (data.rol === "empresa") {
    const nombreEmpresa = form.querySelector('[name="nombre_empresa"]');
    if (!data.nombre_empresa || !data.nombre_empresa.trim()) {
      mostrarError(nombreEmpresa, "El nombre de empresa es obligatorio");
      hayErrores = true;
    }
  }

  return hayErrores;
}

/* ── Validación en tiempo real de campos requeridos ─────────────────── */

function setupFieldValidation(form) {
  // Email
  const emailField = form.querySelector('[name="email"]');
  emailField.addEventListener("blur", () => {
    const val = emailField.value.trim();
    if (!val) {
      mostrarError(emailField, "El correo es obligatorio");
    } else if (!val.includes("@") || !val.includes(".")) {
      mostrarError(emailField, "Ingresa un correo válido");
    } else {
      marcarValido(emailField);
    }
  });
  emailField.addEventListener("input", () => {
    const val = emailField.value.trim();
    if (val && val.includes("@") && val.includes(".")) {
      marcarValido(emailField);
    }
  });
}

/** Agrega listeners a campos dinámicos requeridos */
function setupDynamicFieldValidation(form, rol) {
  if (rol === "estudiante") {
    ["nombre", "apellido"].forEach(name => {
      const field = form.querySelector(`[name="${name}"]`);
      if (!field) return;

      field.addEventListener("blur", () => {
        if (!field.value.trim()) {
          mostrarError(field, `El ${name} es obligatorio`);
        } else {
          marcarValido(field);
        }
      });

      field.addEventListener("input", () => {
        if (field.value.trim()) marcarValido(field);
      });
    });
  }

  if (rol === "empresa") {
    const field = form.querySelector('[name="nombre_empresa"]');
    if (!field) return;

    field.addEventListener("blur", () => {
      if (!field.value.trim()) {
        mostrarError(field, "El nombre de empresa es obligatorio");
      } else {
        marcarValido(field);
      }
    });

    field.addEventListener("input", () => {
      if (field.value.trim()) marcarValido(field);
    });
  }
}

/* ── Render principal ───────────────────────────────────────────── */

export function renderRegister() {
  setTimeout(() => {
    const form = document.getElementById("form-registro");
    if (!form) return;

    const camposDinamicos = document.getElementById("campos-dinamicos");
    const radios = form.querySelectorAll('input[name="rol"]');
    const btn = form.querySelector("button[type=submit]");

    // Render inicial
    camposDinamicos.innerHTML = camposEstudiante();
    setupPasswordToggle(form);
    setupPasswordValidation(form);
    setupFieldValidation(form);
    setupDynamicFieldValidation(form, "estudiante");

    // Resaltar opción de rol activa
    function actualizarRolVisual() {
      document.querySelectorAll(".rol-option").forEach((el) => {
        const val = el.dataset.val;
        const checked = form.querySelector(`[name="rol"][value="${val}"]`).checked;
        el.style.borderColor = checked ? "var(--primary)" : "var(--border-mid)";
        el.style.background  = checked ? "var(--primary-light)" : "";
      });
    }
    actualizarRolVisual();

    // Cambio dinámico
    radios.forEach((radio) => {
      radio.addEventListener("change", () => {
        const rol = radio.value;
        camposDinamicos.innerHTML =
          rol === "empresa" ? camposEmpresa() : camposEstudiante();

        actualizarRolVisual();
        // Re-registrar validaciones para campos dinámicos
        setupDynamicFieldValidation(form, rol);
      });
    });

    // Submit → validar todo + enviar al backend
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Validar todos los campos
      const hayErrores = validarFormularioCompleto(form);

      if (hayErrores) {
        flash("Hay campos obligatorios sin completar o con errores.", "error");

        // Scroll al primer campo con error
        const primerError = form.querySelector(`.${BORDER_ERROR}`);
        if (primerError) {
          primerError.scrollIntoView({ behavior: "smooth", block: "center" });
          primerError.focus();
        }
        return;
      }

      const data = Object.fromEntries(new FormData(form));

      btn.disabled = true;
      btn.textContent = "Creando cuenta…";
      btn.classList.add("opacity-60", "cursor-not-allowed");

      try {
        await auth.register(data);

        flash("¡Cuenta creada correctamente! Inicia sesión.", "success");
        window.location.hash = "#/login";
      } catch (err) {
        flash(err.message || "Error al registrar. Intenta de nuevo.", "error");
        btn.disabled = false;
        btn.textContent = "Crear cuenta";
        btn.classList.remove("opacity-60", "cursor-not-allowed");
      }
    });
  }, 0);

  return `
    <main style="min-height:calc(100vh - 60px);display:flex;align-items:center;justify-content:center;padding:2rem 1rem;background:var(--bg);">
      <div style="width:100%;max-width:460px;">

        <div style="text-align:center;margin-bottom:1.75rem;">
          <h1 style="font-size:1.5rem;margin-bottom:.3rem;">Crear cuenta</h1>
          <p style="color:var(--muted);font-size:.9rem;">Únete a la plataforma institucional</p>
        </div>

        <div class="card card-body" style="border-radius:14px;box-shadow:0 4px 20px rgba(0,0,0,.08);">
          <form id="form-registro" novalidate>

            <p class="form-label" style="margin-bottom:.6rem;">Tipo de cuenta</p>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem;margin-bottom:1.25rem;">
              <label style="cursor:pointer;">
                <input type="radio" name="rol" value="estudiante" class="sr-only" checked />
                <div class="rol-option" data-val="estudiante" style="border:2px solid var(--border-mid);border-radius:8px;padding:.75rem;text-align:center;transition:border-color .15s,background .15s;">
                  <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24" style="margin:0 auto .4rem;display:block;" aria-hidden="true"><path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                  <span style="font-size:.825rem;font-weight:600;color:var(--navy-mid);">Estudiante</span>
                </div>
              </label>
              <label style="cursor:pointer;">
                <input type="radio" name="rol" value="empresa" class="sr-only" />
                <div class="rol-option" data-val="empresa" style="border:2px solid var(--border-mid);border-radius:8px;padding:.75rem;text-align:center;transition:border-color .15s,background .15s;">
                  <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24" style="margin:0 auto .4rem;display:block;" aria-hidden="true"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16"/><path d="M3 21h18M9 21v-4h6v4"/></svg>
                  <span style="font-size:.825rem;font-weight:600;color:var(--navy-mid);">Empresa</span>
                </div>
              </label>
            </div>

            <div id="campos-dinamicos"></div>

            <div class="form-group">
              <label for="reg-email" class="form-label">Correo electrónico <span class="req">*</span></label>
              <input type="email" id="reg-email" name="email" placeholder="tu@correo.edu"
                class="form-input" autocomplete="email" />
            </div>

            <div class="form-group" style="margin-bottom:.5rem;">
              <label for="reg-password" class="form-label">Contraseña <span class="req">*</span></label>
              <div class="password-wrapper input-wrapper">
                <input type="password" id="reg-password" name="password" placeholder="Mínimo 8 caracteres"
                  class="form-input" autocomplete="new-password" />
                <button type="button" class="toggle-password input-toggle-btn" tabindex="-1" aria-label="Mostrar contraseña">
                  ${EYE_OPEN}
                </button>
              </div>
            </div>

            <div class="form-group" style="margin-bottom:1.5rem;">
              <label for="reg-confirm" class="form-label">Confirmar contraseña <span class="req">*</span></label>
              <div class="password-wrapper input-wrapper">
                <input type="password" id="reg-confirm" name="confirmar_password" placeholder="Repite tu contraseña"
                  class="form-input" autocomplete="new-password" />
                <button type="button" class="toggle-password input-toggle-btn" tabindex="-1" aria-label="Mostrar contraseña">
                  ${EYE_OPEN}
                </button>
              </div>
            </div>

            <button type="submit" class="btn btn-primary btn-lg btn-full">
              Crear cuenta
            </button>

          </form>
        </div>

        <p style="text-align:center;font-size:.88rem;color:var(--muted);margin-top:1.25rem;">
          ¿Ya tienes cuenta?
          <a href="#/login" style="color:var(--primary);font-weight:600;"> Iniciar sesión</a>
        </p>
      </div>
    </main>
  `;
}