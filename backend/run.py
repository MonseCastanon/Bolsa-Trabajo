"""
run.py — Punto de entrada de la aplicación.

Uso:
  python run.py          # Levanta el servidor de desarrollo
  flask run              # Alternativa con CLI de Flask
  gunicorn "run:app"     # Producción
"""

from app import create_app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
