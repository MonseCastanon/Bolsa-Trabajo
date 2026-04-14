import { vacantes, postulaciones } from "../services/api.js";
import { renderFooter } from "../components/Footer.js";
import { flash } from "../components/FlashMessage.js";

export async function renderCandidatos() {
  let listaVacantes = [];
  let contenido = "";

  try {
    // 1. Obtener vacantes de la empresa
    const resVacantes = await vacantes.listar();
    listaVacantes = resVacantes.vacantes;

    // 2. Por cada vacante → obtener candidatos
    for (const v of listaVacantes) {
      try {
        const res = await postulaciones.candidatosPorVacante(v.id);
        const candidatos = res.candidatos || [];

        if (!candidatos.length) continue;

        contenido += `
          <div class="mb-8">
            <h2 class="font-semibold text-lg mb-3 text-gray-800">
              ${v.titulo}
            </h2>

            <div class="bg-white border rounded-xl overflow-hidden">
              <table class="w-full text-sm">
                <thead class="bg-gray-50 text-gray-500 uppercase text-xs">
                  <tr>
                    <th class="px-4 py-2 text-left">Candidato</th>
                    <th class="px-4 py-2 text-left">Mensaje</th>
                    <th class="px-4 py-2 text-left">Estado</th>
                    <th class="px-4 py-2 text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  ${candidatos.map(c => `
                    <tr class="border-t">
                      <td class="px-4 py-2">${c.estudiante_email || "—"}</td>
                      <td class="px-4 py-2">${c.mensaje || "—"}</td>
                      <td class="px-4 py-2 estado-${c.estado}">
                        ${c.estado}
                      </td>
                      <td class="px-4 py-2 flex gap-2">

                        <button data-id="${c.id}" data-estado="aceptado"
                          class="btn-aceptar bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs">
                          Admitir
                        </button>

                        <button data-id="${c.id}" data-estado="rechazado"
                          class="btn-rechazar bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs">
                          Rechazar
                        </button>

                      </td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          </div>
        `;

      } catch (e) {
        console.error(e);
      }
    }

  } catch (e) {
    return `<p class="p-10 text-red-500">${e.message}</p>`;
  }

  if (!contenido) {
    contenido = `<p class="text-gray-400 text-center py-10">
      No hay postulaciones aún.
    </p>`;
  }

  // ── Eventos ──
  setTimeout(() => {
    document.querySelectorAll("[data-id]").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        const estado = btn.dataset.estado;

        try {
          await postulaciones.cambiarEstado(id, estado);
          flash("Estado actualizado", "success");

          // recargar vista
          window.location.hash = "#/candidatos";

        } catch (e) {
          flash(e.message, "error");
        }
      });
    });
  }, 0);

  return `
    <main class="max-w-5xl mx-auto px-6 py-10">
      <h1 class="text-2xl font-bold mb-6">Candidatos</h1>
      ${contenido}
    </main>
    ${renderFooter()}
  `;
}