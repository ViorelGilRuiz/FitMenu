# Arquitectura MVP

## Componentes
1. Frontend (Next.js)
- Onboarding de perfil
- Vista de menú semanal
- Vista de receta paso a paso
- Lista de compra

2. Backend (FastAPI)
- API de perfiles
- Motor de planificación semanal
- API de recetas
- Cálculo de macros/calorías por comida

3. Datos (PostgreSQL)
- Usuarios
- Preferencias y restricciones
- Recetas
- Planes semanales
- Historial y feedback

## Flujo principal
1. Usuario completa onboarding.
2. Backend calcula rango calórico/macros por objetivo.
3. Motor selecciona recetas compatibles.
4. Se genera menú de 7 días.
5. Sistema construye lista de compra agregada.

## IA en el sistema
- Recomendador de comidas por perfil.
- Generación de instrucciones culinarias claras.
- Sustituciones de ingredientes por alergias/preferencias.
- Explicación de por qué cada comida encaja con el objetivo.

## Seguridad y cumplimiento
- Token auth para APIs.
- Separación por tenant para B2B.
- Logging y trazabilidad de recomendaciones.
- Aviso: no reemplaza consulta médica/nutricional profesional.
