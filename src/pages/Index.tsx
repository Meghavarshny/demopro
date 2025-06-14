import React, { useState, useEffect } from 'react';
import { Search, Heart, ChefHat } from 'lucide-react';
import RecipeCard from '../components/RecipeCard';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import RecipeModal from '../components/RecipeModal';
import Footer from '../components/Footer';
import { useMealAPI } from '../hooks/useMealAPI';
import { Recipe } from '../types/Recipe';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);

  const { recipes, categories, loading, error, searchRecipes, getRecipesByCategory } = useMealAPI();

  
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favoriteRecipes');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (e) {
       
        setFavorites([]);
      }
    }
  }, []);

  
  useEffect(() => {
    localStorage.setItem('favoriteRecipes', JSON.stringify(favorites));
  }, [favorites]);

  
  useEffect(() => {
    if (searchTerm.trim() !== '') {
      searchRecipes(searchTerm);
    } else if (selectedCategory !== '') {
      getRecipesByCategory(selectedCategory);
    } else
     {
      
      searchRecipes('chicken');
    }
  }, [searchTerm, selectedCategory]);

  
  useEffect(() => {
    searchRecipes('chicken');
  }, []);

  const handleToggleFavorite = (recipeId: string) => {
    if (favorites.includes(recipeId)) {
      setFavorites(favorites.filter(id => id !== recipeId));
    } else {
      setFavorites([...favorites, recipeId]);
    }
  };

  const recipesToShow = showFavorites 
    ? recipes.filter(recipe => favorites.includes(recipe.idMeal))
    : recipes;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header section */}
      <header className="bg-white shadow-lg border-b-4 border-orange-400">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-orange-500 p-3 rounded-full">
                <ChefHat className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">RecipeBox</h1>
                <p className="text-gray-600">Discover amazing recipes from around the world</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowFavorites(!showFavorites)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
                showFavorites 
                  ? 'bg-red-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Heart className={`h-5 w-5 ${showFavorites ? 'fill-current' : ''}`} />
              <span>My Favorites ({favorites.length})</span>
            </button>
          </div>

          {/* Search and filter controls */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <SearchBar 
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                placeholder="Search for recipes..."
              />
            </div>
            <div className="md:w-64">
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main content area */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              {showFavorites ? 'Your Favorite Recipes' : 'Browse Recipes'}
            </h2>
            <div className="text-gray-600">
              {recipesToShow.length} recipe{recipesToShow.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>

        {/* Show loading spinner */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            <span className="ml-3 text-gray-600">Loading recipes...</span>
          </div>
        )}

        {/* Show error message */}
        {error && (
          <div className="text-center py-12">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg inline-block">
              <p className="font-semibold">Something went wrong!</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* No favorites message */}
        {!loading && !error && recipesToShow.length === 0 && showFavorites && (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No favorites yet!</h3>
            <p className="text-gray-500">Start browsing recipes and add some to your favorites</p>
            <button
              onClick={() => setShowFavorites(false)}
              className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition-colors"
            >
              Browse Recipes
            </button>
          </div>
        )}

        {/* No search results */}
        {!loading && !error && recipesToShow.length === 0 && !showFavorites && (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No recipes found</h3>
            <p className="text-gray-500">Try changing your search or filter settings</p>
          </div>
        )}

        {/* Recipe grid */}
        {!loading && recipesToShow.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recipesToShow.map((recipe) => (
              <RecipeCard
                key={recipe.idMeal}
                recipe={recipe}
                isFavorite={favorites.includes(recipe.idMeal)}
                onToggleFavorite={() => handleToggleFavorite(recipe.idMeal)}
                onViewDetails={() => setSelectedRecipe(recipe)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Recipe detail modal */}
      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          isOpen={!!selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          isFavorite={favorites.includes(selectedRecipe.idMeal)}
          onToggleFavorite={() => handleToggleFavorite(selectedRecipe.idMeal)}
        />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
