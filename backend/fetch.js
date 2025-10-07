import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchRecipes() {
  const { data, error } = await supabase
    .from('recipes')
    .select('*'); // get all columns

  if (error) {
    console.error('Error fetching recipes:', error.message);
  } else {
    console.log('Recipes:', data);
  }
}

fetchRecipes();
