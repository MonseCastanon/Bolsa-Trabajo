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

from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app import db
from app.utils import roles_required
from app.models import Postulacion, Vacante, Empresa
from sqlalchemy.exc import IntegrityError

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


#   - POST /<vacante_id> para postularse
@postulaciones_bp.route("/<int:vacante_id>", methods=["POST"])
@login_required
@roles_required("estudiante")
def postularse(vacante_id):
    vacante = Vacante.query.get_or_404(vacante_id)

    data = request.get_json()

    nueva = Postulacion(
        estudiante_id=current_user.id,
        vacante_id=vacante.id,
        mensaje=data.get("mensaje")
    )

    try:
        db.session.add(nueva)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"ok": False, "mensaje": "Ya te postulaste a esta vacante"}), 400

    return jsonify({"ok": True, "mensaje": "Postulación enviada"})

#   - DELETE /<id> para retirar postulación
@postulaciones_bp.route("/<int:post_id>", methods=["DELETE"])
@login_required
@roles_required("estudiante")
def retirar_postulacion(post_id):
    p = Postulacion.query.get_or_404(post_id)

    if p.estudiante_id != current_user.id:
        return jsonify({"ok": False, "mensaje": "No puedes eliminar esta postulación"}), 403

    db.session.delete(p)
    db.session.commit()

    return jsonify({"ok": True, "mensaje": "Postulación eliminada"})

#   - GET /vacante/<id> para candidatos (empresa)
@postulaciones_bp.route("/vacante/<int:vacante_id>", methods=["GET"])
@login_required
@roles_required("empresa")
def candidatos(vacante_id):
    vacante = Vacante.query.get_or_404(vacante_id)

    empresa = Empresa.query.filter_by(usuario_id=current_user.id).first()
    if not empresa:
        return jsonify({"ok": False, "mensaje": "Empresa no encontrada"}), 404

    # Solo la empresa duena de la vacante puede ver sus candidatos
    if vacante.empresa_id != empresa.id:
        return jsonify({"ok": False, "mensaje": "No tienes permiso para ver estos candidatos"}), 403

    posts = Postulacion.query.filter_by(vacante_id=vacante_id).all()

    return jsonify({
        "ok": True,
        "candidatos": [
            {
                "id": p.id,
                "estudiante_id": p.estudiante_id,
                "estado": p.estado,
                "mensaje": p.mensaje,
                "postulado_en": p.postulado_en.isoformat(),
            }
            for p in posts
        ],
    })

#   - PUT /<id>/estado con CambiarEstadoForm
@postulaciones_bp.route("/<int:post_id>/estado", methods=["PUT"])
@login_required
@roles_required("empresa")
def cambiar_estado(post_id):
    p = Postulacion.query.get_or_404(post_id)

    empresa = Empresa.query.filter_by(usuario_id=current_user.id).first()
    if not empresa:
        return jsonify({"ok": False, "mensaje": "Empresa no encontrada"}), 404

    vacante = Vacante.query.get(p.vacante_id)
    # Solo la empresa duena de la vacante puede cambiar el estado
    if not vacante or vacante.empresa_id != empresa.id:
        return jsonify({"ok": False, "mensaje": "No tienes permiso para modificar esta postulación"}), 403

    data = request.get_json()
    nuevo_estado = data.get("estado")

    if nuevo_estado not in ["pendiente", "revisado", "aceptado", "rechazado"]:
        return jsonify({"ok": False, "mensaje": "Estado inválido"}), 400

    p.estado = nuevo_estado
    db.session.commit()

    return jsonify({"ok": True, "mensaje": "Estado actualizado"})
