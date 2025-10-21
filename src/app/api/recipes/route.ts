import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { generateDynamicPrompt, generateEnhancedUserPrompt, AIRecommendationContext } from '@/utils/aiPrompts';
import { generateSmartRecommendation, FallbackRecommendationContext } from '@/utils/fallbackAI';

interface RecipeRequest {
  ingredients: string;
  cuisine?: string;
}

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

interface SpoonacularRecipe {
  id: number;
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


export async function POST(request: NextRequest) {
  try {
    const { ingredients, cuisine }: RecipeRequest = await request.json();

    if (!ingredients || !ingredients.trim()) {
      return NextResponse.json(
        { error: 'Ingredients are required' },
        { status: 400 }
      );
    }

    // Clean and prepare ingredients for Spoonacular API
    const ingredientList = ingredients
      .split(',')
      .map(ing => ing.trim())
      .filter(ing => ing.length > 0)
      .join(',+');

    // Prepare Spoonacular API request
    const spoonacularApiKey = process.env.SPOONACULAR_API_KEY;
    if (!spoonacularApiKey) {
      throw new Error('Spoonacular API key is not configured');
    }

    let spoonacularUrl: string;
    let params: Record<string, string | number | boolean>;

    if (cuisine && cuisine.trim()) {
      // Use complex search for cuisine filtering
      spoonacularUrl = `https://api.spoonacular.com/recipes/complexSearch`;
      params = {
        includeIngredients: ingredientList,
        cuisine: cuisine.trim(),
        number: 5,
        sort: 'random',
        addRecipeInformation: true,
        addRecipeInstructions: false,
        addRecipeNutrition: true,
      };
    } else {
      // Use findByIngredients for no specific cuisine
      spoonacularUrl = `https://api.spoonacular.com/recipes/findByIngredients`;
      params = {
        ingredients: ingredientList,
        number: 5,
        ranking: 1, // maximize used ingredients
        ignorePantry: true,
      };
    }

    // Fetch recipes from Spoonacular
    const spoonacularResponse = await axios.get(spoonacularUrl, {
      params,
      headers: {
        'x-api-key': spoonacularApiKey,
      },
    });

    let recipes: Recipe[];

    if (cuisine && cuisine.trim()) {
      // Handle complexSearch response format
      recipes = spoonacularResponse.data.results.map((recipe: SpoonacularRecipe) => ({
        id: recipe.id,
        title: recipe.title,
        image: recipe.image,
        sourceUrl: recipe.sourceUrl || `https://spoonacular.com/recipes/${recipe.title.replace(/\s+/g, '-').toLowerCase()}-${recipe.id}`,
        readyInMinutes: recipe.readyInMinutes,
        servings: recipe.servings,
        healthScore: recipe.healthScore,
        cheap: recipe.cheap,
        dairyFree: recipe.dairyFree,
        glutenFree: recipe.glutenFree,
        ketogenic: recipe.ketogenic,
        vegan: recipe.vegan,
        vegetarian: recipe.vegetarian,
        veryHealthy: recipe.veryHealthy,
        veryPopular: recipe.veryPopular,
        whole30: recipe.whole30,
      }));
    } else {
      // Handle findByIngredients response format
      recipes = spoonacularResponse.data.map((recipe: SpoonacularRecipe) => ({
        id: recipe.id,
        title: recipe.title,
        image: recipe.image,
        sourceUrl: `https://spoonacular.com/recipes/${recipe.title.replace(/\s+/g, '-').toLowerCase()}-${recipe.id}`,
        readyInMinutes: recipe.readyInMinutes,
        servings: recipe.servings,
        healthScore: recipe.healthScore,
        cheap: recipe.cheap,
        dairyFree: recipe.dairyFree,
        glutenFree: recipe.glutenFree,
        ketogenic: recipe.ketogenic,
        vegan: recipe.vegan,
        vegetarian: recipe.vegetarian,
        veryHealthy: recipe.veryHealthy,
        veryPopular: recipe.veryPopular,
        whole30: recipe.whole30,
      }));
    }

    // Get AI suggestions from ZAI API with enhanced prompts
    let aiSuggestion = '';
    try {
      const zaiApiKey = process.env.ZAI_API_KEY;
      if (!zaiApiKey) {
        throw new Error('ZAI API key is not configured');
      }

      // Create context for AI recommendation
      const aiContext: AIRecommendationContext = {
        ingredients: ingredients.split(',').map(i => i.trim()),
        cuisine: cuisine || undefined,
        recipes: recipes.map(r => ({
          title: r.title,
          readyInMinutes: r.readyInMinutes,
          servings: r.servings
        })),
        cookingTimePreference: 'any' // Could be made configurable in the future
      };

      // Generate dynamic prompts based on context
      const systemPrompt = generateDynamicPrompt(aiContext);
      const userPrompt = generateEnhancedUserPrompt(aiContext);

      const zaiResponse = await axios.post(
        'https://api.zai.ai/v1/chat/completions',
        {
          model: 'zai-ai',
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: userPrompt
            }
          ],
          max_tokens: 200,
          temperature: 0.7,
        },
        {
          headers: {
            'Authorization': `Bearer ${zaiApiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      aiSuggestion = zaiResponse.data.choices[0]?.message?.content || '';

    } catch (zaiError) {
      console.error('ZAI API Error:', zaiError);
      // Enhanced fallback recommendation
      const fallbackContext: FallbackRecommendationContext = {
        recipes,
        ingredients: ingredients.split(',').map(i => i.trim()),
        cuisine: cuisine || undefined
      };
      aiSuggestion = generateSmartRecommendation(fallbackContext);
    }

    return NextResponse.json({
      recipes,
      aiSuggestion,
    });

  } catch (error) {
    console.error('Recipe API Error:', error);

    if (axios.isAxiosError(error)) {
      if (error.response?.status === 402) {
        return NextResponse.json(
          { error: 'API quota exceeded. Please try again later.' },
          { status: 402 }
        );
      }
      if (error.response?.status === 401) {
        return NextResponse.json(
          { error: 'API authentication failed. Please check the configuration.' },
          { status: 401 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to fetch recipes. Please try again.' },
      { status: 500 }
    );
  }
}