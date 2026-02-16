# FitMenu AI Studio

<p align="center">
  <strong>AI Nutrition Platform for Fitness & Wellness</strong><br/>
  Smart weekly menus, step-by-step recipes, and premium UX for B2B use cases.
</p>

<p align="center">
  <a href="./README.md">Version en Espanol</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-In%20Development-1f6feb" alt="status"/>
  <img src="https://img.shields.io/badge/Backend-FastAPI-009688" alt="backend"/>
  <img src="https://img.shields.io/badge/Frontend-Vanilla%20JS-ffb300" alt="frontend"/>
  <img src="https://img.shields.io/badge/Architecture-B2B%20Ready-7b1fa2" alt="architecture"/>
</p>

![FitMenu Hero](docs/assets/fitmenu-hero.svg)

## 0. Visual overview
### Product flow
![FitMenu Flow](docs/assets/fitmenu-flow.svg)

### Architecture
![FitMenu Architecture](docs/assets/fitmenu-architecture.svg)

## 1. Project vision
**FitMenu AI Studio** is an intelligent nutrition platform focused on sports performance, wellness, and dietary adherence.

The goal is to evolve from a **working MVP** into a **scalable B2B SaaS** for gyms, wellness companies, coaches, and digital health products.

## 2. Problem it solves
People who train or want to improve their health often struggle with:
- realistic weekly meal planning,
- clear and sustainable recipes,
- adapting diet to goals and restrictions,
- maintaining long-term consistency.

## 3. Proposed solution
FitMenu AI converts profile data into actionable outputs:
- personalized weekly menu,
- healthy step-by-step recipes,
- nutritional data (kcal, protein, carbs, fat),
- aggregated shopping list,
- modern UX to improve engagement.

## 4. B2B value proposition
- Personalized nutrition at scale.
- Better retention and adherence for end users.
- White-label integration potential.
- Foundation ready for multi-tenant growth.

## 5. Current status
**Actively in development.**

Current deliverables:
- operational backend with rules engine,
- multi-page frontend,
- complete flow from login to recipe detail,
- technical and product documentation.

## 6. Application flow
1. `login.html`
2. `form.html`
3. `recipes.html`
4. `recipe.html`

## 7. Technical architecture
```text
Frontend (HTML/CSS/JS multipage)
        |
        v
Backend API (FastAPI + nutrition rules engine)
        |
        v
SQL Data Model (PostgreSQL-ready schema)
```

## 8. Main endpoints
| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/health` | Service status |
| `POST` | `/menus/weekly` | Weekly menu |
| `POST` | `/menus/weekly/full` | Full menu + KPIs + shopping list |
| `GET` | `/recipes` | Recipe catalog |
| `GET` | `/recipes/{recipe_id}` | Recipe detail |

## 9. Local run
### Backend
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
```

### Frontend
```bash
cd frontend
python -m http.server 5500
```

## 10. Scale roadmap
- Phase 1: Working MVP.
- Phase 2: Real persistence + robust auth + adaptive feedback loop.
- Phase 3: Multi-tenant B2B SaaS + analytics + integrations.

## 11. Author
**Viorel Gil Ruiz**
