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
  <img src="https://img.shields.io/badge/Go--To--Market-B2B-7b1fa2" alt="b2b"/>
</p>

## :rocket: Project proposition
**FitMenu AI Studio** is an intelligent nutrition platform for fitness performance and wellness.

It is designed to evolve from a **working MVP** into a **scalable B2B SaaS** for gyms, wellness companies, nutrition programs, and white-label partners.

## :briefcase: Business value
- Personalized nutrition at scale.
- Better user adherence and retention.
- Lower friction for nutrition teams.
- Strong base for productization and commercial growth.

## :sparkles: Latest updates
- Full backend auth flow: `Sign in / Register` with Bearer token.
- Real user persistence on server (`backend/data/users.json` in demo mode).
- Extended onboarding with lifestyle variables.
- Login data is pushed into the form and stored profile is auto-filled from API.
- New `AI Insight` block after form submission with personalized guidance.
- Richer nutrition profile inputs.
- Recommendation engine adapted to cooking level.
- Expanded recipe catalog (`r1` to `r22`).
- `3D Cards` page filtered by difficulty according to user level.
- Enhanced 3D cards with image hover carousel and smoother interactions.

## :brain: Variables now affecting recommendations
- `cook_level`: `basic`, `intermediate`, `advanced`
- `activity_level`: `low`, `moderate`, `high`
- `training_days`: 0-7
- `max_prep_minutes`
- `preferred_cost`: `low`, `mid`, `high`, `any`
- `dislikes`

## :salad: Level-based logic
- **Low (`basic`)**: `easy` recipes only.
- **Intermediate**: `easy` + `medium`.
- **Advanced**: `easy` + `medium` + `hard`.

## :compass: App flow
1. `login.html` (register or sign in)
2. `form.html` (auto-fills when user profile exists)
3. `recipes.html`
4. `recipe.html`

## :building_construction: Technical architecture
```text
Frontend (HTML/CSS/JS multipage)
        |
        v
Backend API (FastAPI + nutrition rules engine)
        |
        v
SQL Data Model (PostgreSQL-ready schema)
```

## :electric_plug: Main endpoints
| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/auth/register` | User registration |
| `POST` | `/auth/login` | Login and token issuance |
| `GET` | `/auth/me` | Authenticated user profile |
| `PUT` | `/auth/me/account` | Update account preferences |
| `PUT` | `/auth/me/profile` | Save nutrition profile |
| `GET` | `/health` | Service status |
| `POST` | `/menus/weekly` | Weekly menu |
| `POST` | `/menus/weekly/full` | Full menu + KPIs + shopping list |
| `GET` | `/recipes` | Recipe catalog |
| `GET` | `/recipes/{recipe_id}` | Recipe details |

## :lock: Security and authentication (current)
- Password hashing with `PBKDF2-HMAC-SHA256`.
- Signed Bearer token with expiration.
- Authenticated account/profile persistence via API.
- Note: for production, migrate to standard JWT + persistent database.

## :arrow_forward: Local run
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

## :chart_with_upwards_trend: Scaling roadmap
- Phase 1: Functional MVP and demo-ready product.
- Phase 2: Production persistence + robust authentication + adaptive feedback loop.
- Phase 3: Multi-tenant B2B SaaS + analytics + ecosystem integrations.

## :art: Professional GitHub branding
A practical checklist to improve your GitHub profile and commercial presentation is included at:
- `docs/github-profile-pro.md`
- `docs/github-profile-readme-template.md`

## :bust_in_silhouette: Author
**Viorel Gil Ruiz**
