
import React, { useMemo } from 'react';
import { X, Heart, MapPin, ExternalLink, Play } from 'lucide-react';
import { Recipe, Ingredient } from '../types/Recipe';

interface RecipeModalProps {
  recipe: Recipe;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const RecipeModal: React.FC<RecipeModalProps> = ({
  recipe,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite
}) => {
  // Get all ingredients from the recipe
  const ingredients = useMemo(() => {
    const ingredientList: Ingredient[] = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}` as keyof Recipe] as string;
      const measure = recipe[`strMeasure${i}` as keyof Recipe] as string;
      
      if (ingredient && ingredient.trim()) {
        ingredientList.push({
          ingredient: ingredient.trim(),
          measure: measure ? measure.trim() : ''
        });
      }
    }
    return ingredientList;
  }, [recipe]);

  // Split instructions into steps
  const steps = useMemo(() => {
    return recipe.strInstructions
      .split(/\r\n|\n|\r/)
      .filter(step => step.trim().length > 0)
      .map(step => step.trim());
  }, [recipe.strInstructions]);

  if (!isOpen) return null;

  const handleYouTubeClick = () => {
    if (recipe.strYoutube) {
      window.open(recipe.strYoutube, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="relative">
          <img
            src={recipe.strMealThumb}
            alt={recipe.strMeal}
            className="w-full h-64 object-cover rounded-t-xl"
          />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/80 hover:bg-white p-2 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <button
            onClick={onToggleFavorite}
            className={`absolute top-4 left-4 p-2 rounded-full transition-all duration-200 ${
              isFavorite
                ? 'bg-red-500 text-white'
                : 'bg-white/80 hover:bg-white text-gray-600'
            }`}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          {recipe.strYoutube && (
            <button
              onClick={handleYouTubeClick}
              className="absolute bottom-4 right-4 bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition-colors shadow-lg"
            >
              <Play className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{recipe.strMeal}</h2>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>{recipe.strArea}</span>
              </div>
              <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full">
                {recipe.strCategory}
              </div>
              {recipe.strTags && (
                <div className="flex flex-wrap gap-1">
                  {recipe.strTags.split(',').map((tag, index) => (
                    <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Ingredients</h3>
              <ul className="space-y-2">
                {ingredients.map((item, index) => (
                  <li key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-700">{item.ingredient}</span>
                    <span className="text-gray-500 font-medium">{item.measure}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Instructions</h3>
              <div className="space-y-3">
                {steps.map((step, index) => (
                  <div key={index} className="flex space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {recipe.strSource && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <a
                href={recipe.strSource}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-orange-600 hover:text-orange-700 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                <span>View Original Recipe</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;
