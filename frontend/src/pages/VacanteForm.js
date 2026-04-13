import { vacantes } from "../services/api.js";
import { renderFooter } from "../components/Footer.js";
import { flash } from "../components/FlashMessage.js";

export async function renderFormularioVacante(id = null) {
  let vacante = null;

  // ── Si hay ID → estamos editando ──
  if (id) {
    try {
      const res = await vacantes.detalle(id);
      vacante = res.vacante;
    } catch (e) {
      return `<p class="p-10 text-red-500">Error: ${e.message}</p>`;
    }
  }

  const esEdicion = !!vacante;

  // ── Valores iniciales ──
  const valores = {
    titulo: vacante?.titulo || "",
    descripcion: vacante?.descripcion || "",
    requisitos: vacante?.requisitos || "",
    tipo: vacante?.tipo || "empleo",
    modalidad: vacante?.modalidad || "presencial",
    cierra_en: vacante?.cierra_en
      ? vacante.cierra_en.split("T")[0]
      : ""
  };

  // ── Helpers validación ──
  function setError(input, mensaje) {
    input.classList.add("border-red-500");

    let error = input.nextElementSibling;
    if (!error || !error.classList.contains("error-msg")) {
      error = document.createElement("p");
      error.className = "error-msg text-xs text-red-500 mt-1";
      input.parentNode.insertBefore(error, input.nextSibling);
    }

    error.textContent = mensaje;
  }

  function clearError(input) {
    input.classList.remove("border-red-500");

    const error = input.nextElementSibling;
    if (error && error.classList.contains("error-msg")) {
      error.remove();
    }
  }

  // ── Eventos ──
  setTimeout(() => {
    const form = document.getElementById("form-vacante");

    // ── Submit ──
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      let valido = true;

      // Limpiar errores previos
      [...form.elements].forEach(el => clearError(el));

      // Validaciones
      if (!form.titulo.value || form.titulo.value.length < 5) {
        setError(form.titulo, "Mínimo 5 caracteres");
        valido = false;
      }

      if (!form.descripcion.value || form.descripcion.value.length < 10) {
        setError(form.descripcion, "Mínimo 10 caracteres");
        valido = false;
      }

      if (!form.tipo.value) {
        setError(form.tipo, "Selecciona un tipo");
        valido = false;
      }

      if (!form.modalidad.value) {
        setError(form.modalidad, "Selecciona una modalidad");
        valido = false;
      }

      if (!valido) return;

      const data = {
        titulo: form.titulo.value,
        descripcion: form.descripcion.value,
        requisitos: form.requisitos.value,
        tipo: form.tipo.value,
        modalidad: form.modalidad.value,
        cierra_en: form.cierra_en.value || null
      };

      try {
        if (esEdicion) {
          await vacantes.editar(id, data);
          flash("Vacante actualizada correctamente", "success");

          setTimeout(() => {
            window.location.hash = `#/vacantes/${id}`;
          }, 800);

        } else {
          await vacantes.crear(data);
          flash("Vacante creada correctamente", "success");

          setTimeout(() => {
            window.location.hash = "#/vacantes";
          }, 800);
        }

      } catch (err) {
        flash(err.message, "error");
      }
    });

    // ── Cancelar ──
    const btnCancelar = document.getElementById("btn-cancelar");
    if (btnCancelar) {
      btnCancelar.addEventListener("click", (e) => {
        e.preventDefault();

        if (esEdicion) {
          window.location.hash = `#/vacantes/${id}`;
        } else {
          window.location.hash = "#/vacantes";
        }
      });
    }

  }, 0);

  // ── HTML ──
  return `
    <main class="max-w-2xl mx-auto px-6 py-10">
      <h1 class="text-2xl font-bold mb-6">
        ${esEdicion ? "Editar Vacante" : "Nueva Vacante"}
      </h1>

      <form id="form-vacante" class="space-y-4">

        <input name="titulo" placeholder="Título"
          value="${valores.titulo}"
          class="w-full border p-2 rounded" />

        <textarea name="descripcion" placeholder="Descripción"
          class="w-full border p-2 rounded">${valores.descripcion}</textarea>

        <textarea name="requisitos" placeholder="Requisitos"
          class="w-full border p-2 rounded">${valores.requisitos}</textarea>

        <select name="tipo" class="w-full border p-2 rounded">
          <option value="empleo" ${valores.tipo === "empleo" ? "selected" : ""}>Empleo</option>
          <option value="practica" ${valores.tipo === "practica" ? "selected" : ""}>Prácticas</option>
        </select>

        <select name="modalidad" class="w-full border p-2 rounded">
          <option value="presencial" ${valores.modalidad === "presencial" ? "selected" : ""}>Presencial</option>
          <option value="remoto" ${valores.modalidad === "remoto" ? "selected" : ""}>Remoto</option>
          <option value="hibrido" ${valores.modalidad === "hibrido" ? "selected" : ""}>Híbrido</option>
        </select>

        <input type="date" name="cierra_en"
          value="${valores.cierra_en}"
          class="w-full border p-2 rounded" />

        <!-- Botones -->
        <div class="flex justify-end gap-2 pt-4">
          <button
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
            ${esEdicion ? "Actualizar Vacante" : "Crear Vacante"}
          </button>

          <button id="btn-cancelar"
            class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded">
            Cancelar
          </button>
        </div>

      </form>
    </main>
    ${renderFooter()}
  `;
}