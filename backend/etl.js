import 'dotenv/config';


import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function parseNumber(value) {
  if (value === null || value === undefined) return null;
  const str = String(value).trim().toLowerCase();
  if (str === 'nan' || str === '') return null;
  const num = parseFloat(str);
  return isNaN(num) ? null : num;
}

function parseInteger(value) {
  const num = parseNumber(value);
  return num !== null ? Math.round(num) : null;
}

function extractCalories(caloriesStr) {
  if (!caloriesStr) return null;
  const match = String(caloriesStr).match(/(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

function cleanRecipe(recipe) {
  const nutrients = recipe.nutrients || {};

  return {
    cuisine: recipe.cuisine || null,
    title: recipe.title || null,
    rating: parseNumber(recipe.rating),
    prep_time: parseInteger(recipe.prep_time),
    cook_time: parseInteger(recipe.cook_time),
    total_time: parseInteger(recipe.total_time),
    description: recipe.description || null,
    nutrients: nutrients,
    serves: recipe.serves || null,
    calories_int: extractCalories(nutrients.calories),
    url: recipe.URL || recipe.url || null,
    country_state: recipe.Country_State || null,
    continent: recipe.Contient || recipe.Continent || null,
    ingredients: recipe.ingredients || [],
    instructions: recipe.instructions || []
  };
}

async function loadRecipes(filePath, batchSize = 100) {
  console.log(`Loading recipes from: ${filePath}`);

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  let recipes;

  try {
    recipes = JSON.parse(fileContent);
  } catch (error) {
    console.error('Error parsing JSON:', error.message);
    process.exit(1);
  }

  if (!Array.isArray(recipes)) {
    recipes = [recipes];
  }

  console.log(`Found ${recipes.length} recipes to process`);

  let successCount = 0;
  let errorCount = 0;
  const errors = [];

  for (let i = 0; i < recipes.length; i += batchSize) {
    const batch = recipes.slice(i, i + batchSize);
    const cleanedBatch = batch.map((recipe, idx) => {
      try {
        return cleanRecipe(recipe);
      } catch (error) {
        errors.push({ index: i + idx, error: error.message, recipe });
        return null;
      }
    }).filter(r => r !== null);

    if (cleanedBatch.length > 0) {
      const { data, error } = await supabase
        .from('recipes')
        .insert(cleanedBatch)
        .select();

      if (error) {
        console.error(`Batch ${Math.floor(i / batchSize) + 1} error:`, error.message);
        errorCount += cleanedBatch.length;
        errors.push({ batch: Math.floor(i / batchSize) + 1, error: error.message });
      } else {
        successCount += cleanedBatch.length;
        console.log(`Batch ${Math.floor(i / batchSize) + 1}: Inserted ${cleanedBatch.length} recipes (Total: ${successCount})`);
      }
    }
  }

  console.log('\n=== ETL Summary ===');
  console.log(`Total recipes processed: ${recipes.length}`);
  console.log(`Successfully inserted: ${successCount}`);
  console.log(`Errors: ${errorCount}`);

  if (errors.length > 0) {
    console.log('\n=== Errors ===');
    errors.slice(0, 10).forEach((err, idx) => {
      console.log(`${idx + 1}. ${JSON.stringify(err, null, 2)}`);
    });
    if (errors.length > 10) {
      console.log(`... and ${errors.length - 10} more errors`);
    }
  }

  return { successCount, errorCount, errors };
}

const args = process.argv.slice(2);
const inputFileIndex = args.indexOf('--input');
const batchSizeIndex = args.indexOf('--batch-size');

const inputFile = inputFileIndex >= 0 ? args[inputFileIndex + 1] : 'recipes.json';
const batchSize = batchSizeIndex >= 0 ? parseInt(args[batchSizeIndex + 1], 10) : 100;

if (!fs.existsSync(inputFile)) {
  console.error(`Input file not found: ${inputFile}`);
  console.log('\nUsage: node etl.js --input <file.json> [--batch-size <size>]');
  process.exit(1);
}

loadRecipes(inputFile, batchSize)
  .then(result => {
    console.log('\nETL completed successfully');
    process.exit(result.errorCount > 0 ? 1 : 0);
  })
  .catch(error => {
    console.error('ETL failed:', error);
    process.exit(1);
  });
