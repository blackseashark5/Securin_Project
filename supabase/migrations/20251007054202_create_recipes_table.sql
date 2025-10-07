/*
  # Create recipes table with JSONB support
  
  ## Overview
  This migration creates the core recipes table for storing parsed recipe data with proper indexing
  for efficient querying, filtering, and sorting operations.
  
  ## New Tables
  
  ### `recipes`
  Stores all recipe information with the following columns:
  - `id` (uuid, primary key) - Unique identifier for each recipe
  - `cuisine` (varchar) - Type of cuisine (e.g., "Southern Recipes", "Italian")
  - `title` (varchar) - Recipe name/title
  - `rating` (real) - User rating from 0-5, NULL if not rated or NaN in source
  - `prep_time` (integer) - Preparation time in minutes, NULL if invalid/NaN
  - `cook_time` (integer) - Cooking time in minutes, NULL if invalid/NaN
  - `total_time` (integer) - Total time in minutes, NULL if invalid/NaN
  - `description` (text) - Full recipe description
  - `nutrients` (jsonb) - Complete nutrition information as structured JSON
  - `serves` (varchar) - Number of servings (e.g., "8 servings")
  - `calories_int` (integer) - Normalized numeric calories extracted from nutrients for efficient filtering
  - `url` (varchar) - Original recipe URL
  - `country_state` (varchar) - Country/state origin
  - `continent` (varchar) - Continent origin
  - `ingredients` (jsonb) - Array of ingredients
  - `instructions` (jsonb) - Array of cooking instructions
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Record update timestamp
  
  ## Indexes
  
  1. **idx_recipes_rating** - B-tree index on rating (DESC NULLS LAST) for efficient sorting
  2. **idx_recipes_calories** - B-tree index on calories_int for numeric range filtering
  3. **idx_recipes_total_time** - B-tree index on total_time for time-based filtering
  4. **idx_recipes_title** - GIN index for full-text search on titles
  5. **idx_recipes_cuisine** - B-tree index for cuisine filtering
  6. **idx_recipes_nutrients** - GIN index on nutrients JSONB for flexible JSON queries
  
  ## Security
  
  - Enable Row Level Security (RLS) on recipes table
  - Add policy allowing public read access (SELECT) for all users
  - Write operations restricted (no public INSERT/UPDATE/DELETE policies)
  
  ## Design Decisions
  
  1. **NaN Handling**: All numeric fields use NULL to represent missing/invalid data
  2. **JSONB for Flexibility**: nutrients, ingredients, and instructions stored as JSONB for:
     - Flexible schema evolution
     - Efficient querying with GIN indexes
     - Native JSON operations in PostgreSQL
  3. **Normalized Calories**: calories_int extracted for performance (avoiding JSONB parsing in filters)
  4. **Timestamps**: Automatic tracking of created_at and updated_at for auditing
  5. **Text Search**: GIN index on title enables efficient ILIKE and full-text search operations
*/

-- Create recipes table
CREATE TABLE IF NOT EXISTS recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cuisine varchar(255),
  title varchar(1024),
  rating real,
  prep_time integer,
  cook_time integer,
  total_time integer,
  description text,
  nutrients jsonb,
  serves varchar(255),
  calories_int integer,
  url varchar(2048),
  country_state varchar(255),
  continent varchar(255),
  ingredients jsonb,
  instructions jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_recipes_rating ON recipes (rating DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_recipes_calories ON recipes (calories_int);
CREATE INDEX IF NOT EXISTS idx_recipes_total_time ON recipes (total_time);
CREATE INDEX IF NOT EXISTS idx_recipes_cuisine ON recipes (cuisine);
CREATE INDEX IF NOT EXISTS idx_recipes_title ON recipes USING gin (to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_recipes_nutrients ON recipes USING gin (nutrients);

-- Enable Row Level Security
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

-- Public read access policy
CREATE POLICY "Public can read all recipes"
  ON recipes
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_recipes_updated_at
  BEFORE UPDATE ON recipes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();