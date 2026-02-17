# 🍽️ FitMenu AI Studio

<p align="center">
  <strong>Plataforma de nutrición inteligente con experiencia visual premium</strong><br/>
  Login interactivo, perfil personalizado, menú semanal por IA y recetas paso a paso.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Estado-En%20desarrollo-1f6feb" alt="estado"/>
  <img src="https://img.shields.io/badge/Frontend-HTML%20%7C%20CSS%20%7C%20JS-ffb300" alt="frontend"/>
  <img src="https://img.shields.io/badge/Backend-FastAPI-009688" alt="backend"/>
  <img src="https://img.shields.io/badge/Auth-LocalStorage%20%2B%20Token%20simulado-7b1fa2" alt="auth"/>
  <img src="https://img.shields.io/badge/UI-Glass%20%2B%20Neon%20Warm-ff7043" alt="ui"/>
</p>

---

## ✨ Qué es
**FitMenu AI Studio** es una aplicación web orientada a fitness/bienestar que:
- autentica usuarios (registro/login),
- recoge un perfil nutricional,
- genera menús semanales personalizados,
- permite navegar recetas con detalle técnico y visual.

El proyecto está diseñado para evolucionar a producto B2B escalable.

---

## 🧭 Flujo de navegación actual
1. **`login.html`**  
   Acceso o creación de cuenta.
2. **`form.html`**  
   Formulario completo del perfil (precargado si ya existe).
3. **`menu.html`**  
   Menú semanal full page con navegación por semana y por día.
4. **`recipe.html`**  
   Receta full page con acciones (hecha/favoritos placeholder).
5. **`recipes.html`**  
   Catálogo visual de cartas 3D.

### Reglas de guard implementadas
- Sin sesión: redirige a `login.html`.
- Con sesión:
  - si no hay perfil completo o no hay menú: `form.html`,
  - si ya hay perfil + menú: `menu.html`.
- `recipe.html` exige sesión + menú generado.

---

## 🧱 Arquitectura frontend (refactor modular)

```text
frontend/
  background.js                 # Inicializador visual por escena
  login.html
  form.html
  menu.html
  recipes.html
  recipe.html
  shared.css
  js/
    services/
      storage.js
      authService.js
      userService.js
      recipeService.js
      menuService.js
      guards.js
    ui/
      navbar.js
      AnimatedCookingBackground.js
      cooking/
        assets.js
        physics.js
    pages/
      loginPage.js
      formPage.js
      menuPage.js
      recipesPage.js
      recipePage.js
```

---

## 🔐 Persistencia local (simulación backend)
Se usa `localStorage` con prefijo `fitmenu_v2`:
- `users`: usuarios registrados (password hasheada en navegador).
- `session`: sesión activa.
- `user_data`: perfil, menús, favoritos, cocinadas, notas.
- `recipes_cache`: catálogo de recetas cacheado.

---

## 🧠 Motor de menú semanal
`menuService.js`:
- calcula calorías objetivo por perfil,
- ajusta dificultad según nivel de usuario,
- genera semana completa (7 días),
- hidrata `recipe_id` con objetos receta para render.

---

## 🎨 Fondo animado del login (Canvas pro)
Implementado en `AnimatedCookingBackground.js`:
- sartén 2D con perspectiva suave,
- fuego procedural animado bajo la sartén,
- ingredientes cayendo continuamente,
- colisión/rebote dentro de la sartén,
- hover (escala + glow + tooltip),
- drag&drop a la sartén con efecto “sizzle”,
- doble click para “pin” temporal,
- click derecho para eliminar ingrediente,
- pausa por `document.hidden`,
- respeto de `prefers-reduced-motion`,
- `devicePixelRatio` limitado a `1.5`.

---

## 🚀 Ejecutar en local

### Frontend (rápido)
```bash
cd frontend
python -m http.server 5500
```
Abrir:
- `http://127.0.0.1:5500/login.html`

### Backend (opcional en esta fase)
```bash
cd backend
python -m venv .venv
# Windows
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
```

---

## ✅ Casos manuales recomendados
1. Usuario nuevo: login → form → guardar → menu → recipe → volver.
2. Usuario existente con menú: login → entra directo a menu.
3. Editar perfil: menu → “Editar perfil” → guardar → volver a menu.
4. Sin sesión: abrir `menu.html` o `recipe.html` → redirección a login.
5. Login fondo: hover/drag/drop sobre ingredientes sin bloquear inputs.

---

## 📚 Documentación
- Guía no técnica para negocio: `docs/guia-usuario-empresas.md`
- **Nueva guía técnica para desarrolladores:** `docs/guia-programador.md`
- Arquitectura: `docs/architecture.md`
- Roadmap: `docs/roadmap.md`

---

## 📈 Estado del proyecto
Proyecto en desarrollo activo.  
Objetivo: escalar FitMenu AI Studio hacia un producto comercial robusto (B2B/SaaS) con backend productivo, métricas y panel empresarial.

---

## 👨‍💻 Autor
**Viorel Gil Ruiz**

