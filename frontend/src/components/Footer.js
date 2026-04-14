/**
 * src/components/Footer.js
 */

export function renderFooter() {
  return `
    <footer style="background:#0f172a;border-top:1px solid rgba(255,255,255,.06);padding:2.5rem 1.5rem;margin-top:auto;">
      <div style="max-width:1100px;margin:0 auto;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:1rem;">
        <div style="display:flex;align-items:center;gap:0.6rem;">
          <svg width="22" height="22" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect width="26" height="26" rx="6" fill="#2563eb"/>
            <path d="M5 20V10.5l8-4.5 8 4.5V20" stroke="#fff" stroke-width="2" stroke-linejoin="round"/>
            <rect x="9" y="13" width="8" height="7" rx="1" stroke="#fff" stroke-width="1.75"/>
          </svg>
          <div>
            <p style="font-weight:600;font-size:.875rem;color:#f1f5f9;line-height:1.2;">Bolsa de Trabajo</p>
            <p style="font-size:.72rem;color:#475569;">Prácticas Profesionales</p>
          </div>
        </div>
        <div style="text-align:right;">
          <p style="font-size:.8rem;color:#475569;">&copy; ${new Date().getFullYear()} Plataforma institucional &mdash; uso académico</p>
        </div>
      </div>
    </footer>
  `;
}
