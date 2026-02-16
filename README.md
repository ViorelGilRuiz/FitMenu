# FitMenu AI Studio

> Plataforma inteligente de nutricion y fitness para generar menus semanales personalizados, recetas paso a paso y una experiencia visual moderna orientada a producto B2B.

## Estado del proyecto
**Proyecto en desarrollo activo (MVP funcional + evolucion continua).**

FitMenu AI Studio ya permite generar menus semanales segun el perfil del usuario, ver recetas con detalle nutricional y navegar por una experiencia multipagina preparada para demo comercial.  
La vision es escalarlo a producto SaaS multi-tenant para gimnasios, empresas wellness, apps health y partners corporativos.

## Problema que resolvemos
Muchas personas quieren mejorar su alimentacion para rendir mejor (gimnasio, salud, composicion corporal), pero no saben:
- que cocinar cada dia,
- como organizar un menu sostenible,
- como adaptar recetas a objetivos y restricciones,
- como mantener adherencia semana tras semana.

## Solucion FitMenu AI
FitMenu AI transforma datos basicos del usuario en:
- menu semanal personalizado,
- recetas saludables con pasos claros,
- macros y calorias por receta,
- lista de compra agregada,
- experiencia visual atractiva para mejorar engagement.

## Propuesta de valor B2B
- Personalizacion de nutricion a escala.
- Mejor adherencia y retencion de usuarios finales.
- Base para white-label en gimnasios y empresas.
- Integracion futura por API con ecosistemas de entrenamiento/salud.

## Demo funcional actual
### Flujo multipagina
1. `login.html`  
   Captura nombre y nivel del usuario (`Bajo`, `Intermedio`, `Avanzado`).
2. `form.html`  
   Perfil nutricional + generacion del menu semanal.
3. `recipes.html`  
   Galeria de recetas en cartas 3D.
4. `recipe.html`  
   Vista de receta completa paso a paso.

### Personalizacion por nivel
- **Bajo:** experiencia simplificada.
- **Intermedio:** experiencia estandar.
- **Avanzado:** mayor detalle (KPIs y datos nutricionales extendidos).

## Arquitectura tecnica
```text
Frontend (HTML/CSS/JS multipagina)
        |
        v
Backend API (FastAPI, motor de reglas y seleccion de recetas)
        |
        v
Modelo de datos SQL (schema PostgreSQL para evolucion productiva)
```

## Stack tecnologico
- **Frontend:** HTML, CSS, JavaScript vanilla.
- **Backend:** Python, FastAPI, Pydantic.
- **Base de datos (diseno):** PostgreSQL (schema en `db/schema.sql`).
- **API docs:** Swagger/OpenAPI via FastAPI.

## Backend: funcionamiento
El backend aplica reglas nutricionales sobre:
- objetivo (`lose_fat`, `maintain`, `gain_muscle`),
- dieta (`omnivore`, `vegetarian`, `vegan`),
- restricciones (`lactose_free`, `gluten_free`),
- alergias,
- numero de comidas por dia.

### Logica principal
1. Estima calorias objetivo segun perfil.
2. Filtra recetas compatibles por dieta/restricciones/alergenos.
3. Asigna recetas por franja de comida (`breakfast`, `lunch`, `dinner`, etc.).
4. Genera menu semanal de 7 dias.
5. (Endpoint full) agrega KPIs y lista de compra consolidada.

## Endpoints disponibles
| Metodo | Endpoint | Descripcion |
|---|---|---|
| `GET` | `/health` | Estado de la API |
| `POST` | `/menus/weekly` | Genera menu semanal resumido |
| `POST` | `/menus/weekly/full` | Menu semanal completo + KPIs + lista compra |
| `GET` | `/recipes` | Lista de recetas |
| `GET` | `/recipes/{recipe_id}` | Detalle de receta |

## Estructura del repositorio
- `backend/`: API FastAPI, motor de menu y logica de recomendacion.
- `db/`: schema SQL base para evolucion a PostgreSQL.
- `docs/`: product brief, arquitectura, roadmap y demo de API.
- `frontend/`: app web multipagina (`login`, `form`, `recipes`, `recipe`) y estilos compartidos.

## Modelo de datos (DB)
Diseno SQL preparado para evolucion a produccion:
- `users`
- `user_profiles`
- `recipes`
- `weekly_menus`

### Rol de cada entidad
- **users:** identidad basica del usuario.
- **user_profiles:** preferencias nutricionales y restricciones.
- **recipes:** catalogo nutricional con ingredientes y pasos.
- **weekly_menus:** plan semanal persistido en JSONB + trazabilidad.

> Esquema completo en `db/schema.sql`.

## Como ejecutar el proyecto
### 1) Backend
```bash
cd backend
python -m venv .venv
# Windows
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
```

API docs:
- `http://127.0.0.1:8001/docs`

### 2) Frontend
```bash
cd frontend
python -m http.server 5500
```

Abrir:
- `http://127.0.0.1:5500/login.html`

## Seguridad y notas de producto
- Este MVP no sustituye asesoria medica o nutricional profesional.
- La autenticacion actual es de demo; en roadmap se contempla auth robusta y control multi-tenant.

## Roadmap de escalado
### Fase 1 (actual)
- MVP funcional end-to-end.
- Generacion de menu + recetas + shopping list.
- UX multipagina con enfoque demo comercial.

### Fase 2
- Persistencia completa en PostgreSQL.
- Login real y cuentas de usuario.
- Feedback loop para mejorar recomendaciones.
- Ajustes por sexo/objetivo con reglas mas finas.

### Fase 3
- Plataforma SaaS B2B multi-tenant.
- Panel admin para empresas.
- Analytics y reporting de adherencia.
- Integraciones externas (apps fitness, wearables, ERPs wellness).

## Vision
Convertir FitMenu AI en una plataforma escalable de nutricion inteligente para empresas, con impacto real en adherencia, salud preventiva y rendimiento deportivo.

## Autor
**Viorel Gil Ruiz**  
Proyecto en evolucion continua. Se iran incorporando mejoras funcionales, tecnicas y de producto de forma iterativa.
