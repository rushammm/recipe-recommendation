// Hook for managing saved recipes using local storage

import { useState, useEffect } from 'react';

interface Recipe {
  id?: number;
  title: string;
  image: string;
  sourceUrl?: string;
  readyInMinutes?: number;
  servings?: number;
  healthScore?: number;
  cheap?: boolean;
  dairyFree?: boolean;
  glutenFree?: boolean;
  ketogenic?: boolean;
  vegan?: boolean;
  vegetarian?: boolean;
  veryHealthy?: boolean;
  veryPopular?: boolean;
  whole30?: boolean;
}

const STORAGE_KEY = 'smart-recipe-saved-recipes';

export function useSavedRecipes() {
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved recipes from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedRecipes(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading saved recipes:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save recipes to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedRecipes));
      } catch (error) {
        console.error('Error saving recipes:', error);
      }
    }
  }, [savedRecipes, isLoading]);

  const saveRecipe = (recipe: Recipe) => {
    setSavedRecipes(prev => {
      // Check if recipe already exists (by ID or title)
      const exists = prev.some(r => 
        (r.id && r.id === recipe.id) || 
        (!r.id && r.title === recipe.title)
      );
      
      if (exists) {
        // Remove recipe if it already exists
        return prev.filter(r => 
          !(r.id && r.id === recipe.id) && 
          !(!r.id && r.title === recipe.title)
        );
      } else {
        // Add new recipe
        return [...prev, recipe];
      }
    });
  };

  const removeRecipe = (recipeId: number | string, identifier: 'id' | 'title' = 'id') => {
    setSavedRecipes(prev => prev.filter(recipe => {
      if (identifier === 'id') {
        return recipe.id !== recipeId;
      } else {
        return recipe.title !== recipeId;
      }
    }));
  };

  const isRecipeSaved = (recipe: Recipe): boolean => {
    return savedRecipes.some(r => 
      (r.id && r.id === recipe.id) || 
      (!r.id && r.title === recipe.title)
    );
  };

  const clearAllSavedRecipes = () => {
    setSavedRecipes([]);
  };

  const getSavedRecipeCount = (): number => {
    return savedRecipes.length;
  };

  const exportSavedRecipes = (): string => {
    return JSON.stringify(savedRecipes, null, 2);
  };

  const importSavedRecipes = (jsonData: string): boolean => {
    try {
      const recipes = JSON.parse(jsonData);
      if (Array.isArray(recipes)) {
        setSavedRecipes(recipes);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error importing recipes:', error);
      return false;
    }
  };

  return {
    savedRecipes,
    isLoading,
    saveRecipe,
    removeRecipe,
    isRecipeSaved,
    clearAllSavedRecipes,
    getSavedRecipeCount,
    exportSavedRecipes,
    importSavedRecipes,
  };
}