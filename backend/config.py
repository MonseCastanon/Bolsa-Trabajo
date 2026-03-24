"""
config.py — Configuraciones de la aplicación.

Monserrat crea este archivo en la semana 1 (fundamentos).
Define tres perfiles: base, desarrollo y producción.
"""

import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    """Configuración base compartida por todos los entornos."""

    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-secret-key-insegura")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # CORS: permite al frontend (Vite en :5173) consumir la API
    FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:5173")

    # WTF CSRF — en API pura con JS se puede deshabilitar si se usa JWT,
    # pero lo dejamos activo porque el formulario de login usa sesión Flask.
    WTF_CSRF_ENABLED = True


class DevelopmentConfig(Config):
    """Entorno de desarrollo local."""

    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL", "sqlite:///bolsa_trabajo_dev.db"
    )


class ProductionConfig(Config):
    """Entorno de producción (Render, Railway, etc.)."""

    DEBUG = False
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")

    # En producción la DB_URL de Heroku/Render usa postgres://, SQLAlchemy
    # requiere postgresql://. Corregimos si es necesario.
    if SQLALCHEMY_DATABASE_URI and SQLALCHEMY_DATABASE_URI.startswith("postgres://"):
        SQLALCHEMY_DATABASE_URI = SQLALCHEMY_DATABASE_URI.replace(
            "postgres://", "postgresql://", 1
        )


# Mapa para seleccionar configuración por nombre de entorno
config_map = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "default": DevelopmentConfig,
}
