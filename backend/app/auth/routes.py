"""
app/auth/routes.py — Blueprint de autenticación.

Endpoints:
  POST /api/auth/register  → crear cuenta (estudiante | empresa)
  POST /api/auth/login     → iniciar sesión, devuelve JSON
  POST /api/auth/logout    → cerrar sesión
  GET  /api/auth/me        → datos del usuario actual (requiere sesión)

Monserrat implementa esto en la semana 2.
El frontend (Vite + JS) consume estos endpoints vía fetch().
"""

from flask import Blueprint, request, jsonify
from flask_login import login_user, logout_user, login_required, current_user

from app import db, bcrypt
from app.models import Usuario, PerfilEstudiante, Empresa
from app.auth.forms import LoginForm, RegisterForm
from app.utils import roles_required

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
def register():
    """
    Registro de nuevo usuario.
    Espera JSON: { email, password, confirmar_password, rol }
    Crea el perfil vacío correspondiente al rol.
    """
    data = request.get_json()

    # Reutilizamos el form para validación aunque sea una API JSON
    form = RegisterForm(data=data, meta={"csrf": False})

    if not form.validate():
        return jsonify({"ok": False, "errores": form.errors}), 400

    hashed = bcrypt.generate_password_hash(data["password"]).decode("utf-8")
    nuevo_usuario = Usuario(
        email=data["email"],
        password_hash=hashed,
        rol=data["rol"],
    )
    db.session.add(nuevo_usuario)
    db.session.flush()  # obtenemos el id antes de commit

    # Crear perfil vacío según el rol
    if data["rol"] == "estudiante":
        perfil = PerfilEstudiante(
            usuario_id=nuevo_usuario.id,
            nombre="",
            apellido="",
        )
        db.session.add(perfil)
    elif data["rol"] == "empresa":
        empresa = Empresa(
            usuario_id=nuevo_usuario.id,
            nombre="Mi Empresa",
        )
        db.session.add(empresa)

    db.session.commit()

    return jsonify({"ok": True, "mensaje": "Cuenta creada exitosamente."}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    """
    Inicio de sesión.
    Espera JSON: { email, password }
    Devuelve datos básicos del usuario para que el frontend los almacene.
    """
    data = request.get_json()

    form = LoginForm(data=data, meta={"csrf": False})
    if not form.validate():
        return jsonify({"ok": False, "errores": form.errors}), 400

    usuario = Usuario.query.filter_by(email=data["email"]).first()

    if not usuario or not bcrypt.check_password_hash(usuario.password_hash, data["password"]):
        return jsonify({"ok": False, "mensaje": "Credenciales incorrectas."}), 401

    if not usuario.activo:
        return jsonify({"ok": False, "mensaje": "Tu cuenta está desactivada."}), 403

    login_user(usuario)

    return jsonify({
        "ok": True,
        "usuario": {
            "id": usuario.id,
            "email": usuario.email,
            "rol": usuario.rol,
        },
    })


@auth_bp.route("/logout", methods=["POST"])
@login_required
def logout():
    """Cierra la sesión del usuario actual."""
    logout_user()
    return jsonify({"ok": True, "mensaje": "Sesión cerrada."})


@auth_bp.route("/me", methods=["GET"])
@login_required
def me():
    """Devuelve los datos del usuario en sesión."""
    return jsonify({
        "ok": True,
        "usuario": {
            "id": current_user.id,
            "email": current_user.email,
            "rol": current_user.rol,
        },
    })
