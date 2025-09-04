import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";

// Simple in-memory data for ingredients and recipes
const ingredientsDatabase = [
  { name: "Tomato", score: 0.95 },
  { name: "Basil", score: 0.92 },
  { name: "Mozzarella", score: 0.90 },
  { name: "Chicken", score: 0.98 },
  { name: "Onion", score: 0.96 },
  { name: "Garlic", score: 0.94 },
  { name: "Pasta", score: 0.88 },
  { name: "Rice", score: 0.86 },
  { name: "Cheese", score: 0.89 },
  { name: "Beef", score: 0.93 },
  { name: "Olive Oil", score: 0.85 },
  { name: "Salt", score: 0.99 },
  { name: "Pepper", score: 0.97 },
  { name: "Lemon", score: 0.84 },
  { name: "Spinach", score: 0.82 },
  { name: "Mushroom", score: 0.81 },
  { name: "Bell Pepper", score: 0.80 },
  { name: "Carrot", score: 0.83 },
  { name: "Potato", score: 0.87 },
  { name: "Egg", score: 0.91 }
];

const recipesDatabase = [
  {
    id: "caprese-salad",
    title: "Fresh Caprese Salad",
    description: "A classic Italian salad with fresh tomatoes, mozzarella, and basil.",
    image: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?ixlib=rb-4.0.3&w=600&h=400&fit=crop",
    cookTime: 15,
    prepTime: 10,
    servings: 4,
    difficulty: "Easy" as const,
    rating: 4.8,
    reviewCount: 124,
    ingredients: [
      { name: "Tomato", amount: "4", unit: "large" },
      { name: "Mozzarella", amount: "200", unit: "g" },
      { name: "Basil", amount: "10", unit: "leaves" },
      { name: "Olive Oil", amount: "3", unit: "tbsp" },
      { name: "Salt", amount: "1", unit: "tsp" },
      { name: "Pepper", amount: "1/2", unit: "tsp" }
    ],
    instructions: [
      { step: 1, description: "Slice the tomatoes and mozzarella into 1/4-inch thick rounds." },
      { step: 2, description: "Arrange alternating slices of tomato and mozzarella on a serving platter." },
      { step: 3, description: "Tuck fresh basil leaves between the slices." },
      { step: 4, description: "Drizzle with olive oil and season with salt and pepper." },
      { step: 5, description: "Let stand for 10 minutes before serving to allow flavors to meld." }
    ],
    tags: ["Quick", "Fresh", "Italian", "Vegetarian"],
    nutrition: {
      calories: 180,
      protein: "12g",
      carbs: "8g",
      fat: "14g"
    }
  },
  {
    id: "chicken-stir-fry",
    title: "Garden Vegetable Stir Fry",
    description: "Quick and nutritious stir fry with seasonal vegetables and aromatic spices.",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-4.0.3&w=600&h=400&fit=crop",
    cookTime: 25,
    prepTime: 15,
    servings: 3,
    difficulty: "Medium" as const,
    rating: 4.6,
    reviewCount: 89,
    ingredients: [
      { name: "Chicken", amount: "300", unit: "g" },
      { name: "Bell Pepper", amount: "2", unit: "medium" },
      { name: "Onion", amount: "1", unit: "large" },
      { name: "Garlic", amount: "3", unit: "cloves" },
      { name: "Olive Oil", amount: "2", unit: "tbsp" },
      { name: "Salt", amount: "1", unit: "tsp" },
      { name: "Pepper", amount: "1/2", unit: "tsp" }
    ],
    instructions: [
      { step: 1, description: "Cut chicken into bite-sized pieces and season with salt and pepper." },
      { step: 2, description: "Heat oil in a large skillet or wok over medium-high heat." },
      { step: 3, description: "Add chicken and cook until golden brown, about 5-6 minutes." },
      { step: 4, description: "Add vegetables and garlic, stir-fry for 8-10 minutes until tender-crisp." },
      { step: 5, description: "Season with additional salt and pepper to taste. Serve immediately." }
    ],
    tags: ["Healthy", "Quick", "High Protein"],
    nutrition: {
      calories: 220,
      protein: "25g",
      carbs: "12g",
      fat: "8g"
    }
  },
  {
    id: "pasta-marinara",
    title: "Classic Pasta Marinara",
    description: "Authentic Italian pasta with homemade marinara sauce and fresh herbs.",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?ixlib=rb-4.0.3&w=600&h=400&fit=crop",
    cookTime: 45,
    prepTime: 15,
    servings: 4,
    difficulty: "Easy" as const,
    rating: 4.9,
    reviewCount: 203,
    ingredients: [
      { name: "Pasta", amount: "400", unit: "g" },
      { name: "Tomato", amount: "6", unit: "large" },
      { name: "Garlic", amount: "4", unit: "cloves" },
      { name: "Onion", amount: "1", unit: "medium" },
      { name: "Olive Oil", amount: "3", unit: "tbsp" },
      { name: "Basil", amount: "15", unit: "leaves" },
      { name: "Salt", amount: "1", unit: "tsp" },
      { name: "Pepper", amount: "1/2", unit: "tsp" }
    ],
    instructions: [
      { step: 1, description: "Bring a large pot of salted water to boil for pasta." },
      { step: 2, description: "Heat olive oil in a large saucepan and sauté onion until soft." },
      { step: 3, description: "Add garlic and cook for 1 minute until fragrant." },
      { step: 4, description: "Add chopped tomatoes and simmer for 20 minutes until thick." },
      { step: 5, description: "Cook pasta according to package directions, drain and toss with sauce." },
      { step: 6, description: "Garnish with fresh basil and serve immediately." }
    ],
    tags: ["Comfort", "Italian", "Classic"],
    nutrition: {
      calories: 380,
      protein: "14g",
      carbs: "72g",
      fat: "6g"
    }
  }
];

const userProfiles = [
  {
    id: "user1",
    name: "Alex Johnson",
    email: "alex@example.com",
    joinDate: "2024-01-15",
    stats: {
      savedRecipes: 24,
      cookedRecipes: 18,
      collections: 3,
      followers: 45
    }
  }
];

const ingredientsQuerySchema = z.object({
  q: z.string().min(1).optional()
});

const recipeParamsSchema = z.object({
  slug: z.string().min(1)
});

const uploadSignRequestSchema = z.object({
  filename: z.string(),
  contentType: z.string(),
  size: z.number()
});

const uploadCompleteSchema = z.object({
  image_id: z.string(),
  url: z.string(),
  metadata: z.object({}).optional()
});

const recognizeImageSchema = z.object({
  image_id: z.string(),
  mode: z.literal('vision'),
  max_suggestions: z.number().default(5)
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ ok: true, timestamp: new Date().toISOString() });
  });

  // Ingredients search endpoint
  app.get("/api/ingredients", (req, res) => {
    try {
      const { q } = ingredientsQuerySchema.parse(req.query);
      
      if (!q) {
        return res.json({
          suggestions: [],
          popular: ingredientsDatabase.slice(0, 8)
        });
      }

      const query = q.toLowerCase();
      const suggestions = ingredientsDatabase
        .filter(ingredient => 
          ingredient.name.toLowerCase().includes(query)
        )
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);

      res.json({
        suggestions,
        popular: ingredientsDatabase.slice(0, 8)
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid query parameters" });
    }
  });

  // Recipes search endpoint
  app.get("/api/recipes", (req, res) => {
    try {
      const {
        ingredients,
        diet,
        allergies,
        maxCookTime,
        cuisine,
        difficulty,
        allowSubstitutions,
        servings
      } = req.query;
      
      if (!ingredients) {
        return res.json({ recipes: [], total: 0 });
      }

      const ingredientList = (ingredients as string).split(',').map(i => i.trim().toLowerCase());
      
      // Start with ingredient-based filtering
      let matchingRecipes = recipesDatabase.filter(recipe => 
        recipe.ingredients.some(ingredient => 
          ingredientList.some(reqIngredient => 
            ingredient.name.toLowerCase().includes(reqIngredient)
          )
        )
      );

      // Apply additional filters
      if (diet && diet !== 'any') {
        matchingRecipes = matchingRecipes.filter(recipe => 
          recipe.tags.some(tag => tag.toLowerCase().includes(diet as string))
        );
      }

      if (allergies) {
        const allergyList = (allergies as string).split(',').map(a => a.trim().toLowerCase());
        matchingRecipes = matchingRecipes.filter(recipe => 
          !allergyList.some(allergy => 
            recipe.ingredients.some(ingredient => 
              ingredient.name.toLowerCase().includes(allergy) ||
              recipe.tags.some(tag => tag.toLowerCase().includes(allergy))
            )
          )
        );
      }

      if (maxCookTime) {
        const maxTime = parseInt(maxCookTime as string);
        matchingRecipes = matchingRecipes.filter(recipe => recipe.cookTime <= maxTime);
      }

      if (cuisine) {
        matchingRecipes = matchingRecipes.filter(recipe => 
          recipe.tags.some(tag => tag.toLowerCase().includes((cuisine as string).toLowerCase()))
        );
      }

      if (difficulty && difficulty !== 'any') {
        matchingRecipes = matchingRecipes.filter(recipe => 
          recipe.difficulty.toLowerCase() === (difficulty as string).toLowerCase()
        );
      }

      // Note: allowSubstitutions and servings would be used in recipe recommendation logic
      // For now, we'll just acknowledge them in the filtering

      res.json({
        recipes: matchingRecipes,
        total: matchingRecipes.length
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid query parameters" });
    }
  });

  // Single recipe endpoint
  app.get("/api/recipes/:slug", (req, res) => {
    try {
      const { slug } = recipeParamsSchema.parse(req.params);
      
      const recipe = recipesDatabase.find(r => r.id === slug);
      
      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }

      res.json(recipe);
    } catch (error) {
      res.status(400).json({ message: "Invalid recipe ID" });
    }
  });

  // Profile endpoint
  app.get("/api/profile", (req, res) => {
    // In a real app, this would get the current user from session
    const profile = userProfiles[0];
    res.json(profile);
  });

  // User's saved recipes
  app.get("/api/profile/saved-recipes", (req, res) => {
    // Return subset of recipes as "saved"
    const savedRecipes = recipesDatabase.slice(0, 2).map(recipe => ({
      id: recipe.id,
      title: recipe.title,
      image: recipe.image,
      cookTime: recipe.cookTime,
      rating: recipe.rating,
      reviewCount: recipe.reviewCount,
      tags: recipe.tags
    }));
    
    res.json(savedRecipes);
  });

  // User's recent recipes
  app.get("/api/profile/recent-recipes", (req, res) => {
    const recentRecipes = recipesDatabase.slice(0, 3).map(recipe => ({
      id: recipe.id,
      title: recipe.title,
      image: recipe.image,
      cookTime: recipe.cookTime,
      rating: recipe.rating,
      reviewCount: recipe.reviewCount,
      tags: recipe.tags,
      lastCooked: "2 days ago"
    }));
    
    res.json(recentRecipes);
  });

  // User's collections
  app.get("/api/profile/collections", (req, res) => {
    const collections = [
      {
        id: "quick-meals",
        name: "Quick Weeknight Meals",
        description: "Fast and easy recipes for busy weeknights",
        recipeCount: 12,
        isPublic: true
      },
      {
        id: "healthy-options",
        name: "Healthy Options",
        description: "Nutritious recipes for a balanced diet",
        recipeCount: 8,
        isPublic: false
      }
    ];
    
    res.json(collections);
  });

  // Admin endpoints
  app.get("/api/admin/stats", (req, res) => {
    const stats = {
      users: {
        total: 1247,
        active: 892,
        newThisMonth: 134
      },
      recipes: {
        total: 1856,
        published: 1823,
        pending: 33
      },
      system: {
        uptime: "99.8%",
        apiCalls: 25847,
        errors: 12
      }
    };
    
    res.json(stats);
  });

  app.get("/api/admin/users", (req, res) => {
    const users = [
      {
        id: "user1",
        name: "Alex Johnson",
        email: "alex@example.com",
        role: "user" as const,
        status: "active" as const,
        joinDate: "2024-01-15",
        lastActive: "2024-01-20"
      },
      {
        id: "admin1",
        name: "Admin User",
        email: "admin@ingredo.com",
        role: "admin" as const,
        status: "active" as const,
        joinDate: "2023-12-01",
        lastActive: "2024-01-21"
      }
    ];
    
    res.json(users);
  });

  app.get("/api/admin/recipes", (req, res) => {
    const adminRecipes = recipesDatabase.map(recipe => ({
      id: recipe.id,
      title: recipe.title,
      author: "Alex Johnson",
      status: "published" as const,
      createdAt: "2024-01-10",
      rating: recipe.rating,
      views: Math.floor(Math.random() * 1000) + 100
    }));
    
    res.json(adminRecipes);
  });

  // Upload endpoints
  app.post("/api/uploads/sign", (req, res) => {
    try {
      const { filename, contentType, size } = uploadSignRequestSchema.parse(req.body);
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(contentType)) {
        return res.status(400).json({ message: "Invalid file type. Only JPEG, PNG, and WebP are allowed." });
      }
      
      // Validate file size (5MB limit)
      if (size > 5 * 1024 * 1024) {
        return res.status(400).json({ message: "File too large. Maximum size is 5MB." });
      }
      
      const imageId = `img_${Math.random().toString(36).substr(2, 9)}`;
      const mockUploadUrl = `https://mock-storage.example.com/upload/${imageId}`;
      
      res.json({
        image_id: imageId,
        uploadUrl: mockUploadUrl
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid upload request" });
    }
  });

  app.post("/api/uploads/complete", (req, res) => {
    try {
      const { image_id, url } = uploadCompleteSchema.parse(req.body);
      
      // In a real app, you'd store this in a database
      console.log(`Upload completed for ${image_id}: ${url}`);
      
      res.json({ 
        success: true,
        image_id,
        thumbnailUrl: `https://mock-storage.example.com/thumbnails/${image_id}.jpg`
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid completion request" });
    }
  });

  app.post("/api/recognize-image", (req, res) => {
    try {
      const { image_id, max_suggestions } = recognizeImageSchema.parse(req.body);
      
      // Mock ingredient recognition results
      const mockRecognitions = [
        { name: "Tomato", normalized: "tomato", confidence: 0.95 },
        { name: "Onion", normalized: "onion", confidence: 0.88 },
        { name: "Bell Pepper", normalized: "bell pepper", confidence: 0.82 },
        { name: "Garlic", normalized: "garlic", confidence: 0.76 },
        { name: "Basil", normalized: "basil", confidence: 0.71 }
      ];
      
      // Return up to max_suggestions items
      const suggestions = mockRecognitions.slice(0, max_suggestions);
      
      res.json({
        image_id,
        recognized: suggestions
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid recognition request" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
