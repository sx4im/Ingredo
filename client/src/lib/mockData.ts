// Mock data for frontend development and testing
export const mockRecipes = [
  {
    id: "1",
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
      { name: "Tomatoes", amount: "4", unit: "large" },
      { name: "Fresh mozzarella", amount: "8", unit: "oz" },
      { name: "Fresh basil", amount: "1/2", unit: "cup" },
      { name: "Extra virgin olive oil", amount: "3", unit: "tbsp" },
      { name: "Balsamic vinegar", amount: "1", unit: "tbsp" },
      { name: "Salt", amount: "1/2", unit: "tsp" },
      { name: "Black pepper", amount: "1/4", unit: "tsp" }
    ],
    instructions: [
      { step: 1, description: "Slice the tomatoes and mozzarella into 1/4-inch thick rounds." },
      { step: 2, description: "Arrange the tomato and mozzarella slices on a serving platter, alternating them." },
      { step: 3, description: "Tuck fresh basil leaves between the slices." },
      { step: 4, description: "Drizzle with olive oil and balsamic vinegar." },
      { step: 5, description: "Season with salt and pepper to taste." },
      { step: 6, description: "Let sit for 10 minutes before serving to allow flavors to meld." }
    ],
    tags: ["Quick", "Fresh", "Vegetarian", "Italian"],
    nutrition: {
      calories: 180,
      protein: "12g",
      carbs: "8g",
      fat: "12g"
    },
    // Additional fields for search functionality
    matchPercentage: undefined as number | undefined,
    missingIngredients: undefined as string[] | undefined,
    hasAllIngredients: undefined as boolean | undefined,
    isCreative: undefined as boolean | undefined
  },
  {
    id: "2",
    title: "Garden Vegetable Stir Fry",
    description: "Quick and nutritious stir fry with seasonal vegetables and aromatic spices.",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-4.0.3&w=600&h=400&fit=crop",
    cookTime: 25,
    prepTime: 15,
    servings: 4,
    difficulty: "Easy" as const,
    rating: 4.6,
    reviewCount: 89,
    ingredients: [
      { name: "Broccoli", amount: "2", unit: "cups" },
      { name: "Bell peppers", amount: "2", unit: "medium" },
      { name: "Carrots", amount: "2", unit: "large" },
      { name: "Snow peas", amount: "1", unit: "cup" },
      { name: "Garlic", amount: "3", unit: "cloves" },
      { name: "Ginger", amount: "1", unit: "tbsp" },
      { name: "Soy sauce", amount: "3", unit: "tbsp" },
      { name: "Sesame oil", amount: "1", unit: "tbsp" },
      { name: "Vegetable oil", amount: "2", unit: "tbsp" }
    ],
    instructions: [
      { step: 1, description: "Cut all vegetables into bite-sized pieces." },
      { step: 2, description: "Heat vegetable oil in a large wok or skillet over high heat." },
      { step: 3, description: "Add garlic and ginger, stir for 30 seconds until fragrant." },
      { step: 4, description: "Add carrots and cook for 2 minutes." },
      { step: 5, description: "Add broccoli and bell peppers, cook for 3 minutes." },
      { step: 6, description: "Add snow peas and cook for 1 minute." },
      { step: 7, description: "Add soy sauce and sesame oil, toss everything together." },
      { step: 8, description: "Serve immediately over rice or noodles." }
    ],
    tags: ["Healthy", "Vegetarian", "Quick", "Asian"],
    nutrition: {
      calories: 120,
      protein: "4g",
      carbs: "18g",
      fat: "4g"
    },
    matchPercentage: undefined as number | undefined,
    missingIngredients: undefined as string[] | undefined,
    hasAllIngredients: undefined as boolean | undefined,
    isCreative: undefined as boolean | undefined
  },
  {
    id: "3",
    title: "Classic Pasta Marinara",
    description: "Authentic Italian pasta with homemade marinara sauce and fresh herbs.",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?ixlib=rb-4.0.3&w=600&h=400&fit=crop",
    cookTime: 45,
    prepTime: 20,
    servings: 6,
    difficulty: "Medium" as const,
    rating: 4.9,
    reviewCount: 203,
    ingredients: [
      { name: "Spaghetti", amount: "1", unit: "lb" },
      { name: "Crushed tomatoes", amount: "28", unit: "oz" },
      { name: "Onion", amount: "1", unit: "medium" },
      { name: "Garlic", amount: "4", unit: "cloves" },
      { name: "Fresh basil", amount: "1/4", unit: "cup" },
      { name: "Olive oil", amount: "3", unit: "tbsp" },
      { name: "Sugar", amount: "1", unit: "tsp" },
      { name: "Salt", amount: "1", unit: "tsp" },
      { name: "Red pepper flakes", amount: "1/4", unit: "tsp" }
    ],
    instructions: [
      { step: 1, description: "Heat olive oil in a large saucepan over medium heat." },
      { step: 2, description: "Add diced onion and cook until softened, about 5 minutes." },
      { step: 3, description: "Add minced garlic and red pepper flakes, cook for 1 minute." },
      { step: 4, description: "Add crushed tomatoes, sugar, and salt. Bring to a simmer." },
      { step: 5, description: "Reduce heat and simmer for 30 minutes, stirring occasionally." },
      { step: 6, description: "Meanwhile, cook pasta according to package directions." },
      { step: 7, description: "Add fresh basil to the sauce and remove from heat." },
      { step: 8, description: "Toss pasta with sauce and serve immediately." }
    ],
    tags: ["Comfort", "Italian", "Vegetarian", "Classic"],
    nutrition: {
      calories: 320,
      protein: "12g",
      carbs: "58g",
      fat: "6g"
    },
    matchPercentage: undefined as number | undefined,
    missingIngredients: undefined as string[] | undefined,
    hasAllIngredients: undefined as boolean | undefined,
    isCreative: undefined as boolean | undefined
  },
  {
    id: "4",
    title: "Mediterranean Quinoa Bowl",
    description: "Nutritious quinoa bowl with fresh vegetables, olives, and feta cheese.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&w=600&h=400&fit=crop",
    cookTime: 20,
    prepTime: 15,
    servings: 4,
    difficulty: "Easy" as const,
    rating: 4.7,
    reviewCount: 156,
    ingredients: [
      { name: "Quinoa", amount: "1", unit: "cup" },
      { name: "Cucumber", amount: "1", unit: "large" },
      { name: "Cherry tomatoes", amount: "1", unit: "cup" },
      { name: "Red onion", amount: "1/2", unit: "small" },
      { name: "Kalamata olives", amount: "1/2", unit: "cup" },
      { name: "Feta cheese", amount: "4", unit: "oz" },
      { name: "Fresh parsley", amount: "1/4", unit: "cup" },
      { name: "Lemon juice", amount: "3", unit: "tbsp" },
      { name: "Olive oil", amount: "2", unit: "tbsp" }
    ],
    instructions: [
      { step: 1, description: "Cook quinoa according to package directions and let cool." },
      { step: 2, description: "Dice cucumber and halve cherry tomatoes." },
      { step: 3, description: "Thinly slice red onion and chop parsley." },
      { step: 4, description: "In a large bowl, combine quinoa with all vegetables." },
      { step: 5, description: "Add olives and crumbled feta cheese." },
      { step: 6, description: "Whisk together lemon juice and olive oil for dressing." },
      { step: 7, description: "Pour dressing over salad and toss to combine." },
      { step: 8, description: "Garnish with fresh parsley and serve chilled." }
    ],
    tags: ["Healthy", "Mediterranean", "Vegetarian", "Gluten-Free"],
    nutrition: {
      calories: 280,
      protein: "10g",
      carbs: "35g",
      fat: "12g"
    },
    matchPercentage: undefined as number | undefined,
    missingIngredients: undefined as string[] | undefined,
    hasAllIngredients: undefined as boolean | undefined,
    isCreative: undefined as boolean | undefined
  },
  {
    id: "5",
    title: "Chicken Teriyaki Bowl",
    description: "Tender chicken with homemade teriyaki sauce served over steamed rice.",
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?ixlib=rb-4.0.3&w=600&h=400&fit=crop",
    cookTime: 30,
    prepTime: 20,
    servings: 4,
    difficulty: "Medium" as const,
    rating: 4.8,
    reviewCount: 187,
    ingredients: [
      { name: "Chicken breast", amount: "1.5", unit: "lbs" },
      { name: "Soy sauce", amount: "1/2", unit: "cup" },
      { name: "Brown sugar", amount: "1/4", unit: "cup" },
      { name: "Rice vinegar", amount: "2", unit: "tbsp" },
      { name: "Garlic", amount: "3", unit: "cloves" },
      { name: "Ginger", amount: "1", unit: "tbsp" },
      { name: "Cornstarch", amount: "1", unit: "tbsp" },
      { name: "Sesame oil", amount: "1", unit: "tsp" },
      { name: "Green onions", amount: "2", unit: "stalks" }
    ],
    instructions: [
      { step: 1, description: "Cut chicken into bite-sized pieces and season with salt." },
      { step: 2, description: "Make teriyaki sauce by combining soy sauce, brown sugar, vinegar, garlic, and ginger." },
      { step: 3, description: "Heat oil in a large skillet over medium-high heat." },
      { step: 4, description: "Cook chicken until golden brown and cooked through, about 8 minutes." },
      { step: 5, description: "Add teriyaki sauce and bring to a simmer." },
      { step: 6, description: "Mix cornstarch with water and add to thicken sauce." },
      { step: 7, description: "Cook rice according to package directions." },
      { step: 8, description: "Serve chicken over rice, garnished with green onions." }
    ],
    tags: ["Asian", "Protein", "Comfort", "Family-Friendly"],
    nutrition: {
      calories: 420,
      protein: "35g",
      carbs: "45g",
      fat: "8g"
    },
    matchPercentage: undefined as number | undefined,
    missingIngredients: undefined as string[] | undefined,
    hasAllIngredients: undefined as boolean | undefined,
    isCreative: undefined as boolean | undefined
  }
];

export const mockIngredients = [
  { name: "Tomato", normalized: "tomato", commonUnit: "pieces" },
  { name: "Basil", normalized: "basil", commonUnit: "leaves" },
  { name: "Mozzarella", normalized: "mozzarella", commonUnit: "oz" },
  { name: "Onion", normalized: "onion", commonUnit: "medium" },
  { name: "Garlic", normalized: "garlic", commonUnit: "cloves" },
  { name: "Olive oil", normalized: "olive oil", commonUnit: "tbsp" },
  { name: "Salt", normalized: "salt", commonUnit: "tsp" },
  { name: "Pepper", normalized: "pepper", commonUnit: "tsp" },
  { name: "Chicken", normalized: "chicken", commonUnit: "lbs" },
  { name: "Rice", normalized: "rice", commonUnit: "cups" },
  { name: "Broccoli", normalized: "broccoli", commonUnit: "cups" },
  { name: "Carrot", normalized: "carrot", commonUnit: "medium" },
  { name: "Bell pepper", normalized: "bell pepper", commonUnit: "medium" },
  { name: "Pasta", normalized: "pasta", commonUnit: "lbs" },
  { name: "Quinoa", normalized: "quinoa", commonUnit: "cups" },
  { name: "Cucumber", normalized: "cucumber", commonUnit: "large" },
  { name: "Lemon", normalized: "lemon", commonUnit: "medium" },
  { name: "Ginger", normalized: "ginger", commonUnit: "tbsp" },
  { name: "Soy sauce", normalized: "soy sauce", commonUnit: "tbsp" },
  { name: "Eggs", normalized: "eggs", commonUnit: "large" }
];

export const mockUserProfile = {
  id: "user-1",
  name: "John Doe",
  email: "john@example.com",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&w=100&h=100&fit=crop&crop=face",
  joinDate: "2024-01-15T00:00:00Z",
  stats: {
    savedRecipes: 12,
    cookedRecipes: 8,
    collections: 3,
    followers: 24
  }
};

export const mockCollections = [
  {
    id: "col-1",
    name: "Quick Weeknight Meals",
    description: "Fast and easy recipes for busy weeknights",
    recipeCount: 8,
    coverImage: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&w=400&h=200&fit=crop",
    isPublic: true
  },
  {
    id: "col-2",
    name: "Healthy Salads",
    description: "Fresh and nutritious salad recipes",
    recipeCount: 5,
    coverImage: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&w=400&h=200&fit=crop",
    isPublic: false
  },
  {
    id: "col-3",
    name: "Italian Classics",
    description: "Traditional Italian recipes from Nonna's kitchen",
    recipeCount: 6,
    coverImage: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?ixlib=rb-4.0.3&w=400&h=200&fit=crop",
    isPublic: true
  }
];

export const mockAdminStats = {
  users: {
    total: 1247,
    active: 892,
    newThisMonth: 156
  },
  recipes: {
    total: 3421,
    published: 3156,
    pending: 45
  },
  system: {
    uptime: "99.9%",
    apiCalls: 45678,
    errors: 12
  }
};

export const mockUsers = [
  {
    id: "user-1",
    name: "John Doe",
    email: "john@example.com",
    role: "user" as const,
    status: "active" as const,
    joinDate: "2024-01-15T00:00:00Z",
    lastActive: "2024-09-05T10:30:00Z"
  },
  {
    id: "user-2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "admin" as const,
    status: "active" as const,
    joinDate: "2024-01-10T00:00:00Z",
    lastActive: "2024-09-05T09:15:00Z"
  },
  {
    id: "user-3",
    name: "Mike Johnson",
    email: "mike@example.com",
    role: "user" as const,
    status: "inactive" as const,
    joinDate: "2024-02-20T00:00:00Z",
    lastActive: "2024-08-15T14:22:00Z"
  }
];

export const mockAdminRecipes = [
  {
    id: "recipe-1",
    title: "Chocolate Chip Cookies",
    author: "John Doe",
    status: "published" as const,
    createdAt: "2024-09-01T10:00:00Z",
    rating: 4.5,
    views: 1234
  },
  {
    id: "recipe-2",
    title: "Vegan Buddha Bowl",
    author: "Jane Smith",
    status: "pending" as const,
    createdAt: "2024-09-04T15:30:00Z",
    rating: 0,
    views: 0
  },
  {
    id: "recipe-3",

    title: "Spicy Thai Curry",
    author: "Mike Johnson",
    status: "draft" as const,
    createdAt: "2024-09-03T08:45:00Z",
    rating: 0,
    views: 0
  }
];
