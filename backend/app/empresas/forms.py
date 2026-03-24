"""
app/empresas/forms.py — Formulario de perfil de empresa.

Responsable: Juan Diego — semana 2.
"""

from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, SubmitField
from wtforms.validators import DataRequired, Length, Optional, URL


class PerfilEmpresaForm(FlaskForm):
    """Formulario para editar el perfil de una empresa."""

    nombre = StringField(
        "Nombre de la empresa",
        validators=[DataRequired(), Length(max=150)],
    )
    sector = StringField(
        "Sector",
        validators=[Optional(), Length(max=100)],
    )
    descripcion = TextAreaField(
        "Descripción",
        validators=[Optional()],
    )
    sitio_web = StringField(
        "Sitio web",
        validators=[Optional(), URL(message="Ingresa una URL válida.")],
    )
    submit = SubmitField("Guardar perfil")
