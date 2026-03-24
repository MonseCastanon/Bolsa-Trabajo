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
from flask_wtf.csrf import CSRFProtect

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
    """
    Fábrica de la aplicación Flask.

    Parámetro:
        env: nombre del entorno ('development' | 'production').
             Si no se pasa, se lee de la variable FLASK_ENV.
    """

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

    # ── Configuración de Flask-Login ───────────────
    login_manager.login_view = "auth.login"
    login_manager.login_message = "Inicia sesión para continuar."
    login_manager.login_message_category = "warning"

    # ── CORS manual (sin flask-cors extra) ─────────
    # Permite al frontend en Vite (:5173) consumir la API en desarrollo.
    @app.after_request
    def add_cors_headers(response):
        frontend_url = app.config.get("FRONTEND_URL", "http://localhost:5173")
        response.headers["Access-Control-Allow-Origin"] = frontend_url
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, X-CSRFToken"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        return response

    # ── Registro de Blueprints ─────────────────────
    # Auth — Monserrat (semana 2)
    from app.auth.routes import auth_bp
    app.register_blueprint(auth_bp, url_prefix="/api/auth")

    # Vacantes — Gilberto (semana 2)
    from app.vacantes.routes import vacantes_bp
    app.register_blueprint(vacantes_bp, url_prefix="/api/vacantes")

    # Empresas — Juan Diego (semana 2)
    from app.empresas.routes import empresas_bp
    app.register_blueprint(empresas_bp, url_prefix="/api/empresas")

    # Perfil — Monserrat/Gilberto (semana 3)
    from app.perfil.routes import perfil_bp
    app.register_blueprint(perfil_bp, url_prefix="/api/perfil")

    # Postulaciones — Gilberto (semana 3)
    from app.postulaciones.routes import postulaciones_bp
    app.register_blueprint(postulaciones_bp, url_prefix="/api/postulaciones")

    # Admin — Juan Diego (semana 3)
    from app.admin.routes import admin_bp
    app.register_blueprint(admin_bp, url_prefix="/api/admin")

    # ── Health check ───────────────────────────────
    @app.route("/api/health")
    def health():
        return jsonify({"status": "ok", "env": env})

    return app
