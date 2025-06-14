
import { useState, useEffect } from 'react';
import { Recipe, Category } from '../types/Recipe';

const API_BASE = 'https://www.themealdb.com/api/json/v1/1';

export const useMealAPI = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get categories when hook is first used
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await fetch(`${API_BASE}/categories.php`);
      const data = await response.json();
      if (data.categories) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.log('Error loading categories:', err);
      setError('Could not load categories');
    }
  };

  const searchRecipes = async (query: string) => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/search.php?s=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      if (data.meals) {
        setRecipes(data.meals);
      } else {
        setRecipes([]);
      }
    } catch (err) {
      console.log('Error searching recipes:', err);
      setError('Failed to search recipes');
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const getRecipesByCategory = async (category: string) => {
    if (!category) return;

    setLoading(true);
    setError(null);

    try {
      // Get meals in category
      const response = await fetch(`${API_BASE}/filter.php?c=${encodeURIComponent(category)}`);
      const data = await response.json();
      
      if (data.meals) {
        // Get detailed info for first 12 meals
        const mealPromises = data.meals.slice(0, 12).map(async (meal: any) => {
          try {
            const detailResponse = await fetch(`${API_BASE}/lookup.php?i=${meal.idMeal}`);
            const detailData = await detailResponse.json();
            return detailData.meals ? detailData.meals[0] : meal;
          } catch {
            return meal;
          }
        });

        const detailedMeals = await Promise.all(mealPromises);
        setRecipes(detailedMeals.filter(meal => meal !== null));
      } else {
        setRecipes([]);
      }
    } catch (err) {
      console.log('Error getting category recipes:', err);
      setError('Failed to load category recipes');
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const getRecipeById = async (id: string): Promise<Recipe | null> => {
    try {
      const response = await fetch(`${API_BASE}/lookup.php?i=${id}`);
      const data = await response.json();
      return data.meals ? data.meals[0] : null;
    } catch (err) {
      console.log('Error getting recipe details:', err);
      return null;
    }
  };

  return {
    recipes,
    categories,
    loading,
    error,
    searchRecipes,
    getRecipesByCategory,
    getRecipeById
  };
};
