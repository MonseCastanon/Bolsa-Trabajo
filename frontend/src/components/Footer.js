/**
 * src/components/Footer.js
 */

export function renderFooter() {
  return `
    <footer class="bg-slate-900 text-gray-400 text-center py-6 mt-16 text-sm">
      <p>© ${new Date().getFullYear()} Bolsa de Trabajo y Prácticas Profesionales</p>
      <p class="mt-1 text-xs text-gray-600">Plataforma interna — uso académico</p>
    </footer>
  `;
}
