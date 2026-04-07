import { empresas } from "../services/api.js";
import { flash } from "../components/FlashMessage.js";

export async function renderPerfilEmpresa() {
    let empresa = {};
    try {
        const res = await empresas.miPerfil();
        empresa = res.empresa;
    } catch(e) {
        return `<main class="p-10 text-center text-red-500">Error al cargar perfil</main>`
    }

    setTimeout(() => {
        const form = document.getElementById("perfil-empresa-form");
        if(form) {
            form.addEventListener("submit", async(e) => {
                e.preventDefault();
                const btn = form.querySelector('button[type="submit"]');
                btn.disabled = true;
                btn.textContent = "Guardando...";
                try {
                    await empresas.editarPerfil({
                        nombre: form.nombre.value,
                        sector: form.sector.value,
                        descripcion: form.descripcion.value,
                        sitio_web: form.sitio_web.value,
                        logo_url: ""
                    });
                    flash("Perfil actualizado correctamente", "success");
                } catch(error) {
                    flash(error.message, "error");
                } finally {
                    btn.disabled = false;
                    btn.textContent = "Guardar";
                }
            })
        }
    }, 0);

    let html = `
    <main class="max-w-3xl mx-auto px-6 py-10">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Editar mi perfil empresarial</h2>
        <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <form id="perfil-empresa-form">
                <div class="mb-4">
                    <label for="nombre" class="block text-sm font-medium text-gray-700 mb-1">Nombre Comercial</label>
                    <input type="text" id="nombre" name="nombre" value="${empresa.nombre || ''}" class="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-indigo-500 outline-none">
                </div>
                <div class="mb-4">
                    <label for="sector" class="block text-sm font-medium text-gray-700 mb-1">Sector (e.g. Tecnología, Salud)</label>
                    <input type="text" id="sector" name="sector" value="${empresa.sector || ''}" class="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-indigo-500 outline-none">
                </div>
                <div class="mb-4">
                    <label for="descripcion" class="block text-sm font-medium text-gray-700 mb-1">Descripción corporativa</label>
                    <textarea id="descripcion" name="descripcion" class="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 h-24 focus:ring-indigo-500 outline-none">${empresa.descripcion || ''}</textarea>
                </div>
                <div class="mb-6">
                    <label for="sitio_web" class="block text-sm font-medium text-gray-700 mb-1">Sitio web / LinkedIn</label>
                    <input type="url" id="sitio_web" name="sitio_web" value="${empresa.sitio_web || ''}" class="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-indigo-500 outline-none">
                </div>
                <button type="submit" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md shadow-sm transition">
                    Guardar cambios
                </button>
            </form>
        </div>
    </main>
    `
    return html
}
