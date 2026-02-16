# API Demo

## Health
```bash
curl http://127.0.0.1:8000/health
```

## Generar menu semanal
```bash
curl -X POST http://127.0.0.1:8000/menus/weekly \
  -H "Content-Type: application/json" \
  -d '{
    "age": 28,
    "weight_kg": 75,
    "height_cm": 178,
    "goal": "gain_muscle",
    "diet": "omnivore",
    "lactose_free": false,
    "gluten_free": false,
    "allergies": ["peanut"],
    "meals_per_day": 4
  }'
```

## Ver receta paso a paso
```bash
curl http://127.0.0.1:8000/recipes/r2
```
