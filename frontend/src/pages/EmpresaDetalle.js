import { empresas } from "../services/api.js";

export async function renderEmpresaDetalle() {
    const id = window.location.hash.split("/")[2]
    try {
        const res = await empresas.detalle(id)
        const empresa = res.empresa;
        let html = `
        <main class="max-w-4xl mx-auto px-6 py-10">
            <a href="#/empresas" data-route="#/empresas" class="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 mb-4 transition">&larr; Volver al directorio</a>
            <h2 class="text-2xl font-bold text-gray-900 mb-6">${empresa.nombre}</h2>
            <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden p-6">
                ${empresa.logo_url ? `<img src="${empresa.logo_url}" alt="${empresa.nombre}" class="w-24 h-24 object-cover rounded-md mb-4 bg-gray-100">` : ''}
                <p class="text-gray-600 mb-2"><strong>Sector:</strong> ${empresa.sector || '-'}</p>
                <p class="text-gray-600 mb-4"><strong>Descripción:</strong> ${empresa.descripcion || '-'}</p>
                ${empresa.sitio_web ? `<a href="${empresa.sitio_web}" target="_blank" class="text-indigo-600 hover:underline inline-flex items-center">Visitar sitio web</a>` : ''}
            </div>
        </main>
        `
        return html
    } catch(e) {
        return `<main class="p-10 text-center text-red-500">Error al cargar la empresa</main>`
    }
}
