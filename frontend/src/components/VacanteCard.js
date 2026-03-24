/**
 * src/components/VacanteCard.js
 *
 * Tarjeta reutilizable para mostrar una vacante en la lista.
 * Gilberto usa este componente en su página Vacantes.js (semana 2).
 *
 * @param {Object} vacante — objeto vacante del API
 * @param {string} nombreEmpresa — nombre de la empresa (opcional)
 * @returns {string} HTML string
 */

export function renderVacanteCard(vacante, nombreEmpresa = "") {
  const badgeClase = vacante.tipo === "empleo" ? "badge-empleo" : "badge-practica";
  const badgeLabel = vacante.tipo === "empleo" ? "Empleo" : "Prácticas";
  const modalidadIcons = { presencial: "🏢", remoto: "🌐", hibrido: "🔀" };
  const iconModalidad = modalidadIcons[vacante.modalidad] || "";

  return `
    <div class="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
         onclick="window.location.hash = '#/vacantes/${vacante.id}'">
      <div class="flex items-start justify-between mb-2">
        <h3 class="font-semibold text-gray-900 text-base leading-snug">${vacante.titulo}</h3>
        <span class="badge ${badgeClase} text-xs font-medium px-2 py-0.5 rounded-full ml-2 whitespace-nowrap">
          ${badgeLabel}
        </span>
      </div>
      ${nombreEmpresa ? `<p class="text-sm text-blue-600 mb-2">${nombreEmpresa}</p>` : ""}
      <p class="text-sm text-gray-500 flex items-center gap-1">
        ${iconModalidad} ${vacante.modalidad.charAt(0).toUpperCase() + vacante.modalidad.slice(1)}
      </p>
      <p class="text-xs text-gray-400 mt-3">
        Publicada: ${new Date(vacante.publicada_en).toLocaleDateString("es-MX")}
      </p>
    </div>
  `;
}
