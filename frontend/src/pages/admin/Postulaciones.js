import { admin } from "../../services/api.js"
import { estado } from "../../main.js"

export async function renderAdminPostulaciones() {
    if (!estado.usuario || estado.usuario.rol !== 'admin'){
        window.location.hash = '#/login'
        return ""
    }

    let postulaciones = []
    try {
        const res = await admin.listarPostulaciones()
        postulaciones = res.postulaciones || []
    } catch (e) {
        console.error(e)
    }
    
    let html = `
    <main class="max-w-5xl mx-auto px-6 py-10">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Postulaciones</h2>
        <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <table class="w-full text-left border-collapse">
                <thead class="bg-gray-50 text-xs text-gray-500 uppercase border-b border-gray-200">
                    <tr>
                        <th class="px-4 py-3">ID</th>
                        <th class="px-4 py-3">Estudiante ID</th>
                        <th class="px-4 py-3">Vacante ID</th>
                        <th class="px-4 py-3">Fecha</th>
                        <th class="px-4 py-3">Estado</th>
                        <th class="px-4 py-3 text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                    ${postulaciones.map(postulacion => `
                        <tr class="hover:bg-gray-50 transition">
                            <td class="px-4 py-3 text-sm">${postulacion.id}</td>
                            <td class="px-4 py-3 text-sm text-gray-900">${postulacion.postulante_id || postulacion.estudiante}</td>
                            <td class="px-4 py-3 text-sm text-gray-900">${postulacion.vacante_id || postulacion.vacante}</td>
                            <td class="px-4 py-3 text-sm text-gray-600">${new Date(postulacion.fecha_postulacion || postulacion.fecha).toLocaleDateString()}</td>
                            <td class="px-4 py-3 text-sm font-medium ${postulacion.estado === 'pendiente' ? 'text-yellow-600' : 'text-blue-600'}">
                                ${postulacion.estado}
                            </td>
                            <td class="px-4 py-3 text-sm text-center">
                                <button onclick="window.togglePostulacion(${postulacion.id})" class="text-indigo-600 hover:text-indigo-900 font-medium bg-indigo-50 px-3 py-1 rounded-md transition hover:bg-indigo-100">Toggle</button>
                            </td>
                        </tr>
                    `).join('')}
                    ${postulaciones.length === 0 ? '<tr><td colspan="6" class="px-4 py-8 text-center text-gray-500">No hay postulaciones.</td></tr>' : ''}
                </tbody>
            </table>
        </div>
    </main>
    `

    if (!window.togglePostulacion) {
        window.togglePostulacion = async function(id) {
            try {
                await admin.togglePostulacion(id)
                window.location.reload()
            } catch (e) {
                alert("Error al cambiar estado")
            }
        }
    }

    return html
}