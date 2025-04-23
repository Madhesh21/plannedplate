import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  FlatList,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import * as Animatable from "react-native-animatable";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Tab = createBottomTabNavigator();
const MealPlanStack = createStackNavigator();
const GroceryListStack = createStackNavigator();

function MealPlanStackScreen() {
  return (
    <MealPlanStack.Navigator>
      <MealPlanStack.Screen
        name="MealPlanMain"
        component={MealPlanScreen}
        options={{ headerShown: false }}
      />
    </MealPlanStack.Navigator>
  );
}

function GroceryListStackScreen() {
  return (
    <GroceryListStack.Navigator>
      <GroceryListStack.Screen
        name="GroceryListMain"
        component={GroceryListScreen}
        options={{ headerShown: false }}
      />
    </GroceryListStack.Navigator>
  );
}

// Main App Component with Tab Navigation
const HomeTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "MealPlan") {
            iconName = focused ? "restaurant" : "restaurant-outline";
          } else if (route.name === "GroceryList") {
            iconName = focused ? "list" : "list-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#FF6B6B",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          paddingBottom: 5,
          height: 60,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="MealPlan" component={MealPlanStackScreen} />
      <Tab.Screen name="GroceryList" component={GroceryListStackScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

// Meal Plan Screen Component
const MealPlanScreen = () => {
  const navigation = useNavigation();
  const [ingredients, setIngredients] = useState("");
  const [ingredientList, setIngredientList] = useState([]);
  const [suggestedRecipes, setSuggestedRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const addToGroceryList = (recipeIngredients) => {
    // Navigate to GroceryList tab and pass the ingredients
    navigation.navigate("GroceryList", {
      screen: "GroceryListMain",
      params: { newItems: recipeIngredients },
    });
  };
  const addIngredient = () => {
    if (ingredients.trim()) {
      setIngredientList([...ingredientList, ingredients.trim()]);
      setIngredients("");
    }
  };

  const removeIngredient = (index) => {
    const newList = [...ingredientList];
    newList.splice(index, 1);
    setIngredientList(newList);
  };

  const getRecipeSuggestions = async () => {
    if (ingredientList.length === 0) return;

    setIsLoading(true);
    try {
      const mockRecipes = generateMockRecipes(ingredientList);
      setSuggestedRecipes(mockRecipes);
    } catch (error) {
      console.error("Error fetching recipes: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockRecipes = (ingredients) => {
    const allRecipes = [
      {
        id: "1",
        name: "Vegetable Stir Fry",
        description: `A quick stir fry using ${ingredients.join(", ")}.`,
        ingredients: [...ingredients, "soy sauce", "vegetable oil", "garlic"],
        steps: [
          "1. Prepare all vegetables by washing and cutting into uniform pieces",
          "2. Heat 1 tbsp oil in a wok or large pan over high heat",
          "3. Add minced garlic and stir for 30 seconds until fragrant",
          "4. Add vegetables starting with the ones that take longest to cook",
          "5. Stir constantly for 3-4 minutes until vegetables are crisp-tender",
          "6. Add 2 tbsp soy sauce and toss to combine",
          "7. Serve immediately over rice if desired",
        ],
        cookingTime: "15 minutes",
        difficulty: "Easy",
      },
      {
        id: "2",
        name: "Homemade Soup",
        description: `Comforting soup with ${ingredients.join(", ")}.`,
        ingredients: [
          ...ingredients,
          "vegetable broth",
          "salt",
          "pepper",
          "herbs",
        ],
        steps: [
          "1. Chop all vegetables into bite-sized pieces",
          "2. Heat 1 tbsp oil in a large pot over medium heat",
          "3. Sauté vegetables for 5 minutes until slightly softened",
          "4. Add 4 cups vegetable broth and bring to a boil",
          "5. Reduce heat and simmer for 20 minutes",
          "6. Season with salt, pepper, and herbs to taste",
          "7. Blend partially if you prefer a creamier texture",
        ],
        cookingTime: "30 minutes",
        difficulty: "Medium",
      },
      {
        id: "3",
        name: "Pasta Primavera",
        description: `Fresh pasta dish featuring ${ingredients.join(", ")}.`,
        ingredients: [
          ...ingredients,
          "pasta",
          "olive oil",
          "garlic",
          "parmesan cheese",
        ],
        steps: [
          "1. Cook pasta according to package instructions",
          "2. While pasta cooks, heat olive oil in a large pan",
          "3. Sauté garlic for 1 minute until fragrant",
          "4. Add vegetables and cook until tender",
          "5. Drain pasta, reserving 1/2 cup pasta water",
          "6. Toss pasta with vegetables, adding pasta water as needed",
          "7. Top with grated parmesan before serving",
        ],
        cookingTime: "20 minutes",
        difficulty: "Easy",
      },
      {
        id: "4",
        name: "Omelette",
        description: `Fluffy omelette with ${ingredients.join(", ")}.`,
        ingredients: [...ingredients, "eggs", "butter", "salt", "pepper"],
        steps: [
          "1. Beat 2-3 eggs with a pinch of salt and pepper",
          "2. Melt butter in a non-stick pan over medium heat",
          "3. Pour in eggs and let set for 30 seconds",
          "4. Add vegetables to one half of the omelette",
          "5. When eggs are nearly set, fold omelette in half",
          "6. Cook for another 30 seconds, then slide onto plate",
        ],
        cookingTime: "10 minutes",
        difficulty: "Easy",
      },
      {
        id: "5",
        name: "Roasted Vegetables",
        description: `Oven-roasted ${ingredients.join(", ")} with herbs.`,
        ingredients: [
          ...ingredients,
          "olive oil",
          "salt",
          "pepper",
          "dried herbs",
        ],
        steps: [
          "1. Preheat oven to 400°F (200°C)",
          "2. Chop vegetables into even-sized pieces",
          "3. Toss with olive oil, salt, pepper, and herbs",
          "4. Spread in single layer on baking sheet",
          "5. Roast for 25-30 minutes, stirring halfway",
          "6. Serve as side dish or over grains",
        ],
        cookingTime: "35 minutes",
        difficulty: "Easy",
      },
      {
        id: "6",
        name: "Grain Bowl",
        description: `Healthy grain bowl with ${ingredients.join(", ")}.`,
        ingredients: [
          ...ingredients,
          "quinoa or rice",
          "lemon juice",
          "olive oil",
          "feta cheese",
        ],
        steps: [
          "1. Cook grains according to package instructions",
          "2. Prepare vegetables (raw or lightly cooked)",
          "3. Make dressing with lemon juice, olive oil, salt and pepper",
          "4. Assemble bowl with grains, vegetables, and dressing",
          "5. Top with crumbled feta cheese",
          "6. Add nuts or seeds for extra crunch if desired",
        ],
        cookingTime: "25 minutes",
        difficulty: "Easy",
      },
      {
        id: "7",
        name: "Vegetable Curry",
        description: `Flavorful curry with ${ingredients.join(", ")}.`,
        ingredients: [
          ...ingredients,
          "coconut milk",
          "curry paste",
          "onion",
          "garlic",
        ],
        steps: [
          "1. Sauté chopped onion and garlic in oil until soft",
          "2. Add curry paste and cook for 1 minute",
          "3. Add vegetables and stir to coat with paste",
          "4. Pour in coconut milk and bring to simmer",
          "5. Cook for 15-20 minutes until vegetables are tender",
          "6. Serve with rice or naan bread",
        ],
        cookingTime: "30 minutes",
        difficulty: "Medium",
      },
      {
        id: "8",
        name: "Frittata",
        description: `Italian-style egg dish with ${ingredients.join(", ")}.`,
        ingredients: [
          ...ingredients,
          "eggs",
          "milk",
          "cheese",
          "salt",
          "pepper",
        ],
        steps: [
          "1. Preheat oven to 350°F (175°C)",
          "2. Sauté vegetables in oven-safe pan",
          "3. Whisk eggs with milk, salt and pepper",
          "4. Pour egg mixture over vegetables",
          "5. Cook on stovetop until edges set (5 minutes)",
          "6. Sprinkle with cheese and bake for 15 minutes",
          "7. Let cool slightly before slicing",
        ],
        cookingTime: "30 minutes",
        difficulty: "Medium",
      },
    ];

    // Return 4 random recipes from the collection
    return allRecipes.sort(() => 0.5 - Math.random()).slice(0, 3);
  };
  // Update your recipe card rendering to show steps when pressed
  const [expandedRecipe, setExpandedRecipe] = useState(null);

  const toggleRecipeExpansion = (recipeId) => {
    setExpandedRecipe(expandedRecipe === recipeId ? null : recipeId);
  };

  return (
    <ScrollView style={styles.screenContainer}>
      <Animatable.View
        animation="fadeIn"
        duration={1000}
        style={styles.content}
      >
        <Text style={styles.title}>Meal Planner</Text>

        <View style={styles.inputSection}>
          <Text style={styles.sectionTitle}>What ingredients do you have?</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="e.g. chicken, tomatoes"
              value={ingredients}
              onChangeText={setIngredients}
              onSubmitEditing={addIngredient}
            />
            <TouchableOpacity style={styles.addButton} onPress={addIngredient}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.ingredientsContainer}>
            {ingredientList.map((item, index) => (
              <View key={index} style={styles.ingredientItem}>
                <Text style={styles.ingredientText}>{item}</Text>
                <TouchableOpacity onPress={() => removeIngredient(index)}>
                  <Text style={styles.removeText}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={[
              styles.suggestButton,
              ingredientList.length === 0 && styles.disabledButton,
            ]}
            onPress={getRecipeSuggestions}
            disabled={ingredientList.length === 0 || isLoading}
          >
            <Text style={styles.suggestButtonText}>
              {isLoading ? "Finding Recipes..." : "Suggest Recipes"}
            </Text>
          </TouchableOpacity>
        </View>

        {suggestedRecipes.length > 0 && (
          <View style={styles.recipesSection}>
            <Text style={styles.sectionTitle}>Suggested Recipes</Text>
            {suggestedRecipes.map((recipe) => (
              <TouchableOpacity
                key={recipe.id}
                style={styles.recipeCard}
                onPress={() => toggleRecipeExpansion(recipe.id)}
              >
                <Text style={styles.recipeName}>{recipe.name}</Text>
                <Text style={styles.recipeDescription}>
                  {recipe.description}
                </Text>
                <Text style={styles.recipeMeta}>
                  ⏱️ {recipe.cookingTime} | 🧑‍🍳 {recipe.difficulty}
                </Text>

                {expandedRecipe === recipe.id && (
                  <View style={styles.recipeDetails}>
                    <Text style={styles.sectionHeader}>Ingredients:</Text>
                    <Text style={styles.recipeIngredients}>
                      {recipe.ingredients.join(", ")}
                    </Text>

                    <Text style={styles.sectionHeader}>Steps:</Text>
                    {recipe.steps.map((step, index) => (
                      <Text key={index} style={styles.stepText}>
                        {step}
                      </Text>
                    ))}

                    <TouchableOpacity
                      style={styles.addToListButton}
                      onPress={() => addToGroceryList(recipe.ingredients)}
                    >
                      <Text style={styles.addToListButtonText}>
                        Add Ingredients to Grocery List
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </Animatable.View>
    </ScrollView>
  );
};

// Grocery List Screen Component with Calculator
const GroceryListScreen = ({ route }) => {
  const [groceryItems, setGroceryItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [calculatorValue, setCalculatorValue] = useState("0");
  const [calculatorActive, setCalculatorActive] = useState(false);

  useEffect(() => {
    if (route.params?.newItems) {
      // Process the new items
      const itemsToAdd = route.params.newItems.filter(
        (item) => !groceryItems.some((gItem) => gItem.name === item)
      );

      if (itemsToAdd.length > 0) {
        setGroceryItems((prev) => [
          ...prev,
          ...itemsToAdd.map((item) => ({ name: item, quantity: 1 })),
        ]);
      }
    }
  }, [route.params]);

  const addGroceryItem = () => {
    if (newItem.trim()) {
      setGroceryItems([...groceryItems, { name: newItem.trim(), quantity: 1 }]);
      setNewItem("");
    }
  };

  const removeGroceryItem = (index) => {
    const newList = [...groceryItems];
    newList.splice(index, 1);
    setGroceryItems(newList);
  };

  const updateQuantity = (index, change) => {
    const newList = [...groceryItems];
    newList[index].quantity = Math.max(1, newList[index].quantity + change);
    setGroceryItems(newList);
  };

  const handleCalculatorInput = (value) => {
    if (calculatorValue === "0") {
      setCalculatorValue(value);
    } else {
      setCalculatorValue(calculatorValue + value);
    }
  };

  const calculateResult = () => {
    try {
      setCalculatorValue(eval(calculatorValue).toString());
    } catch {
      setCalculatorValue("Error");
    }
  };

  const clearCalculator = () => {
    setCalculatorValue("0");
  };

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.title}>Grocery List</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add grocery item"
          value={newItem}
          onChangeText={setNewItem}
          onSubmitEditing={addGroceryItem}
        />
        <TouchableOpacity style={styles.addButton} onPress={addGroceryItem}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.calculatorToggle}
        onPress={() => setCalculatorActive(!calculatorActive)}
      >
        <Text style={styles.calculatorToggleText}>
          {calculatorActive ? "Hide Calculator" : "Show Calculator"}
        </Text>
      </TouchableOpacity>

      {calculatorActive && (
        <View style={styles.calculatorContainer}>
          <View style={styles.calculatorDisplay}>
            <Text style={styles.calculatorDisplayText}>{calculatorValue}</Text>
          </View>
          <View style={styles.calculatorButtons}>
            {[
              "7",
              "8",
              "9",
              "/",
              "4",
              "5",
              "6",
              "*",
              "1",
              "2",
              "3",
              "-",
              "0",
              ".",
              "=",
              "+",
            ].map((btn) => (
              <TouchableOpacity
                key={btn}
                style={styles.calculatorButton}
                onPress={() =>
                  btn === "=" ? calculateResult() : handleCalculatorInput(btn)
                }
              >
                <Text style={styles.calculatorButtonText}>{btn}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[styles.calculatorButton, { backgroundColor: "#FF6B6B" }]}
              onPress={clearCalculator}
            >
              <Text style={styles.calculatorButtonText}>C</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <FlatList
        data={groceryItems}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.groceryItem}>
            <View style={styles.quantityControls}>
              <TouchableOpacity onPress={() => updateQuantity(index, -1)}>
                <Text style={styles.quantityButton}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{item.quantity}</Text>
              <TouchableOpacity onPress={() => updateQuantity(index, 1)}>
                <Text style={styles.quantityButton}>+</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.groceryItemText}>{item.name}</Text>
            <TouchableOpacity onPress={() => removeGroceryItem(index)}>
              <Text style={styles.removeText}>×</Text>
            </TouchableOpacity>
          </View>
        )}
        style={styles.groceryList}
      />
    </View>
  );
};

// Profile Screen Component
const ProfileScreen = () => {
  const navigation = useNavigation();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.reset({
        index: 0,
        routes: [{ name: "LoginScreen" }],
      });
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.title}>Your Profile</Text>
      <View style={styles.profileSection}>
        <Text style={styles.profileText}>Email: {auth.currentUser?.email}</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
          <Text style={styles.logoutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#e8383b",
    padding: 22,
  },
  content: {
    alignItems: "center",
    width: "100%",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 20,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#34495E",
    marginBottom: 16,
    textAlign: "center",
  },
  inputSection: {
    width: "100%",
    marginBottom: 32,
    backgroundColor: "#F8F9FA",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    padding: 14,
    marginRight: 12,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
  },
  addButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 10,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  ingredientsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
    justifyContent: "flex-start",
  },
  ingredientItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    margin: 5,
    borderWidth: 1,
    borderColor: "#C8E6C9",
  },
  ingredientText: {
    marginRight: 8,
    fontSize: 15,
    color: "#2E7D32",
  },
  removeText: {
    color: "#E53935",
    fontWeight: "bold",
    fontSize: 18,
    paddingHorizontal: 4,
  },
  suggestButton: {
    backgroundColor: "#FF9800",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: "#BDBDBD",
    shadowOpacity: 0.1,
  },
  suggestButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  recipesSection: {
    width: "100%",
    marginBottom: 30,
  },
  recipeCard: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#EEEEEE",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  recipeName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#303F9F",
    marginBottom: 8,
  },
  recipeDescription: {
    fontSize: 15,
    color: "#546E7A",
    lineHeight: 22,
    marginBottom: 6,
  },
  recipeIngredients: {
    fontSize: 14,
    color: "#607D8B",
    marginTop: 6,
    fontStyle: "italic",
    lineHeight: 20,
  },
  profileSection: {
    marginTop: 34,
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 20,
    borderRadius: 12,
    width: "100%",
  },
  profileText: {
    fontSize: 17,
    marginBottom: 24,
    color: "#424242",
  },
  logoutButton: {
    backgroundColor: "#F44336",
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  logoutButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  groceryItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#EEEEEE",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  groceryItemText: {
    flex: 1,
    marginHorizontal: 12,
    fontSize: 16,
    color: "#37474F",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingHorizontal: 4,
  },
  quantityButton: {
    fontSize: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    color: "#FF6B6B",
    fontWeight: "bold",
  },
  quantityText: {
    fontSize: 16,
    width: 32,
    textAlign: "center",
    fontWeight: "500",
  },
  calculatorToggle: {
    backgroundColor: "#FF9800",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  calculatorToggleText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },
  calculatorContainer: {
    marginVertical: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  calculatorDisplay: {
    backgroundColor: "#ECEFF1",
    padding: 18,
    alignItems: "flex-end",
  },
  calculatorDisplayText: {
    fontSize: 28,
    fontWeight: "500",
    color: "#263238",
  },
  calculatorButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  calculatorButton: {
    width: "25%",
    padding: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F5F5",
    borderWidth: 0.5,
    borderColor: "#E0E0E0",
    height: 60,
  },
  calculatorButtonText: {
    fontSize: 20,
    fontWeight: "500",
    color: "#263238",
  },
  groceryList: {
    marginTop: 12,
    width: "100%",
  },
  recipeMeta: {
    fontSize: 13,
    color: "#78909C",
    marginTop: 5,
    marginBottom: 2,
  },
  recipeDetails: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
  },
  sectionHeader: {
    fontWeight: "700",
    marginTop: 10,
    marginBottom: 6,
    fontSize: 15,
    color: "#455A64",
  },
  stepText: {
    marginLeft: 12,
    marginBottom: 8,
    fontSize: 14,
    color: "#455A64",
    lineHeight: 20,
  },
  addToListButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    marginTop: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  addToListButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 15,
  },
});

export default HomeTabs;
