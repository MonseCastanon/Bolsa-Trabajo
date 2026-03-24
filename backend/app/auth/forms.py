"""
app/auth/forms.py — Formularios de autenticación (WTForms).

Monserrat crea estos formularios en la semana 2 (Blueprint Auth).
"""

from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SelectField, SubmitField
from wtforms.validators import DataRequired, Email, EqualTo, Length, ValidationError
from app.models import Usuario


class LoginForm(FlaskForm):
    """Formulario de inicio de sesión."""

    email = StringField(
        "Correo electrónico",
        validators=[DataRequired(message="El correo es requerido."), Email()],
    )
    password = PasswordField(
        "Contraseña",
        validators=[DataRequired(message="La contraseña es requerida.")],
    )
    submit = SubmitField("Iniciar sesión")


class RegisterForm(FlaskForm):
    """
    Formulario de registro con selector de rol.
    Roles disponibles para registro público: estudiante | empresa.
    El rol 'admin' solo se asigna desde el panel de administración.
    """

    email = StringField(
        "Correo electrónico",
        validators=[
            DataRequired(message="El correo es requerido."),
            Email(message="Ingresa un correo válido."),
        ],
    )
    password = PasswordField(
        "Contraseña",
        validators=[
            DataRequired(),
            Length(min=8, message="Mínimo 8 caracteres."),
        ],
    )
    confirmar_password = PasswordField(
        "Confirmar contraseña",
        validators=[
            DataRequired(),
            EqualTo("password", message="Las contraseñas no coinciden."),
        ],
    )
    rol = SelectField(
        "Tipo de cuenta",
        choices=[("estudiante", "Estudiante"), ("empresa", "Empresa")],
        validators=[DataRequired()],
    )
    submit = SubmitField("Crear cuenta")

    def validate_email(self, field):
        """Verifica que el correo no esté registrado."""
        if Usuario.query.filter_by(email=field.data).first():
            raise ValidationError("Este correo ya está registrado.")
