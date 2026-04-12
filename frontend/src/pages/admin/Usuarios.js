import { admin } from "../../services/api.js"
import { estado } from "../../main.js"

export async function renderAdminUsuarios() {
    // Validar que el usuario sea admin
    if (!estado.usuario || estado.usuario.rol !== 'admin'){
        window.location.hash = '#/login'
        return ""
    }

    // Obtener la lista de usuarios usando admin.listarUsuarios de api.js
    let usuarios = []
    try {
        const res = await admin.listarUsuarios()
        usuarios = res.usuarios || []
    } catch (e) {
        console.error(e)
    }

    // Renderizar una tabla con usuarios
    let html = `
    <main class="max-w-4xl mx-auto px-6 py-10">
        <a href="#/dashboard" class="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 mb-4 transition">
            &larr; Volver al Dashboard
        </a>
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Usuarios</h2>
        <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <table class="w-full text-left border-collapse">
                <thead class="bg-gray-50 text-xs text-gray-500 uppercase border-b border-gray-200">
                    <tr>
                        <th class="px-4 py-3">ID</th>
                        <th class="px-4 py-3">Email</th>
                        <th class="px-4 py-3">Rol</th>
                        <th class="px-4 py-3">Estado</th>
                        <th class="px-4 py-3 text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                    ${usuarios.map(usuario => `
                        <tr class="hover:bg-gray-50 transition">
                            <td class="px-4 py-3 text-sm">${usuario.id}</td>
                            <td class="px-4 py-3 text-sm text-gray-600">${usuario.email}</td>
                            <td class="px-4 py-3 text-sm text-gray-600">${usuario.rol}</td>
                            <td class="px-4 py-3 text-sm font-medium ${usuario.activo ? 'text-green-600' : 'text-red-600'}">
                                ${usuario.activo ? 'Activo' : 'Inactivo'}
                            </td>
                            <td class="px-4 py-3 text-sm text-center">
                                <button onclick="window.toggleUsuario(${usuario.id})" class="text-indigo-600 hover:text-indigo-900 font-medium bg-indigo-50 px-3 py-1 rounded-md transition hover:bg-indigo-100">Toggle</button>
                            </td>
                        </tr>
                    `).join('')}
                    ${usuarios.length === 0 ? '<tr><td colspan="5" class="px-4 py-8 text-center text-gray-500">No hay usuarios.</td></tr>' : ''}
                </tbody>
            </table>
        </div>
    </main>
    `

    // Siempre reasignamos toggleUsuario para que use el renderAdminUsuarios actualizado
    window.toggleUsuario = async function(id) {
        try {
            await admin.toggleUsuario(id)
            // Re-renderizar solo el componente dentro del #app (sin recargar la página)
            const app = document.getElementById("app")
            if (app) {
                app.innerHTML = await renderAdminUsuarios()
            }
        } catch (e) {
            alert("Error al cambiar estado")
        }
    }

    return html 
}