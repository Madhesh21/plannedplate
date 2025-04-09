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
    return [
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
    ];
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
    backgroundColor: "#fff",
    padding: 20,
  },
  content: {
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#444",
    marginBottom: 15,
    textAlign: "center",
  },
  inputSection: {
    width: "100%",
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginRight: 10,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  ingredientsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
    justifyContent: "center",
  },
  ingredientItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    margin: 5,
  },
  ingredientText: {
    marginRight: 5,
  },
  removeText: {
    color: "#ff4444",
    fontWeight: "bold",
    fontSize: 16,
  },
  suggestButton: {
    backgroundColor: "#FF9800",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#cccccc",
  },
  suggestButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  recipesSection: {
    width: "100%",
    marginBottom: 30,
  },
  recipeCard: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  recipeName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  recipeDescription: {
    fontSize: 14,
    color: "#666",
  },
  recipeIngredients: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
    fontStyle: "italic",
  },
  profileSection: {
    marginTop: 30,
    alignItems: "center",
  },
  profileText: {
    fontSize: 16,
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  groceryItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    justifyContent: "space-between",
  },
  groceryItemText: {
    flex: 1,
    marginHorizontal: 10,
    fontSize: 16,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    fontSize: 20,
    paddingHorizontal: 10,
    color: "#FF6B6B",
  },
  quantityText: {
    fontSize: 16,
    width: 30,
    textAlign: "center",
  },
  calculatorToggle: {
    backgroundColor: "#FF9800",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  calculatorToggleText: {
    color: "#fff",
    fontWeight: "bold",
  },
  calculatorContainer: {
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
  },
  calculatorDisplay: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    alignItems: "flex-end",
  },
  calculatorDisplayText: {
    fontSize: 24,
  },
  calculatorButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  calculatorButton: {
    width: "25%",
    padding: 15,
    alignItems: "center",
    backgroundColor: "#eee",
    borderWidth: 0.5,
    borderColor: "#ddd",
  },
  calculatorButtonText: {
    fontSize: 18,
  },
  groceryList: {
    marginTop: 10,
  },
  recipeMeta: {
    fontSize: 12,
    color: "#666",
    marginTop: 3,
  },
  recipeDetails: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  sectionHeader: {
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 4,
  },
  stepText: {
    marginLeft: 10,
    marginBottom: 5,
    fontSize: 14,
    color: "#444",
  },
  addToListButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  addToListButtonText: {
    color: "white",
    fontWeight: "bold",
  }
});

export default HomeTabs;
