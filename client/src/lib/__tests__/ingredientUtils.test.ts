import { describe, it, expect } from 'vitest';
import { 
  normalizeIngredientName, 
  convertUnit, 
  aggregateIngredients,
  generateShoppingList 
} from '../ingredientUtils';

describe('ingredientUtils', () => {
  describe('normalizeIngredientName', () => {
    it('should normalize ingredient names correctly', () => {
      expect(normalizeIngredientName('Fresh Tomatoes')).toBe('tomatoes');
      expect(normalizeIngredientName('Organic Olive Oil')).toBe('olive oil');
      expect(normalizeIngredientName('Dried Basil Leaves')).toBe('basil leaves');
      expect(normalizeIngredientName('Extra Virgin Olive Oil')).toBe('extra virgin olive oil');
    });

    it('should handle special characters and multiple spaces', () => {
      expect(normalizeIngredientName('Tomato, diced')).toBe('tomato diced');
      expect(normalizeIngredientName('Bell  Pepper')).toBe('bell pepper');
      expect(normalizeIngredientName('Garlic (minced)')).toBe('garlic minced');
    });
  });

  describe('convertUnit', () => {
    it('should convert volume units correctly', () => {
      const result = convertUnit(16, 'tbsp', 'cups');
      expect(result).toEqual({
        amount: 1,
        factor: 0.0625
      });
    });

    it('should convert weight units correctly', () => {
      const result = convertUnit(16, 'oz', 'lb');
      expect(result).toEqual({
        amount: 1,
        factor: 0.0625
      });
    });

    it('should return null for incompatible units', () => {
      expect(convertUnit(1, 'cups', 'lb')).toBeNull();
      expect(convertUnit(1, 'tbsp', 'pieces')).toBeNull();
    });

    it('should return null for unknown units', () => {
      expect(convertUnit(1, 'unknown', 'cups')).toBeNull();
      expect(convertUnit(1, 'cups', 'unknown')).toBeNull();
    });
  });

  describe('aggregateIngredients', () => {
    const mockRecipeIngredients = [
      {
        recipeId: 'recipe1',
        ingredients: [
          { name: 'Tomatoes', amount: '4', unit: 'large' },
          { name: 'Garlic', amount: '3', unit: 'cloves' },
          { name: 'Olive oil', amount: '2', unit: 'tbsp' }
        ]
      },
      {
        recipeId: 'recipe2',
        ingredients: [
          { name: 'Fresh Tomatoes', amount: '2', unit: 'large' },
          { name: 'Garlic cloves', amount: '4', unit: 'cloves' },
          { name: 'Extra virgin olive oil', amount: '3', unit: 'tbsp' }
        ]
      }
    ];

    it('should aggregate ingredients with same normalized names', () => {
      const result = aggregateIngredients(mockRecipeIngredients);
      
      expect(result).toHaveLength(3);
      
      const tomatoes = result.find(item => item.normalizedName === 'tomatoes');
      expect(tomatoes).toBeDefined();
      expect(tomatoes?.totalAmount).toBe('6');
      expect(tomatoes?.unit).toBe('large');
      expect(tomatoes?.recipes).toEqual(['recipe1', 'recipe2']);
      
      const garlic = result.find(item => item.normalizedName === 'garlic');
      expect(garlic).toBeDefined();
      expect(garlic?.totalAmount).toBe('7');
      expect(garlic?.unit).toBe('cloves');
      
      const oliveOil = result.find(item => item.normalizedName === 'olive oil');
      expect(oliveOil).toBeDefined();
      expect(oliveOil?.totalAmount).toBe('5');
      expect(oliveOil?.unit).toBe('tbsp');
    });

    it('should handle fractions in amounts', () => {
      const recipeIngredients = [
        {
          recipeId: 'recipe1',
          ingredients: [
            { name: 'Sugar', amount: '1/2', unit: 'cup' },
            { name: 'Flour', amount: '1 1/2', unit: 'cups' }
          ]
        }
      ];

      const result = aggregateIngredients(recipeIngredients);
      
      expect(result).toHaveLength(2);
      expect(result[0].totalAmount).toBe('0.5');
      expect(result[1].totalAmount).toBe('1.5');
    });

    it('should provide unit conversions when possible', () => {
      const recipeIngredients = [
        {
          recipeId: 'recipe1',
          ingredients: [
            { name: 'Butter', amount: '8', unit: 'tbsp' }
          ]
        }
      ];

      const result = aggregateIngredients(recipeIngredients);
      const butter = result.find(item => item.normalizedName === 'butter');
      
      expect(butter?.conversions).toHaveLength(1);
      expect(butter?.conversions[0].from).toBe('tbsp');
      expect(butter?.conversions[0].to).toBe('cups');
      expect(butter?.conversions[0].amount).toBe('0.50');
    });

    it('should handle empty ingredient lists', () => {
      const result = aggregateIngredients([]);
      expect(result).toEqual([]);
    });

    it('should handle single recipe', () => {
      const recipeIngredients = [
        {
          recipeId: 'recipe1',
          ingredients: [
            { name: 'Salt', amount: '1', unit: 'tsp' }
          ]
        }
      ];

      const result = aggregateIngredients(recipeIngredients);
      expect(result).toHaveLength(1);
      expect(result[0].totalAmount).toBe('1');
      expect(result[0].recipes).toEqual(['recipe1']);
    });
  });

  describe('generateShoppingList', () => {
    const mockRecipes = [
      {
        id: 'recipe1',
        title: 'Pasta',
        ingredients: [
          { name: 'Pasta', amount: '1', unit: 'lb' },
          { name: 'Tomatoes', amount: '2', unit: 'large' }
        ]
      },
      {
        id: 'recipe2',
        title: 'Salad',
        ingredients: [
          { name: 'Fresh Tomatoes', amount: '3', unit: 'large' },
          { name: 'Lettuce', amount: '1', unit: 'head' }
        ]
      }
    ];

    it('should generate shopping list from recipes', () => {
      const result = generateShoppingList(mockRecipes);
      
      expect(result).toHaveLength(3);
      
      const tomatoes = result.find(item => item.normalizedName === 'tomatoes');
      expect(tomatoes).toBeDefined();
      expect(tomatoes?.totalAmount).toBe('5');
      expect(tomatoes?.recipes).toEqual(['recipe1', 'recipe2']);
      
      const pasta = result.find(item => item.normalizedName === 'pasta');
      expect(pasta).toBeDefined();
      expect(pasta?.totalAmount).toBe('1');
      expect(pasta?.recipes).toEqual(['recipe1']);
      
      const lettuce = result.find(item => item.normalizedName === 'lettuce');
      expect(lettuce).toBeDefined();
      expect(lettuce?.totalAmount).toBe('1');
      expect(lettuce?.recipes).toEqual(['recipe2']);
    });

    it('should handle empty recipe list', () => {
      const result = generateShoppingList([]);
      expect(result).toEqual([]);
    });
  });
});
