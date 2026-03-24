/**
 * src/components/FlashMessage.js
 *
 * Muestra notificaciones tipo toast/alert en el frontend.
 * Reemplaza los flash messages de Jinja2 para la SPA en JS.
 *
 * Uso:
 *   import { flash } from "./components/FlashMessage.js";
 *   flash("Registro exitoso", "success");
 *   flash("Credenciales incorrectas", "error");
 */

export function flash(mensaje, tipo = "info") {
  const tipos = {
    success: "flash-success",
    error: "flash-error",
    warning: "flash-warning",
    info: "flash-info",
  };

  const clase = tipos[tipo] || tipos.info;

  const container = document.createElement("div");
  container.className = `flash ${clase} fixed top-4 right-4 z-50 shadow-lg max-w-sm`;
  container.textContent = mensaje;

  document.body.appendChild(container);

  // Auto-remover tras 4 segundos
  setTimeout(() => {
    container.style.opacity = "0";
    container.style.transition = "opacity 0.3s";
    setTimeout(() => container.remove(), 300);
  }, 4000);
}
