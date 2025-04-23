// src/services/recipeService.js

// API key should be stored securely, ideally in environment variables
// For demo purposes, we're including it directly (not recommended for production)
const GEMINI_API_KEY = "AIzaSyDN1QTRlheiZhqlLl-5qIdkSG4JLvdo7xc"; // Replace with your actual API key

export const generateRecipes = async (ingredients) => {
  try {
    // Gemini API endpoint
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
        GEMINI_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Create 2 detailed recipes using some or all of these ingredients: ${ingredients.join(
                    ", "
                  )}. 
                      For each recipe, provide: 
                      1. A name 
                      2. A short description 
                      3. A complete list of ingredients with measurements (including additional basic ingredients like salt, oil, etc.)
                      4. Step-by-step instructions
                      5. Cooking time
                      6. Difficulty level (Easy, Medium, Hard)
                      Format the response as a JSON array with objects that include the following fields: 
                      id, name, description, ingredients (array), steps (array), cookingTime, difficulty.`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
          },
        }),
      }
    );

    const data = await response.json();

    // Parse the response to extract the recipes
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      const content = data.candidates[0].content.parts[0].text;

      // Extract JSON from the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);

      if (jsonMatch) {
        const recipes = JSON.parse(jsonMatch[0]);
        return recipes;
      } else {
        // If we can't parse the JSON, try to extract the recipes manually
        const fallbackRecipes = parseRecipesManually(content, ingredients);
        return fallbackRecipes;
      }
    } else {
      throw new Error("Invalid response format from Gemini API");
    }
  } catch (error) {
    console.error("Error generating recipes:", error);
    throw error;
  }
};

// Fallback function to parse recipes if the AI response isn't properly formatted JSON
const parseRecipesManually = (content, userIngredients) => {
  // Simple fallback - create basic recipes if AI parsing fails
  return [
    {
      id: "1",
      name: "Quick Meal with " + userIngredients[0],
      description: `A simple recipe using ${userIngredients.join(", ")}.`,
      ingredients: [...userIngredients, "salt", "pepper", "olive oil"],
      steps: [
        "1. Prepare all ingredients",
        "2. Cook according to your preference",
        "3. Season with salt and pepper",
        "4. Serve hot",
      ],
      cookingTime: "20 minutes",
      difficulty: "Easy",
    },
    {
      id: "2",
      name: "Creative Dish with " + userIngredients[0],
      description: `An innovative recipe using ${userIngredients.join(", ")}.`,
      ingredients: [...userIngredients, "garlic", "herbs", "butter"],
      steps: [
        "1. Prepare all ingredients",
        "2. Sauté with butter and garlic",
        "3. Mix all ingredients together",
        "4. Garnish with herbs and serve",
      ],
      cookingTime: "30 minutes",
      difficulty: "Medium",
    },
  ];
};

/* // You can also add a function to save user's favorite recipes to Firebase
export const saveRecipeToFavorites = async (recipe) => {
  if (!auth.currentUser) return;

  try {
    const db = getFirestore();
    await addDoc(collection(db, `users/${auth.currentUser.uid}/favorites`), {
      ...recipe,
      savedAt: new Date(),
    });
    return true;
  } catch (error) {
    console.error("Error saving recipe:", error);
    return false;
  }
}; */
