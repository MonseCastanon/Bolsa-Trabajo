import { estado } from "../../main.js"
import { renderFooter } from "../../components/Footer.js"

export function renderAdminPanel() {
    // Guard: solo admins
    if (!estado.usuario || estado.usuario.rol !== 'admin') {
        window.location.hash = '#/login'
        return ""
    }

    const { email } = estado.usuario

    return `
    <main class="max-w-3xl mx-auto px-6 py-10">
        <h1 class="text-2xl font-bold text-gray-900 mb-1">Panel Administrador</h1>
        <p class="text-sm text-gray-500 mb-8">${email}</p>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a href="#/admin/usuarios"
               class="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition text-center cursor-pointer">
                <div class="text-3xl mb-2">👥</div>
                <p class="font-semibold text-gray-800">Usuarios</p>
                <p class="text-xs text-gray-400 mt-1">Activar / desactivar cuentas</p>
            </a>
            <a href="#/admin/vacantes"
               class="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition text-center cursor-pointer">
                <div class="text-3xl mb-2">💼</div>
                <p class="font-semibold text-gray-800">Vacantes</p>
                <p class="text-xs text-gray-400 mt-1">Ver y gestionar publicaciones</p>
            </a>
            <a href="#/admin/postulaciones"
               class="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition text-center cursor-pointer">
                <div class="text-3xl mb-2">📬</div>
                <p class="font-semibold text-gray-800">Postulaciones</p>
                <p class="text-xs text-gray-400 mt-1">Ver todas las postulaciones</p>
            </a>
        </div>
    </main>
    ${renderFooter()}
    `
}
