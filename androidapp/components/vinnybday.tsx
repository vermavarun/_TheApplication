import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Image,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from "react-native";

type FloatingHeartProps = {
  delay: number;
  duration: number;
  style: ViewStyle;
};

const FloatingHeart = ({ delay, duration, style }: FloatingHeartProps) => {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(progress, {
          toValue: 1,
          duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
        Animated.timing(progress, {
          toValue: 0,
          duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [delay, duration, progress]);

  return (
    <Animated.View
      testID="floating-heart"
      accessible={false}
      pointerEvents="none"
      style={[
        styles.heart,
        style,
        {
          opacity: progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0.45, 0.9],
          }),
          transform: [
            {
              translateY: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [8, -8],
              }),
            },
            {
              scale: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0.9, 1.08],
              }),
            },
          ],
        },
      ]}
    >
      <Text style={styles.heartText}>♥</Text>
    </Animated.View>
  );
};

const VinnyBday = () => {
  const entrance = useRef(new Animated.Value(0.96)).current;

  useEffect(() => {
    const animation = Animated.timing(entrance, {
      toValue: 1,
      duration: 850,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    });

    animation.start();
    return () => animation.stop();
  }, [entrance]);

  return (
    <View style={styles.container}>
      <Text
        testID="birthday-heading"
        accessibilityRole="header"
        style={styles.heading}
      >
        Happy Birthday, my love
      </Text>
      <Text style={styles.subtitle}>A little celebration, just for you</Text>

      <View style={styles.imageStage}>
        <Animated.View
          testID="birthday-card-animation"
          style={[
            styles.imageMotion,
            {
              transform: [
                {
                  scale: entrance.interpolate({
                    inputRange: [0.96, 1],
                    outputRange: [0.96, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <Image
            testID="birthday-card-image"
            source={require("../assets/images/bday.png")}
            style={styles.image}
            resizeMode="contain"
            accessibilityLabel="Birthday card for my wife"
          />
        </Animated.View>

        <View style={styles.hearts} pointerEvents="none">
          <FloatingHeart delay={0} duration={1800} style={styles.heartTopLeft} />
          <FloatingHeart
            delay={500}
            duration={2100}
            style={styles.heartMiddleRight}
          />
          <FloatingHeart
            delay={900}
            duration={1900}
            style={styles.heartBottomLeft}
          />
        </View>
      </View>

      <Text testID="birthday-footer" style={styles.footer}>
        Every day with you is my favorite day.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    alignItems: "center",
    backgroundColor: "#dbea9d",
  },
  heading: {
    color: "#49323a",
    fontSize: 25,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    color: "#76515d",
    fontSize: 15,
    marginTop: 5,
    textAlign: "center",
  },
  imageStage: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  imageMotion: {
    flex: 1,
    width: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  hearts: {
    ...StyleSheet.absoluteFillObject,
  },
  heart: {
    position: "absolute",
  },
  heartText: {
    color: "#d94970",
    fontSize: 25,
    textShadowColor: "rgba(255, 255, 255, 0.9)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
  },
  heartTopLeft: {
    top: "10%",
    left: "3%",
  },
  heartMiddleRight: {
    top: "48%",
    right: "2%",
  },
  heartBottomLeft: {
    bottom: "12%",
    left: "7%",
  },
  footer: {
    color: "#49323a",
    fontSize: 15,
    fontWeight: "600",
    marginTop: 8,
    textAlign: "center",
  },
});

export default VinnyBday;
