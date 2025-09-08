// Mock API service for frontend development
import { 
  mockRecipes, 
  mockIngredients, 
  mockUserProfile, 
  mockCollections, 
  mockAdminStats, 
  mockUsers, 
  mockAdminRecipes 
} from './mockData';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory storage for shopping lists
let shoppingListsStorage: Array<{
  id: string;
  name: string;
  recipeIds: string[];
  createdAt: string;
  items: any[];
}> = [
  // Add some initial data for demonstration
  {
    id: "list_demo_1",
    name: "Weekly Groceries",
    recipeIds: ["1", "2"],
    createdAt: "2024-01-15T10:30:00Z",
    items: []
  },
  {
    id: "list_demo_2", 
    name: "Dinner Party",
    recipeIds: ["3"],
    createdAt: "2024-01-14T15:45:00Z",
    items: []
  }
];

export const mockApi = {
  // Recipe endpoints
  async getRecipes(params: URLSearchParams) {
    await delay(500); // Simulate network delay
    
    const ingredients = params.get('ingredients');
    const diet = params.get('diet');
    const cuisine = params.get('cuisine');
    const difficulty = params.get('difficulty');
    const maxCookTime = params.get('maxCookTime');
    const mode = params.get('mode') || 'match';
    const sort = params.get('sort') || 'relevance';
    
    let filteredRecipes = [...mockRecipes];
    
    // Filter by ingredients (simple text matching)
    if (ingredients) {
      const ingredientList = ingredients.toLowerCase().split(',');
      filteredRecipes = filteredRecipes.filter(recipe => 
        recipe.ingredients.some(ing => 
          ingredientList.some(searchIng => 
            ing.name.toLowerCase().includes(searchIng.trim())
          )
        )
      );
    }
    
    // Filter by diet
    if (diet && diet !== 'any') {
      if (diet === 'vegan') {
        filteredRecipes = filteredRecipes.filter(recipe => 
          !recipe.ingredients.some(ing => 
            ['chicken', 'cheese', 'milk', 'butter', 'eggs'].some(nonVegan => 
              ing.name.toLowerCase().includes(nonVegan)
            )
          )
        );
      } else if (diet === 'vegetarian') {
        filteredRecipes = filteredRecipes.filter(recipe => 
          !recipe.ingredients.some(ing => 
            ['chicken', 'beef', 'pork', 'fish', 'meat'].some(meat => 
              ing.name.toLowerCase().includes(meat)
            )
          )
        );
      }
    }
    
    // Filter by cuisine
    if (cuisine) {
      filteredRecipes = filteredRecipes.filter(recipe => 
        recipe.tags.some(tag => 
          tag.toLowerCase().includes(cuisine.toLowerCase())
        )
      );
    }
    
    // Filter by difficulty
    if (difficulty && difficulty !== 'any') {
      filteredRecipes = filteredRecipes.filter(recipe => 
        recipe.difficulty.toLowerCase() === difficulty.toLowerCase()
      );
    }
    
    // Filter by max cook time
    if (maxCookTime) {
      const maxTime = parseInt(maxCookTime);
      filteredRecipes = filteredRecipes.filter(recipe => 
        recipe.cookTime <= maxTime
      );
    }
    
    // Add match percentage and missing ingredients for matched mode
    if (mode === 'match' && ingredients) {
      const ingredientList = ingredients.toLowerCase().split(',');
      filteredRecipes = filteredRecipes.map(recipe => {
        const recipeIngredients = recipe.ingredients.map(ing => ing.name.toLowerCase());
        const matchingIngredients = ingredientList.filter(searchIng => 
          recipeIngredients.some(recipeIng => 
            recipeIng.includes(searchIng.trim()) || searchIng.trim().includes(recipeIng)
          )
        );
        const matchPercentage = Math.round((matchingIngredients.length / ingredientList.length) * 100);
        const missingIngredients = ingredientList.filter(searchIng => 
          !recipeIngredients.some(recipeIng => 
            recipeIng.includes(searchIng.trim()) || searchIng.trim().includes(recipeIng)
          )
        );
        
        return {
          ...recipe,
          matchPercentage,
          missingIngredients: missingIngredients.length > 0 ? missingIngredients : undefined,
          hasAllIngredients: missingIngredients.length === 0,
          isCreative: false
        };
      });
    }
    
    // Add creative mode modifications
    if (mode === 'creative') {
      filteredRecipes = filteredRecipes.map(recipe => ({
        ...recipe,
        isCreative: true,
        matchPercentage: Math.floor(Math.random() * 30) + 40, // 40-70% for creative
        missingIngredients: ['Creative ingredient 1', 'Creative ingredient 2'],
        hasAllIngredients: false
      }));
    } else {
      // Ensure non-creative recipes have proper structure
      filteredRecipes = filteredRecipes.map(recipe => ({
        ...recipe,
        isCreative: false,
        hasAllIngredients: recipe.hasAllIngredients ?? true
      }));
    }
    
    // Sort recipes
    switch (sort) {
      case 'time':
        filteredRecipes.sort((a, b) => (a.prepTime + a.cookTime) - (b.prepTime + b.cookTime));
        break;
      case 'rating':
        filteredRecipes.sort((a, b) => b.rating - a.rating);
        break;
      case 'popularity':
        filteredRecipes.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'relevance':
      default:
        filteredRecipes.sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0));
        break;
    }
    
    return {
      recipes: filteredRecipes,
      total: filteredRecipes.length,
      mode,
      generatedAt: new Date().toISOString()
    };
  },
  
  async getRecipe(slug: string) {
    await delay(300);
    
    // Find recipe by ID (assuming slug is the ID)
    const recipe = mockRecipes.find(r => r.id === slug);
    if (!recipe) {
      throw new Error('Recipe not found');
    }
    
    return recipe;
  },
  
  // Ingredient endpoints
  async getIngredients(query: string) {
    await delay(200);
    
    if (!query) {
      return { suggestions: [], popular: mockIngredients.slice(0, 10) };
    }
    
    const suggestions = mockIngredients
      .filter(ing => 
        ing.name.toLowerCase().includes(query.toLowerCase()) ||
        ing.normalized.includes(query.toLowerCase())
      )
      .slice(0, 8);
    
    return { suggestions, popular: mockIngredients.slice(0, 5) };
  },
  
  // Profile endpoints
  async getProfile() {
    await delay(400);
    return mockUserProfile;
  },
  
  async getSavedRecipes() {
    await delay(300);
    return mockRecipes.slice(0, 6); // Return first 6 as saved
  },
  
  async getRecentRecipes() {
    await delay(300);
    return mockRecipes.slice(0, 4).map(recipe => ({
      ...recipe,
      lastCooked: "2 days ago"
    }));
  },
  
  async getCollections() {
    await delay(300);
    return mockCollections;
  },
  
  // Admin endpoints
  async getAdminStats() {
    await delay(400);
    return mockAdminStats;
  },
  
  async getAdminUsers() {
    await delay(300);
    return mockUsers;
  },
  
  async getAdminRecipes() {
    await delay(300);
    return mockAdminRecipes;
  },
  
  // Upload endpoints (mock)
  async signUpload(data: { filename: string; contentType: string; size: number }) {
    await delay(200);
    return {
      image_id: `img_${Date.now()}`,
      uploadUrl: `https://mock-storage.example.com/upload/${data.filename}`
    };
  },
  
  async completeUpload(data: { image_id: string; url: string }) {
    await delay(300);
    return {
      success: true,
      image_id: data.image_id,
      thumbnailUrl: data.url.replace('.jpg', '_thumb.jpg')
    };
  },
  
  async recognizeImage(data: { image_id: string; mode: string; max_suggestions: number }) {
    await delay(1000); // Simulate AI processing time
    
    // Mock recognition results
    const mockRecognized = [
      { name: "Tomato", normalized: "tomato", confidence: 0.92 },
      { name: "Onion", normalized: "onion", confidence: 0.87 },
      { name: "Garlic", normalized: "garlic", confidence: 0.78 },
      { name: "Bell Pepper", normalized: "bell pepper", confidence: 0.65 }
    ];
    
    return {
      image_id: data.image_id,
      recognized: mockRecognized.slice(0, data.max_suggestions)
    };
  },

  // Favorites endpoints
  async saveRecipe(recipeId: string) {
    await delay(200);
    return { success: true, recipeId, saved: true };
  },

  async unsaveRecipe(recipeId: string) {
    await delay(200);
    return { success: true, recipeId, saved: false };
  },

  // Shopping list endpoints
  async createShoppingList(data: { name: string; recipeIds: string[] }) {
    await delay(300);
    const shoppingListId = `list_${Date.now()}`;
    const newList = {
      id: shoppingListId,
      name: data.name,
      recipeIds: data.recipeIds,
      createdAt: new Date().toISOString(),
      items: []
    };
    
    // Store the list in memory
    shoppingListsStorage.push(newList);
    
    return newList;
  },

  async getShoppingLists() {
    await delay(200);
    // Return stored lists with summary data
    return shoppingListsStorage.map(list => ({
      id: list.id,
      name: list.name,
      itemCount: list.items.length,
      recipeCount: list.recipeIds.length,
      createdAt: list.createdAt
    }));
  },

  async getShoppingList(listId: string) {
    await delay(200);
    
    // Find the list in storage
    const list = shoppingListsStorage.find(l => l.id === listId);
    
    if (!list) {
      throw new Error('Shopping list not found');
    }
    
    // Get recipe details for the stored recipe IDs
    const recipes = list.recipeIds.map(recipeId => {
      const recipe = mockRecipes.find(r => r.id === recipeId);
      return recipe ? { id: recipe.id, title: recipe.title } : { id: recipeId, title: 'Unknown Recipe' };
    });
    
    return {
      id: list.id,
      name: list.name,
      recipes: recipes,
      items: list.items,
      createdAt: list.createdAt
    };
  },

  async updateShoppingListItem(listId: string, itemId: string, data: { amount?: string; unit?: string }) {
    await delay(200);
    return { success: true, itemId, ...data };
  },

  async deleteShoppingListItem(listId: string, itemId: string) {
    await delay(200);
    return { success: true, itemId };
  },

  async exportShoppingList(listId: string, format: 'csv' | 'email') {
    await delay(500);
    if (format === 'csv') {
      return {
        success: true,
        downloadUrl: `https://api.example.com/shopping-lists/${listId}/export.csv`,
        filename: `shopping-list-${listId}.csv`
      };
    } else {
      return {
        success: true,
        message: "Shopping list sent to your email successfully"
      };
    }
  }
};

// Override the apiClient to use mock data in development
export const createMockApiClient = () => ({
  async get<T>(url: string): Promise<T> {
    const urlObj = new URL(url, 'http://localhost:5000');
    const pathname = urlObj.pathname;
    const searchParams = urlObj.searchParams;
    
    switch (pathname) {
      case '/api/recipes':
        return mockApi.getRecipes(searchParams) as Promise<T>;
      case '/api/ingredients':
        const query = searchParams.get('q') || '';
        return mockApi.getIngredients(query) as Promise<T>;
      case '/api/profile':
        return mockApi.getProfile() as Promise<T>;
      case '/api/profile/saved-recipes':
        return mockApi.getSavedRecipes() as Promise<T>;
      case '/api/profile/recent-recipes':
        return mockApi.getRecentRecipes() as Promise<T>;
      case '/api/profile/collections':
        return mockApi.getCollections() as Promise<T>;
      case '/api/admin/stats':
        return mockApi.getAdminStats() as Promise<T>;
      case '/api/admin/users':
        return mockApi.getAdminUsers() as Promise<T>;
      case '/api/admin/recipes':
        return mockApi.getAdminRecipes() as Promise<T>;
      case '/api/shopping-lists':
        return mockApi.getShoppingLists() as Promise<T>;
      default:
        if (pathname.startsWith('/api/recipes/') && !pathname.includes('ingredients=')) {
          const slug = pathname.split('/').pop();
          return mockApi.getRecipe(slug!) as Promise<T>;
        }
        if (pathname.startsWith('/api/shopping-lists/') && !pathname.includes('/export')) {
          const listId = pathname.split('/').pop();
          return mockApi.getShoppingList(listId!) as Promise<T>;
        }
        throw new Error(`Mock API endpoint not found: ${pathname}`);
    }
  },
  
  async post<T>(url: string, data?: unknown): Promise<T> {
    const urlObj = new URL(url, 'http://localhost:5000');
    const pathname = urlObj.pathname;
    
    switch (pathname) {
      case '/api/uploads/sign':
        return mockApi.signUpload(data as any) as Promise<T>;
      case '/api/uploads/complete':
        return mockApi.completeUpload(data as any) as Promise<T>;
      case '/api/recognize-image':
        return mockApi.recognizeImage(data as any) as Promise<T>;
      case '/api/shopping-lists':
        return mockApi.createShoppingList(data as any) as Promise<T>;
      default:
        if (pathname.startsWith('/api/recipe/') && pathname.endsWith('/save')) {
          const recipeId = pathname.split('/')[3];
          return mockApi.saveRecipe(recipeId) as Promise<T>;
        }
        if (pathname.startsWith('/api/recipe/') && pathname.endsWith('/unsave')) {
          const recipeId = pathname.split('/')[3];
          return mockApi.unsaveRecipe(recipeId) as Promise<T>;
        }
        if (pathname.startsWith('/api/shopping-list/') && pathname.endsWith('/export')) {
          const listId = pathname.split('/')[3];
          return mockApi.exportShoppingList(listId, (data as any)?.format || 'csv') as Promise<T>;
        }
        throw new Error(`Mock API endpoint not found: ${pathname}`);
    }
  },
  
  async put<T>(url: string, data?: unknown): Promise<T> {
    throw new Error(`Mock API PUT not implemented for: ${url}`);
  },
  
  async patch<T>(url: string, data?: unknown): Promise<T> {
    const urlObj = new URL(url, 'http://localhost:5000');
    const pathname = urlObj.pathname;
    
    if (pathname.startsWith('/api/shopping-list/') && pathname.includes('/items/')) {
      const parts = pathname.split('/');
      const listId = parts[3];
      const itemId = parts[5];
      return mockApi.updateShoppingListItem(listId, itemId, data as any) as Promise<T>;
    }
    
    throw new Error(`Mock API PATCH not implemented for: ${url}`);
  },
  
  async delete<T>(url: string): Promise<T> {
    const urlObj = new URL(url, 'http://localhost:5000');
    const pathname = urlObj.pathname;
    
    if (pathname.startsWith('/api/shopping-list/') && pathname.includes('/items/')) {
      const parts = pathname.split('/');
      const listId = parts[3];
      const itemId = parts[5];
      return mockApi.deleteShoppingListItem(listId, itemId) as Promise<T>;
    }
    
    throw new Error(`Mock API DELETE not implemented for: ${url}`);
  }
});
