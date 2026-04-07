import { empresas } from "../services/api.js";

export async function renderEmpresas() {
    let res = await empresas.listar();
    let lista = res.empresas || [];

    let html = `
    <main class="max-w-5xl mx-auto px-6 py-10">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Directorio de Empresas</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${lista.map(e => `
                <div class="bg-white border text-center border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-md transition">
                    ${e.logo_url ? `<img src="${e.logo_url}" class="w-16 h-16 mx-auto rounded mb-4 object-cover">` : `<div class="w-16 h-16 mx-auto bg-gray-100 rounded mb-4 flex items-center justify-center text-gray-400"><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg></div>`}
                    <h3 class="text-lg font-bold text-gray-900 mb-1">${e.nombre}</h3>
                    <p class="text-sm text-gray-500 mb-4">${e.sector || 'General'}</p>
                    <a href="#/empresas/${e.id}" data-route="#/empresas/${e.id}" class="text-indigo-600 hover:text-indigo-800 text-sm font-medium bg-indigo-50 px-3 py-1.5 rounded inline-block">Ver perfil &rarr;</a>
                </div>
            `).join('')}
            ${lista.length === 0 ? '<p class="col-span-full text-center text-gray-500 py-8">No hay empresas registradas activas en nuestra red.</p>' : ''}
        </div>
    </main>
    `;
    return html;
}


