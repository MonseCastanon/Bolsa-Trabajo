import { admin } from "../../services/api.js"
import { estado } from "../../main.js"

export async function renderAdminVacantes() {
    if (!estado.usuario || estado.usuario.rol !== 'admin'){
        window.location.hash = '#/login'
        return ""
    }

    let vacantes = []
    try {
        const res = await admin.listarVacantes()
        vacantes = res.vacantes || []
    } catch (e) {
        console.error(e)
    }

    let html = `
    <main class="max-w-5xl mx-auto px-6 py-10">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Vacantes</h2>
        <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <table class="w-full text-left border-collapse">
                <thead class="bg-gray-50 text-xs text-gray-500 uppercase border-b border-gray-200">
                    <tr>
                        <th class="px-4 py-3">ID</th>
                        <th class="px-4 py-3">Empresa</th>
                        <th class="px-4 py-3">Título</th>
                        <th class="px-4 py-3">Estado</th>
                        <th class="px-4 py-3 text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                    ${vacantes.map(vacante => `
                        <tr class="hover:bg-gray-50 transition">
                            <td class="px-4 py-3 text-sm">${vacante.id}</td>
                            <td class="px-4 py-3 text-sm font-medium text-gray-900">${vacante.empresa_id || vacante.empresa || '-'}</td>
                            <td class="px-4 py-3 text-sm text-gray-800">${vacante.titulo}</td>
                            <td class="px-4 py-3 text-sm font-medium ${vacante.activo ? 'text-green-600' : 'text-red-600'}">
                                ${vacante.activo ? 'Activa' : 'Inactiva'}
                            </td>
                            <td class="px-4 py-3 text-sm text-center">
                                <button onclick="window.toggleVacante(${vacante.id})" class="text-indigo-600 hover:text-indigo-900 font-medium bg-indigo-50 px-3 py-1 rounded-md transition hover:bg-indigo-100">Toggle</button>
                            </td>
                        </tr>
                    `).join('')}
                    ${vacantes.length === 0 ? '<tr><td colspan="5" class="px-4 py-8 text-center text-gray-500">No hay vacantes publicadas.</td></tr>' : ''}
                </tbody>
            </table>
        </div>
    </main>
    `

    if (!window.toggleVacante) {
        window.toggleVacante = async function(id) {
            try {
                await admin.toggleVacante(id)
                window.location.reload()
            } catch (e) {
                alert("Error al cambiar estado de la vacante")
            }
        }
    }

    return html
}