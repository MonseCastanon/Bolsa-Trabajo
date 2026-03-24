"""
app/postulaciones/forms.py — Formularios de postulación.

Responsable: Gilberto — semana 3.
"""

from flask_wtf import FlaskForm
from wtforms import TextAreaField, SelectField, SubmitField
from wtforms.validators import Optional, DataRequired


class PostulacionForm(FlaskForm):
    """Formulario para postularse a una vacante."""

    mensaje = TextAreaField(
        "Carta de presentación (opcional)",
        validators=[Optional()],
    )
    submit = SubmitField("Postularme")


class CambiarEstadoForm(FlaskForm):
    """
    Formulario para que una empresa cambie el estado de una postulación.
    Solo rol empresa puede usarlo.
    """

    estado = SelectField(
        "Estado",
        choices=[
            ("pendiente", "Pendiente"),
            ("revisado", "Revisado"),
            ("aceptado", "Aceptado"),
            ("rechazado", "Rechazado"),
        ],
        validators=[DataRequired()],
    )
    submit = SubmitField("Actualizar estado")
