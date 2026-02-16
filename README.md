# FitMenu AI Studio

<p align="center">
  <strong>AI Nutrition Platform for Fitness & Wellness</strong><br/>
  Menus semanales inteligentes, recetas paso a paso y experiencia visual premium para entornos B2B.
</p>

<p align="center">
  <a href="./README.en.md">English Version</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-MVP%20Avanzado-1f6feb" alt="status"/>
  <img src="https://img.shields.io/badge/Auth-Backend%20Token-0f9d58" alt="auth"/>
  <img src="https://img.shields.io/badge/Backend-FastAPI-009688" alt="backend"/>
  <img src="https://img.shields.io/badge/Frontend-Vanilla%20JS-ffb300" alt="frontend"/>
  <img src="https://img.shields.io/badge/Go--To--Market-B2B-7b1fa2" alt="b2b"/>
</p>

## :star2: Documento principal para empresas
Si una persona no técnica quiere entender el proyecto desde cero:

- **📘 Guía de usuario para empresas (no técnica):** `docs/guia-usuario-empresas.md`

Incluye explicación visual, base de datos simplificada, estado actual, propuesta de valor y roadmap.

## :rocket: Qué es FitMenu AI
**FitMenu AI Studio** es una plataforma de nutrición inteligente que convierte datos de perfil en:
- menú semanal personalizado,
- recetas paso a paso,
- lista de compra,
- recomendaciones IA comprensibles,
- experiencia visual moderna (tarjetas 3D + interacción).

## :briefcase: Valor para negocio
- Personalización a escala para empresas de salud/fitness.
- Mayor adherencia del usuario final.
- Menor fricción operativa para equipos de nutrición.
- Base sólida para SaaS B2B y white-label.

## :sparkles: Estado actual (implementado)
- ✅ Registro e inicio de sesión completo con backend.
- ✅ Autenticación con token Bearer y expiración.
- ✅ Guardado de cuenta y perfil en servidor (entorno demo).
- ✅ Formulario avanzado con autocompletado de perfil.
- ✅ Consejo IA tras completar formulario.
- ✅ Motor de recomendación nutricional por objetivo/restricciones/nivel.
- ✅ Catálogo ampliado de recetas (`r1` a `r22`).
- ✅ Vista de recetas con tarjetas 3D y carrusel de imagen en hover.

## :brain: Personalización real
El motor tiene en cuenta:
- objetivo (`lose_fat`, `maintain`, `gain_muscle`),
- dieta (`omnivore`, `vegetarian`, `vegan`),
- alergias y `dislikes`,
- nivel culinario (`basic`, `intermediate`, `advanced`),
- actividad semanal, días de entrenamiento,
- tiempo máximo de preparación,
- preferencia de coste.

## :compass: Flujo de uso
1. `login.html` → registro o acceso de usuario existente.
2. `form.html` → perfil nutricional + consejo IA + generación del menú.
3. `recipes.html` → exploración visual de recetas en cartas 3D.
4. `recipe.html` → receta completa paso a paso.

## :electric_plug: Endpoints principales
| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/auth/register` | Registro de usuario |
| `POST` | `/auth/login` | Login + entrega de token |
| `GET` | `/auth/me` | Perfil autenticado |
| `PUT` | `/auth/me/account` | Actualizar preferencias de cuenta |
| `PUT` | `/auth/me/profile` | Guardar perfil nutricional |
| `POST` | `/menus/weekly` | Menú semanal resumido |
| `POST` | `/menus/weekly/full` | Menú completo + KPIs + lista de compra |
| `GET` | `/recipes` | Catálogo de recetas |
| `GET` | `/recipes/{recipe_id}` | Detalle de receta |
| `GET` | `/health` | Estado del servicio |

## :building_construction: Arquitectura
```text
Frontend (HTML/CSS/JS multipágina)
        |
        v
Backend API (FastAPI + motor nutricional + auth token)
        |
        v
Modelo de datos SQL (preparado para PostgreSQL)
```

## :card_file_box: Base de datos y persistencia
- Diseño de base de datos en `db/schema.sql`.
- Persistencia de usuarios demo en `backend/data/users.json`.
- Entidades clave: `users`, `user_profiles`, `recipes`, `weekly_menus`.

## :open_file_folder: Documentación del proyecto
- `docs/guia-usuario-empresas.md` → guía no técnica para empresas.
- `docs/product-brief.md` → visión de producto.
- `docs/architecture.md` → arquitectura técnica.
- `docs/roadmap.md` → plan de evolución.
- `docs/api-demo.md` → pruebas rápidas de API.
- `docs/github-profile-pro.md` → mejora profesional de perfil GitHub.
- `docs/github-profile-readme-template.md` → plantilla de README de perfil.
- `docs/github-profile-readme-ready.md` → acceso rápido a versiones premium.
- `docs/github-profile-readme-ready-es.md` → README de perfil listo (español).
- `docs/github-profile-readme-ready-en.md` → README de perfil listo (inglés).

## :arrow_forward: Ejecución local
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
- MVP avanzado funcional.
- Auth + recomendación + UX visual + documentación empresarial.

### Fase 2
- Persistencia productiva en PostgreSQL.
- Seguridad endurecida y gestión de sesiones avanzada.
- Métricas y feedback loop de adherencia.

### Fase 3
- SaaS B2B multi-tenant.
- Panel admin para empresas.
- Integraciones con ecosistemas fitness/wearables.

## :warning: Nota profesional
FitMenu AI es una plataforma tecnológica de apoyo nutricional y no reemplaza asesoramiento médico o nutricional profesional.

## :bust_in_silhouette: Autor
**Viorel Gil Ruiz**
