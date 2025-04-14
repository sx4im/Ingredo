let room;

export function initializeStorage() {
  room = new WebsimSocket();
}

export async function saveRecipe(recipe) {
  try {
    if (!room) initializeStorage();
    await room.collection("recipe").create({
      title: recipe.title,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
      cookingTime: recipe.cookingTime,
      servings: recipe.servings,
    });
    return true;
  } catch (error) {
    console.error("Error saving recipe:", error);
    return false;
  }
}

export function getSavedRecipes(callback) {
  try {
    if (!room) initializeStorage();
    return room.collection("recipe").subscribe(callback);
  } catch (error) {
    console.error("Error getting saved recipes:", error);
    return () => {}; // Return empty unsubscribe function
  }
}

export async function deleteRecipe(recipeId) {
  try {
    if (!room) initializeStorage();
    await room.collection("recipe").delete(recipeId);
    return true;
  } catch (error) {
    console.error("Error deleting recipe:", error);
    return false;
  }
}
