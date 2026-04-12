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
    <div class="grid grid-cols-2 gap-3 mb-4">
      <div>
        <label class="${LABEL_CLASS}">Nombre <span class="text-red-500">*</span></label>
        <input type="text" name="nombre" placeholder="Ej. Juan"
          class="w-full border ${BORDER_DEFAULT} rounded-lg px-3 py-2 text-sm transition-colors duration-200" />
      </div>
      <div>
        <label class="${LABEL_CLASS}">Apellido <span class="text-red-500">*</span></label>
        <input type="text" name="apellido" placeholder="Ej. Pérez"
          class="w-full border ${BORDER_DEFAULT} rounded-lg px-3 py-2 text-sm transition-colors duration-200" />
      </div>
    </div>

    <div class="grid grid-cols-2 gap-3 mb-4">
      <div>
        <label class="${LABEL_CLASS}">Carrera</label>
        <input type="text" name="carrera" placeholder="Ej. Ing. en Sistemas"
          class="w-full border ${BORDER_DEFAULT} rounded-lg px-3 py-2 text-sm transition-colors duration-200" />
      </div>
      <div>
        <label class="${LABEL_CLASS}">Semestre</label>
        <select name="semestre"
          class="w-full border ${BORDER_DEFAULT} rounded-lg px-3 py-2 text-sm bg-white transition-colors duration-200">
          <option value="">Seleccionar</option>
          ${[1,2,3,4,5,6,7,8,9,10,11,12].map(s => `<option value="${s}">${s}°</option>`).join("")}
        </select>
      </div>
    </div>

    <div class="mb-4">
      <label class="${LABEL_CLASS}">Link CV</label>
      <input type="url" name="cv_url" placeholder="https://mi-cv.com (opcional)"
        class="w-full border ${BORDER_DEFAULT} rounded-lg px-3 py-2 text-sm transition-colors duration-200" />
    </div>

    <div class="mb-4">
      <label class="${LABEL_CLASS}">Acerca de ti</label>
      <textarea name="bio" rows="3" placeholder="Cuéntanos sobre ti (opcional)"
        class="w-full border ${BORDER_DEFAULT} rounded-lg px-3 py-2 text-sm resize-none transition-colors duration-200"></textarea>
    </div>
  `;
}

function camposEmpresa() {
  return `
    <div class="mb-4">
      <label class="${LABEL_CLASS}">Nombre de empresa <span class="text-red-500">*</span></label>
      <input type="text" name="nombre_empresa" placeholder="Ej. Tech Solutions SA"
        class="w-full border ${BORDER_DEFAULT} rounded-lg px-3 py-2 text-sm transition-colors duration-200" />
    </div>

    <div class="mb-4">
      <label class="${LABEL_CLASS}">Sector</label>
      <select name="sector"
        class="w-full border ${BORDER_DEFAULT} rounded-lg px-3 py-2 text-sm bg-white transition-colors duration-200">
        <option value="">Seleccionar sector</option>
        <option value="Tecnología">Tecnología</option>
        <option value="Salud">Salud</option>
        <option value="Educación">Educación</option>
        <option value="Finanzas">Finanzas</option>
        <option value="Otro">Otro</option>
      </select>
    </div>

    <div class="mb-4">
      <label class="${LABEL_CLASS}">Descripción</label>
      <textarea name="descripcion" rows="3" placeholder="Describe tu empresa (opcional)"
        class="w-full border ${BORDER_DEFAULT} rounded-lg px-3 py-2 text-sm resize-none transition-colors duration-200"></textarea>
    </div>

    <div class="mb-4">
      <label class="${LABEL_CLASS}">Sitio web</label>
      <input type="url" name="sitio_web" placeholder="https://tu-empresa.com (opcional)"
        class="w-full border ${BORDER_DEFAULT} rounded-lg px-3 py-2 text-sm transition-colors duration-200" />
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
        <div class="flex items-center gap-1 ${c.ok ? "text-green-600" : "text-red-500"}">
          <span>${c.ok ? "✓" : "✗"}</span>
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

    // Cambio dinámico
    radios.forEach((radio) => {
      radio.addEventListener("change", () => {
        const rol = radio.value;
        camposDinamicos.innerHTML =
          rol === "empresa" ? camposEmpresa() : camposEstudiante();

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
    <main class="flex items-center justify-center min-h-[80vh] px-4 py-10 bg-gray-50">
      <div class="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-sm p-8">

        <h1 class="text-2xl font-bold text-gray-900 mb-1">Crear cuenta</h1>
        <p class="text-sm text-gray-500 mb-6">Elige tu tipo de cuenta</p>

        <form id="form-registro" novalidate>

          <div class="mb-5 grid grid-cols-2 gap-2">
            <label class="cursor-pointer">
              <input type="radio" name="rol" value="estudiante" class="sr-only peer" checked />
              <div class="border-2 rounded-lg p-3 text-center text-sm peer-checked:border-blue-500 peer-checked:bg-blue-50 transition-colors duration-200">
                🎓 Estudiante
              </div>
            </label>
            <label class="cursor-pointer">
              <input type="radio" name="rol" value="empresa" class="sr-only peer" />
              <div class="border-2 rounded-lg p-3 text-center text-sm peer-checked:border-blue-500 peer-checked:bg-blue-50 transition-colors duration-200">
                🏢 Empresa
              </div>
            </label>
          </div>

          <div id="campos-dinamicos"></div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Correo electrónico <span class="text-red-500">*</span></label>
            <input type="email" name="email" placeholder="ejemplo@correo.com"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm transition-colors duration-200" />
          </div>

          <div class="mb-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña <span class="text-red-500">*</span></label>
            <div class="password-wrapper relative">
              <input type="password" name="password" placeholder="Mínimo 8 caracteres"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm transition-colors duration-200"
                style="-webkit-appearance:none;" />
              <button type="button" class="toggle-password absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded transition-colors" style="background:transparent;border:none;outline:none;cursor:pointer;" tabindex="-1">
                ${EYE_OPEN}
              </button>
            </div>
          </div>

          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-1">Confirmar contraseña <span class="text-red-500">*</span></label>
            <div class="password-wrapper relative">
              <input type="password" name="confirmar_password" placeholder="Repite tu contraseña"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm transition-colors duration-200"
                style="-webkit-appearance:none;" />
              <button type="button" class="toggle-password absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded transition-colors" style="background:transparent;border:none;outline:none;cursor:pointer;" tabindex="-1">
                ${EYE_OPEN}
              </button>
            </div>
          </div>

          <button type="submit"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-all duration-200">
            Crear cuenta
          </button>
        </form>
      </div>
    </main>
  `;
}