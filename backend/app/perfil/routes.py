"""
app/perfil/routes.py — Blueprint de perfil.

Responsable: Monserrat (parte estudiante) — semana 3.
             Juan Diego agrega editar perfil empresa aquí también.

Endpoints planificados:
  GET  /api/perfil/           → ver perfil del usuario en sesión
  PUT  /api/perfil/estudiante → editar perfil estudiante
  PUT  /api/perfil/empresa    → editar perfil empresa
"""

from flask import Blueprint, jsonify
from flask_login import login_required, current_user
from app.models import PerfilEstudiante, Empresa

perfil_bp = Blueprint("perfil", __name__)


@perfil_bp.route("/", methods=["GET"])
@login_required
def ver_perfil():
    """Devuelve el perfil del usuario en sesión según su rol."""
    if current_user.rol == "estudiante":
        p = PerfilEstudiante.query.filter_by(usuario_id=current_user.id).first()
        if not p:
            return jsonify({"ok": False, "mensaje": "Perfil no encontrado."}), 404
        return jsonify({
            "ok": True,
            "perfil": {
                "nombre": p.nombre,
                "apellido": p.apellido,
                "carrera": p.carrera,
                "semestre": p.semestre,
                "bio": p.bio,
                "cv_url": p.cv_url,
            },
        })

    elif current_user.rol == "empresa":
        e = Empresa.query.filter_by(usuario_id=current_user.id).first()
        if not e:
            return jsonify({"ok": False, "mensaje": "Perfil no encontrado."}), 404
        return jsonify({
            "ok": True,
            "perfil": {
                "nombre": e.nombre,
                "sector": e.sector,
                "descripcion": e.descripcion,
                "sitio_web": e.sitio_web,
            },
        })

    return jsonify({"ok": False, "mensaje": "Rol sin perfil."}), 400


# TODO (semana 3):
#   - PUT /estudiante con PerfilEstudianteForm
#   - PUT /empresa con PerfilEmpresaForm
