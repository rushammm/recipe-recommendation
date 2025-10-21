// AI Prompt utilities for generating intelligent recipe recommendations
import { getContextualCookingTip, RecipeTypeContext } from './cookingTips';

export interface AIRecommendationContext {
  ingredients: string[];
  cuisine?: string;
  recipes: Array<{
    title: string;
    readyInMinutes?: number;
    servings?: number;
  }>;
  dietaryPreferences?: string[];
  cookingTimePreference?: 'quick' | 'moderate' | 'any';
  nutritionalFocus?: 'balanced' | 'high-protein' | 'low-carb' | 'vegetarian' | 'any';
}

export function generateDynamicPrompt(context: AIRecommendationContext): string {
  const { ingredients, cuisine, recipes, dietaryPreferences, cookingTimePreference, nutritionalFocus } = context;
  
  // Base system prompt
  let systemPrompt = `You are an expert chef and nutritionist with deep knowledge of various cuisines and cooking techniques.
  Based on the available ingredients and recipe options, provide personalized recommendations that consider:
  1. Flavor compatibility of ingredients
  2. Nutritional balance and health benefits
  3. Cooking techniques that enhance the ingredients
  4. Cuisine-specific preparation methods
  5. Practical cooking tips for better results
  6. Nutritional insights about the recommended dish
  
  Keep your response under 150 words, be encouraging, and provide actionable advice.`;

  // Add cuisine-specific context
  if (cuisine) {
    const cuisineContext = getCuisineContext(cuisine);
    systemPrompt += `\n\nCuisine Context: ${cuisineContext}`;
  }

  // Add ingredient-specific insights
  if (ingredients.length > 0) {
    const ingredientInsights = getIngredientInsights(ingredients);
    systemPrompt += `\n\nIngredient Insights: ${ingredientInsights}`;
  }

  // Add dietary considerations
  if (dietaryPreferences && dietaryPreferences.length > 0) {
    systemPrompt += `\n\nDietary Considerations: User prefers ${dietaryPreferences.join(', ')} options.`;
  }

  // Add cooking time preference
  if (cookingTimePreference) {
    const timeContext = getTimePreferenceContext(cookingTimePreference);
    systemPrompt += `\n\nTime Preference: ${timeContext}`;
  }

  // Add nutritional focus
  if (nutritionalFocus && nutritionalFocus !== 'any') {
    const nutritionContext = getNutritionalFocusContext(nutritionalFocus);
    systemPrompt += `\n\nNutritional Focus: ${nutritionContext}`;
  }

  return systemPrompt;
}

export function generateEnhancedUserPrompt(context: AIRecommendationContext): string {
  const { ingredients, cuisine, recipes } = context;
  
  let userPrompt = `I have these ingredients: ${ingredients.join(', ')}`;
  
  if (cuisine) {
    userPrompt += ` and I'd like to make ${cuisine} cuisine`;
  }
  
  userPrompt += `. Here are the recipe options I found:\n`;
  
  recipes.forEach((recipe, index) => {
    userPrompt += `${index + 1}. ${recipe.title}`;
    if (recipe.readyInMinutes) {
      userPrompt += ` (${recipe.readyInMinutes} minutes)`;
    }
    userPrompt += '\n';
  });
  
  // Add contextual cooking tip for the first recipe
  if (recipes.length > 0) {
    const cookingContext: RecipeTypeContext = {
      recipeTitle: recipes[0].title,
      ingredients,
      cuisine
    };
    const contextualTip = getContextualCookingTip(cookingContext);
    userPrompt += `\n\nAdditional context: ${contextualTip}`;
  }
  
  userPrompt += `\n\nWhich recipe would you recommend and what specific tips can you provide to make it exceptional?`;
  
  return userPrompt;
}

export function generateUserPrompt(context: AIRecommendationContext): string {
  const { ingredients, cuisine, recipes } = context;
  
  let userPrompt = `I have these ingredients: ${ingredients.join(', ')}`;
  
  if (cuisine) {
    userPrompt += ` and I'd like to make ${cuisine} cuisine`;
  }
  
  userPrompt += `. Here are the recipe options I found:\n`;
  
  recipes.forEach((recipe, index) => {
    userPrompt += `${index + 1}. ${recipe.title}`;
    if (recipe.readyInMinutes) {
      userPrompt += ` (${recipe.readyInMinutes} minutes)`;
    }
    userPrompt += '\n';
  });
  
  userPrompt += `\nWhich recipe would you recommend and what specific tips can you provide to make it exceptional?`;
  
  return userPrompt;
}

function getCuisineContext(cuisine: string): string {
  const contexts: Record<string, string> = {
    italian: "Italian cuisine emphasizes fresh ingredients, olive oil, herbs like basil and oregano, and proper pasta cooking techniques.",
    indian: "Indian cuisine uses complex spice blends, ghee, and techniques like tempering (tadka) for deep flavor development.",
    chinese: "Chinese cuisine focuses on balance, wok cooking techniques, and the interplay of sweet, sour, salty, and bitter flavors.",
    mexican: "Mexican cuisine features chiles, cilantro, lime, and techniques like roasting and slow-cooking for depth.",
    mediterranean: "Mediterranean cuisine highlights olive oil, fresh herbs, garlic, and simple preparations that let ingredients shine.",
    thai: "Thai cuisine balances sweet, sour, salty, and spicy flavors with fresh herbs and aromatic ingredients.",
    pakistani: "Pakistani cuisine uses aromatic spices, ghee, and techniques like dum (slow steaming) for rich flavors.",
    american: "American cuisine is diverse, often featuring grilling, smoking, and comfort food preparations."
  };
  
  return contexts[cuisine.toLowerCase()] || "Focus on techniques that enhance the natural flavors of the ingredients.";
}

function getIngredientInsights(ingredients: string[]): string {
  const insights: string[] = [];
  
  // Protein ingredients
  if (ingredients.some(i => ['chicken', 'beef', 'pork', 'fish', 'tofu'].includes(i.toLowerCase()))) {
    insights.push("Protein present - consider marination techniques and proper cooking temperatures");
  }
  
  // Aromatic ingredients
  if (ingredients.some(i => ['garlic', 'onion', 'ginger', 'shallots'].includes(i.toLowerCase()))) {
    insights.push("Aromatics available - focus on proper sautéing techniques for flavor base");
  }
  
  // Fresh herbs
  if (ingredients.some(i => ['basil', 'cilantro', 'parsley', 'mint'].includes(i.toLowerCase()))) {
    insights.push("Fresh herbs available - add at the end to preserve flavor and aroma");
  }
  
  // Vegetables
  const vegetables = ingredients.filter(i => 
    ['tomato', 'pepper', 'onion', 'carrot', 'broccoli', 'spinach', 'mushroom'].includes(i.toLowerCase())
  );
  if (vegetables.length > 0) {
    insights.push("Fresh vegetables - consider cooking methods that preserve texture and nutrients");
  }
  
  return insights.join('. ') || "Focus on techniques that bring out the best in these ingredients.";
}

function getTimePreferenceContext(preference: string): string {
  const contexts: Record<string, string> = {
    quick: "User prefers quick meals under 30 minutes - focus on efficient cooking methods",
    moderate: "User doesn't mind spending moderate time cooking - can include techniques that build flavor",
    any: "User is flexible with cooking time - can suggest both quick and elaborate preparations"
  };
  
  return contexts[preference] || contexts.any;
}

function getNutritionalFocusContext(focus: string): string {
  const contexts: Record<string, string> = {
    balanced: "Focus on recipes with a good balance of macronutrients - protein, carbs, and healthy fats.",
    'high-protein': "Prioritize recipes rich in protein sources like lean meats, fish, legumes, or tofu.",
    'low-carb': "Focus on recipes that are lower in carbohydrates, emphasizing vegetables and proteins.",
    vegetarian: "Focus on plant-based recipes that are nutritionally complete with protein from various sources.",
    any: "No specific nutritional focus - recommend based on flavor and cooking techniques."
  };
  
  return contexts[focus] || contexts.any;
}