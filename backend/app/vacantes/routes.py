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

from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.utils import roles_required
from app import db
from app.models import Vacante, Empresa
from datetime import datetime

vacantes_bp = Blueprint("vacantes", __name__)


# ── Rutas base (Monserrat deja esqueleto funcional) ─────────────────────────

@vacantes_bp.route("/", methods=["GET"])
def listar():
    """
    Lista pública de vacantes activas.
    Gilberto implementará filtros por tipo (?tipo=empleo | practica) en semana 2.
    """
    tipo = request.args.get("tipo")  # empleo | practica

    query = Vacante.query.filter_by(estado="activa")

    if tipo:
        query = query.filter_by(tipo=tipo)

    vacantes = query.all()

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


#   - POST /nueva con @roles_required("empresa")
@vacantes_bp.route("/nueva", methods=["POST"])
@login_required
@roles_required("empresa")
def crear_vacante():
    data = request.get_json()

    empresa = Empresa.query.filter_by(usuario_id=current_user.id).first()

    if not empresa:
        return jsonify({"ok": False, "mensaje": "Empresa no encontrada"}), 404

    nueva = Vacante(
        empresa_id=empresa.id,
        titulo=data.get("titulo"),
        descripcion=data.get("descripcion"),
        requisitos=data.get("requisitos"),
        tipo=data.get("tipo", "empleo"),
        modalidad=data.get("modalidad", "presencial"),
        cierra_en=datetime.fromisoformat(data["cierra_en"]) if data.get("cierra_en") else None
    )

    db.session.add(nueva)
    db.session.commit()

    return jsonify({"ok": True, "mensaje": "Vacante creada correctamente"})

#   - PUT /<id>/editar
@vacantes_bp.route("/<int:vacante_id>/editar", methods=["PUT"])
@login_required
@roles_required("empresa")
def editar_vacante(vacante_id):
    v = Vacante.query.get_or_404(vacante_id)

    empresa = Empresa.query.filter_by(usuario_id=current_user.id).first()

    if v.empresa_id != empresa.id:
        return jsonify({"ok": False, "mensaje": "No puedes editar esta vacante"}), 403

    data = request.get_json()

    v.titulo = data.get("titulo", v.titulo)
    v.descripcion = data.get("descripcion", v.descripcion)
    v.requisitos = data.get("requisitos", v.requisitos)
    v.tipo = data.get("tipo", v.tipo)
    v.modalidad = data.get("modalidad", v.modalidad)

    if data.get("cierra_en"):
        v.cierra_en = datetime.fromisoformat(data["cierra_en"])

    db.session.commit()

    return jsonify({"ok": True, "mensaje": "Vacante actualizada"})

#   - POST /<id>/eliminar
@vacantes_bp.route("/<int:vacante_id>/eliminar", methods=["POST"])
@login_required
@roles_required("empresa")
def eliminar_vacante(vacante_id):
    v = Vacante.query.get_or_404(vacante_id)

    empresa = Empresa.query.filter_by(usuario_id=current_user.id).first()

    if v.empresa_id != empresa.id:
        return jsonify({"ok": False, "mensaje": "No puedes eliminar esta vacante"}), 403

    v.estado = "cerrada"  # soft delete
    db.session.commit()

    return jsonify({"ok": True, "mensaje": "Vacante eliminada"})

#   - PUT /<id>/reabrir para volver a activar una vacante cerrada
@vacantes_bp.route("/<int:vacante_id>/reabrir", methods=["PUT"])
@login_required
@roles_required("empresa")
def reabrir_vacante(vacante_id):
    v = Vacante.query.get_or_404(vacante_id)

    empresa = Empresa.query.filter_by(usuario_id=current_user.id).first()

    if v.empresa_id != empresa.id:
        return jsonify({"ok": False, "mensaje": "No puedes modificar esta vacante"}), 403

    v.estado = "activa"
    db.session.commit()

    return jsonify({"ok": True, "mensaje": "Vacante reabierta"})