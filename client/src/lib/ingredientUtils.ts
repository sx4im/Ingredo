// Utility functions for ingredient aggregation and unit conversion

export interface Ingredient {
  name: string;
  amount: string;
  unit: string;
}

export interface AggregatedIngredient {
  id: string;
  name: string;
  normalizedName: string;
  totalAmount: string;
  unit: string;
  recipes: string[];
  conversions: Array<{
    from: string;
    to: string;
    amount: string;
    factor: number;
  }>;
}

// Unit conversion factors (to base units)
const UNIT_CONVERSIONS: Record<string, Record<string, number>> = {
  // Volume conversions (to cups)
  volume: {
    'tsp': 1/48,      // 1 cup = 48 tsp
    'tbsp': 1/16,     // 1 cup = 16 tbsp
    'fl oz': 1/8,     // 1 cup = 8 fl oz
    'cup': 1,
    'pint': 2,
    'quart': 4,
    'gallon': 16,
    'ml': 1/236.588,  // 1 cup = 236.588 ml
    'l': 1/0.236588,  // 1 cup = 0.236588 l
  },
  // Weight conversions (to pounds)
  weight: {
    'oz': 1/16,       // 1 lb = 16 oz
    'lb': 1,
    'lbs': 1,
    'g': 1/453.592,   // 1 lb = 453.592 g
    'kg': 2.20462,    // 1 kg = 2.20462 lbs
  },
  // Count conversions (to pieces)
  count: {
    'piece': 1,
    'pieces': 1,
    'large': 1,
    'medium': 1,
    'small': 1,
    'clove': 1,
    'cloves': 1,
    'slice': 1,
    'slices': 1,
  }
};

// Categorize units by type
function getUnitType(unit: string): 'volume' | 'weight' | 'count' | 'unknown' {
  const lowerUnit = unit.toLowerCase();
  
  if (UNIT_CONVERSIONS.volume[lowerUnit]) return 'volume';
  if (UNIT_CONVERSIONS.weight[lowerUnit]) return 'weight';
  if (UNIT_CONVERSIONS.count[lowerUnit]) return 'count';
  
  return 'unknown';
}

// Convert amount to number, handling fractions
function parseAmount(amount: string): number {
  if (typeof amount === 'number') return amount;
  
  // Handle fractions like "1/2", "3/4"
  if (amount.includes('/')) {
    const [numerator, denominator] = amount.split('/').map(Number);
    return numerator / denominator;
  }
  
  // Handle mixed numbers like "1 1/2"
  if (amount.includes(' ')) {
    const parts = amount.split(' ');
    const whole = parseFloat(parts[0]) || 0;
    const fraction = parts[1]?.includes('/') ? parseAmount(parts[1]) : 0;
    return whole + fraction;
  }
  
  return parseFloat(amount) || 0;
}

// Normalize ingredient names for grouping
export function normalizeIngredientName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s]/g, '') // Remove special characters
    .replace(/\b(fresh|dried|frozen|canned|organic|raw|cooked)\b/g, '') // Remove descriptors
    .trim();
}

// Convert between units of the same type
export function convertUnit(
  amount: number, 
  fromUnit: string, 
  toUnit: string
): { amount: number; factor: number } | null {
  const fromType = getUnitType(fromUnit);
  const toType = getUnitType(toUnit);
  
  if (fromType !== toType || fromType === 'unknown') {
    return null;
  }
  
  const conversions = UNIT_CONVERSIONS[fromType];
  const fromFactor = conversions[fromUnit.toLowerCase()];
  const toFactor = conversions[toUnit.toLowerCase()];
  
  if (!fromFactor || !toFactor) {
    return null;
  }
  
  const factor = fromFactor / toFactor;
  const convertedAmount = amount * factor;
  
  return {
    amount: convertedAmount,
    factor
  };
}

// Aggregate ingredients from multiple recipes
export function aggregateIngredients(
  recipeIngredients: Array<{
    recipeId: string;
    ingredients: Ingredient[];
  }>
): AggregatedIngredient[] {
  const ingredientMap = new Map<string, {
    name: string;
    normalizedName: string;
    amounts: Array<{ amount: number; unit: string; recipeId: string }>;
  }>();

  // Group ingredients by normalized name
  recipeIngredients.forEach(({ recipeId, ingredients }) => {
    ingredients.forEach(ingredient => {
      const normalized = normalizeIngredientName(ingredient.name);
      const amount = parseAmount(ingredient.amount);
      
      if (!ingredientMap.has(normalized)) {
        ingredientMap.set(normalized, {
          name: ingredient.name,
          normalizedName: normalized,
          amounts: []
        });
      }
      
      ingredientMap.get(normalized)!.amounts.push({
        amount,
        unit: ingredient.unit,
        recipeId
      });
    });
  });

  // Aggregate and convert units
  const aggregated: AggregatedIngredient[] = [];
  
  ingredientMap.forEach((ingredient, normalizedName) => {
    const amounts = ingredient.amounts;
    const unitType = getUnitType(amounts[0].unit);
    
    if (unitType === 'unknown' || amounts.length === 1) {
      // No conversion possible or only one amount
      const totalAmount = amounts.reduce((sum, item) => sum + item.amount, 0);
      aggregated.push({
        id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: ingredient.name,
        normalizedName,
        totalAmount: totalAmount.toString(),
        unit: amounts[0].unit,
        recipes: [...new Set(amounts.map(a => a.recipeId))],
        conversions: []
      });
      return;
    }

    // Try to convert all amounts to the most common unit
    const unitCounts = new Map<string, number>();
    amounts.forEach(item => {
      unitCounts.set(item.unit, (unitCounts.get(item.unit) || 0) + 1);
    });
    
    const mostCommonUnit = Array.from(unitCounts.entries())
      .sort(([,a], [,b]) => b - a)[0][0];
    
    let totalAmount = 0;
    const conversions: Array<{ from: string; to: string; amount: string; factor: number }> = [];
    
    amounts.forEach(item => {
      if (item.unit === mostCommonUnit) {
        totalAmount += item.amount;
      } else {
        const conversion = convertUnit(item.amount, item.unit, mostCommonUnit);
        if (conversion) {
          totalAmount += conversion.amount;
          conversions.push({
            from: item.unit,
            to: mostCommonUnit,
            amount: conversion.amount.toFixed(2),
            factor: conversion.factor
          });
        } else {
          // Can't convert, keep separate
          totalAmount += item.amount;
        }
      }
    });

    aggregated.push({
      id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: ingredient.name,
      normalizedName,
      totalAmount: totalAmount.toString(),
      unit: mostCommonUnit,
      recipes: [...new Set(amounts.map(a => a.recipeId))],
      conversions
    });
  });

  return aggregated.sort((a, b) => a.name.localeCompare(b.name));
}

// Generate shopping list from recipes
export function generateShoppingList(
  recipes: Array<{ id: string; title: string; ingredients: Ingredient[] }>
): AggregatedIngredient[] {
  const recipeIngredients = recipes.map(recipe => ({
    recipeId: recipe.id,
    ingredients: recipe.ingredients
  }));
  
  return aggregateIngredients(recipeIngredients);
}
