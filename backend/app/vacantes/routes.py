"""
app/vacantes/routes.py — Blueprint de vacantes.

Responsable: Gilberto — semana 2.
Dependencia: necesita Vacante, Postulacion y @roles_required de Monse (día 5, semana 1).

Endpoints planificados:
  GET    /api/vacantes/             → lista pública (con filtro tipo)
  GET    /api/vacantes/<id>         → detalle público
  POST   /api/vacantes/nueva        → crear vacante (solo rol empresa)
  PUT    /api/vacantes/<id>/editar  → editar vacante propia
  POST   /api/vacantes/<id>/eliminar → eliminar vacante propia
"""

from flask import Blueprint, jsonify
from app.models import Vacante

vacantes_bp = Blueprint("vacantes", __name__)


# ── Rutas base (Monserrat deja esqueleto funcional) ─────────────────────────

@vacantes_bp.route("/", methods=["GET"])
def listar():
    """
    Lista pública de vacantes activas.
    Gilberto implementará filtros por tipo (?tipo=empleo | practica) en semana 2.
    """
    vacantes = Vacante.query.filter_by(estado="activa").all()
    return jsonify({
        "ok": True,
        "vacantes": [
            {
                "id": v.id,
                "titulo": v.titulo,
                "tipo": v.tipo,
                "modalidad": v.modalidad,
                "empresa_id": v.empresa_id,
                "publicada_en": v.publicada_en.isoformat(),
            }
            for v in vacantes
        ],
    })


@vacantes_bp.route("/<int:vacante_id>", methods=["GET"])
def detalle(vacante_id):
    """Detalle de una vacante específica."""
    v = Vacante.query.get_or_404(vacante_id)
    return jsonify({
        "ok": True,
        "vacante": {
            "id": v.id,
            "titulo": v.titulo,
            "descripcion": v.descripcion,
            "requisitos": v.requisitos,
            "tipo": v.tipo,
            "modalidad": v.modalidad,
            "estado": v.estado,
            "empresa_id": v.empresa_id,
            "publicada_en": v.publicada_en.isoformat(),
            "cierra_en": v.cierra_en.isoformat() if v.cierra_en else None,
        },
    })


# TODO (Gilberto, semana 2):
#   - POST /nueva con @roles_required("empresa")
#   - PUT /<id>/editar
#   - POST /<id>/eliminar
#   - Filtro por tipo en listar()
