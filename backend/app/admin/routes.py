"""
app/admin/routes.py — Blueprint de administración.

Responsable: Juan Diego — semana 3.
Dependencia: necesita que Gilberto exponga modelos de vacantes y
             postulaciones antes de semana 3.
TODAS las rutas están protegidas con @roles_required("admin").

Endpoints planificados:
  GET  /api/admin/usuarios              → listar todos los usuarios
  PUT  /api/admin/usuarios/<id>/toggle  → activar/desactivar cuenta
  GET  /api/admin/vacantes              → listar todas las vacantes
  PUT  /api/admin/vacantes/<id>/toggle  → activar/desactivar publicación
  GET  /api/admin/postulaciones         → ver todas las postulaciones
"""

from flask import Blueprint, jsonify
from app.utils import roles_required
from app.models import Usuario, Vacante, Postulacion
from app import db

admin_bp = Blueprint("admin", __name__)


@admin_bp.route("/usuarios", methods=["GET"])
@roles_required("admin")
def listar_usuarios():
    """Lista todos los usuarios del sistema."""
    usuarios = Usuario.query.all()
    return jsonify({
        "ok": True,
        "usuarios": [
            {
                "id": u.id,
                "email": u.email,
                "rol": u.rol,
                "activo": u.activo,
                "creado_en": u.creado_en.isoformat(),
            }
            for u in usuarios
        ],
    })


@admin_bp.route("/usuarios/<int:usuario_id>/toggle", methods=["PUT"])
@roles_required("admin")
def toggle_usuario(usuario_id):
    """Activa o desactiva una cuenta de usuario."""
    u = Usuario.query.get_or_404(usuario_id)
    u.activo = not u.activo
    db.session.commit()
    estado = "activada" if u.activo else "desactivada"
    return jsonify({"ok": True, "mensaje": f"Cuenta {estado}."})


# TODO (Juan Diego, semana 3):
#   - GET  /vacantes
#   - PUT  /vacantes/<id>/toggle
#   - GET  /postulaciones
