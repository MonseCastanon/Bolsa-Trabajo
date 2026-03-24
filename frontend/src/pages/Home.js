/**
 * src/pages/Home.js — Página de inicio (landing pública).
 *
 * Monserrat la deja funcional en semana 1 para que el equipo
 * tenga algo que mostrar mientras trabaja en sus blueprints.
 */

import { renderFooter } from "../components/Footer.js";
import { vacantes } from "../services/api.js";

export async function renderHome() {
  // Cargamos las últimas 3 vacantes para mostrar en el hero
  let ultimasVacantes = [];
  try {
    const res = await vacantes.listar();
    ultimasVacantes = res.vacantes.slice(0, 3);
  } catch {
    // API no disponible aún — mostramos sección vacía
  }

  const vacantesHtml = ultimasVacantes.length
    ? ultimasVacantes.map((v) => `
        <div class="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
             onclick="window.location.hash='#/vacantes/${v.id}'">
          <p class="font-medium text-gray-800">${v.titulo}</p>
          <p class="text-xs text-gray-400 mt-1">${v.tipo} · ${v.modalidad}</p>
        </div>
      `).join("")
    : `<p class="text-gray-400 text-sm">No hay vacantes disponibles aún.</p>`;

  return `
    <main>
      <!-- Hero -->
      <section class="bg-gradient-to-br from-slate-900 to-blue-900 text-white py-20 px-6 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          Encuentra tu próxima oportunidad
        </h1>
        <p class="text-lg text-blue-200 max-w-xl mx-auto mb-8">
          Plataforma centralizada de vacantes laborales y prácticas profesionales
          para estudiantes y empresas.
        </p>
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="#/vacantes"
            class="bg-blue-500 hover:bg-blue-400 text-white font-semibold px-6 py-3 rounded-lg">
            Ver vacantes →
          </a>
          <a href="#/registro"
            class="bg-white text-blue-900 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50">
            Crear cuenta
          </a>
        </div>
      </section>

      <!-- Últimas vacantes -->
      <section class="max-w-4xl mx-auto px-6 py-14">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Oportunidades recientes</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          ${vacantesHtml}
        </div>
        <div class="text-center mt-8">
          <a href="#/vacantes" class="text-blue-600 hover:underline text-sm font-medium">
            Ver todas las vacantes →
          </a>
        </div>
      </section>

      <!-- Cómo funciona -->
      <section class="bg-gray-100 py-14 px-6">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-2xl font-bold text-gray-800 mb-10">¿Cómo funciona?</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div class="text-4xl mb-3">🎓</div>
              <h3 class="font-semibold text-gray-700 mb-1">Estudiantes</h3>
              <p class="text-sm text-gray-500">Crea tu perfil, explora vacantes y postúlate en un clic.</p>
            </div>
            <div>
              <div class="text-4xl mb-3">🏢</div>
              <h3 class="font-semibold text-gray-700 mb-1">Empresas</h3>
              <p class="text-sm text-gray-500">Publica vacantes y recibe candidatos calificados.</p>
            </div>
            <div>
              <div class="text-4xl mb-3">✅</div>
              <h3 class="font-semibold text-gray-700 mb-1">Seguimiento</h3>
              <p class="text-sm text-gray-500">Revisa el estado de cada postulación en tiempo real.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
    ${renderFooter()}
  `;
}
