# Bolsa de Trabajo y Prácticas Profesionales

Plataforma web que centraliza la publicación y consulta de vacantes laborales y oportunidades de prácticas profesionales para estudiantes y empresas dentro de un entorno académico.

---

## Índice

1. [Arquitectura del proyecto](#arquitectura-del-proyecto)
2. [Stack tecnológico](#stack-tecnológico)
3. [Estructura de carpetas](#estructura-de-carpetas)
4. [Configuración inicial](#configuración-inicial)
5. [Variables de entorno](#variables-de-entorno)
6. [Base de datos y migraciones](#base-de-datos-y-migraciones)
7. [Seed de datos de prueba](#seed-de-datos-de-prueba)
8. [Levantar el proyecto en desarrollo](#levantar-el-proyecto-en-desarrollo)
9. [Endpoints de la API](#endpoints-de-la-api)
10. [Reglas de Git del equipo](#reglas-de-git-del-equipo)
11. [División de trabajo por semana](#división-de-trabajo-por-semana)

---

## Arquitectura del proyecto

El proyecto separa **backend** y **frontend** en carpetas independientes dentro del mismo repositorio (monorepo).

```
bolsa_trabajo/
├── backend/     # API Flask (Python)
└── frontend/    # SPA JavaScript + Tailwind CSS (Vite)
```

- El **backend** expone una API REST bajo `/api/*`.
- El **frontend** es una Single Page Application que consume esa API vía `fetch()`.
- En desarrollo, Vite actúa como proxy: las peticiones a `/api` se redirigen automáticamente a Flask en `:5000`, eliminando problemas de CORS.
- En producción ambos pueden desplegarse por separado (Render, Railway, Vercel, etc.).

---

## Stack tecnológico

| Capa       | Tecnología                        | Responsabilidad                              |
|------------|-----------------------------------|----------------------------------------------|
| Backend    | Flask 3.x                         | API REST, lógica de negocio, autenticación   |
| ORM        | Flask-SQLAlchemy + Flask-Migrate  | Modelos y migraciones (Alembic)              |
| Auth       | Flask-Login + Flask-Bcrypt        | Sesión por cookie + hash de contraseñas      |
| Validación | Flask-WTF (WTForms)               | Validación de formularios del lado servidor  |
| Base datos | PostgreSQL (prod) / SQLite (dev)  | Persistencia                                 |
| Frontend   | JavaScript ES Modules (Vite)      | SPA con router hash, sin framework pesado    |
| Estilos    | Tailwind CSS (CDN)                | Utilidades CSS, sin paso de compilación      |
| Reactividad| Alpine.js (CDN)                   | Interactividad declarativa en HTML           |
| Servidor   | Gunicorn                          | Producción                                   |

---

## Estructura de carpetas

```
bolsa_trabajo/
│
├── .env.example               # Plantilla de variables de entorno
├── .gitignore
├── README.md
│
├── backend/
│   ├── app/
│   │   ├── __init__.py        # create_app() — registra blueprints y extensiones
│   │   ├── models.py          # ⚠ SOLO MONSERRAT edita este archivo
│   │   ├── utils.py           # @roles_required — decorador reutilizable
│   │   ├── auth/
│   │   │   ├── __init__.py
│   │   │   ├── routes.py      # /api/auth/* — login, logout, register, me
│   │   │   └── forms.py       # LoginForm, RegisterForm
│   │   ├── vacantes/
│   │   │   ├── __init__.py
│   │   │   ├── routes.py      # /api/vacantes/* — CRUD (Gilberto, sem 2)
│   │   │   └── forms.py       # VacanteForm
│   │   ├── postulaciones/
│   │   │   ├── __init__.py
│   │   │   └── routes.py      # /api/postulaciones/* (Gilberto, sem 3)
│   │   ├── empresas/
│   │   │   ├── __init__.py
│   │   │   └── routes.py      # /api/empresas/* (Juan Diego, sem 2)
│   │   ├── perfil/
│   │   │   ├── __init__.py
│   │   │   └── routes.py      # /api/perfil/* (Monserrat + Juan Diego, sem 3)
│   │   └── admin/
│   │       ├── __init__.py
│   │       └── routes.py      # /api/admin/* (Juan Diego, sem 3)
│   ├── migrations/            # Generado por Flask-Migrate (Alembic)
│   ├── seed.py                # ⚠ CRÍTICO — datos de prueba realistas
│   ├── run.py                 # Punto de entrada
│   ├── config.py              # DevelopmentConfig, ProductionConfig
│   ├── Procfile               # web: gunicorn "run:app"
│   └── requirements.txt       # 9 dependencias exactas
│
└── frontend/
    ├── index.html             # Shell de la SPA
    ├── vite.config.js         # Proxy /api → :5000
    ├── package.json
    └── src/
        ├── main.js            # Router hash + inicialización
        ├── styles/
        │   └── main.css       # Variables CSS + clases propias
        ├── services/
        │   └── api.js         # ⚠ Toda comunicación con el backend va aquí
        ├── components/
        │   ├── Navbar.js      # Navbar con roles (Monserrat, sem 1)
        │   ├── FlashMessage.js# Notificaciones tipo toast
        │   ├── VacanteCard.js # Tarjeta de vacante reutilizable
        │   └── Footer.js
        └── pages/
            ├── Home.js        # Landing pública
            ├── Login.js       # Formulario de login
            ├── Register.js    # Registro con selector de rol
            ├── Vacantes.js    # Listado + filtro por tipo
            ├── VacanteDetalle.js
            └── Dashboard.js   # Panel según rol
```

---

## Configuración inicial

### Prerrequisitos

```bash
python --version   # >= 3.10
node --version     # >= 18
pip --version
```

### Paso 1 — Clonar el repositorio

```bash
git clone <url-del-repo>
cd bolsa_trabajo
```

### Paso 2 — Configurar el backend

```bash
cd backend

# Crear entorno virtual
python -m venv venv

# Activar (macOS/Linux)
source venv/bin/activate

# Activar (Windows)
venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt
```

### Paso 3 — Variables de entorno

```bash
cp ../.env.example .env
# Editar .env con tus valores reales
```

### Paso 4 — Migraciones

```bash
# Solo la primera vez si la carpeta migrations/ no existe:
flask db init

# Crear migración con todos los modelos
flask db migrate -m "initial models"

# Aplicar a la base de datos
flask db upgrade
```

### Paso 5 — Datos de prueba

```bash
python seed.py
```

Credenciales creadas:
- **Admin:** `admin@bolsatrabajo.edu` / `Admin1234!`
- **Empresa:** `rrhh@techmexico.com` / `Empresa1234!`
- **Estudiante:** `ana.garcia@alumnos.edu` / `Alumno1234!`

### Paso 6 — Frontend

```bash
cd ../frontend
npm install
```

---

## Variables de entorno

El archivo `.env` vive en `backend/` y **nunca se sube a Git**.

| Variable       | Descripción                              | Valor por defecto (dev)            |
|----------------|------------------------------------------|------------------------------------|
| `FLASK_APP`    | Módulo de entrada Flask                  | `run.py`                           |
| `FLASK_ENV`    | Entorno activo                           | `development`                      |
| `SECRET_KEY`   | Clave para sesiones y CSRF               | _(obligatorio cambiar)_            |
| `DATABASE_URL` | Cadena de conexión a la DB               | SQLite local si se omite           |
| `FRONTEND_URL` | URL del frontend para headers CORS       | `http://localhost:5173`            |

---

## Base de datos y migraciones

Flujo de trabajo:

```bash
# 1. Monserrat modifica models.py
# 2. Genera la migración
flask db migrate -m "descripción del cambio"

# 3. Revisa el archivo en migrations/versions/
# 4. Aplica
flask db upgrade

# 5. Commit del archivo de migración
git add migrations/
git commit -m "Add migration: descripción"
```

> ⚠ **Solo Monserrat genera migraciones.** Cualquier cambio en modelos se comunica al equipo antes de hacer commit.

---

## Seed de datos de prueba

```bash
cd backend
python seed.py
```

Seguro de ejecutar múltiples veces. **No usar en producción.**

---

## Levantar el proyecto en desarrollo

Se necesitan **dos terminales**:

### Terminal 1 — Backend

```bash
cd backend
source venv/bin/activate
python run.py
# → http://localhost:5000
```

### Terminal 2 — Frontend

```bash
cd frontend
npm run dev
# → http://localhost:5173
```

Abrir el navegador en `http://localhost:5173`.

---

## Endpoints de la API

### Auth — `/api/auth`

| Método | Ruta        | Descripción              | Acceso      |
|--------|-------------|--------------------------|-------------|
| POST   | `/register` | Crear cuenta             | Público     |
| POST   | `/login`    | Iniciar sesión           | Público     |
| POST   | `/logout`   | Cerrar sesión            | Autenticado |
| GET    | `/me`       | Usuario en sesión        | Autenticado |

### Vacantes — `/api/vacantes`

| Método | Ruta             | Descripción               | Acceso    |
|--------|------------------|---------------------------|-----------|
| GET    | `/`              | Lista pública             | Público   |
| GET    | `/<id>`          | Detalle                   | Público   |
| POST   | `/nueva`         | Crear vacante             | empresa   |
| PUT    | `/<id>/editar`   | Editar propia             | empresa   |
| POST   | `/<id>/eliminar` | Eliminar propia           | empresa   |

### Empresas — `/api/empresas`

| Método | Ruta          | Descripción               | Acceso   |
|--------|---------------|---------------------------|----------|
| GET    | `/`           | Directorio                | Público  |
| GET    | `/<id>`       | Perfil público            | Público  |
| PUT    | `/mi-perfil`  | Editar perfil propio      | empresa  |

### Postulaciones — `/api/postulaciones`

| Método | Ruta                  | Descripción                  | Acceso     |
|--------|-----------------------|------------------------------|------------|
| GET    | `/mis-postulaciones`  | Postulaciones del estudiante | estudiante |
| POST   | `/<vacante_id>`       | Postularse                   | estudiante |
| DELETE | `/<id>`               | Retirar postulación          | estudiante |
| GET    | `/vacante/<id>`       | Candidatos por vacante       | empresa    |
| PUT    | `/<id>/estado`        | Cambiar estado               | empresa    |

### Perfil — `/api/perfil`

| Método | Ruta          | Descripción           | Acceso      |
|--------|---------------|-----------------------|-------------|
| GET    | `/`           | Ver perfil propio     | Autenticado |
| PUT    | `/estudiante` | Editar perfil         | estudiante  |
| PUT    | `/empresa`    | Editar perfil empresa | empresa     |

### Admin — `/api/admin`

| Método | Ruta                    | Descripción                   | Acceso |
|--------|-------------------------|-------------------------------|--------|
| GET    | `/usuarios`             | Todos los usuarios            | admin  |
| PUT    | `/usuarios/<id>/toggle` | Activar / desactivar cuenta   | admin  |
| GET    | `/vacantes`             | Todas las vacantes            | admin  |
| PUT    | `/vacantes/<id>/toggle` | Activar / desactivar vacante  | admin  |
| GET    | `/postulaciones`        | Todas las postulaciones       | admin  |

---

## Reglas de Git del equipo

| Regla                    | Detalle                                                                      |
|--------------------------|------------------------------------------------------------------------------|
| **Rama por persona**     | `feature/monse-auth` · `feature/gilberto-vacantes` · `feature/diego-admin`  |
| **Nunca directo a main** | Todo cambio va a `develop` vía Pull Request                                  |
| **PR antes de merge**    | Otra persona revisa antes de integrar                                        |
| **models.py protegido**  | Solo Monserrat. Cambios se comunican en el grupo antes de cualquier commit   |
| **.env nunca en Git**    | Se versiona `.env.example` con valores ficticios                             |
| **Commits atómicos**     | `"Add VacanteForm validation"` — no `"fix stuff"`                           |

### Flujo diario

```bash
# Actualizar antes de empezar
git checkout develop && git pull origin develop

# Trabajar en tu rama
git checkout feature/tu-nombre-funcionalidad

# Commit atómico
git add archivo.py
git commit -m "Add: descripción concreta"

# Rebase antes del PR
git fetch origin && git rebase origin/develop

# Push y abrir PR
git push origin feature/tu-nombre-funcionalidad
```

---

## División de trabajo por semana

### Semana 1 — Monserrat (fundamentos, prioridad total)

| Tarea                            | Estado |
|----------------------------------|--------|
| Estructura del proyecto          | ✅     |
| `config.py` y `.env.example`     | ✅     |
| `models.py` completo             | ✅     |
| Migración inicial                | ✅     |
| `seed.py` con datos realistas    | ✅     |
| `Navbar.js` base con roles       | ✅     |
| `@roles_required` en `utils.py`  | ✅     |

> Gilberto y Juan Diego: diseñan flujos en papel y leen documentación durante esta semana.

### Semana 2 — En paralelo

| Persona    | Módulo        | Tareas principales                                |
|------------|---------------|---------------------------------------------------|
| Monserrat  | `auth_bp`     | register, login, logout, me                       |
| Gilberto   | `vacantes_bp` | CRUD vacantes, VacanteForm, filtros por tipo       |
| Juan Diego | `empresas_bp` | Directorio de empresas, perfil público             |

### Semana 3 — En paralelo

| Persona    | Módulo              | Tareas principales                              |
|------------|---------------------|-------------------------------------------------|
| Monserrat  | `perfil_bp`         | Ver y editar perfil estudiante                  |
| Gilberto   | `postulaciones_bp`  | Postularse, retirar, candidatos, cambiar estado |
| Juan Diego | `admin_bp`          | Panel admin: usuarios, vacantes, postulaciones  |

### Semana 4 — QA conjunto

- Integración completa frontend ↔ backend
- `python seed.py` para demo con datos reales
- Revisión de flujos por rol (estudiante, empresa, admin)
- Ensayo de presentación

---

## Notas para el revisor senior

- `models.py` centraliza todos los modelos con relaciones, restricciones de unicidad y comentarios de responsabilidad por integrante.
- `utils.py` define `@roles_required` una sola vez; ningún blueprint duplica esa lógica.
- `api.js` es la única capa de `fetch()` en el frontend; las páginas nunca llaman directamente a la red.
- `seed.py` genera datos coherentes entre tablas y es idempotente (se puede ejecutar múltiples veces).
- El proxy de Vite elimina la necesidad de la dependencia `flask-cors`.
- SQLite como fallback permite arrancar sin PostgreSQL instalado localmente.
# Bolsa-Trabajo
