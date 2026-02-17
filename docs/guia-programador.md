# 🛠️ Guía del Programador — FitMenu AI Studio

> Documento técnico detallado para entender el proyecto desde cero y continuar su evolución con criterio de arquitectura frontend senior.

---

## 1) 🎯 Objetivo técnico del sistema
FitMenu AI Studio organiza la experiencia en 5 pantallas:
- `login.html`
- `form.html`
- `menu.html`
- `recipes.html`
- `recipe.html`

Con una base modular en ES Modules, servicios desacoplados y estado persistido en `localStorage`.

---

## 2) 🧱 Estructura real del frontend

```text
frontend/
  background.js
  shared.css
  login.html
  form.html
  menu.html
  recipes.html
  recipe.html
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

## 3) 💾 Persistencia y modelo de datos (frontend)

### 3.1 `storage.js`
Este archivo es la capa base de I/O local.

#### Responsabilidades
- Prefijar claves (`fitmenu_v2`).
- Leer/escribir JSON con control de errores.
- Exponer `storageKeys` centralizados.

#### Por qué está así
- Evita strings sueltas de `localStorage` por todo el proyecto.
- Permite cambiar backend de persistencia futuro con impacto mínimo.

---

### 3.2 `authService.js`
Gestiona:
- registro,
- login,
- sesión activa,
- logout.

#### Flujo de registro (resumen de código)
1. Normaliza email (`normalizeEmail`).
2. Valida password mínima.
3. Comprueba duplicados en `users`.
4. Hashea password (SHA-256 con `crypto.subtle` si disponible).
5. Guarda usuario.
6. Crea sesión (`token` simple + `userId` + `timestamp`).

#### Decisiones técnicas
- Hash en cliente como mejora mínima (sin backend real).
- API de sesión simple para poder migrar luego a JWT real.

---

### 3.3 `userService.js`
Gestiona estado de negocio por usuario:
- `profile`
- `menus`
- `favorites`
- `cooked`
- `notes`

#### Claves
- `isProfileComplete(profile)` define el contrato para habilitar menú.
- `saveGeneratedMenu` mantiene histórico limitado.

---

## 4) 🧠 Generación de menú y catálogo

### 4.1 `recipeService.js`
- Carga recetas desde API si disponible.
- Si no, usa fallback local (`LOCAL_RECIPES`).
- Cachea en `recipes_cache`.

### 4.2 `menuService.js`
Funciones principales:
- `estimateTargetCalories(profile)`  
  Calcula objetivo calórico con BMR + factor actividad + ajuste por objetivo.
- `buildWeeklyMenu(profile, recipes, weekIndex)`  
  Construye estructura semanal por días y tipos de comida.
- `hydrateMenuWithRecipes(menu, recipes)`  
  Convierte `recipe_id` en objeto receta para pintar UI sin fetch extra.
- `buildWeekAdvice(...)`  
  Genera consejo IA rotativo por semana.

---

## 5) 🛡️ Guards y reglas de navegación

### `guards.js`
Este archivo centraliza todas las redirecciones:

- `guardLoginPage()`
- `guardFormPage()`
- `guardMenuPage()`
- `guardRecipePage()`
- `getPostLoginRoute(userId)`

#### Regla núcleo
Si no hay sesión válida:
```js
window.location.replace("login.html");
```

#### Regla post-login
```js
if (!hasProfile || !hasMenu) return "form.html";
return "menu.html";
```

---

## 6) 🧩 UI reusable y composición

### `ui/navbar.js`
Componente reusable de topbar:
- renderiza enlaces por página activa,
- ofrece botones comunes (`Atras`, `Salir`),
- encapsula `bindNavbarActions()`.

Beneficio: consistencia visual y menos duplicación en HTML.

---

## 7) 📄 Lógica de cada página

### 7.1 `pages/loginPage.js`
- Ejecuta `guardLoginPage()` al inicio.
- Valida credenciales.
- `loginUser` / `registerUser`.
- Redirige según `getPostLoginRoute`.

### 7.2 `pages/formPage.js`
- Ejecuta `guardFormPage()`.
- Precarga perfil si existe.
- Valida formulario.
- Guarda perfil.
- Si no hay menú: genera primero menú y luego redirige.

### 7.3 `pages/menuPage.js`
- Ejecuta `guardMenuPage()`.
- Carga menús + recetas.
- Renderiza semana actual, día actual y detalle.
- CTA:
  - editar perfil,
  - generar nueva semana,
  - abrir receta.

### 7.4 `pages/recipesPage.js`
- Grid visual de tarjetas.
- Tilt 3D por puntero.
- Click abre `recipe.html?id=...`.

### 7.5 `pages/recipePage.js`
- Ejecuta `guardRecipePage()`.
- Resuelve receta por query/localStorage.
- Render hero + ingredientes + pasos + acciones placeholder.

---

## 8) 🎞️ Motor de fondo animado (login)

### 8.1 `background.js`
Inicializador por escena:
- `data-scene="login"` -> `AnimatedCookingBackground`.
- resto -> starfield ligero.

### 8.2 `AnimatedCookingBackground.js` (desglose técnico)

#### a) Setup
- Contexto canvas 2D.
- Normalización de DPR (`<=1.5`).
- Estado de puntero.
- Colecciones: ingredientes, partículas sizzle, estado de sartén/fuego.

#### b) Game loop
- `requestAnimationFrame`.
- `frame(now)`:
  1. calcula `dt`,
  2. `update(dt, now)`,
  3. `render(now)`.

#### c) Física de ingredientes
Cada ingrediente:
```js
{
  x, y, vx, vy, rot, vr, radius,
  state: "falling" | "inPan" | "dragged",
  scale, targetScale, inPanSince
}
```

En `update`:
- gravedad progresiva,
- damping,
- colisión con elipse de drop-zone de la sartén,
- rebote suave y deslizamiento al centro.

#### d) Caída continua (sin paradas)
- mínimo de ítems en caída (`minFallingItems`),
- respawn por tiempo,
- reciclado de ítems “en sartén” tras varios segundos.

#### e) Interacciones
- hover: escala `1.25` + glow + tooltip.
- drag: escala `1.35`, suelta dentro/fuera.
- drop en sartén: `spawnSizzle`.
- doble click: “pin”.
- click derecho: elimina.

#### f) Accesibilidad y rendimiento
- pausa al ocultar pestaña (`document.hidden`),
- `prefers-reduced-motion`,
- reducción de intensidad al enfocar inputs del login.

---

## 9) 🎨 Estilos y diseño

### `shared.css`
Define:
- tema base,
- glass/neón cálido,
- layout de páginas,
- componentes (cards, paneles, topbar, botones),
- comportamiento responsive.

Buenas prácticas usadas:
- clases reutilizables,
- jerarquía visual consistente,
- contraste alto en formularios.

---

## 10) ▶️ Cómo ejecutar y depurar

### Ejecutar frontend
```bash
cd frontend
python -m http.server 5500
```

### URLs
- `http://127.0.0.1:5500/login.html`
- `http://127.0.0.1:5500/form.html`
- `http://127.0.0.1:5500/menu.html`
- `http://127.0.0.1:5500/recipes.html`
- `http://127.0.0.1:5500/recipe.html`

### Checklist de validación rápida
1. Login funciona (crear cuenta + entrar).
2. Usuario nuevo cae en `form`.
3. Guardar perfil genera menú y va a `menu`.
4. Abrir receta funciona.
5. Sin sesión, `menu/recipe` redirigen a login.
6. Fondo login mantiene 60fps y no tapa inputs.

---

## 11) 🧭 Roadmap técnico recomendado
1. Migrar autenticación a backend real con refresh tokens.
2. Persistir perfil y menús en PostgreSQL.
3. Añadir capa de estado global ligera (`signals` o store local).
4. Tests E2E de flujo (`login -> form -> menu -> recipe`).
5. Telemetría UX (interacciones y tiempos de generación).

---

## 12) 👨‍💻 Convenciones para contribuir
- Mantener ASCII en código.
- Evitar lógica inline en HTML.
- Añadir módulos por responsabilidad única.
- No introducir dependencias pesadas sin justificar.
- Priorizar UX + rendimiento + accesibilidad.

---

### Nota final
Esta guía es la base para una **nueva documentación de ingeniería** del proyecto.  
Si quieres, el siguiente paso lo preparo en formato “playbook” por fases (`fase 1, fase 2, fase 3`) para equipos de desarrollo.

