"""
models.py — Todos los modelos SQLAlchemy del proyecto.

REGLA DE ORO (ver imágenes de planificación):
  Solo Monserrat edita este archivo.
  Cualquier cambio se comunica en el grupo ANTES de hacer commit y va por PR.
  Esto evita conflictos de Git en semanas 2 y 3.

Modelos definidos:
  - Usuario    : base de autenticación + rol
  - PerfilEstudiante : datos académicos del estudiante
  - Empresa    : datos públicos de la empresa
  - Vacante    : oferta laboral o de prácticas
  - Postulacion: relación estudiante ↔ vacante con estado
"""

from datetime import datetime
from app import db, login_manager
from flask_login import UserMixin


# ─────────────────────────────────────────────
# Cargador de sesión para Flask-Login
# ─────────────────────────────────────────────

@login_manager.user_loader
def load_user(user_id):
    return Usuario.query.get(int(user_id))


# ─────────────────────────────────────────────
# Modelo: Usuario
# ─────────────────────────────────────────────

class Usuario(db.Model, UserMixin):
    """
    Tabla central de autenticación.
    El campo `rol` determina qué blueprints y vistas puede usar cada persona.
    Roles válidos: 'estudiante' | 'empresa' | 'admin'
    """

    __tablename__ = "usuarios"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    rol = db.Column(db.String(20), nullable=False, default="estudiante")
    activo = db.Column(db.Boolean, default=True)
    creado_en = db.Column(db.DateTime, default=datetime.utcnow)

    # Relaciones — se accede desde el objeto usuario
    perfil_estudiante = db.relationship(
        "PerfilEstudiante", backref="usuario", uselist=False, lazy=True
    )
    empresa = db.relationship(
        "Empresa", backref="usuario", uselist=False, lazy=True
    )
    postulaciones = db.relationship(
        "Postulacion", backref="estudiante", lazy=True
    )

    def __repr__(self):
        return f"<Usuario {self.email} [{self.rol}]>"


# ─────────────────────────────────────────────
# Modelo: PerfilEstudiante
# ─────────────────────────────────────────────

class PerfilEstudiante(db.Model):
    """
    Información académica y profesional del estudiante.
    Se crea automáticamente al registrarse como 'estudiante'.
    Blueprint responsable (semana 3): perfil_bp — parte estudiante.
    """

    __tablename__ = "perfiles_estudiante"

    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey("usuarios.id"), nullable=False)

    nombre = db.Column(db.String(100), nullable=False)
    apellido = db.Column(db.String(100), nullable=False)
    carrera = db.Column(db.String(150))
    semestre = db.Column(db.Integer)
    cv_url = db.Column(db.String(300))  # URL a archivo o link externo
    bio = db.Column(db.Text)
    actualizado_en = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<PerfilEstudiante {self.nombre} {self.apellido}>"


# ─────────────────────────────────────────────
# Modelo: Empresa
# ─────────────────────────────────────────────

class Empresa(db.Model):
    """
    Perfil público de cada empresa registrada.
    Blueprint responsable (semana 2): empresas_bp.
    Juan Diego necesita este modelo antes de arrancar empresas_bp y admin_bp.
    """

    __tablename__ = "empresas"

    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey("usuarios.id"), nullable=False)

    nombre = db.Column(db.String(150), nullable=False)
    descripcion = db.Column(db.Text)
    sector = db.Column(db.String(100))
    sitio_web = db.Column(db.String(200))
    logo_url = db.Column(db.String(300))
    activa = db.Column(db.Boolean, default=True)
    creada_en = db.Column(db.DateTime, default=datetime.utcnow)

    vacantes = db.relationship("Vacante", backref="empresa", lazy=True)

    def __repr__(self):
        return f"<Empresa {self.nombre}>"


# ─────────────────────────────────────────────
# Modelo: Vacante
# ─────────────────────────────────────────────

class Vacante(db.Model):
    """
    Oferta laboral o de prácticas publicada por una empresa.
    Blueprint responsable (semana 2): vacantes_bp — Gilberto.
    Gilberto necesita este modelo (y @roles_required) antes de arrancar.
    tipo: 'empleo' | 'practica'
    estado: 'activa' | 'cerrada' | 'pausada'
    """

    __tablename__ = "vacantes"

    id = db.Column(db.Integer, primary_key=True)
    empresa_id = db.Column(db.Integer, db.ForeignKey("empresas.id"), nullable=False)

    titulo = db.Column(db.String(200), nullable=False)
    descripcion = db.Column(db.Text, nullable=False)
    requisitos = db.Column(db.Text)
    tipo = db.Column(db.String(20), nullable=False, default="empleo")  # 'empleo' | 'practica'
    modalidad = db.Column(db.String(20), default="presencial")         # 'presencial' | 'remoto' | 'hibrido'
    estado = db.Column(db.String(20), default="activa")
    publicada_en = db.Column(db.DateTime, default=datetime.utcnow)
    cierra_en = db.Column(db.DateTime, nullable=True)

    postulaciones = db.relationship("Postulacion", backref="vacante", lazy=True)

    def __repr__(self):
        return f"<Vacante '{self.titulo}' [{self.tipo}]>"


# ─────────────────────────────────────────────
# Modelo: Postulacion
# ─────────────────────────────────────────────

class Postulacion(db.Model):
    """
    Relación entre un estudiante y una vacante.
    Blueprint responsable (semana 3): postulaciones_bp.
    estado: 'pendiente' | 'revisado' | 'aceptado' | 'rechazado'
    """

    __tablename__ = "postulaciones"

    id = db.Column(db.Integer, primary_key=True)
    estudiante_id = db.Column(db.Integer, db.ForeignKey("usuarios.id"), nullable=False)
    vacante_id = db.Column(db.Integer, db.ForeignKey("vacantes.id"), nullable=False)

    estado = db.Column(db.String(20), default="pendiente")
    mensaje = db.Column(db.Text)  # carta de presentación breve
    postulado_en = db.Column(db.DateTime, default=datetime.utcnow)
    actualizado_en = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Restricción: un estudiante solo puede postularse una vez por vacante
    __table_args__ = (
        db.UniqueConstraint("estudiante_id", "vacante_id", name="uq_postulacion"),
    )

    def __repr__(self):
        return f"<Postulacion estudiante={self.estudiante_id} vacante={self.vacante_id} [{self.estado}]>"
