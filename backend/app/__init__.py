"""
app/__init__.py — Application Factory (create_app).

Monserrat configura este archivo en la semana 1.
Todos los blueprints se registran aquí; los compañeros NUNCA modifican
este archivo sin avisar al equipo primero.

Extensiones inicializadas:
  db, migrate, login_manager, bcrypt
"""

import os
from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager
from flask_bcrypt import Bcrypt
from flask_wtf.csrf import CSRFProtect, CSRFError

from config import config_map

# ─────────────────────────────────────────────
# Extensiones — se instancian sin app todavía
# ─────────────────────────────────────────────

db = SQLAlchemy()
migrate = Migrate()
login_manager = LoginManager()
bcrypt = Bcrypt()
csrf = CSRFProtect()


def create_app(env: str = None) -> Flask:
    app = Flask(__name__)

    # ── Configuración ──────────────────────────────
    env = env or os.environ.get("FLASK_ENV", "development")
    app.config.from_object(config_map.get(env, config_map["default"]))

    # ── Inicializar extensiones con la app ─────────
    db.init_app(app)
    migrate.init_app(app, db)
    login_manager.init_app(app)
    bcrypt.init_app(app)
    csrf.init_app(app)

    # ── CSRF: se elimina aquí, cada blueprint se exime a sí mismo ──
    # (ver csrf.exempt(bp) en cada routes.py)

    @app.errorhandler(CSRFError)
    def handle_csrf_error(e):
        return jsonify({"ok": False, "mensaje": "Token CSRF inválido o ausente."}), 400

    # ── Configuración de Flask-Login ───────────────
    login_manager.login_view = None

    @login_manager.unauthorized_handler
    def unauthorized():
        return jsonify({"ok": False, "mensaje": "Sesión requerida."}), 401

    # ── CORS manual ────────────────────────────────
    @app.after_request
    def add_cors_headers(response):
        frontend_url = app.config.get("FRONTEND_URL", "http://localhost:5173")
        response.headers["Access-Control-Allow-Origin"] = frontend_url
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, X-CSRFToken"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        return response

    # ── Registro de Blueprints ─────────────────────
    from app.auth.routes import auth_bp
    csrf.exempt(auth_bp)                          # ← aquí
    app.register_blueprint(auth_bp, url_prefix="/api/auth")

    from app.vacantes.routes import vacantes_bp
    csrf.exempt(vacantes_bp)                      # ← aquí
    app.register_blueprint(vacantes_bp, url_prefix="/api/vacantes")

    from app.empresas.routes import empresas_bp
    csrf.exempt(empresas_bp)                      # ← aquí
    app.register_blueprint(empresas_bp, url_prefix="/api/empresas")

    from app.perfil.routes import perfil_bp
    csrf.exempt(perfil_bp)                        # ← aquí
    app.register_blueprint(perfil_bp, url_prefix="/api/perfil")

    from app.postulaciones.routes import postulaciones_bp
    csrf.exempt(postulaciones_bp)                 # ← aquí
    app.register_blueprint(postulaciones_bp, url_prefix="/api/postulaciones")

    from app.admin.routes import admin_bp
    csrf.exempt(admin_bp)                         # ← aquí
    app.register_blueprint(admin_bp, url_prefix="/api/admin")

    # ── Health check ───────────────────────────────
    @app.route("/api/health")
    def health():
        return jsonify({"status": "ok", "env": env})

    return app