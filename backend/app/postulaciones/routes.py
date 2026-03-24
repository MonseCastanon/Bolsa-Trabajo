"""
app/postulaciones/routes.py — Blueprint de postulaciones.

Responsable: Gilberto — semana 3.
Dependencia: necesita que Gilberto haya expuesto los modelos en semana 2.

Endpoints planificados:
  POST /api/postulaciones/<vacante_id>       → postularse (solo estudiante)
  DELETE /api/postulaciones/<id>             → retirar postulación
  GET  /api/postulaciones/mis-postulaciones  → vista estudiante
  GET  /api/postulaciones/vacante/<id>       → candidatos por vacante (solo empresa)
  PUT  /api/postulaciones/<id>/estado        → cambiar estado (solo empresa)
"""

from flask import Blueprint, jsonify
from flask_login import login_required, current_user
from app.utils import roles_required
from app.models import Postulacion

postulaciones_bp = Blueprint("postulaciones", __name__)


@postulaciones_bp.route("/mis-postulaciones", methods=["GET"])
@login_required
@roles_required("estudiante")
def mis_postulaciones():
    """Lista de postulaciones del estudiante en sesión."""
    posts = Postulacion.query.filter_by(estudiante_id=current_user.id).all()
    return jsonify({
        "ok": True,
        "postulaciones": [
            {
                "id": p.id,
                "vacante_id": p.vacante_id,
                "estado": p.estado,
                "postulado_en": p.postulado_en.isoformat(),
            }
            for p in posts
        ],
    })


# TODO (Gilberto, semana 3):
#   - POST /<vacante_id> para postularse
#   - DELETE /<id> para retirar postulación
#   - GET /vacante/<id> para candidatos (empresa)
#   - PUT /<id>/estado con CambiarEstadoForm
