import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Text, Animated } from "react-native";
import LottieView from "lottie-react-native";

const SplashScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        delay: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        delay: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <LottieView
        source={require("../../assets/splash.json")}
        autoPlay
        loop={false}
        style={styles.animation}
      />
      <Animated.Text
        style={[
          styles.appName,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        Meal Planning made easy
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e8383b",
  },
  animation: {
    width: 300,
    height: 300,
  },
  appName: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default SplashScreen;
