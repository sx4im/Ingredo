import { config } from "./config.js";

export async function generateRecipe(ingredients, diet) {
  try {
    const response = await fetch("/api/ai_completion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        prompt: `Generate a recipe using these ingredients: ${ingredients}. 
                Dietary restrictions: ${diet}.
                Include title, ingredients list, step-by-step instructions, cooking time, and servings.
                
                interface Recipe {
                  title: string;
                  ingredients: string[];
                  steps: string[];
                  cookingTime: string;
                  servings: number;
                }
                
                {
                  "title": "Lemon Garlic Chicken with Sautéed Spinach",
                  "ingredients": [
                    "2 chicken breasts",
                    "2 cloves garlic, minced",
                    "1 lemon",
                    "2 cups fresh spinach"
                  ],
                  "steps": [
                    "Season chicken with salt and pepper",
                    "Heat oil in pan over medium heat",
                    "Cook chicken 6-7 minutes per side"
                  ],
                  "cookingTime": "25 minutes",
                  "servings": 2
                }`,
        data: { ingredients, diet },
      }),
    });

    const recipe = await response.json();
    return recipe;
  } catch (error) {
    console.error("Error generating recipe:", error);
    throw error;
  }
}

export function suggestSubstitutions(ingredient) {
  const substitutions = {
    butter: ["coconut oil", "olive oil", "applesauce"],
    eggs: ["flax eggs", "mashed banana", "silken tofu"],
    milk: ["almond milk", "soy milk", "oat milk"],
  };

  return substitutions[ingredient.toLowerCase()] || [];
}
