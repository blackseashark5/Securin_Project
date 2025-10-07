// showRecipes.js
import fs from 'fs';
import path from 'path';

const filePath = path.resolve('../recipes.json');

if (!fs.existsSync(filePath)) {
  console.error(`File not found: ${filePath}`);
  process.exit(1);
}

let recipesRaw;
try {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  recipesRaw = JSON.parse(fileContent);
} catch (error) {
  console.error('Error reading or parsing JSON:', error.message);
  process.exit(1);
}

// Convert object with numeric keys into an array
const recipes = Object.values(recipesRaw);

console.log(`Found ${recipes.length} recipe(s):\n`);

recipes.forEach((r, idx) => {
  console.log(`Recipe ${idx + 1}:`);
  console.log(`Title: ${r.title || 'N/A'}`);
  console.log(`Cuisine: ${r.cuisine || 'N/A'}`);
  console.log(`Rating: ${r.rating ?? 'N/A'}`);
  console.log(`Prep Time: ${r.prep_time ?? 'N/A'} mins`);
  console.log(`Cook Time: ${r.cook_time ?? 'N/A'} mins`);
  console.log(`Total Time: ${r.total_time ?? 'N/A'} mins`);
  console.log(`Continent: ${r.Contient || 'N/A'}`);
  console.log(`Country/State: ${r.Country_State || 'N/A'}`);
  console.log(`URL: ${r.URL || r.url || 'N/A'}`);
  console.log('-------------------------');
});
