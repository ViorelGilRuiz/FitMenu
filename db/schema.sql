CREATE TABLE users (
  id UUID PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE user_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id),
  sex TEXT CHECK (sex IN ('male', 'female')),
  age INT NOT NULL,
  weight_kg NUMERIC(5,2) NOT NULL,
  height_cm INT NOT NULL,
  goal TEXT NOT NULL CHECK (goal IN ('lose_fat', 'maintain', 'gain_muscle')),
  diet TEXT NOT NULL CHECK (diet IN ('omnivore', 'vegetarian', 'vegan')),
  lactose_free BOOLEAN NOT NULL DEFAULT FALSE,
  gluten_free BOOLEAN NOT NULL DEFAULT FALSE,
  allergies TEXT[] NOT NULL DEFAULT '{}',
  dislikes TEXT[] NOT NULL DEFAULT '{}',
  cook_level TEXT NOT NULL DEFAULT 'intermediate' CHECK (cook_level IN ('basic', 'intermediate', 'advanced')),
  activity_level TEXT NOT NULL DEFAULT 'moderate' CHECK (activity_level IN ('low', 'moderate', 'high')),
  training_days INT NOT NULL DEFAULT 3 CHECK (training_days BETWEEN 0 AND 7),
  max_prep_minutes INT NOT NULL DEFAULT 45 CHECK (max_prep_minutes BETWEEN 10 AND 120),
  preferred_cost TEXT NOT NULL DEFAULT 'any' CHECK (preferred_cost IN ('low', 'mid', 'high', 'any')),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE recipes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  calories INT NOT NULL,
  protein_g INT NOT NULL,
  carbs_g INT NOT NULL,
  fat_g INT NOT NULL,
  ingredients JSONB NOT NULL,
  steps JSONB NOT NULL
);

CREATE TABLE weekly_menus (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  target_calories INT NOT NULL,
  week_start DATE NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
