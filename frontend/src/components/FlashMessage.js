/**
 * src/components/FlashMessage.js
 * Notificaciones toast accesibles — sin emojis, con iconos SVG.
 */

const ICONS_SVG = {
  success: `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>`,
  error:   `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  warning: `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  info:    `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
};

const STYLES_MAP = {
  success: { bg: "#f0fdf4", border: "#166534", bdColor: "#86efac", color: "#166534" },
  error:   { bg: "#fef2f2", border: "#991b1b", bdColor: "#fca5a5", color: "#991b1b" },
  warning: { bg: "#fffbeb", border: "#854d0e", bdColor: "#fde047", color: "#854d0e" },
  info:    { bg: "#eff6ff", border: "#1e40af", bdColor: "#93c5fd", color: "#1e40af" },
};

export function flash(mensaje, tipo = "info") {
  const s = STYLES_MAP[tipo] || STYLES_MAP.info;
  const icon = ICONS_SVG[tipo] || ICONS_SVG.info;

  const existentes = document.querySelectorAll(".flash-toast").length;
  const topOffset  = 72 + existentes * 68;

  const el = document.createElement("div");
  el.className = "flash-toast";
  el.setAttribute("role", "alert");
  el.setAttribute("aria-live", "polite");
  el.style.cssText = `
    position: fixed;
    top: ${topOffset}px;
    right: 1.25rem;
    z-index: 9999;
    max-width: 360px;
    min-width: 280px;
    background: ${s.bg};
    border: 1px solid ${s.bdColor};
    border-left: 4px solid ${s.border};
    color: ${s.color};
    border-radius: 8px;
    padding: 0.8rem 1rem;
    box-shadow: 0 8px 24px rgba(0,0,0,.12);
    font-size: 0.875rem;
    font-family: 'Inter', sans-serif;
    font-weight: 500;
    display: flex;
    align-items: flex-start;
    gap: 0.6rem;
    opacity: 0;
    transform: translateX(16px);
    transition: opacity 0.22s ease, transform 0.22s ease;
  `;

  el.innerHTML = `
    <span style="flex-shrink:0;margin-top:1px;">${icon}</span>
    <span style="flex:1;line-height:1.5;">${mensaje}</span>
    <button onclick="this.parentElement.remove()" style="background:none;border:none;cursor:pointer;color:inherit;opacity:.6;padding:0;flex-shrink:0;line-height:1;" aria-label="Cerrar notificación">
      <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
  `;

  document.body.appendChild(el);
  // Trigger animation
  requestAnimationFrame(() => {
    el.style.opacity = "1";
    el.style.transform = "translateX(0)";
  });

  setTimeout(() => {
    el.style.opacity  = "0";
    el.style.transform = "translateX(16px)";
    setTimeout(() => el.remove(), 250);
  }, 4500);
}