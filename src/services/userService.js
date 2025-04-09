import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

// Create initial user profile during registration
export const createUserProfile = async (user, additionalData = {}) => {
  if (!user) return null;

  const userRef = doc(db, "users", user.uid);

  const userProfile = {
    uid: user.uid,
    displayName: additionalData.displayName || "",
    email: user.email,
    profilePicture: null,
    createdAt: new Date(),
    lastLogin: new Date(),

    preferences: {
      dietaryRestrictions: [],
      favoriteCuisines: [],
    },

    settings: {
      notifications: {
        mealPlanReminders: true,
        groceryListUpdates: true,
        newRecipeRecommendations: true,
      },
      theme: "light",
      language: "en",
    },

    stats: {
      recipesCooked: 0,
      mealPlansCreated: 0,
      averageRating: 0,
    },
  };

  try {
    await setDoc(userRef, userProfile);
    return userProfile;
  } catch (error) {
    console.error("Error creating user profile:", error);
    throw error;
  }
};

// Update user preferences during profile setup
export const updateUserPreferences = async (userId, preferences) => {
  if (!userId) throw new Error("User ID is required");

  const userRef = doc(db, "users", userId);

  try {
    await updateDoc(userRef, {
      "preferences.dietaryRestrictions": preferences.dietaryRestrictions || [],
      "preferences.favoriteCuisines": preferences.favoriteCuisines || [],
    });
  } catch (error) {
    console.error("Error updating user preferences:", error);
    throw error;
  }
};
