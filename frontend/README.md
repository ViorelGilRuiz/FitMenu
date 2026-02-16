# Frontend Demo Multipagina

Flujo actual:
1. `login.html` (nombre + API + nivel)
2. `form.html` (generar menu por nivel)
3. `recipes.html` (cartas 3D de recetas)
4. `recipe.html` (detalle paso a paso)

Todas las pantallas comparten fondo animado tipo universo/atomos.

## Ejecutar
```bash
cd frontend
python -m http.server 5500
```

Abrir:
- `http://127.0.0.1:5500/login.html`

## Requisito backend
- API en `http://127.0.0.1:8001`
- Endpoints usados: `/menus/weekly`, `/menus/weekly/full`, `/recipes`, `/recipes/{id}`

## Niveles
- `Bajo`: vista simplificada de menu y receta.
- `Intermedio`: vista normal.
- `Avanzado`: muestra KPIs, calorias/proteina por dia y metadatos de receta.
