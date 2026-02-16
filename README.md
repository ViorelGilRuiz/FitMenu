# FitMenu AI Studio

<p align="center">
  <strong>AI Nutrition Platform for Fitness & Wellness</strong><br/>
  Menus semanales inteligentes, recetas paso a paso y experiencia premium para entornos B2B.
</p>

<p align="center">
  <a href="./README.en.md">English Version</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-In%20Development-1f6feb" alt="status"/>
  <img src="https://img.shields.io/badge/Backend-FastAPI-009688" alt="backend"/>
  <img src="https://img.shields.io/badge/Frontend-Vanilla%20JS-ffb300" alt="frontend"/>
  <img src="https://img.shields.io/badge/Go--To--Market-B2B-7b1fa2" alt="b2b"/>
</p>

## :rocket: Propuesta del proyecto
**FitMenu AI Studio** es una plataforma de nutricion inteligente para rendimiento deportivo y bienestar.

Su objetivo es evolucionar desde un **MVP funcional** a un **SaaS B2B escalable** para:
- gimnasios y cadenas fitness,
- programas corporativos de bienestar,
- coaches y centros de nutricion,
- integraciones white-label con apps de salud.

## :briefcase: Valor comercial para empresas
- Personalizacion nutricional a escala.
- Mejor adherencia del usuario final.
- Menor friccion operativa para equipos de nutricion.
- Base tecnica lista para escalar y productizar.

## :sparkles: Novedades implementadas (ultima version)
- Login dual `Iniciar sesion / Registrarse` con persistencia local de usuarios.
- Deteccion de usuario registrado por email y acceso con credenciales.
- Onboarding ampliado con variables de estilo de vida.
- Volcado de datos de cuenta al formulario y autocompletado de perfil guardado.
- Bloque `Consejo IA` al generar menu con resumen personalizado de recomendaciones.
- Perfil nutricional mas rico y personalizado.
- Motor de recomendacion adaptado por nivel de cocina.
- Catalogo ampliado de recetas (`r1` a `r22`).
- Filtro por dificultad en vista `Cartas 3D` segun nivel del usuario.
- Tarjetas 3D mejoradas con rotacion y carrusel de imagenes en hover.

## :brain: Variables que ahora influyen en el menu
Ademas de edad/peso/altura/objetivo/dieta/restricciones, ahora se usan:
- `cook_level`: `basic`, `intermediate`, `advanced`
- `activity_level`: `low`, `moderate`, `high`
- `training_days`: 0-7
- `max_prep_minutes`: tiempo maximo por receta
- `preferred_cost`: `low`, `mid`, `high`, `any`
- `dislikes`: ingredientes no deseados

Resultado: los menus son mas realistas para el contexto de cada persona.

## :salad: Logica por nivel de usuario
- **Bajo (`basic`)**: recetas `easy`.
- **Intermedio (`intermediate`)**: recetas `easy` + `medium`.
- **Avanzado (`advanced`)**: recetas `easy` + `medium` + `hard`.

Esto aplica tanto al motor semanal como a la pagina de cartas.

## :compass: Flujo de la aplicacion
1. `login.html` (registro o acceso de usuario existente)
2. `form.html` (autocompleta perfil si ya estaba guardado)
3. `recipes.html`
4. `recipe.html`

## :building_construction: Arquitectura tecnica
```text
Frontend (HTML/CSS/JS multipagina)
        |
        v
Backend API (FastAPI + motor de reglas nutricionales)
        |
        v
Data Model SQL (schema listo para PostgreSQL)
```

## :toolbox: Stack
- **Frontend:** HTML5, CSS3, JavaScript (Vanilla).
- **Backend:** Python, FastAPI, Pydantic.
- **DB (schema):** PostgreSQL-ready en `db/schema.sql`.
- **Documentacion API:** Swagger/OpenAPI.

## :electric_plug: Endpoints principales
| Metodo | Endpoint | Uso |
|---|---|---|
| `GET` | `/health` | Estado de servicio |
| `POST` | `/menus/weekly` | Menu semanal resumido |
| `POST` | `/menus/weekly/full` | Menu completo + KPIs + lista de compra |
| `GET` | `/recipes` | Catalogo de recetas |
| `GET` | `/recipes/{recipe_id}` | Detalle de receta |

## :card_file_box: Modelo de datos (SQL)
Entidades principales:
- `users`
- `user_profiles`
- `recipes`
- `weekly_menus`

Campos nuevos relevantes en `user_profiles`:
- `dislikes`
- `cook_level`
- `activity_level`
- `training_days`
- `max_prep_minutes`
- `preferred_cost`

Referencia: `db/schema.sql`

## :open_file_folder: Estructura del repositorio
```text
backend/     # API FastAPI y motor de recomendacion
frontend/    # app web multipagina + UX visual
db/          # esquema SQL
docs/        # brief, arquitectura, roadmap, demo API
```

## :art: Branding GitHub profesional
He dejado una guia accionable para pulir tu perfil y tu presencia comercial en GitHub:
- `docs/github-profile-pro.md`
- `docs/github-profile-readme-template.md`

## :arrow_forward: Ejecucion local
### Backend
```bash
cd backend
python -m venv .venv
# Windows
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
```
Swagger:
- `http://127.0.0.1:8001/docs`

### Frontend
```bash
cd frontend
python -m http.server 5500
```
Abrir:
- `http://127.0.0.1:5500/login.html`

## :chart_with_upwards_trend: Roadmap de escalado
### Fase 1 (actual)
- MVP funcional end-to-end.
- Motor de personalizacion por perfil y nivel.
- Demo comercial para presentaciones B2B.

### Fase 2
- Persistencia real completa en PostgreSQL.
- Autenticacion robusta (backend + sesiones seguras).
- Feedback loop para recomendaciones adaptativas.

### Fase 3
- SaaS B2B multi-tenant.
- Panel admin para empresas.
- Analitica de adherencia y rendimiento.
- Integraciones con wearables y ecosistemas fitness.

## :warning: Nota profesional
FitMenu AI es una plataforma tecnologica de apoyo nutricional.  
No reemplaza evaluacion medica o nutricional profesional.

## :bust_in_silhouette: Autor
**Viorel Gil Ruiz**  
Proyecto en desarrollo continuo con foco en calidad tecnica, producto y ventas comerciales.
