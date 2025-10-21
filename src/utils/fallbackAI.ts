// Enhanced fallback AI recommendations when ZAI API is unavailable

export interface Recipe {
  title: string;
  image: string;
  sourceUrl?: string;
  readyInMinutes?: number;
  servings?: number;
}

export interface FallbackRecommendationContext {
  recipes: Recipe[];
  ingredients: string[];
  cuisine?: string;
}

export function generateSmartRecommendation(context: FallbackRecommendationContext): string {
  const { recipes, ingredients, cuisine } = context;
  
  if (recipes.length === 0) {
    return generateNoRecipesRecommendation(ingredients, cuisine);
  }

  // Analyze recipes for different criteria
  const analysis = analyzeRecipes(recipes, ingredients, cuisine);
  
  // Generate recommendation based on analysis
  return generateRecommendation(analysis, ingredients, cuisine, recipes);
}

function analyzeRecipes(recipes: Recipe[], ingredients: string[], cuisine?: string): RecipeCategories {
  const ingredientList = ingredients.map(i => i.toLowerCase().trim());
  
  // Categorize recipes
  const categories: RecipeCategories = {
    healthy: [] as Recipe[],
    quick: [] as Recipe[],
    cuisineSpecific: [] as Recipe[],
    ingredientMatch: [] as (Recipe & { matchScore: number })[]
  };

  recipes.forEach(recipe => {
    const title = recipe.title.toLowerCase();
    
    // Health indicators
    const healthKeywords = ['salad', 'grilled', 'baked', 'steamed', 'fresh', 'vegetable', 'light', 'healthy'];
    if (healthKeywords.some(keyword => title.includes(keyword))) {
      categories.healthy.push(recipe);
    }
    
    // Quick meal indicators
    const quickKeywords = ['easy', 'quick', 'simple', 'fast', '15-minute', '30-minute', 'ready'];
    if (quickKeywords.some(keyword => title.includes(keyword)) || 
        (recipe.readyInMinutes && recipe.readyInMinutes <= 30)) {
      categories.quick.push(recipe);
    }
    
    // Cuisine-specific indicators
    if (cuisine) {
      const cuisineKeywords = getCuisineKeywords(cuisine);
      if (cuisineKeywords.some(keyword => title.includes(keyword))) {
        categories.cuisineSpecific.push(recipe);
      }
    }
    
    // Ingredient match scoring
    const matchScore = calculateIngredientMatch(recipe.title, ingredientList);
    if (matchScore > 0.5) {
      categories.ingredientMatch.push({ ...recipe, matchScore } as Recipe & { matchScore: number });
    }
  });

  return categories;
}

function calculateIngredientMatch(recipeTitle: string, ingredients: string[]): number {
  const title = recipeTitle.toLowerCase();
  const matchedIngredients = ingredients.filter(ingredient => 
    title.includes(ingredient) || ingredient.includes(title.split(' ')[0])
  );
  return matchedIngredients.length / ingredients.length;
}

function getCuisineKeywords(cuisine: string): string[] {
  const keywords: Record<string, string[]> = {
    italian: ['pasta', 'pizza', 'risotto', 'lasagna', 'gnocchi', 'bruschetta'],
    indian: ['curry', 'tikka', 'biryani', 'masala', 'naan', 'samosa', 'korma'],
    chinese: ['stir-fry', 'fried rice', 'noodles', 'dumplings', 'wok', 'sweet and sour'],
    mexican: ['taco', 'burrito', 'quesadilla', 'enchilada', 'salsa', 'guacamole'],
    mediterranean: ['hummus', 'falafel', 'tabbouleh', 'gyro', 'kebab', 'tzatziki'],
    thai: ['curry', 'pad thai', 'stir-fry', 'coconut', 'lemongrass', 'basil'],
    pakistani: ['karahi', 'biryani', 'korma', 'kebab', 'naan', 'haleem'],
    american: ['burger', 'bbq', 'grilled', 'sandwich', 'fries', 'mac and cheese']
  };
  
  return keywords[cuisine.toLowerCase()] || [];
}

interface RecipeCategories {
  healthy: Recipe[];
  quick: Recipe[];
  cuisineSpecific: Recipe[];
  ingredientMatch: (Recipe & { matchScore: number })[];
}

function generateRecommendation(categories: RecipeCategories, ingredients: string[], cuisine?: string, allRecipes: Recipe[] = []): string {
  let recommendedRecipe: Recipe;
  let reason = '';
  let tip = '';

  // Priority order: cuisine-specific > healthy > quick > ingredient match
  if (categories.cuisineSpecific.length > 0) {
    recommendedRecipe = categories.cuisineSpecific[0];
    reason = `This ${cuisine} dish perfectly matches your preference! `;
    tip = getCuisineSpecificTip(cuisine);
  } else if (categories.healthy.length > 0) {
    recommendedRecipe = categories.healthy[0];
    reason = "This looks like a nutritious choice! ";
    tip = getHealthTip();
  } else if (categories.quick.length > 0) {
    recommendedRecipe = categories.quick[0];
    reason = "Perfect for a quick and delicious meal! ";
    tip = getQuickCookingTip();
  } else if (categories.ingredientMatch.length > 0) {
    // Sort by match score
    categories.ingredientMatch.sort((a, b) => b.matchScore - a.matchScore);
    recommendedRecipe = categories.ingredientMatch[0];
    reason = "This recipe makes great use of your ingredients! ";
    tip = getIngredientBasedTip(ingredients);
  } else {
    recommendedRecipe = allRecipes[0];
    reason = "This looks like a delicious option! ";
    tip = getGeneralCookingTip();
  }

  // Add time-specific advice
  if (recommendedRecipe.readyInMinutes) {
    if (recommendedRecipe.readyInMinutes <= 30) {
      tip += " This quick recipe is perfect for busy days!";
    } else if (recommendedRecipe.readyInMinutes > 60) {
      tip += " Take your time with this recipe - good things come to those who wait!";
    }
  }

  // Add nutritional insights
  const nutritionalInsight = getNutritionalInsight(recommendedRecipe, ingredients);
  if (nutritionalInsight) {
    tip += ` ${nutritionalInsight}`;
  }

  return `${reason}I recommend "${recommendedRecipe.title}" - it looks delicious and should work well with your ingredients. ${tip}`;
}

function generateNoRecipesRecommendation(ingredients: string[], cuisine?: string): string {
  const suggestions = getIngredientSubstitutions(ingredients);
  const cuisineTip = cuisine ? ` Try searching for ${cuisine} recipes with these ingredients or ` : ' ';
  
  return `No recipes found with those exact ingredients. ${cuisineTip}try these alternatives: ${suggestions}. Also, consider adding common pantry items like onions, garlic, or olive oil to expand your options!`;
}

function getIngredientSubstitutions(ingredients: string[]): string {
  const substitutions: Record<string, string[]> = {
    'chicken': ['tofu', 'paneer', 'chickpeas', 'white beans'],
    'beef': ['mushrooms', 'lentils', 'black beans', 'portobello'],
    'tomatoes': ['red bell peppers', 'canned tomatoes', 'tomato paste', 'paprika'],
    'onions': ['shallots', 'leeks', 'green onions', 'fennel'],
    'garlic': ['garlic powder', 'shallots', 'onion powder', 'ginger'],
    'rice': ['quinoa', 'couscous', 'pasta', 'potatoes'],
    'pasta': ['rice', 'potatoes', 'bread', 'polenta']
  };

  const suggestions: string[] = [];
  
  ingredients.forEach(ingredient => {
    const lower = ingredient.toLowerCase();
    if (substitutions[lower]) {
      suggestions.push(`${ingredient} → ${substitutions[lower].join(' or ')}`);
    }
  });

  return suggestions.length > 0 ? suggestions.join(', ') : 'try adding common ingredients like eggs, flour, or herbs';
}

function getCuisineSpecificTip(cuisine?: string): string {
  const tips: Record<string, string> = {
    italian: 'For authentic Italian flavor, use high-quality olive oil and fresh herbs. Don\'t overcook your pasta!',
    indian: 'Toast your spices before adding them to release their aromas. Ghee adds authentic flavor!',
    chinese: 'Heat your wok until it smoking hot before adding ingredients for perfect stir-fry results!',
    mexican: 'Fresh lime juice and cilantro at the end brighten all the flavors. Don\'t skip the chiles!',
    mediterranean: 'Extra virgin olive oil and fresh herbs are key. Let ingredients shine simply!',
    thai: 'Balance is crucial - sweet, sour, salty, and spicy. Fish sauce adds authentic umami!',
    pakistani: 'Garam masala at the end adds aromatic finish. Slow cooking develops deep flavors!',
    american: 'Don\'t be afraid to season generously. American cuisine loves bold flavors!'
  };
  
  return tips[cuisine?.toLowerCase() || ''] || getGeneralCookingTip();
}

function getHealthTip(): string {
  const tips = [
    'Add extra vegetables to boost nutrition without compromising flavor!',
    'Consider using less salt and more herbs for a healthier seasoning approach.',
    'Grilling or baking instead of frying can make this even healthier!',
    'Add a side salad to complete this nutritious meal.'
  ];
  
  return tips[Math.floor(Math.random() * tips.length)];
}

function getNutritionalInsight(recipe: Recipe, ingredients: string[]): string {
  const title = recipe.title.toLowerCase();
  const ingredientList = ingredients.map(i => i.toLowerCase());
  
  // Protein-rich insights
  if (ingredientList.some(i => ['chicken', 'beef', 'fish', 'tofu', 'beans', 'lentils'].includes(i))) {
    return "This dish provides good protein for muscle maintenance and satiety.";
  }
  
  // Vegetable-rich insights
  const vegetableCount = ingredientList.filter(i =>
    ['tomato', 'spinach', 'broccoli', 'pepper', 'carrot', 'onion', 'mushroom'].includes(i)
  ).length;
  
  if (vegetableCount >= 3) {
    return "Packed with vegetables, this meal provides essential vitamins and fiber.";
  }
  
  // Healthy fats insights
  if (ingredientList.some(i => ['avocado', 'olive oil', 'nuts', 'salmon'].includes(i))) {
    return "Contains healthy fats that support heart health and brain function.";
  }
  
  // Complex carbs insights
  if (ingredientList.some(i => ['rice', 'quinoa', 'pasta', 'potatoes', 'sweet potatoes'].includes(i))) {
    return "Provides complex carbohydrates for sustained energy throughout the day.";
  }
  
  // General balanced insight
  return "This recipe offers a good balance of nutrients for a healthy meal.";
}

function getQuickCookingTip(): string {
  const tips = [
    'Prep all your ingredients before you start cooking for even faster results!',
    'A hot pan is your best friend for quick cooking - get it properly heated first.',
    'Cut ingredients uniformly for even cooking in less time.',
    'Multitask by prepping the next ingredient while one is cooking.'
  ];
  
  return tips[Math.floor(Math.random() * tips.length)];
}

function getIngredientBasedTip(ingredients: string[]): string {
  const tips: Record<string, string> = {
    'chicken': 'Let chicken rest for 5 minutes after cooking to keep it juicy!',
    'tomatoes': 'Use ripe tomatoes for the best flavor, or canned when fresh aren\'t available.',
    'garlic': 'Sauté garlic slowly over medium heat to prevent burning and develop sweetness.',
    'onion': 'Caramelize onions slowly for deep, sweet flavor that enhances any dish.',
    'rice': 'Rinse rice before cooking and let it rest covered for 10 minutes after cooking.',
    'pasta': 'Save some pasta water to add to your sauce for perfect consistency!'
  };

  for (const ingredient of ingredients) {
    const lower = ingredient.toLowerCase();
    if (tips[lower]) {
      return tips[lower];
    }
  }
  
  return getGeneralCookingTip();
}

function getGeneralCookingTip(): string {
  const tips = [
    'Taste as you go and adjust seasoning gradually - you can always add more!',
    'Fresh herbs at the end of cooking brighten flavors dramatically.',
    'A squeeze of lemon or lime can brighten almost any dish.',
    'Don\'t crowd the pan - cook in batches if needed for better browning.',
    'Let meat rest after cooking to redistribute juices for maximum flavor.'
  ];
  
  return tips[Math.floor(Math.random() * tips.length)];
}