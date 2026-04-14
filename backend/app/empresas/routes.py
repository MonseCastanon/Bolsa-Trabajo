"""
app/empresas/routes.py — Blueprint de empresas.

Responsable: Juan Diego — semana 2.
Dependencia: necesita Empresa, Usuario y base del proyecto de Monse (día 5).

Endpoints planificados:
  GET  /api/empresas/          → directorio público de empresas
  GET  /api/empresas/<id>      → perfil público de empresa
  PUT  /api/empresas/mi-perfil → editar perfil de empresa propia (solo rol empresa)
"""

from flask import Blueprint, jsonify, request
from app.models import Empresa
from app.utils import roles_required
from flask_login import current_user
from app import db
from app.empresas.forms import PerfilEmpresaForm

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
@empresas_bp.route("/mi-perfil", methods=["GET"])
@roles_required("empresa")
def mi_perfil():
    """Perfil para obtener los datos de la empresa actual"""
    empresa = Empresa.query.filter_by(usuario_id=current_user.id).first_or_404()
    return jsonify({
        "ok": True,
        "empresa": {
            "id": empresa.id,
            "nombre": empresa.nombre,
            "sector": empresa.sector,
            "descripcion": empresa.descripcion,
            "sitio_web": empresa.sitio_web,
            "logo_url": empresa.logo_url,
        },
    })

@empresas_bp.route("/mi-perfil", methods=["PUT"])
@roles_required("empresa")
def editar_mi_perfil():
    """Editar perfil de empresa propia — recibe JSON del frontend"""
    empresa = Empresa.query.filter_by(usuario_id=current_user.id).first_or_404()
    data = request.get_json(silent=True) or {}

    nombre = data.get("nombre", "").strip()
    if not nombre:
        return jsonify({"ok": False, "mensaje": "El nombre de la empresa es obligatorio."}), 400

    empresa.nombre = nombre
    empresa.sector = data.get("sector", empresa.sector or "").strip() or None
    empresa.descripcion = data.get("descripcion", empresa.descripcion or "").strip() or None
    empresa.sitio_web = data.get("sitio_web", empresa.sitio_web or "").strip() or None
    empresa.logo_url = data.get("logo_url", empresa.logo_url or "").strip() or None

    db.session.commit()
    return jsonify({"ok": True, "mensaje": "Perfil actualizado correctamente"})

#   - PerfilEmpresaForm (WTForms)
