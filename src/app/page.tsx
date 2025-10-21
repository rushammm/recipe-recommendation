'use client';

import { useState } from 'react';
import RecipeCard from '@/components/RecipeCard';
import AIRecommendation from '@/components/AIRecommendation';
import SavedRecipes from '@/components/SavedRecipes';
import { RecipeCardSkeleton, AIRecommendationSkeleton, FullPageLoading } from '@/components/ui/LoadingSkeleton';
import { ErrorMessage, useError } from '@/components/ui/ErrorMessage';
import { useSavedRecipes } from '@/hooks/useSavedRecipes';

export default function Home() {
  const [ingredients, setIngredients] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState<'initial' | 'fetching' | 'analyzing' | 'generating'>('initial');
  const [showSavedRecipes, setShowSavedRecipes] = useState(false);
  
  const { showError, hideError, ErrorComponent, hasError } = useError();
  const { saveRecipe, isRecipeSaved, getSavedRecipeCount } = useSavedRecipes();

  const cuisineOptions = [
    { value: '', label: 'All Cuisines' },
    { value: 'italian', label: 'Italian' },
    { value: 'pakistani', label: 'Pakistani' },
    { value: 'indian', label: 'Indian' },
    { value: 'chinese', label: 'Chinese' },
    { value: 'mexican', label: 'Mexican' },
    { value: 'mediterranean', label: 'Mediterranean' },
    { value: 'thai', label: 'Thai' },
    { value: 'american', label: 'American' },
  ];

  const findRecipes = async () => {
    if (!ingredients.trim()) {
      showError('Please enter at least one ingredient');
      return;
    }

    setLoading(true);
    setLoadingStage('fetching');
    setRecipes([]);
    setAiSuggestion('');

    try {
      setLoadingStage('fetching');
      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients, cuisine }),
      });

      setLoadingStage('analyzing');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch recipes');
      }

      setLoadingStage('generating');
      setRecipes(data.recipes);
      setAiSuggestion(data.aiSuggestion);
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
      setLoadingStage('initial');
    }
  };

  const getLoadingMessage = () => {
    switch (loadingStage) {
      case 'fetching':
        return 'Finding recipes that match your ingredients...';
      case 'analyzing':
        return 'Analyzing flavor combinations and nutritional profiles...';
      case 'generating':
        return 'Generating personalized AI recommendations...';
      default:
        return 'Searching for perfect recipes...';
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-16 animate-slide-up">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#DB5461] to-[#C74552] rounded-xl flex items-center justify-center shadow-lg animate-bounce-in">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gradient">RecipeAI</span>
            </div>
            <button
              onClick={() => setShowSavedRecipes(true)}
              className="relative p-3 text-[#686963] hover:text-[#DB5461] transition-all-smooth rounded-full hover:glass shadow-sm group"
              aria-label="View saved recipes"
            >
              <svg className="w-6 h-6 transition-all-smooth group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              {getSavedRecipeCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#DB5461] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse-slow font-bold">
                  {getSavedRecipeCount()}
                </span>
              )}
            </button>
          </div>
          <h1 className="text-6xl font-bold text-[#686963] mb-6 tracking-tight animate-bounce-in">
            Smart Recipe <span className="text-gradient">Recommender</span>
          </h1>
          <p className="text-xl text-[#8AA29E] max-w-3xl mx-auto leading-relaxed animate-slide-up">
            Transform your ingredients into culinary masterpieces with AI-powered recipe recommendations
            tailored to your taste preferences and dietary needs.
          </p>
        </header>

        <main>
          <section className="glass rounded-2xl shadow-xl p-10 mb-12 card-hover animate-scale-in border border-[#E3F2FD]/50">
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#DB5461] to-[#C74552] rounded-xl flex items-center justify-center shadow-lg mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Find Your Perfect Recipe</h2>
                  <p style={{ color: 'var(--foreground)' }}>Tell us what you have, and we&apos;ll work our magic</p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="group">
                <label htmlFor="ingredients" className="flex items-center text-sm font-semibold text-[#686963] mb-3 group-focus-within:text-[#DB5461] transition-all-smooth">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Ingredients you have:
                </label>
                <input
                  id="ingredients"
                  type="text"
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  placeholder="e.g., chicken, tomatoes, onions, garlic, basil"
                  className="w-full text-base border-2 rounded-xl input-focus input-sm outline-none interactive"
                />
                <p className="text-sm text-[#8AA29E] mt-2 flex items-center">
                  <svg className="w-4 h-4 mr-1 text-[#DB5461]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Enter ingredients separated by commas for better suggestions
                </p>
              </div>

              <div className="group">
                <label htmlFor="cuisine" className="flex items-center text-sm font-semibold text-[#686963] mb-3 group-focus-within:text-[#DB5461] transition-all-smooth">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Preferred cuisine (optional):
                </label>
                <select
                  id="cuisine"
                  value={cuisine}
                  onChange={(e) => setCuisine(e.target.value)}
                  className="w-full text-base border-2 rounded-xl input-focus input-sm outline-none bg-white interactive"
                >
                  {cuisineOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={findRecipes}
                disabled={loading}
                className="w-full btn-primary py-3 px-6 rounded-xl text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 interactive"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Finding Amazing Recipes...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span>Find Recipes</span>
                  </>
                )}
              </button>
            </div>

            {hasError && (
              <div className="mt-6 animate-fade-in">
                <ErrorComponent onRetry={findRecipes} />
              </div>
            )}
          </section>

          {loading && (
            <FullPageLoading message={getLoadingMessage()} />
          )}

          {(aiSuggestion || loading) && (
            <section className="mb-12 animate-slide-up">
              {loading ? (
                <AIRecommendationSkeleton />
              ) : (
                <AIRecommendation suggestion={aiSuggestion} />
              )}
            </section>
          )}

          {(recipes.length > 0 || loading) && (
            <section className="animate-fade-in">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-4xl font-bold text-[#686963] mb-2">Recommended Recipes</h2>
                  <p className="text-[#8AA29E]">Discover perfect dishes tailored to your ingredients</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="status-dot success"></div>
                  <span className="text-sm text-[#8AA29E]">{recipes.length} recipes found</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {loading ? (
                  // Show skeleton cards while loading
                  Array.from({ length: 6 }).map((_, index) => (
                    <RecipeCardSkeleton key={index} />
                  ))
                ) : (
                  recipes.map((recipe, index) => (
                    <div key={index} className="animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
                      <RecipeCard
                        recipe={recipe}
                        onSave={saveRecipe}
                        isSaved={isRecipeSaved(recipe)}
                      />
                    </div>
                  ))
                )}
              </div>
            </section>
          )}

          {!loading && !hasError && recipes.length === 0 && (
            <div className="text-center py-20 animate-fade-in">
              <div className="flex justify-center items-center w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#DB5461] to-[#C74552] shadow-xl animate-bounce-in">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#686963] mb-3">
                Ready to Cook Something Amazing?
              </h3>
              <p className="text-lg text-[#8AA29E] max-w-md mx-auto">
                Enter the ingredients you have at home and let our AI find the perfect recipes for you!
              </p>
              <div className="mt-8 flex justify-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-[#8AA29E]">
                  <svg className="w-5 h-5 text-[#DB5461]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>AI-Powered</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-[#8AA29E]">
                  <svg className="w-5 h-5 text-[#DB5461]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>Personalized</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-[#8AA29E]">
                  <svg className="w-5 h-5 text-[#DB5461]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Quick & Easy</span>
                </div>
              </div>
            </div>
          )}
        </main>

        <footer className="mt-20 py-8 border-t border-[#E3F2FD] animate-fade-in">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="status-dot success"></div>
                <span className="text-sm text-[#8AA29E]">Smart Recommendations</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="status-dot warning"></div>
                <span className="text-sm text-[#8AA29E]">AI-Powered</span>
              </div>
            </div>
            <p className="text-[#686963] text-sm">
              Powered by <span className="font-semibold text-[#DB5461]">Spoonacular API</span> & <span className="font-semibold text-[#DB5461]">ZAI AI</span>
            </p>
          </div>
        </footer>
      </div>

      {/* Saved Recipes Modal */}
      <SavedRecipes
        isOpen={showSavedRecipes}
        onClose={() => setShowSavedRecipes(false)}
      />
    </div>
  );
}
