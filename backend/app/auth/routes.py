"""
app/auth/routes.py — Blueprint de autenticación.
"""

from flask import Blueprint, request, jsonify
from flask_login import login_user, logout_user, login_required, current_user

from app import db, bcrypt
from app.models import Usuario, PerfilEstudiante, Empresa
from app.auth.forms import LoginForm, RegisterForm
from app.utils import roles_required

auth_bp = Blueprint("auth", __name__)
# ← Sin csrf.exempt aquí, se hace en __init__.py


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
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
    db.session.flush()

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
    data = request.get_json()

    if not data or not data.get("email") or not data.get("password"):
        return jsonify({"ok": False, "mensaje": "Email y contraseña son requeridos."}), 400

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
def logout():
    if not current_user.is_authenticated:
        return jsonify({"ok": False, "mensaje": "No hay sesión activa."}), 401
    logout_user()
    return jsonify({"ok": True, "mensaje": "Sesión cerrada."})


@auth_bp.route("/me", methods=["GET"])
@login_required
def me():
    return jsonify({
        "ok": True,
        "usuario": {
            "id": current_user.id,
            "email": current_user.email,
            "rol": current_user.rol,
        },
    })