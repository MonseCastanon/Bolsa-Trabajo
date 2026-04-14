/**
 * src/pages/Home.js — Página de inicio (landing pública).
 * Diseño profesional para bolsa de trabajo. Sin emojis.
 */

import { renderFooter } from "../components/Footer.js";
import { vacantes }     from "../services/api.js";

export async function renderHome() {
  let ultimasVacantes = [];
  try {
    const res = await vacantes.listar();
    ultimasVacantes = res.vacantes.slice(0, 6);
  } catch {
    // API no disponible — mostramos sección vacía
  }

  const vacantesHtml = ultimasVacantes.length
    ? ultimasVacantes.map((v) => `
        <article class="vacante-card"
             onclick="window.location.hash='#/vacantes/${v.id}'"
             role="button" tabindex="0"
             aria-label="Ver vacante: ${v.titulo}"
             onkeydown="if(event.key==='Enter')window.location.hash='#/vacantes/${v.id}'">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:.5rem;">
            <h3 class="vc-title">${v.titulo}</h3>
            <span class="badge ${v.tipo === 'empleo' ? 'badge-empleo' : 'badge-practica'}">${v.tipo === 'empleo' ? 'Empleo' : 'Prácticas'}</span>
          </div>
          <div class="vc-meta">
            <span class="badge ${v.modalidad === 'presencial' ? 'badge-presencial' : v.modalidad === 'remoto' ? 'badge-remoto' : 'badge-hibrido'}">
              ${v.modalidad.charAt(0).toUpperCase() + v.modalidad.slice(1)}
            </span>
          </div>
        </article>
      `).join("")
    : `<p style="color:var(--muted);font-size:.9rem;grid-column:1/-1;text-align:center;padding:2rem 0;">No hay vacantes disponibles en este momento.</p>`;

  return `
    <main>
      <!-- Hero -->
      <section class="hero">
        <div class="hero-content">
          <div style="display:inline-flex;align-items:center;gap:.5rem;background:rgba(37,99,235,.2);border:1px solid rgba(37,99,235,.35);border-radius:99px;padding:.3rem .9rem;font-size:.78rem;font-weight:600;color:#93c5fd;letter-spacing:.04em;margin-bottom:1.5rem;text-transform:uppercase;">
            Plataforma institucional
          </div>
          <h1>Conecta tu talento<br>con las mejores oportunidades</h1>
          <p>Plataforma centralizada de vacantes laborales y prácticas profesionales para estudiantes y empresas de la institución.</p>
          <div class="hero-actions">
            <a href="#/vacantes" class="btn btn-primary btn-lg">
              <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              Explorar vacantes
            </a>
            <a href="#/registro" class="btn btn-lg" style="background:rgba(255,255,255,.1);border:1.5px solid rgba(255,255,255,.25);color:#fff;">
              Crear cuenta gratis
            </a>
          </div>
        </div>
      </section>

      <!-- Stats bar -->
      <section style="background:#fff;border-bottom:1px solid #e2e8f0;">
        <div style="max-width:1100px;margin:0 auto;padding:1.5rem;display:flex;flex-wrap:wrap;gap:2rem;justify-content:center;">
          <div style="text-align:center;">
            <p style="font-size:1.5rem;font-weight:700;color:#1d4ed8;line-height:1;">${ultimasVacantes.length}+</p>
            <p style="font-size:.78rem;color:#64748b;font-weight:500;">Vacantes activas</p>
          </div>
          <div style="width:1px;background:#e2e8f0;align-self:stretch;"></div>
          <div style="text-align:center;">
            <p style="font-size:1.5rem;font-weight:700;color:#1d4ed8;line-height:1;">2</p>
            <p style="font-size:.78rem;color:#64748b;font-weight:500;">Tipos: empleo y prácticas</p>
          </div>
          <div style="width:1px;background:#e2e8f0;align-self:stretch;"></div>
          <div style="text-align:center;">
            <p style="font-size:1.5rem;font-weight:700;color:#1d4ed8;line-height:1;">100%</p>
            <p style="font-size:.78rem;color:#64748b;font-weight:500;">Seguimiento en línea</p>
          </div>
        </div>
      </section>

      <!-- Últimas vacantes -->
      <section style="max-width:1100px;margin:0 auto;padding:3rem 1.5rem;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.5rem;flex-wrap:wrap;gap:1rem;">
          <div>
            <h2 style="margin-bottom:.25rem;">Oportunidades recientes</h2>
            <p style="font-size:.875rem;color:var(--muted);">Las vacantes más recientes publicadas en la plataforma</p>
          </div>
          <a href="#/vacantes" class="btn btn-secondary btn-sm">
            Ver todas
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </a>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1rem;">
          ${vacantesHtml}
        </div>
      </section>

      <!-- Cómo funciona -->
      <section style="background:var(--bg-subtle);border-top:1px solid var(--border);border-bottom:1px solid var(--border);padding:4rem 1.5rem;">
        <div style="max-width:900px;margin:0 auto;">
          <h2 style="text-align:center;margin-bottom:.5rem;">¿Cómo funciona?</h2>
          <p style="text-align:center;color:var(--muted);font-size:.9rem;margin-bottom:3rem;">Tres pasos para encontrar o publicar una oportunidad</p>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1.5rem;">

            <div style="background:#fff;border:1px solid var(--border);border-radius:12px;padding:1.75rem;box-shadow:0 1px 4px rgba(0,0,0,.05);">
              <div style="width:44px;height:44px;background:#eff6ff;border-radius:10px;display:flex;align-items:center;justify-content:center;margin-bottom:1.1rem;">
                <svg width="22" height="22" fill="none" stroke="#2563eb" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              </div>
              <h3 style="font-size:1rem;margin-bottom:.4rem;">Para estudiantes</h3>
              <p style="font-size:.875rem;color:var(--muted);line-height:1.6;">Crea tu perfil académico, explora vacantes activas y postúlate con un clic. Seguimiento del estado en tiempo real.</p>
            </div>

            <div style="background:#fff;border:1px solid var(--border);border-radius:12px;padding:1.75rem;box-shadow:0 1px 4px rgba(0,0,0,.05);">
              <div style="width:44px;height:44px;background:#f0fdf4;border-radius:10px;display:flex;align-items:center;justify-content:center;margin-bottom:1.1rem;">
                <svg width="22" height="22" fill="none" stroke="#16a34a" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
              </div>
              <h3 style="font-size:1rem;margin-bottom:.4rem;">Para empresas</h3>
              <p style="font-size:.875rem;color:var(--muted);line-height:1.6;">Publica vacantes de empleo o prácticas, recibe postulaciones y gestiona candidatos desde tu panel.</p>
            </div>

            <div style="background:#fff;border:1px solid var(--border);border-radius:12px;padding:1.75rem;box-shadow:0 1px 4px rgba(0,0,0,.05);">
              <div style="width:44px;height:44px;background:#faf5ff;border-radius:10px;display:flex;align-items:center;justify-content:center;margin-bottom:1.1rem;">
                <svg width="22" height="22" fill="none" stroke="#7c3aed" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              </div>
              <h3 style="font-size:1rem;margin-bottom:.4rem;">Seguimiento completo</h3>
              <p style="font-size:.875rem;color:var(--muted);line-height:1.6;">Cada postulación tiene estados claros: pendiente, revisado, aceptado o rechazado. Sin incertidumbre.</p>
            </div>

          </div>
        </div>
      </section>

      <!-- CTA final -->
      <section style="padding:4rem 1.5rem;text-align:center;background:#fff;">
        <h2 style="margin-bottom:.5rem;">¿Listo para comenzar?</h2>
        <p style="color:var(--muted);font-size:.9rem;margin-bottom:1.75rem;max-width:450px;margin-left:auto;margin-right:auto;">Únete a la plataforma institucional y conecta con oportunidades reales.</p>
        <div style="display:flex;gap:.75rem;justify-content:center;flex-wrap:wrap;">
          <a href="#/registro" class="btn btn-primary btn-lg">Registrarse ahora</a>
          <a href="#/login"    class="btn btn-secondary btn-lg">Ya tengo cuenta</a>
        </div>
      </section>
    </main>
    ${renderFooter()}
  `;
}
