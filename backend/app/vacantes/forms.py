"""
app/vacantes/forms.py — Formulario de vacante (WTForms).

Responsable: Gilberto — semana 2.
"""

from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, SelectField, SubmitField, DateField
from wtforms.validators import DataRequired, Length, Optional


class VacanteForm(FlaskForm):
    """Formulario para crear y editar vacantes."""

    titulo = StringField(
        "Título de la vacante",
        validators=[DataRequired(), Length(max=200)],
    )
    descripcion = TextAreaField(
        "Descripción",
        validators=[DataRequired()],
    )
    requisitos = TextAreaField(
        "Requisitos",
        validators=[Optional()],
    )
    tipo = SelectField(
        "Tipo",
        choices=[("empleo", "Empleo"), ("practica", "Prácticas profesionales")],
        validators=[DataRequired()],
    )
    modalidad = SelectField(
        "Modalidad",
        choices=[
            ("presencial", "Presencial"),
            ("remoto", "Remoto"),
            ("hibrido", "Híbrido"),
        ],
        validators=[DataRequired()],
    )
    cierra_en = DateField(
        "Fecha de cierre",
        validators=[Optional()],
    )
    submit = SubmitField("Guardar vacante")
