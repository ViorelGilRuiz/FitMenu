# FitMenu AI Studio

<p align="center">
  <strong>AI Nutrition Platform for Fitness & Wellness</strong><br/>
  Smart weekly menus, step-by-step recipes, and premium UX for B2B use cases.
</p>

<p align="center">
  <a href="./README.md">Version en Espanol</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Advanced%20MVP-1f6feb" alt="status"/>
  <img src="https://img.shields.io/badge/Auth-Backend%20Token-0f9d58" alt="auth"/>
  <img src="https://img.shields.io/badge/Backend-FastAPI-009688" alt="backend"/>
  <img src="https://img.shields.io/badge/Frontend-Vanilla%20JS-ffb300" alt="frontend"/>
</p>

## :star2: Non-technical business guide
- `docs/guia-usuario-empresas.md` (Spanish, business-friendly, visual)

## :sparkles: Current implemented state
- Backend auth completed (`register/login/me` + Bearer token).
- User profile persistence and form auto-fill from API.
- AI insight block after profile form submission.
- Recipe engine with personalization by goal, restrictions, level, prep-time and cost.
- Expanded recipe catalog (`r1` to `r22`).
- 3D cards with hover image carousel.

## :electric_plug: Main endpoints
| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/auth/register` | Register user |
| `POST` | `/auth/login` | Login + token |
| `GET` | `/auth/me` | Authenticated user profile |
| `PUT` | `/auth/me/account` | Update account preferences |
| `PUT` | `/auth/me/profile` | Save nutrition profile |
| `POST` | `/menus/weekly/full` | Full weekly menu + KPIs |
| `GET` | `/recipes` | Recipe catalog |
| `GET` | `/recipes/{recipe_id}` | Recipe details |

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

Open:
- `http://127.0.0.1:5500/login.html`

## :open_file_folder: Docs map
- `docs/guia-usuario-empresas.md`
- `docs/product-brief.md`
- `docs/architecture.md`
- `docs/roadmap.md`
- `docs/api-demo.md`
- `docs/github-profile-pro.md`
- `docs/github-profile-readme-ready-es.md`
- `docs/github-profile-readme-ready-en.md`

## :bust_in_silhouette: Author
**Viorel Gil Ruiz**
