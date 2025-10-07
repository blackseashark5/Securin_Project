import { X, ChevronDown, ChevronUp, Clock, Users } from 'lucide-react';
import { Recipe } from '../types';
import { useState } from 'react';

interface RecipeDrawerProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
}

function RecipeDrawer({ recipe, isOpen, onClose }: RecipeDrawerProps) {
  const [timeExpanded, setTimeExpanded] = useState(false);

  if (!isOpen || !recipe) return null;

  const nutrients = recipe.nutrients || {};

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      <div className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-gray-900 truncate">{recipe.title}</h2>
            {recipe.cuisine && (
              <p className="text-sm text-gray-600 mt-1">{recipe.cuisine}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="ml-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="px-6 py-6 space-y-6">
          {recipe.rating !== null && (
            <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-gray-900">{recipe.rating.toFixed(1)}</span>
                <span className="text-gray-600">/ 5.0</span>
              </div>
            </div>
          )}

          {recipe.description && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2">
                Description
              </h3>
              <p className="text-gray-700 leading-relaxed">{recipe.description}</p>
            </div>
          )}

          <div>
            <button
              onClick={() => setTimeExpanded(!timeExpanded)}
              className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Clock className="text-blue-600" size={20} />
                <div className="text-left">
                  <div className="text-sm font-semibold text-gray-900">Total Time</div>
                  <div className="text-lg font-bold text-gray-900">
                    {recipe.total_time ? `${recipe.total_time} minutes` : 'Not specified'}
                  </div>
                </div>
              </div>
              {timeExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            {timeExpanded && (
              <div className="mt-2 p-4 bg-gray-50 rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Prep Time:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {recipe.prep_time ? `${recipe.prep_time} min` : 'Not specified'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Cook Time:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {recipe.cook_time ? `${recipe.cook_time} min` : 'Not specified'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {recipe.serves && (
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Users className="text-blue-600" size={20} />
              <div>
                <div className="text-sm font-semibold text-gray-900">Servings</div>
                <div className="text-lg font-bold text-gray-900">{recipe.serves}</div>
              </div>
            </div>
          )}

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
              Nutrition Information
            </h3>
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <table className="w-full">
                <tbody className="divide-y divide-gray-200">
                  {nutrients.calories && (
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">Calories</td>
                      <td className="px-4 py-3 text-sm text-gray-700 text-right">{nutrients.calories}</td>
                    </tr>
                  )}
                  {nutrients.carbohydrateContent && (
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">Carbohydrates</td>
                      <td className="px-4 py-3 text-sm text-gray-700 text-right">{nutrients.carbohydrateContent}</td>
                    </tr>
                  )}
                  {nutrients.cholesterolContent && (
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">Cholesterol</td>
                      <td className="px-4 py-3 text-sm text-gray-700 text-right">{nutrients.cholesterolContent}</td>
                    </tr>
                  )}
                  {nutrients.fiberContent && (
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">Fiber</td>
                      <td className="px-4 py-3 text-sm text-gray-700 text-right">{nutrients.fiberContent}</td>
                    </tr>
                  )}
                  {nutrients.proteinContent && (
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">Protein</td>
                      <td className="px-4 py-3 text-sm text-gray-700 text-right">{nutrients.proteinContent}</td>
                    </tr>
                  )}
                  {nutrients.saturatedFatContent && (
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">Saturated Fat</td>
                      <td className="px-4 py-3 text-sm text-gray-700 text-right">{nutrients.saturatedFatContent}</td>
                    </tr>
                  )}
                  {nutrients.sodiumContent && (
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">Sodium</td>
                      <td className="px-4 py-3 text-sm text-gray-700 text-right">{nutrients.sodiumContent}</td>
                    </tr>
                  )}
                  {nutrients.sugarContent && (
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">Sugar</td>
                      <td className="px-4 py-3 text-sm text-gray-700 text-right">{nutrients.sugarContent}</td>
                    </tr>
                  )}
                  {nutrients.fatContent && (
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">Total Fat</td>
                      <td className="px-4 py-3 text-sm text-gray-700 text-right">{nutrients.fatContent}</td>
                    </tr>
                  )}
                </tbody>
              </table>
              {Object.keys(nutrients).length === 0 && (
                <div className="px-4 py-8 text-center text-gray-500">
                  No nutrition information available
                </div>
              )}
            </div>
          </div>

          {recipe.ingredients && recipe.ingredients.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
                Ingredients
              </h3>
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-700">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {recipe.instructions && recipe.instructions.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
                Instructions
              </h3>
              <ol className="space-y-3">
                {recipe.instructions.map((instruction, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-gray-700">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-sm font-semibold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="pt-0.5">{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {recipe.url && (
            <div className="pt-4 border-t border-gray-200">
              <a
                href={recipe.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View original recipe →
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default RecipeDrawer;
