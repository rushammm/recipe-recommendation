// Contextual cooking tips based on recipe types and ingredients

export interface RecipeTypeContext {
  recipeTitle: string;
  ingredients: string[];
  cuisine?: string;
  cookingMethod?: string;
}

export function getContextualCookingTip(context: RecipeTypeContext): string {
  const { recipeTitle, ingredients, cuisine, cookingMethod } = context;
  
  // Determine recipe type
  const recipeType = determineRecipeType(recipeTitle, ingredients);
  
  // Get base tip based on recipe type
  let tip = getRecipeTypeTip(recipeType);
  
  // Enhance with cuisine-specific tips
  if (cuisine) {
    const cuisineTip = getCuisineSpecificCookingTip(cuisine, recipeType);
    if (cuisineTip) {
      tip += ` ${cuisineTip}`;
    }
  }
  
  // Add ingredient-specific technique tips
  const techniqueTip = getTechniqueSpecificTip(ingredients, recipeType);
  if (techniqueTip) {
    tip += ` ${techniqueTip}`;
  }
  
  return tip;
}

function determineRecipeType(title: string, ingredients: string[]): string {
  const titleLower = title.toLowerCase();
  const ingredientsLower = ingredients.map(i => i.toLowerCase());
  
  // Protein-based dishes
  if (ingredientsLower.some(i => ['chicken', 'beef', 'pork', 'lamb', 'fish', 'salmon', 'cod'].includes(i))) {
    if (titleLower.includes('grill') || titleLower.includes('bbq')) return 'grilled';
    if (titleLower.includes('stir') || titleLower.includes('wok')) return 'stir-fry';
    if (titleLower.includes('curry') || titleLower.includes('stew')) return 'curry';
    if (titleLower.includes('roast') || titleLower.includes('baked')) return 'roasted';
    if (titleLower.includes('soup')) return 'soup';
    return 'protein-dish';
  }
  
  // Pasta dishes
  if (titleLower.includes('pasta') || titleLower.includes('spaghetti') || 
      titleLower.includes('lasagna') || ingredientsLower.some(i => ['pasta', 'spaghetti'].includes(i))) {
    return 'pasta';
  }
  
  // Rice dishes
  if (titleLower.includes('rice') || titleLower.includes('risotto') || 
      titleLower.includes('pilaf') || ingredientsLower.some(i => ['rice'].includes(i))) {
    return 'rice-dish';
  }
  
  // Vegetable dishes
  if (ingredientsLower.filter(i => 
    ['tomato', 'onion', 'pepper', 'zucchini', 'eggplant', 'spinach', 'broccoli'].includes(i)
  ).length >= 2) {
    if (titleLower.includes('salad')) return 'salad';
    if (titleLower.includes('soup')) return 'soup';
    if (titleLower.includes('stir') || titleLower.includes('sauté')) return 'sauted';
    return 'vegetable-dish';
  }
  
  // Baked goods
  if (titleLower.includes('bread') || titleLower.includes('cake') || 
      titleLower.includes('pie') || titleLower.includes('baked')) {
    return 'baked';
  }
  
  return 'general';
}

function getRecipeTypeTip(recipeType: string): string {
  const tips: Record<string, string> = {
    'grilled': 'For perfect grilling, preheat your grill to medium-high and oil the grates to prevent sticking.',
    'stir-fry': 'Keep ingredients moving in the wok and cook on high heat for the best texture and flavor.',
    'curry': 'Build layers of flavor by toasting spices first, then aromatics, before adding liquids.',
    'roasted': 'Use high heat (400-425°F) for caramelization and do not overcrowd the pan.',
    'soup': 'Start with a good flavor base and simmer slowly to develop deep flavors.',
    'pasta': 'Cook pasta in well-salted water and save some pasta water to adjust sauce consistency.',
    'rice-dish': 'Rinse rice until water runs clear and let it rest covered for 10 minutes after cooking.',
    'salad': 'Dress salad just before serving and use a balance of acidic and sweet elements.',
    'sauted': 'Use medium-high heat and do not overcrowd the pan for proper browning.',
    'vegetable-dish': 'Cook vegetables quickly to preserve nutrients and vibrant colors.',
    'baked': 'Measure ingredients precisely and follow temperature instructions for best results.',
    'protein-dish': 'Let protein rest after cooking to redistribute juices for maximum flavor.',
    'general': 'Taste as you go and adjust seasoning gradually for the best results.'
  };
  
  return tips[recipeType] || tips.general;
}

function getCuisineSpecificCookingTip(cuisine: string, recipeType: string): string {
  const tips: Record<string, Record<string, string>> = {
    italian: {
      'pasta': 'Use high-quality olive oil and finish with fresh herbs for authentic flavor.',
      'general': 'Let ingredients shine with simple preparations and high-quality olive oil.'
    },
    indian: {
      'curry': 'Toast whole spices before grinding for maximum flavor, and use ghee for richness.',
      'rice-dish': 'Soak basmati rice for 30 minutes before cooking for fluffy, separate grains.',
      'general': 'Build flavor layers with spices, and finish with garam masala for aromatic complexity.'
    },
    chinese: {
      'stir-fry': 'Heat your wok until smoking before adding oil for the perfect sear.',
      'rice-dish': 'Use day-old rice for fried rice to prevent sogginess.',
      'general': 'Balance flavors and textures, and use high heat for quick cooking.'
    },
    mexican: {
      'general': 'Fresh lime juice and cilantro at the end brighten all flavors.',
      'vegetable-dish': 'Roast vegetables with chiles and lime for authentic Mexican flavor.'
    },
    mediterranean: {
      'general': 'Extra virgin olive oil and fresh herbs are essential for authentic flavor.',
      'vegetable-dish': 'Grill vegetables with olive oil and herbs for Mediterranean perfection.'
    },
    thai: {
      'curry': 'Balance sweet, sour, salty, and spicy flavors with fish sauce and lime.',
      'general': 'Fresh herbs and aromatics are key - add them at the end for maximum flavor.'
    },
    pakistani: {
      'curry': 'Slow-cook with ghee and whole spices for deep, authentic flavors.',
      'rice-dish': 'Layer rice and curry for dum cooking to infuse flavors throughout.',
      'general': 'Garam masala at the end adds aromatic finish to any dish.'
    }
  };
  
  return tips[cuisine.toLowerCase()]?.[recipeType] || tips[cuisine.toLowerCase()]?.general || '';
}

function getTechniqueSpecificTip(ingredients: string[], recipeType: string): string {
  const ingredientsLower = ingredients.map(i => i.toLowerCase());
  
  // Protein-specific techniques
  if (ingredientsLower.includes('chicken')) {
    return 'Brine chicken for extra moisture and flavor before cooking.';
  }
  
  if (ingredientsLower.includes('beef')) {
    return 'Season beef generously and let it come to room temperature before cooking.';
  }
  
  if (ingredientsLower.includes('fish')) {
    return 'Cook fish quickly over high heat and avoid overcooking for the best texture.';
  }
  
  // Vegetable-specific techniques
  if (ingredientsLower.includes('tomatoes')) {
    return 'Use ripe tomatoes and remove seeds for less watery results in cooked dishes.';
  }
  
  if (ingredientsLower.includes('garlic')) {
    return 'Sauté garlic slowly over medium heat to prevent burning and develop sweetness.';
  }
  
  if (ingredientsLower.includes('onion')) {
    return 'Caramelize onions slowly for deep, sweet flavor that enhances any dish.';
  }
  
  // Herb-specific techniques
  if (ingredientsLower.some(i => ['basil', 'cilantro', 'parsley', 'mint'].includes(i))) {
    return 'Add fresh herbs at the end of cooking to preserve their bright flavors.';
  }
  
  // Spice-specific techniques
  if (ingredientsLower.some(i => ['cumin', 'coriander', 'turmeric', 'paprika'].includes(i))) {
    return 'Toast spices briefly in oil before adding other ingredients to release their aromas.';
  }
  
  return '';
}

export function getPreparationOrderTip(ingredients: string[]): string {
  const order = getOptimalPreparationOrder(ingredients);
  return `For best results, prepare ingredients in this order: ${order.join(' → ')}.`;
}

function getOptimalPreparationOrder(ingredients: string[]): string[] {
  const order: string[] = [];
  const ingredientsLower = ingredients.map(i => i.toLowerCase());
  
  // Aromatics first
  const aromatics = ingredientsLower.filter(i => ['garlic', 'onion', 'shallots', 'ginger'].includes(i));
  if (aromatics.length > 0) {
    order.push('aromatics (garlic, onions, etc.)');
  }
  
  // Hard vegetables
  const hardVegetables = ingredientsLower.filter(i => 
    ['carrots', 'potatoes', 'sweet potatoes', 'winter squash'].includes(i)
  );
  if (hardVegetables.length > 0) {
    order.push('hard vegetables');
  }
  
  // Protein
  const protein = ingredientsLower.filter(i => 
    ['chicken', 'beef', 'pork', 'fish', 'tofu', 'tempeh'].includes(i)
  );
  if (protein.length > 0) {
    order.push('protein');
  }
  
  // Soft vegetables
  const softVegetables = ingredientsLower.filter(i => 
    ['zucchini', 'bell peppers', 'mushrooms', 'spinach', 'tomatoes'].includes(i)
  );
  if (softVegetables.length > 0) {
    order.push('soft vegetables');
  }
  
  // Fresh herbs
  const herbs = ingredientsLower.filter(i => 
    ['basil', 'cilantro', 'parsley', 'mint', 'dill'].includes(i)
  );
  if (herbs.length > 0) {
    order.push('fresh herbs (at the end)');
  }
  
  return order.length > 0 ? order : ['ingredients as needed'];
}