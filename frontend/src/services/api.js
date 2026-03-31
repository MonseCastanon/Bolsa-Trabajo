/**
 * src/services/api.js — Capa de comunicación con el backend Flask.
 *
 * Centraliza todos los fetch() del frontend.
 * Los compañeros importan funciones de aquí; NUNCA escriben fetch()
 * directamente en los componentes de página.
 *
 * Todas las funciones devuelven el JSON parseado o lanzan un Error
 * con el mensaje del servidor.
 *
 * Base URL: en desarrollo Vite hace proxy de /api → localhost:5000
 *           en producción la variable de entorno apunta al backend real.
 */

const BASE_URL = "/api";

// ── Utilidad interna ─────────────────────────────────────────────────────────

async function request(path, options = {}) {
  const defaults = {
    headers: { "Content-Type": "application/json" },
    credentials: "include", // envía cookies de sesión Flask-Login
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...defaults, ...options });
  const data = await res.json();

  if (!res.ok) {
    const msg = data.mensaje || "Error del servidor.";
    throw new Error(msg);
  }

  return data;
}

// ── Auth ─────────────────────────────────────────────────────────────────────

export const auth = {
  register: (payload) =>
    request("/auth/register", { method: "POST", body: JSON.stringify(payload) }),

  login: (payload) =>
    request("/auth/login", { method: "POST", body: JSON.stringify(payload) }),

  logout: () =>
    request("/auth/logout", { method: "POST" }),

  me: () =>
    request("/auth/me"),
};

// ── Vacantes ─────────────────────────────────────────────────────────────────

export const vacantes = {
  listar: (tipo = null) => {
    const qs = tipo ? `?tipo=${tipo}` : "";
    return request(`/vacantes/${qs}`);
  },

  detalle: (id) =>
    request(`/vacantes/${id}`),

  crear: (payload) =>
    request("/vacantes/nueva", { method: "POST", body: JSON.stringify(payload) }),

  editar: (id, payload) =>
    request(`/vacantes/${id}/editar`, { method: "PUT", body: JSON.stringify(payload) }),

  eliminar: (id) =>
    request(`/vacantes/${id}/eliminar`, { method: "POST" }),
};

// ── Empresas ─────────────────────────────────────────────────────────────────

export const empresas = {
  listar: () =>
    request("/empresas/"),

  detalle: (id) =>
    request(`/empresas/${id}`),

  editarPerfil: (payload) =>
    request("/empresas/mi-perfil", { method: "PUT", body: JSON.stringify(payload) }),

  miPerfil: () =>
    request("/empresas/mi-perfil"),
};

// ── Postulaciones ─────────────────────────────────────────────────────────────

export const postulaciones = {
  misPostulaciones: () =>
    request("/postulaciones/mis-postulaciones"),

  postularse: (vacanteId, payload) =>
    request(`/postulaciones/${vacanteId}`, { method: "POST", body: JSON.stringify(payload) }),

  retirar: (id) =>
    request(`/postulaciones/${id}`, { method: "DELETE" }),

  candidatosPorVacante: (vacanteId) =>
    request(`/postulaciones/vacante/${vacanteId}`),

  cambiarEstado: (id, estado) =>
    request(`/postulaciones/${id}/estado`, { method: "PUT", body: JSON.stringify({ estado }) }),
};

// ── Perfil ────────────────────────────────────────────────────────────────────

export const perfil = {
  ver: () =>
    request("/perfil/"),

  editarEstudiante: (payload) =>
    request("/perfil/estudiante", { method: "PUT", body: JSON.stringify(payload) }),

  editarEmpresa: (payload) =>
    request("/perfil/empresa", { method: "PUT", body: JSON.stringify(payload) }),
};

// ── Admin ─────────────────────────────────────────────────────────────────────

export const admin = {
  listarUsuarios: () =>
    request("/admin/usuarios"),

  toggleUsuario: (id) =>
    request(`/admin/usuarios/${id}/toggle`, { method: "PUT" }),

  listarVacantes: () =>
    request("/admin/vacantes"),

  toggleVacante: (id) =>
    request(`/admin/vacantes/${id}/toggle`, { method: "PUT" }),

  listarPostulaciones: () =>
    request("/admin/postulaciones"),

  togglePostulacion: (id) =>
    request(`/admin/postulaciones/${id}/toggle`, { method: "PUT" }),
};
