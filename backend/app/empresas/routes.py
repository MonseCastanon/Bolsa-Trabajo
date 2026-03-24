"""
app/empresas/routes.py — Blueprint de empresas.

Responsable: Juan Diego — semana 2.
Dependencia: necesita Empresa, Usuario y base del proyecto de Monse (día 5).

Endpoints planificados:
  GET  /api/empresas/          → directorio público de empresas
  GET  /api/empresas/<id>      → perfil público de empresa
  PUT  /api/empresas/mi-perfil → editar perfil de empresa propia (solo rol empresa)
"""

from flask import Blueprint, jsonify
from app.models import Empresa

empresas_bp = Blueprint("empresas", __name__)


@empresas_bp.route("/", methods=["GET"])
def listar():
    """Directorio público de empresas activas."""
    empresas = Empresa.query.filter_by(activa=True).all()
    return jsonify({
        "ok": True,
        "empresas": [
            {
                "id": e.id,
                "nombre": e.nombre,
                "sector": e.sector,
                "descripcion": e.descripcion,
                "sitio_web": e.sitio_web,
            }
            for e in empresas
        ],
    })


@empresas_bp.route("/<int:empresa_id>", methods=["GET"])
def detalle(empresa_id):
    """Perfil público de una empresa."""
    e = Empresa.query.get_or_404(empresa_id)
    return jsonify({
        "ok": True,
        "empresa": {
            "id": e.id,
            "nombre": e.nombre,
            "sector": e.sector,
            "descripcion": e.descripcion,
            "sitio_web": e.sitio_web,
            "logo_url": e.logo_url,
        },
    })


# TODO (Juan Diego, semana 2):
#   - PUT /mi-perfil con @roles_required("empresa")
#   - PerfilEmpresaForm (WTForms)
