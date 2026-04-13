import { vacantes } from "../services/api.js";
import { renderFooter } from "../components/Footer.js";
import { flash } from "../components/FlashMessage.js";

export function renderNuevaVacante() {

  function setError(input, mensaje) {
    input.classList.remove("border-gray-300", "border-green-500");
    input.classList.add("border-red-500");

    let error = input.nextElementSibling;
    if (!error || !error.classList.contains("error-msg")) {
      error = document.createElement("p");
      error.className = "error-msg text-xs text-red-500 mt-1";
      input.parentNode.appendChild(error);
    }
    error.textContent = mensaje;
  }

  function setSuccess(input) {
    input.classList.remove("border-gray-300", "border-red-500");
    input.classList.add("border-green-500");

    const error = input.nextElementSibling;
    if (error && error.classList.contains("error-msg")) {
      error.remove();
    }
  }

  function validar(form) {
    let valido = true;

    if (!form.titulo.value.trim()) {
      setError(form.titulo, "El título es obligatorio");
      valido = false;
    } else {
      setSuccess(form.titulo);
    }

    if (!form.descripcion.value.trim()) {
      setError(form.descripcion, "La descripción es obligatoria");
      valido = false;
    } else {
      setSuccess(form.descripcion);
    }

    return valido;
  }

  setTimeout(() => {
    const form = document.getElementById("form-vacante");
    if (!form) return;

    // Validación en tiempo real
    ["titulo", "descripcion"].forEach((campo) => {
      form[campo].addEventListener("input", () => {
        if (form[campo].value.trim()) {
          setSuccess(form[campo]);
        }
      });
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (!validar(form)) {
        flash("Corrige los campos marcados", "warning");
        return;
      }

      const data = {
        titulo: form.titulo.value,
        descripcion: form.descripcion.value,
        requisitos: form.requisitos.value,
        tipo: form.tipo.value,
        modalidad: form.modalidad.value,
        cierra_en: form.cierra_en.value || null
      };

      try {
        await vacantes.crear(data);

        flash("Vacante creada correctamente", "success");

        setTimeout(() => {
          window.location.hash = "#/vacantes";
        }, 1200);

      } catch (err) {
        flash(err.message, "error");
      }
    });

  }, 0);

  return `
    <main class="max-w-2xl mx-auto px-6 py-10">
      <a href="#/dashboard" class="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 mb-4 transition">
            &larr; Volver al Dashboard
      </a>
      
      <h1 class="text-2xl font-bold mb-6">Nueva Vacante</h1>

      <form id="form-vacante" class="space-y-4" method="POST" action="javascript:void(0);">

        <div>
          <input name="titulo" placeholder="Título"
            class="w-full border border-gray-300 p-2 rounded" />
        </div>

        <div>
          <textarea name="descripcion" placeholder="Descripción"
            class="w-full border border-gray-300 p-2 rounded"></textarea>
        </div>

        <div>
          <textarea name="requisitos" placeholder="Requisitos"
            class="w-full border border-gray-300 p-2 rounded"></textarea>
        </div>

        <div>
          <select name="tipo" class="w-full border border-gray-300 p-2 rounded">
            <option value="empleo">Empleo</option>
            <option value="practica">Prácticas</option>
          </select>
        </div>

        <div>
          <select name="modalidad" class="w-full border border-gray-300 p-2 rounded">
            <option value="presencial">Presencial</option>
            <option value="remoto">Remoto</option>
            <option value="hibrido">Híbrido</option>
          </select>
        </div>

        <div>
          <input type="date" name="cierra_en"
            class="w-full border border-gray-300 p-2 rounded" />
        </div>

        <button type="submit"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          Crear Vacante
        </button>

      </form>
    </main>
    ${renderFooter()}
  `;
}