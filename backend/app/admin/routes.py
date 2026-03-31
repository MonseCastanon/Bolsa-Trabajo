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

@admin_bp.route("/", method=["GET"])
@roles_required("admin")
def admin():
    """Retornar contadores globales de usuarios, vacantes y postulaciones"""
    usuarios = Usuario.query.count()
    vacantes = Vacante.query.count()
    postulaciones = Postulacion.query.count()
    return jsonify({
        "ok": True,
        "usuarios": usuarios,
        "vacantes": vacantes,
        "postulaciones": postulaciones,
    })


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
@admin_bp.route("/vacantes", methos=["GET"])
@roles_required("admin")
def listar_vacantes():
    """Listas todas las vacantes"""
    vacantes = Vacante.query.all()
    return jsonify({
        "ok": True,
        "vacantes": [
            {
                "id": v.id,
                "titulo": v.titulo,
                "empresa_id": v.empresa_id,
                "activo": v.activo,
                "creado_en": v.creado_en.isoformat(),
            }
            for v in vacantes
        ],
    })
#   - PUT  /vacantes/<id>/toggle
@admin_bp.route("/vacantes/<int:vacantes_id>/toggle", method=["PUT"])
@roles_required("admin")
def toggle_vacantes(vacantes_id):
    """Activa o desactiva una vacante """ 
    v = Vacante.query.get_or_404(vacantes_id)
    v.activo = not v.activo
    db.session.commit()
    estado = "activada" if v.activo else "desactivada"
    return jsonify({"ok": True, "mensaje": f"Vacante {estado}."})

#   - GET  /postulaciones
@admin_bp.route("/postulaciones", method=["GET"])
@roles_required("admin")
def listar_postulaciones():
    """Listas todas las postulaciones"""
    postulaciones = Postulacion.query.all()
    return jsonify({
        "ok": True,
        "postulaciones": [
            {
                "id": p.id,
                "vacante_id": p.vacante_id,
                "postulante_id": p.postulante_id,
                "estado": p.estado,
                "fecha_postulacion": p.fecha_postulacion.isoformat(),
            }
            for p in postulaciones
        ],
    })