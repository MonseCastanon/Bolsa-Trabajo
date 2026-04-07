/**
 * src/components/FlashMessage.js
 */

export function flash(mensaje, tipo = "info") {
  const colores = {
    success: { bg: "#dcfce7", border: "#16a34a", color: "#15803d", icon: "✅" },
    error:   { bg: "#fee2e2", border: "#dc2626", color: "#b91c1c", icon: "❌" },
    warning: { bg: "#fef9c3", border: "#ca8a04", color: "#a16207", icon: "⚠️" },
    info:    { bg: "#dbeafe", border: "#2563eb", color: "#1d4ed8", icon: "ℹ️" },
  };

  const estilo = colores[tipo] || colores.info;

  // Calcular posición vertical según cuántos flashes ya hay
  const existentes = document.querySelectorAll(".flash-toast").length;
  const offsetTop = 72 + existentes * 72; // 72px = altura navbar + margen

  const container = document.createElement("div");
  container.className = "flash-toast";
  container.style.cssText = `
    position: fixed;
    top: ${offsetTop}px;
    right: 1.25rem;
    z-index: 999;
    max-width: 360px;
    min-width: 260px;
    background: ${estilo.bg};
    border-left: 4px solid ${estilo.border};
    color: ${estilo.color};
    border-radius: 0.5rem;
    padding: 0.75rem 1rem;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    font-size: 0.875rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    opacity: 1;
    transition: opacity 0.3s ease;
  `;

  container.innerHTML = `
    <span style="font-size:1rem;">${estilo.icon}</span>
    <span>${mensaje}</span>
  `;

  document.body.appendChild(container);

  // Auto-remover tras 4 segundos
  setTimeout(() => {
    container.style.opacity = "0";
    setTimeout(() => container.remove(), 300);
  }, 4000);
}