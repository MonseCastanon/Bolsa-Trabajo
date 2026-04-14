/**
 * src/components/VacanteCard.js
 *
 * Tarjeta reutilizable para mostrar una vacante en la lista.
 * Sin emojis — iconos SVG inline.
 */

const MODAL_ICONS = {
  presencial: `<svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16"/><path stroke-linecap="round" stroke-linejoin="round" d="M3 21h18M9 21v-4h6v4"/></svg>`,
  remoto:     `<svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
  hibrido:    `<svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
};

const MODAL_LABELS = {
  presencial: "Presencial",
  remoto:     "Remoto",
  hibrido:    "Híbrido",
};

export function renderVacanteCard(vacante, nombreEmpresa = "") {
  const badgeClase = vacante.tipo === "empleo" ? "badge-empleo" : "badge-practica";
  const badgeLabel = vacante.tipo === "empleo" ? "Empleo" : "Prácticas";

  const modalLabel = MODAL_LABELS[vacante.modalidad] || vacante.modalidad;
  const modalIcon  = MODAL_ICONS[vacante.modalidad]  || "";

  const modalBadge = vacante.modalidad === "presencial"
    ? "badge-presencial"
    : vacante.modalidad === "remoto"
      ? "badge-remoto"
      : "badge-hibrido";

  return `
    <article class="vacante-card"
             onclick="window.location.hash='#/vacantes/${vacante.id}'"
             role="button"
             tabindex="0"
             aria-label="Ver detalle: ${vacante.titulo}"
             onkeydown="if(event.key==='Enter'||event.key===' ')window.location.hash='#/vacantes/${vacante.id}'">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:.5rem;">
        <h3 class="vc-title">${vacante.titulo}</h3>
        <span class="badge ${badgeClase}" style="margin-top:1px;">${badgeLabel}</span>
      </div>

      ${nombreEmpresa ? `<p style="font-size:.825rem;font-weight:500;color:#2563eb;">${nombreEmpresa}</p>` : ""}

      <div class="vc-meta">
        <span class="badge ${modalBadge}" style="display:inline-flex;align-items:center;gap:.3rem;">
          ${modalIcon}${modalLabel}
        </span>
      </div>

      <p class="vc-date">
        Publicada el ${new Date(vacante.publicada_en).toLocaleDateString("es-MX", { year:"numeric", month:"short", day:"numeric" })}
      </p>
    </article>
  `;
}
