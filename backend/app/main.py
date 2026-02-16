from typing import Literal

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(
    title="FitMenu AI API",
    version="0.3.0",
    description="API MVP para generar menus semanales saludables personalizados.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class UserProfile(BaseModel):
    sex: Literal["male", "female"] | None = None
    age: int = Field(..., ge=14, le=90)
    weight_kg: float = Field(..., gt=30, lt=300)
    height_cm: int = Field(..., ge=120, le=230)
    goal: Literal["lose_fat", "maintain", "gain_muscle"]
    diet: Literal["omnivore", "vegetarian", "vegan"] = "omnivore"
    lactose_free: bool = False
    gluten_free: bool = False
    allergies: list[str] = Field(default_factory=list)
    meals_per_day: int = Field(default=4, ge=3, le=6)


class RecipeStep(BaseModel):
    step: int
    text: str


class Recipe(BaseModel):
    id: str
    name: str
    calories: int
    protein_g: int
    carbs_g: int
    fat_g: int
    prep_minutes: int
    difficulty: Literal["easy", "medium", "hard"]
    cost_level: Literal["low", "mid", "high"]
    ingredients: list[str]
    steps: list[RecipeStep]


class MealSlot(BaseModel):
    meal_type: str
    recipe_id: str


class DayPlan(BaseModel):
    day: str
    meals: list[MealSlot]


class WeeklyMenu(BaseModel):
    profile_summary: str
    target_calories: int
    week: list[DayPlan]


class MealSlotFull(BaseModel):
    meal_type: str
    recipe: Recipe


class DayPlanFull(BaseModel):
    day: str
    meals: list[MealSlotFull]
    total_calories: int
    total_protein_g: int


class ShoppingItem(BaseModel):
    ingredient: str
    count: int


class WeeklyKpis(BaseModel):
    unique_recipes: int
    avg_daily_calories: int
    avg_daily_protein_g: int
    avg_prep_minutes_per_meal: int


class WeeklyMenuFull(BaseModel):
    profile_summary: str
    target_calories: int
    week: list[DayPlanFull]
    shopping_list: list[ShoppingItem]
    kpis: WeeklyKpis


RECIPES: dict[str, Recipe] = {
    "r1": Recipe(
        id="r1",
        name="Avena proteica con frutas",
        calories=420,
        protein_g=28,
        carbs_g=52,
        fat_g=11,
        prep_minutes=12,
        difficulty="easy",
        cost_level="low",
        ingredients=[
            "60 g de avena",
            "250 ml de leche o bebida vegetal",
            "1 scoop de proteina",
            "1 platano en rodajas",
            "canela al gusto",
        ],
        steps=[
            RecipeStep(step=1, text="Calienta la leche hasta hervor suave."),
            RecipeStep(step=2, text="Agrega la avena y cocina 4-5 minutos."),
            RecipeStep(step=3, text="Retira del fuego y mezcla la proteina."),
            RecipeStep(step=4, text="Sirve con platano y canela."),
        ],
    ),
    "r2": Recipe(
        id="r2",
        name="Bowl de pollo arroz y verduras",
        calories=610,
        protein_g=46,
        carbs_g=68,
        fat_g=16,
        prep_minutes=30,
        difficulty="medium",
        cost_level="mid",
        ingredients=[
            "150 g pechuga de pollo",
            "90 g arroz integral en crudo",
            "brocoli y zanahoria",
            "1 cda de aceite de oliva",
            "sal y especias",
        ],
        steps=[
            RecipeStep(step=1, text="Cocina el arroz integral segun instrucciones."),
            RecipeStep(step=2, text="Saltea el pollo en cubos con especias."),
            RecipeStep(step=3, text="Cocina las verduras al vapor o salteadas."),
            RecipeStep(step=4, text="Monta el bowl y agrega aceite de oliva."),
        ],
    ),
    "r3": Recipe(
        id="r3",
        name="Ensalada de garbanzos y quinoa",
        calories=530,
        protein_g=22,
        carbs_g=71,
        fat_g=17,
        prep_minutes=22,
        difficulty="easy",
        cost_level="low",
        ingredients=[
            "120 g garbanzos cocidos",
            "70 g quinoa en crudo",
            "tomate pepino y cebolla",
            "zumo de limon",
            "1 cda de aceite de oliva",
        ],
        steps=[
            RecipeStep(step=1, text="Enjuaga y cocina la quinoa 12-15 minutos."),
            RecipeStep(step=2, text="Mezcla quinoa cocida con garbanzos y verduras."),
            RecipeStep(step=3, text="Alina con limon aceite y sal."),
        ],
    ),
    "r4": Recipe(
        id="r4",
        name="Yogur con nueces y frutos rojos",
        calories=290,
        protein_g=18,
        carbs_g=21,
        fat_g=15,
        prep_minutes=6,
        difficulty="easy",
        cost_level="mid",
        ingredients=[
            "200 g yogur alto en proteina",
            "30 g frutos rojos",
            "20 g nueces",
        ],
        steps=[
            RecipeStep(step=1, text="Coloca el yogur en un bol."),
            RecipeStep(step=2, text="Agrega frutos rojos y nueces por encima."),
        ],
    ),
    "r5": Recipe(
        id="r5",
        name="Tofu salteado con arroz jazmin",
        calories=560,
        protein_g=32,
        carbs_g=66,
        fat_g=17,
        prep_minutes=28,
        difficulty="medium",
        cost_level="mid",
        ingredients=[
            "180 g tofu firme",
            "80 g arroz jazmin en crudo",
            "pimiento cebolla y calabacin",
            "aceite de oliva",
            "ajo y pimienta",
        ],
        steps=[
            RecipeStep(step=1, text="Cocina el arroz y reserva."),
            RecipeStep(step=2, text="Dora el tofu en cubos con aceite y ajo."),
            RecipeStep(step=3, text="Agrega verduras y saltea 6 minutos."),
            RecipeStep(step=4, text="Sirve junto al arroz."),
        ],
    ),
    "r6": Recipe(
        id="r6",
        name="Salmon al horno con patata y ensalada",
        calories=640,
        protein_g=42,
        carbs_g=49,
        fat_g=28,
        prep_minutes=36,
        difficulty="medium",
        cost_level="high",
        ingredients=[
            "170 g filete de salmon",
            "250 g patata",
            "mezcla de hojas verdes",
            "aceite de oliva y limon",
        ],
        steps=[
            RecipeStep(step=1, text="Hornea la patata en trozos por 25 minutos."),
            RecipeStep(step=2, text="Hornea el salmon 12-14 minutos."),
            RecipeStep(step=3, text="Prepara ensalada con limon y aceite."),
            RecipeStep(step=4, text="Sirve todo en el plato."),
        ],
    ),
    "r7": Recipe(
        id="r7",
        name="Tortilla de claras con espinaca",
        calories=330,
        protein_g=33,
        carbs_g=12,
        fat_g=14,
        prep_minutes=14,
        difficulty="easy",
        cost_level="low",
        ingredients=[
            "6 claras y 1 huevo entero",
            "espinaca fresca",
            "tomate en cubos",
            "sal y pimienta",
        ],
        steps=[
            RecipeStep(step=1, text="Bate las claras con el huevo y sal."),
            RecipeStep(step=2, text="Saltea espinaca 1 minuto."),
            RecipeStep(step=3, text="Agrega mezcla de huevo y cocina hasta cuajar."),
        ],
    ),
    "r8": Recipe(
        id="r8",
        name="Smoothie vegano de proteina y cacao",
        calories=360,
        protein_g=27,
        carbs_g=35,
        fat_g=11,
        prep_minutes=7,
        difficulty="easy",
        cost_level="low",
        ingredients=[
            "1 banana",
            "250 ml bebida de almendra",
            "1 scoop proteina vegetal",
            "1 cda cacao puro",
            "hielo",
        ],
        steps=[
            RecipeStep(step=1, text="Coloca todos los ingredientes en licuadora."),
            RecipeStep(step=2, text="Licua 40 segundos hasta textura cremosa."),
        ],
    ),
    "r9": Recipe(
        id="r9",
        name="Pudin de chia con mango",
        calories=340,
        protein_g=12,
        carbs_g=36,
        fat_g=16,
        prep_minutes=8,
        difficulty="easy",
        cost_level="low",
        ingredients=[
            "35 g semillas de chia",
            "220 ml bebida de coco sin azucar",
            "1/2 mango en cubos",
            "canela",
        ],
        steps=[
            RecipeStep(step=1, text="Mezcla chia con bebida de coco y canela."),
            RecipeStep(step=2, text="Refrigera 4 horas o toda la noche."),
            RecipeStep(step=3, text="Sirve con mango en cubos."),
        ],
    ),
    "r10": Recipe(
        id="r10",
        name="Guiso de lentejas rojas con verduras",
        calories=480,
        protein_g=24,
        carbs_g=62,
        fat_g=12,
        prep_minutes=24,
        difficulty="medium",
        cost_level="low",
        ingredients=[
            "120 g lenteja roja",
            "zanahoria cebolla y apio",
            "tomate triturado",
            "comino pimenton y sal",
            "1 cda aceite de oliva",
        ],
        steps=[
            RecipeStep(step=1, text="Sofrie verduras picadas con aceite 4 minutos."),
            RecipeStep(step=2, text="Agrega especias, lenteja y tomate triturado."),
            RecipeStep(step=3, text="Cubre con agua y cocina 20 minutos."),
        ],
    ),
}


RECIPE_META: dict[str, dict[str, object]] = {
    "r1": {
        "diets": {"omnivore", "vegetarian"},
        "meal_types": {"breakfast", "snack_am", "snack_pm"},
        "lactose_free": False,
        "gluten_free": False,
        "allergens": {"milk"},
    },
    "r2": {
        "diets": {"omnivore"},
        "meal_types": {"lunch", "dinner"},
        "lactose_free": True,
        "gluten_free": True,
        "allergens": set(),
    },
    "r3": {
        "diets": {"omnivore", "vegetarian", "vegan"},
        "meal_types": {"lunch", "dinner"},
        "lactose_free": True,
        "gluten_free": True,
        "allergens": set(),
    },
    "r4": {
        "diets": {"omnivore", "vegetarian"},
        "meal_types": {"breakfast", "snack_am", "snack_pm", "late_snack"},
        "lactose_free": False,
        "gluten_free": True,
        "allergens": {"milk", "tree_nuts"},
    },
    "r5": {
        "diets": {"omnivore", "vegetarian", "vegan"},
        "meal_types": {"lunch", "dinner"},
        "lactose_free": True,
        "gluten_free": True,
        "allergens": {"soy"},
    },
    "r6": {
        "diets": {"omnivore"},
        "meal_types": {"lunch", "dinner"},
        "lactose_free": True,
        "gluten_free": True,
        "allergens": {"fish"},
    },
    "r7": {
        "diets": {"omnivore", "vegetarian"},
        "meal_types": {"breakfast", "dinner"},
        "lactose_free": True,
        "gluten_free": True,
        "allergens": {"egg"},
    },
    "r8": {
        "diets": {"omnivore", "vegetarian", "vegan"},
        "meal_types": {"breakfast", "snack_am", "snack_pm", "late_snack"},
        "lactose_free": True,
        "gluten_free": True,
        "allergens": {"tree_nuts"},
    },
    "r9": {
        "diets": {"omnivore", "vegetarian", "vegan"},
        "meal_types": {"breakfast", "snack_am", "snack_pm", "late_snack"},
        "lactose_free": True,
        "gluten_free": True,
        "allergens": set(),
    },
    "r10": {
        "diets": {"omnivore", "vegetarian", "vegan"},
        "meal_types": {"lunch", "dinner"},
        "lactose_free": True,
        "gluten_free": True,
        "allergens": set(),
    },
}


DAYS = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
]


def estimate_calories(profile: UserProfile) -> int:
    bmr = (10 * profile.weight_kg) + (6.25 * profile.height_cm) - (5 * profile.age) + 5
    maintenance = bmr * 1.45
    if profile.goal == "lose_fat":
        maintenance -= 350
    elif profile.goal == "gain_muscle":
        maintenance += 280
    return int(max(maintenance, 1400))


def compatible_recipe_ids(profile: UserProfile) -> list[str]:
    allergy_aliases = {
        "nuts": "tree_nuts",
        "nut": "tree_nuts",
        "peanut": "tree_nuts",
        "peanuts": "tree_nuts",
        "lactose": "milk",
        "dairy": "milk",
    }
    allergies = set()
    for item in profile.allergies:
        value = item.strip().lower()
        if value:
            allergies.add(allergy_aliases.get(value, value))

    compatible: list[str] = []
    for recipe_id in RECIPES:
        meta = RECIPE_META[recipe_id]
        if profile.diet not in meta["diets"]:
            continue
        if profile.lactose_free and not meta["lactose_free"]:
            continue
        if profile.gluten_free and not meta["gluten_free"]:
            continue
        if allergies & meta["allergens"]:
            continue
        compatible.append(recipe_id)

    if not compatible:
        raise HTTPException(
            status_code=422,
            detail="No hay recetas compatibles con la dieta/restricciones actuales.",
        )

    return compatible


def meal_slots_for_profile(profile: UserProfile) -> list[str]:
    slots = ["breakfast", "lunch", "dinner", "snack_am", "snack_pm", "late_snack"]
    return slots[: profile.meals_per_day]


def recipe_score(recipe: Recipe, goal: str) -> float:
    protein_density = (recipe.protein_g / recipe.calories) * 100 if recipe.calories else 0
    calories_factor = recipe.calories / 100

    if goal == "gain_muscle":
        return (protein_density * 2.2) + (calories_factor * 0.9)
    if goal == "lose_fat":
        return (protein_density * 2.4) - (calories_factor * 0.55)
    return (protein_density * 2.0) + (calories_factor * 0.2)


def pick_recipe_for_slot(
    slot: str,
    day_index: int,
    slot_index: int,
    compatible_ids: list[str],
    profile: UserProfile,
) -> str:
    slot_candidates = [
        rid for rid in compatible_ids if slot in RECIPE_META[rid]["meal_types"]
    ]
    if not slot_candidates:
        slot_candidates = compatible_ids

    ranked = sorted(
        slot_candidates,
        key=lambda rid: (recipe_score(RECIPES[rid], profile.goal), rid),
        reverse=True,
    )

    rotation = int(profile.age + profile.weight_kg + (day_index * 3) + slot_index) % len(ranked)
    return ranked[rotation]


def build_weekly_menu(profile: UserProfile) -> WeeklyMenu:
    calories = estimate_calories(profile)
    compatible_ids = compatible_recipe_ids(profile)
    meal_slots = meal_slots_for_profile(profile)

    week: list[DayPlan] = []
    for day_index, day in enumerate(DAYS):
        meals: list[MealSlot] = []
        for slot_index, slot in enumerate(meal_slots):
            recipe_id = pick_recipe_for_slot(
                slot=slot,
                day_index=day_index,
                slot_index=slot_index,
                compatible_ids=compatible_ids,
                profile=profile,
            )
            meals.append(MealSlot(meal_type=slot, recipe_id=recipe_id))
        week.append(DayPlan(day=day, meals=meals))

    summary = (
        f"goal={profile.goal}, diet={profile.diet}, meals_per_day={profile.meals_per_day}, "
        f"lactose_free={profile.lactose_free}, gluten_free={profile.gluten_free}, "
        f"allergies={','.join(profile.allergies) if profile.allergies else 'none'}"
    )

    return WeeklyMenu(profile_summary=summary, target_calories=calories, week=week)


def build_weekly_menu_full(profile: UserProfile) -> WeeklyMenuFull:
    base_menu = build_weekly_menu(profile)

    week_full: list[DayPlanFull] = []
    ingredient_counts: dict[str, int] = {}
    used_recipe_ids: set[str] = set()

    prep_sum = 0
    meal_count = 0
    calories_sum = 0
    protein_sum = 0

    for day in base_menu.week:
        full_meals: list[MealSlotFull] = []
        daily_calories = 0
        daily_protein = 0

        for meal in day.meals:
            recipe = RECIPES[meal.recipe_id]
            full_meals.append(MealSlotFull(meal_type=meal.meal_type, recipe=recipe))

            daily_calories += recipe.calories
            daily_protein += recipe.protein_g
            used_recipe_ids.add(recipe.id)
            prep_sum += recipe.prep_minutes
            meal_count += 1

            for ingredient in recipe.ingredients:
                ingredient_counts[ingredient] = ingredient_counts.get(ingredient, 0) + 1

        calories_sum += daily_calories
        protein_sum += daily_protein
        week_full.append(
            DayPlanFull(
                day=day.day,
                meals=full_meals,
                total_calories=daily_calories,
                total_protein_g=daily_protein,
            )
        )

    shopping = [
        ShoppingItem(ingredient=ingredient, count=count)
        for ingredient, count in sorted(ingredient_counts.items(), key=lambda x: x[0])
    ]

    kpis = WeeklyKpis(
        unique_recipes=len(used_recipe_ids),
        avg_daily_calories=int(calories_sum / 7) if week_full else 0,
        avg_daily_protein_g=int(protein_sum / 7) if week_full else 0,
        avg_prep_minutes_per_meal=int(prep_sum / meal_count) if meal_count else 0,
    )

    return WeeklyMenuFull(
        profile_summary=base_menu.profile_summary,
        target_calories=base_menu.target_calories,
        week=week_full,
        shopping_list=shopping,
        kpis=kpis,
    )


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/menus/weekly", response_model=WeeklyMenu)
def generate_weekly_menu(profile: UserProfile) -> WeeklyMenu:
    return build_weekly_menu(profile)


@app.post("/menus/weekly/full", response_model=WeeklyMenuFull)
def generate_weekly_menu_full(profile: UserProfile) -> WeeklyMenuFull:
    return build_weekly_menu_full(profile)


@app.get("/recipes/{recipe_id}", response_model=Recipe)
def get_recipe(recipe_id: str) -> Recipe:
    recipe = RECIPES.get(recipe_id)
    if not recipe:
        raise HTTPException(status_code=404, detail="Receta no encontrada")
    return recipe


@app.get("/recipes", response_model=list[Recipe])
def list_recipes() -> list[Recipe]:
    return list(RECIPES.values())
