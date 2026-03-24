"""
app/perfil/forms.py — Formulario de perfil del estudiante.

Responsable: Monserrat — semana 3.
"""

from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, IntegerField, SubmitField
from wtforms.validators import DataRequired, Optional, Length, NumberRange


class PerfilEstudianteForm(FlaskForm):
    """Formulario para editar el perfil del estudiante."""

    nombre = StringField(
        "Nombre",
        validators=[DataRequired(), Length(max=100)],
    )
    apellido = StringField(
        "Apellido",
        validators=[DataRequired(), Length(max=100)],
    )
    carrera = StringField(
        "Carrera",
        validators=[Optional(), Length(max=150)],
    )
    semestre = IntegerField(
        "Semestre actual",
        validators=[Optional(), NumberRange(min=1, max=12)],
    )
    bio = TextAreaField(
        "Acerca de mí",
        validators=[Optional()],
    )
    cv_url = StringField(
        "Link a mi CV (Google Drive, LinkedIn, etc.)",
        validators=[Optional(), Length(max=300)],
    )
    submit = SubmitField("Guardar perfil")
