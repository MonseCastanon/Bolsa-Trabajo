"""
seed.py — Datos de prueba realistas para desarrollo y demo.

CRÍTICO (ver planificación del equipo):
  "seed.py de Monse es crítico para la demo — sin datos reales la app
   se ve vacía ante el profesor."

Ejecutar con:
  cd backend
  python seed.py

Crea:
  - 1 usuario administrador
  - 3 empresas con sus cuentas
  - 8 estudiantes con perfiles
  - 5 vacantes publicadas
  - 5 postulaciones de prueba
"""

from app import create_app, db, bcrypt
from app.models import Usuario, PerfilEstudiante, Empresa, Vacante, Postulacion

app = create_app("development")


def seed():
    with app.app_context():
        # Limpiar tablas en orden correcto (FK)
        print("🗑  Limpiando tablas...")
        Postulacion.query.delete()
        Vacante.query.delete()
        Empresa.query.delete()
        PerfilEstudiante.query.delete()
        Usuario.query.delete()
        db.session.commit()

        # ── Administrador ─────────────────────────
        print("👤  Creando administrador...")
        admin = Usuario(
            email="admin@bolsatrabajo.edu",
            password_hash=bcrypt.generate_password_hash("Admin1234!").decode("utf-8"),
            rol="admin",
        )
        db.session.add(admin)

        # ── Empresas ──────────────────────────────
        print("🏢  Creando empresas...")
        empresas_data = [
            {
                "email": "rrhh@techmexico.com",
                "nombre": "Tech México",
                "sector": "Tecnología",
                "descripcion": "Empresa de desarrollo de software con enfoque en soluciones empresariales.",
                "sitio_web": "https://techmexico.com",
            },
            {
                "email": "practicas@innovalab.mx",
                "nombre": "InnovaLab",
                "sector": "Investigación",
                "descripcion": "Laboratorio de innovación abierta para startups y proyectos educativos.",
                "sitio_web": "https://innovalab.mx",
            },
            {
                "email": "talento@grupocomercia.mx",
                "nombre": "Grupo Comercia",
                "sector": "Comercio",
                "descripcion": "Cadena de retail con más de 50 tiendas en Guanajuato y Jalisco.",
                "sitio_web": "https://grupocomercia.mx",
            },
        ]

        empresa_objects = []
        for data in empresas_data:
            u = Usuario(
                email=data["email"],
                password_hash=bcrypt.generate_password_hash("Empresa1234!").decode("utf-8"),
                rol="empresa",
            )
            db.session.add(u)
            db.session.flush()  # obtenemos u.id antes del commit

            e = Empresa(
                usuario_id=u.id,
                nombre=data["nombre"],
                sector=data["sector"],
                descripcion=data["descripcion"],
                sitio_web=data["sitio_web"],
            )
            db.session.add(e)
            empresa_objects.append(e)

        db.session.flush()

        # ── Vacantes ──────────────────────────────
        print("💼  Creando vacantes...")
        vacantes_data = [
            {
                "empresa_idx": 0,
                "titulo": "Desarrollador Backend Python (Junior)",
                "descripcion": "Buscamos egresado o pasante con conocimientos en Flask o Django.",
                "requisitos": "Python básico, Git, bases de datos relacionales.",
                "tipo": "empleo",
                "modalidad": "hibrido",
            },
            {
                "empresa_idx": 0,
                "titulo": "Prácticas en QA y Testing",
                "descripcion": "Apoyo en pruebas manuales y automatizadas de nuestras aplicaciones.",
                "requisitos": "Cursando últimos semestres de Sistemas o afín.",
                "tipo": "practica",
                "modalidad": "presencial",
            },
            {
                "empresa_idx": 1,
                "titulo": "Investigador Jr. en Inteligencia Artificial",
                "descripcion": "Apoya proyectos de machine learning aplicados a educación.",
                "requisitos": "Python, estadística básica, inglés técnico.",
                "tipo": "practica",
                "modalidad": "presencial",
            },
            {
                "empresa_idx": 2,
                "titulo": "Analista de Datos Comerciales",
                "descripcion": "Generación de reportes de ventas y KPIs con herramientas BI.",
                "requisitos": "Excel avanzado, SQL básico, manejo de dashboards.",
                "tipo": "empleo",
                "modalidad": "presencial",
            },
            {
                "empresa_idx": 2,
                "titulo": "Prácticas en Marketing Digital",
                "descripcion": "Gestión de redes sociales, campañas de email y SEO.",
                "requisitos": "Creatividad, conocimiento de redes sociales, ortografía.",
                "tipo": "practica",
                "modalidad": "remoto",
            },
        ]

        vacante_objects = []
        for data in vacantes_data:
            v = Vacante(
                empresa_id=empresa_objects[data["empresa_idx"]].id,
                titulo=data["titulo"],
                descripcion=data["descripcion"],
                requisitos=data["requisitos"],
                tipo=data["tipo"],
                modalidad=data["modalidad"],
            )
            db.session.add(v)
            vacante_objects.append(v)

        db.session.flush()

        # ── Estudiantes ───────────────────────────
        print("🎓  Creando estudiantes...")
        estudiantes_data = [
            ("ana.garcia@alumnos.edu", "Ana", "García", "Ingeniería en Sistemas", 8),
            ("carlos.lopez@alumnos.edu", "Carlos", "López", "Informática", 6),
            ("maria.hernandez@alumnos.edu", "María", "Hernández", "Ingeniería en Sistemas", 9),
            ("jose.martinez@alumnos.edu", "José", "Martínez", "Administración", 7),
            ("lucia.perez@alumnos.edu", "Lucía", "Pérez", "Mercadotecnia", 5),
            ("roberto.sanchez@alumnos.edu", "Roberto", "Sánchez", "Informática", 8),
            ("diana.torres@alumnos.edu", "Diana", "Torres", "Ingeniería en Sistemas", 10),
            ("miguel.flores@alumnos.edu", "Miguel", "Flores", "Administración", 6),
        ]

        estudiante_users = []
        for email, nombre, apellido, carrera, semestre in estudiantes_data:
            u = Usuario(
                email=email,
                password_hash=bcrypt.generate_password_hash("Alumno1234!").decode("utf-8"),
                rol="estudiante",
            )
            db.session.add(u)
            db.session.flush()

            p = PerfilEstudiante(
                usuario_id=u.id,
                nombre=nombre,
                apellido=apellido,
                carrera=carrera,
                semestre=semestre,
                bio=f"Estudiante de {carrera}, semestre {semestre}.",
            )
            db.session.add(p)
            estudiante_users.append(u)

        db.session.flush()

        # ── Postulaciones ─────────────────────────
        print("📬  Creando postulaciones...")
        postulaciones_data = [
            (0, 0, "pendiente", "Me interesa mucho esta vacante de backend."),
            (1, 0, "revisado", "Tengo experiencia con Flask en proyectos escolares."),
            (2, 2, "aceptado", "Cursé materias de IA y tengo proyectos en GitHub."),
            (3, 3, "pendiente", "Tengo conocimientos de SQL y Excel avanzado."),
            (4, 4, "pendiente", "Busco prácticas en marketing digital para mi último semestre."),
        ]

        for est_idx, vac_idx, estado, mensaje in postulaciones_data:
            post = Postulacion(
                estudiante_id=estudiante_users[est_idx].id,
                vacante_id=vacante_objects[vac_idx].id,
                estado=estado,
                mensaje=mensaje,
            )
            db.session.add(post)

        db.session.commit()

        print("\n✅  Seed completado exitosamente.")
        print("   Admin:     admin@bolsatrabajo.edu  /  Admin1234!")
        print("   Empresa:   rrhh@techmexico.com     /  Empresa1234!")
        print("   Estudiante: ana.garcia@alumnos.edu /  Alumno1234!")


if __name__ == "__main__":
    seed()
