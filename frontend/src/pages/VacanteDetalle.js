/**
 * src/pages/VacanteDetalle.js — Detalle de una vacante específica.
 *
 * Gilberto completa el botón "Postularse" en semana 3.
 */

import { vacantes, empresas, postulaciones } from "../services/api.js";
import { estado } from "../main.js";
import { renderFooter } from "../components/Footer.js";
import { flash } from "../components/FlashMessage.js";

export async function renderVacanteDetalle(id) {
  let vacante = null;
  let empresa = null;
  let error = null;

  try {
    const resV = await vacantes.detalle(id);
    vacante = resV.vacante;
    const resE = await empresas.detalle(vacante.empresa_id);
    empresa = resE.empresa;
  } catch (err) {
    error = err.message;
  }

  if (error || !vacante) {
    return `
      <main class="max-w-2xl mx-auto px-6 py-16 text-center">
        <p class="text-red-500">${error || "Vacante no encontrada."}</p>
        <a href="#/vacantes" class="text-blue-600 hover:underline text-sm mt-4 inline-block">← Volver</a>
      </main>
    `;
  }

  const tipoBadge = vacante.tipo === "empleo"
    ? `<span class="badge badge-empleo text-xs px-2 py-0.5 rounded-full">Empleo</span>`
    : `<span class="badge badge-practica text-xs px-2 py-0.5 rounded-full">Prácticas</span>`;

  const botonPostular = estado.estaAutenticado() && estado.usuario.rol === "estudiante"
    ? `<button id="btn-postular"
         class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg text-sm">
         Postularme a esta vacante
       </button>`
    : estado.estaAutenticado()
      ? ""
      : `<a href="#/login"
           class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg text-sm">
           Inicia sesión para postularte
         </a>`;

    let accionesEmpresa = "";

   if (
     estado.estaAutenticado() &&
     estado.usuario.rol === "empresa"
    ) {
    accionesEmpresa = `
      <div class="flex gap-3 mt-4">
        <button id="btn-editar"
         class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded text-sm">
          Editar
        </button>

        <button id="btn-eliminar"
          class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm">
          Cerrar vacante
        </button>
      </div>
   `;
}

   setTimeout(() => {
   const btn = document.getElementById("btn-postular");

   const btnEliminar = document.getElementById("btn-eliminar");
   if (btnEliminar) {
     btnEliminar.addEventListener("click", async () => {
       const confirmar = confirm("¿Seguro que quieres cerrar esta vacante?");
       if (!confirmar) return;

       try {
         await vacantes.eliminar(id);
         flash("Vacante cerrada correctamente", "success");
         window.location.hash = "#/vacantes";
        } catch (e) {
          flash(e.message, "error");
        }
      });
   }

    // ── BOTÓN EDITAR ──
    const btnEditar = document.getElementById("btn-editar");
    if (btnEditar) {
      btnEditar.addEventListener("click", () => {
      window.location.hash = `#/vacantes/${id}/editar`;
    });
   }

   if (!btn) return;
 
   btn.addEventListener("click", async () => {
     try {
       await postulaciones.postularse(id, {
         mensaje: "Estoy interesado en la vacante"
       });
 
       flash("Postulación enviada correctamente", "success");
     } catch (e) {
       flash(e.message, "error");
     }
   });
 }, 0);

  return `
    <main class="max-w-2xl mx-auto px-6 py-10">
      <a href="#/vacantes" class="text-sm text-blue-600 hover:underline">← Volver a vacantes</a>

      <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-8 mt-4">
        <div class="flex items-start justify-between mb-3">
          <h1 class="text-2xl font-bold text-gray-900 leading-tight">${vacante.titulo}</h1>
          ${tipoBadge}
        </div>

        ${empresa ? `
          <p class="text-blue-600 font-medium mb-1">${empresa.nombre}</p>
          <p class="text-sm text-gray-400 mb-4">${empresa.sector || ""}</p>
        ` : ""}

        <div class="flex gap-3 text-xs text-gray-500 mb-6">
          <span class="bg-gray-100 px-2 py-1 rounded">📍 ${vacante.modalidad}</span>
          <span class="bg-gray-100 px-2 py-1 rounded">📅 ${new Date(vacante.publicada_en).toLocaleDateString("es-MX")}</span>
          ${vacante.cierra_en ? `<span class="bg-yellow-50 text-yellow-700 px-2 py-1 rounded">⚠ Cierra: ${new Date(vacante.cierra_en).toLocaleDateString("es-MX")}</span>` : ""}
        </div>

        <section class="mb-6">
          <h2 class="font-semibold text-gray-700 mb-2">Descripción</h2>
          <p class="text-sm text-gray-600 leading-relaxed">${vacante.descripcion}</p>
        </section>

        ${vacante.requisitos ? `
          <section class="mb-8">
            <h2 class="font-semibold text-gray-700 mb-2">Requisitos</h2>
            <p class="text-sm text-gray-600 leading-relaxed">${vacante.requisitos}</p>
          </section>
        ` : ""}

        <div>
         ${botonPostular}
         ${accionesEmpresa}
        </div>
      </div>
    </main>
    ${renderFooter()}
  `;
}
