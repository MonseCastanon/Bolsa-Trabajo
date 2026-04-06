"""
app/perfil/routes.py — Blueprint de perfil.

Responsable: Monserrat (parte estudiante).
             Juan Diego agrega editar perfil empresa aquí también.

Endpoints:
  GET  /api/perfil/           → ver perfil del usuario en sesión
  PUT  /api/perfil/estudiante → editar perfil estudiante (solo rol estudiante)
"""

from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user

from app import db
from app.models import PerfilEstudiante, Empresa
from app.perfil.forms import PerfilEstudianteForm
from app.utils import roles_required

perfil_bp = Blueprint("perfil", __name__)


@perfil_bp.route("/", methods=["GET"])
@login_required
def obtener_perfil():
    if current_user.rol == "estudiante":
        perfil = PerfilEstudiante.query.filter_by(usuario_id=current_user.id).first()

        if not perfil:
            return jsonify({"ok": False, "mensaje": "Perfil no encontrado"}), 404

        return jsonify({
            "ok": True,
            "tipo": "estudiante",
            "perfil": {
                "email": current_user.email,
                "nombre": perfil.nombre,
                "apellido": perfil.apellido,
                "carrera": perfil.carrera,
                "semestre": perfil.semestre,
                "bio": perfil.bio,
                "cv_url": perfil.cv_url,
            }
        })

    elif current_user.rol == "empresa":
        return jsonify({"ok": False, "mensaje": "No implementado"}), 403

    return jsonify({"ok": False, "mensaje": "Rol inválido"}), 400


@perfil_bp.route("/estudiante", methods=["PUT"])
@login_required
@roles_required("estudiante")
def editar_perfil_estudiante():
    """
    Actualiza el perfil del estudiante autenticado.
    Espera JSON: { nombre, apellido, carrera, semestre, bio, cv_url }
    Solo accesible para usuarios con rol 'estudiante'.
    """
    data = request.get_json(silent=True) or {}
    form = PerfilEstudianteForm(data=data, meta={"csrf": False})

    if not form.validate():
        return jsonify({"ok": False, "errores": form.errors}), 400

    perfil = PerfilEstudiante.query.filter_by(usuario_id=current_user.id).first()
    if not perfil:
        # No debería ocurrir si el registro crea el perfil vacío, pero lo manejamos
        return jsonify({"ok": False, "mensaje": "Perfil no encontrado."}), 404

    perfil.nombre = form.nombre.data
    perfil.apellido = form.apellido.data
    perfil.carrera = form.carrera.data
    perfil.semestre = form.semestre.data
    perfil.bio = form.bio.data
    perfil.cv_url = form.cv_url.data

    db.session.commit()

    return jsonify({
        "ok": True,
        "mensaje": "Perfil actualizado correctamente.",
        "perfil": {
            "nombre": perfil.nombre,
            "apellido": perfil.apellido,
            "carrera": perfil.carrera,
            "semestre": perfil.semestre,
            "bio": perfil.bio,
            "cv_url": perfil.cv_url,
        },
    })
