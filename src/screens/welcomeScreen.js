import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ImageBackground,
} from "react-native";
import auth from "../config/firebase";

const WelcomeScreen = ({ navigation }) => {
  // Animation for the "Get Started" button
  const buttonScale = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleGetStarted = () => {
    // Navigate to the next screen
    navigation.navigate("LoginScreen");
  };

 /*  const checkIfLoggedIn = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        navigation.navigate("ProfileSetupScreen");
      }
    });
  };

  useEffect(() => {
    checkIfLoggedIn();
  }, []); */

  return (
    <ImageBackground
      source={require("../assets/background.jpg")} // Replace with your image path
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      {/* Overlay with primary background color shadow */}
      <View style={styles.overlay}>
        {/* App Name */}
        <Text style={styles.appName}>Welcome to PlannedPlate</Text>

        {/* Tagline */}
        <Text style={styles.tagline}>
          Discover recipes tailored to your ingredients and create weekly meal
          plans with ease. Cooking made simple, delicious, and stress free.
        </Text>

        {/* Get Started Button */}
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleGetStarted}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Primary color with 70% opacity
    width: "100%",
    padding: 20,
  },
  appName: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#E6FF94", // Accent color for the app name
    marginBottom: 20,
  },
  tagline: {
    fontSize: 16,
    color: "#FFFFFF", // White color for the tagline
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 24,
  },
  button: {
    backgroundColor: "#40A578", // Secondary color for the button
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    elevation: 5, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF", // White color for the button text
  },
});

export default WelcomeScreen;
