"""
app/utils.py — Utilidades compartidas.

Monserrat define @roles_required aquí en la semana 2.
Gilberto y Juan Diego lo importan para proteger sus blueprints.
Nunca duplicar esta lógica en cada archivo de rutas.

Uso:
    from app.utils import roles_required

    @vacantes_bp.route("/nueva", methods=["POST"])
    @roles_required("empresa")
    def nueva_vacante():
        ...
"""

from functools import wraps
from flask import jsonify
from flask_login import current_user


def roles_required(*roles):
    """
    Decorador que restringe una ruta a uno o varios roles.

    Ejemplo:
        @roles_required("admin")              # solo admin
        @roles_required("empresa", "admin")   # empresa o admin

    Si el usuario no está autenticado devuelve 401.
    Si el usuario no tiene el rol requerido devuelve 403.
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if not current_user.is_authenticated:
                return jsonify({"ok": False, "mensaje": "Inicia sesión para continuar."}), 401
            if current_user.rol not in roles:
                return jsonify({"ok": False, "mensaje": "No tienes permiso para esta acción."}), 403
            return f(*args, **kwargs)
        return decorated_function
    return decorator
