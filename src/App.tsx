import { useState, useEffect } from 'react';
import RecipeTable from './components/RecipeTable';
import RecipeDrawer from './components/RecipeDrawer';
import { Recipe } from './types';

function App() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    title: '',
    cuisine: '',
    rating: '',
    total_time: '',
    calories: ''
  });

  const fetchRecipes = async () => {
    setLoading(true);
    setError(null);

    try {
      const hasFilters = Object.values(filters).some(v => v !== '');
      const baseUrl = 'http://localhost:3001/api/v1';
      const endpoint = hasFilters ? '/recipes/search' : '/recipes';

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });

      if (hasFilters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value);
        });
      }

      const response = await fetch(`${baseUrl}${endpoint}?${params}`);

      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }

      const data = await response.json();
      setRecipes(data.data || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, [page, limit]);

  const handleSearch = () => {
    setPage(1);
    fetchRecipes();
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      title: '',
      cuisine: '',
      rating: '',
      total_time: '',
      calories: ''
    });
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Recipe Collection</h1>
          <p className="mt-2 text-sm text-gray-600">
            Browse and search through our collection of delicious recipes
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <RecipeTable
          recipes={recipes}
          loading={loading}
          onRecipeClick={setSelectedRecipe}
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          onClearFilters={handleClearFilters}
          page={page}
          limit={limit}
          total={total}
          onPageChange={setPage}
          onLimitChange={setLimit}
        />
      </main>

      <RecipeDrawer
        recipe={selectedRecipe}
        isOpen={selectedRecipe !== null}
        onClose={() => setSelectedRecipe(null)}
      />
    </div>
  );
}

export default App;
