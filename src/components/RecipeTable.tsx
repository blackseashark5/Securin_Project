import { Star, Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Recipe } from '../types';

interface RecipeTableProps {
  recipes: Recipe[];
  loading: boolean;
  onRecipeClick: (recipe: Recipe) => void;
  filters: {
    title: string;
    cuisine: string;
    rating: string;
    total_time: string;
    calories: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onSearch: () => void;
  onClearFilters: () => void;
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

function StarRating({ rating }: { rating: number | null }) {
  if (rating === null) {
    return <span className="text-gray-400 text-sm">Not rated</span>;
  }

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={16}
          className={
            i < fullStars
              ? 'fill-yellow-400 text-yellow-400'
              : i === fullStars && hasHalfStar
              ? 'fill-yellow-200 text-yellow-400'
              : 'text-gray-300'
          }
        />
      ))}
      <span className="ml-1 text-sm text-gray-600 font-medium">{rating.toFixed(1)}</span>
    </div>
  );
}

function RecipeTable({
  recipes,
  loading,
  onRecipeClick,
  filters,
  onFilterChange,
  onSearch,
  onClearFilters,
  page,
  limit,
  total,
  onPageChange,
  onLimitChange
}: RecipeTableProps) {
  const hasActiveFilters = Object.values(filters).some(v => v !== '');
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit + 1;
  const endIndex = Math.min(page * limit, total);

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recipes</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={onSearch}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              <Search size={16} />
              Search
            </button>
            {hasActiveFilters && (
              <button
                onClick={onClearFilters}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <X size={16} />
                Clear Filters
              </button>
            )}
          </div>
        </div>

        <div className="text-sm text-gray-600">
          Showing {recipes.length > 0 ? startIndex : 0} to {endIndex} of {total} recipes
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cuisine
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rating
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Serves
              </th>
            </tr>
            <tr className="bg-gray-50">
              <th className="px-6 py-2">
                <input
                  type="text"
                  placeholder="Filter by title..."
                  value={filters.title}
                  onChange={(e) => onFilterChange('title', e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </th>
              <th className="px-6 py-2">
                <input
                  type="text"
                  placeholder="Filter cuisine..."
                  value={filters.cuisine}
                  onChange={(e) => onFilterChange('cuisine', e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </th>
              <th className="px-6 py-2">
                <input
                  type="text"
                  placeholder="e.g., >=4.5"
                  value={filters.rating}
                  onChange={(e) => onFilterChange('rating', e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </th>
              <th className="px-6 py-2">
                <input
                  type="text"
                  placeholder="e.g., <=60"
                  value={filters.total_time}
                  onChange={(e) => onFilterChange('total_time', e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </th>
              <th className="px-6 py-2">
                <input
                  type="text"
                  placeholder="e.g., <=400"
                  value={filters.calories}
                  onChange={(e) => onFilterChange('calories', e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="text-xs text-gray-500 mt-0.5">Calories</div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Loading recipes...</span>
                  </div>
                </td>
              </tr>
            ) : recipes.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="text-gray-500">
                    <p className="text-lg font-medium mb-2">No recipes found</p>
                    <p className="text-sm">
                      {hasActiveFilters
                        ? 'Try adjusting your filters or clear them to see all recipes.'
                        : 'No recipes available in the database.'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              recipes.map((recipe) => (
                <tr
                  key={recipe.id}
                  onClick={() => onRecipeClick(recipe)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 truncate max-w-xs" title={recipe.title}>
                      {recipe.title}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">{recipe.cuisine || '-'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <StarRating rating={recipe.rating} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">
                      {recipe.total_time ? `${recipe.total_time} min` : '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">{recipe.serves || '-'}</div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <label className="text-sm text-gray-600">
            Rows per page:
            <select
              value={limit}
              onChange={(e) => {
                onLimitChange(Number(e.target.value));
                onPageChange(1);
              }}
              className="ml-2 px-3 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={15}>15</option>
              <option value={20}>20</option>
              <option value={25}>25</option>
              <option value={30}>30</option>
              <option value={50}>50</option>
            </select>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages || 1}
          </span>
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1 || loading}
            className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages || loading}
            className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default RecipeTable;
