import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { updateUserPreferences } from "../services/userService";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

// ... (keep your dietary restrictions and cuisine options arrays)
// Dietary restrictions options
const dietaryRestrictions = [
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Dairy-Free",
  "Keto",
  "Paleo",
  "Low-Carb",
  "Low-Fat",
  "Pescatarian",
];

// Cuisine preferences options
const cuisineOptions = [
  "Italian",
  "Mexican",
  "Chinese",
  "Indian",
  "Japanese",
  "Mediterranean",
  "Thai",
  "American",
  "French",
  "Middle Eastern",
];

const ProfileSetupScreen = ({ route }) => {
  const { userId } = route.params;
  const [selectedRestrictions, setSelectedRestrictions] = useState([]);
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const toggleRestriction = (restriction) => {
    if (selectedRestrictions.includes(restriction)) {
      setSelectedRestrictions(
        selectedRestrictions.filter((item) => item !== restriction)
      );
    } else {
      setSelectedRestrictions([...selectedRestrictions, restriction]);
    }
  };

  const toggleCuisine = (cuisine) => {
    if (selectedCuisines.includes(cuisine)) {
      setSelectedCuisines(selectedCuisines.filter((item) => item !== cuisine));
    } else {
      setSelectedCuisines([...selectedCuisines, cuisine]);
    }
  };

  const handleSavePreferences = async () => {
    try {
      setLoading(true);
      await updateUserPreferences(userId, {
        dietaryRestrictions: selectedRestrictions,
        favoriteCuisines: selectedCuisines,
      });

      // Update user's display name (if needed)
      /* await auth.currentUser.updateProfile({
        displayName: "User", // Or any default name
      }); */

      // Navigate to Main stack which contains HomeScreen
      navigation.navigate("Main");
    } catch (error) {
      Alert.alert("Error", "Failed to save preferences. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

   return (
     <View style={styles.container}>
       <ScrollView contentContainerStyle={styles.scrollContent}>
         <Animatable.View
           animation="fadeIn"
           duration={1000}
           style={styles.headerContainer}
         >
           <Text style={styles.headerTitle}>Personalize Your Experience</Text>
           <Text style={styles.headerSubtitle}>
             Help us tailor recipes to your preferences
           </Text>
         </Animatable.View>

         <Animatable.View animation="fadeInUp" duration={800} delay={300}>
           <View style={styles.section}>
             <Text style={styles.sectionTitle}>Dietary Restrictions</Text>
             <Text style={styles.sectionSubtitle}>Select all that apply</Text>

             <View style={styles.optionsContainer}>
               {dietaryRestrictions.map((restriction, index) => (
                 <Animatable.View
                   key={restriction}
                   animation="fadeInRight"
                   delay={index * 100}
                 >
                   <TouchableOpacity
                     style={[
                       styles.optionChip,
                       selectedRestrictions.includes(restriction) &&
                         styles.selectedChip,
                     ]}
                     onPress={() => toggleRestriction(restriction)}
                   >
                     <Text
                       style={[
                         styles.optionText,
                         selectedRestrictions.includes(restriction) &&
                           styles.selectedOptionText,
                       ]}
                     >
                       {restriction}
                     </Text>
                     {selectedRestrictions.includes(restriction) && (
                       <Ionicons name="checkmark" size={16} color="#fff" />
                     )}
                   </TouchableOpacity>
                 </Animatable.View>
               ))}
             </View>
           </View>

           <View style={styles.section}>
             <Text style={styles.sectionTitle}>Favorite Cuisines</Text>
             <Text style={styles.sectionSubtitle}>
               Select all that you enjoy
             </Text>

             <View style={styles.optionsContainer}>
               {cuisineOptions.map((cuisine, index) => (
                 <Animatable.View
                   key={cuisine}
                   animation="fadeInRight"
                   delay={index * 100 + 200}
                 >
                   <TouchableOpacity
                     style={[
                       styles.optionChip,
                       selectedCuisines.includes(cuisine) &&
                         styles.selectedChip,
                     ]}
                     onPress={() => toggleCuisine(cuisine)}
                   >
                     <Text
                       style={[
                         styles.optionText,
                         selectedCuisines.includes(cuisine) &&
                           styles.selectedOptionText,
                       ]}
                     >
                       {cuisine}
                     </Text>
                     {selectedCuisines.includes(cuisine) && (
                       <Ionicons name="checkmark" size={16} color="#fff" />
                     )}
                   </TouchableOpacity>
                 </Animatable.View>
               ))}
             </View>
           </View>
         </Animatable.View>
       </ScrollView>

       <Animatable.View
         animation="fadeInUp"
         duration={800}
         style={styles.bottomContainer}
       >
         <TouchableOpacity
           style={styles.skipButton}
           onPress={() =>
             navigation.reset({
               index: 0,
               routes: [{ name: "Home" }],
             })
           }
         >
           <Text style={styles.skipButtonText}>Skip for now</Text>
         </TouchableOpacity>

         <TouchableOpacity
           style={styles.saveButton}
           onPress={handleSavePreferences}
           disabled={loading}
         >
           {loading ? (
             <ActivityIndicator color="#fff" size="small" />
           ) : (
             <Text style={styles.saveButtonText}>Save Preferences</Text>
           )}
         </TouchableOpacity>
       </Animatable.View>
     </View>
   );

  
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 60,
    paddingBottom: 100,
  },
  headerContainer: {
    paddingHorizontal: 30,
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#666",
  },
  section: {
    paddingHorizontal: 30,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  optionChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  selectedChip: {
    backgroundColor: "#FF6B6B",
    borderColor: "#FF6B6B",
  },
  optionText: {
    color: "#555",
    fontWeight: "500",
    marginRight: 5,
  },
  selectedOptionText: {
    color: "#fff",
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  skipButton: {
    paddingVertical: 15,
  },
  skipButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "500",
  },
  saveButton: {
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    minWidth: 150,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfileSetupScreen;



/* */