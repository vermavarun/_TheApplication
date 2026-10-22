import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Image,
  type LayoutChangeEvent,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from "react-native";
import Sound from "react-native-sound";

type FloatingHeartProps = {
  delay: number;
  duration: number;
  style: ViewStyle;
};

type SnowflakeProps = {
  delay: number;
  duration: number;
  height: number;
  left: number;
  size: number;
};

  const absoluteFill: ViewStyle = {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  };
const loveQuotes = [
  "Somehow, every ordinary day becomes brighter with you.",
  "Home is wherever your hand finds mine.",
  "I'd choose you in every lifetime, every season.",
];

const snowflakes = Array.from({ length: 18 }, (_, index) => ({
  delay: (index * 410) % 4600,
  duration: 6200 + ((index * 317) % 2600),
  left: (index * 37) % 100,
  size: 11 + ((index * 7) % 12),
}));

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
          useNativeDriver: true,
        }),
        Animated.timing(progress, {
          toValue: 0,
          duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
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

const Snowflake = ({
  delay,
  duration,
  height,
  left,
  size,
}: SnowflakeProps) => {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(progress, {
          toValue: 1,
          duration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [delay, duration, progress]);

  return (
    <Animated.View
      testID="falling-snowflake"
      accessible={false}
      pointerEvents="none"
      style={[
        styles.snowflake,
          { left: `${left}%` },
        {
          opacity: progress.interpolate({
            inputRange: [0, 0.12, 0.88, 1],
            outputRange: [0, 0.7, 0.7, 0],
          }),
          transform: [
            {
              translateY: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [-20, height + 20],
              }),
            },
            {
              translateX: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [-14, 14],
              }),
            },
          ],
        },
      ]}
    >
      <Text style={[styles.snowflakeText, { fontSize: size }]}>❄</Text>
    </Animated.View>
  );
};

const VinnyBday = () => {
  const entrance = useRef(new Animated.Value(0.96)).current;
  const transition = useRef(new Animated.Value(1)).current;
  const transitionAnimation = useRef<Animated.CompositeAnimation | null>(null);
  const musicPlayer = useRef<Sound | null>(null);
  const [slideIndex, setSlideIndex] = React.useState(0);
  const [stageHeight, setStageHeight] = React.useState(0);
  const [musicStatus, setMusicStatus] = React.useState<
    "loading" | "ready" | "unavailable"
  >("loading");
  const isShowingImage = slideIndex >= loveQuotes.length;

  useEffect(() => {
    let isMounted = true;
    Sound.setCategory("Playback", true);

    const player = new Sound(
      "love_theme.wav",
      Sound.MAIN_BUNDLE,
      (error) => {
        if (!isMounted) {
          return;
        }

        if (error) {
          musicPlayer.current = null;
          setMusicStatus("unavailable");
          return;
        }

        setMusicStatus("ready");
      },
    );

    musicPlayer.current = player;

    return () => {
      isMounted = false;
      player.stop();
      player.release();
      musicPlayer.current = null;
    };
  }, []);

  useEffect(() => {
    const player = musicPlayer.current;
    if (musicStatus !== "ready" || !player) {
      return;
    }

    player.setVolume(0.24);
    player.setNumberOfLoops(-1);
    player.play();
  }, [musicStatus]);

  useEffect(() => {
    const animation = Animated.timing(entrance, {
      toValue: 1,
      duration: 850,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });

    animation.start();
    return () => animation.stop();
  }, [entrance]);

  useEffect(() => {
    if (isShowingImage) {
      return;
    }

    const timer = setTimeout(() => {
      transitionAnimation.current = Animated.timing(transition, {
        toValue: 0,
        duration: 450,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      });
      transitionAnimation.current.start(({ finished }) => {
        if (!finished) {
          return;
        }

        transition.setValue(0);
        setSlideIndex(slideIndex + 1);
        transitionAnimation.current = Animated.timing(transition, {
          toValue: 1,
          duration: 700,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        });
        transitionAnimation.current.start();
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [isShowingImage, slideIndex, transition]);

  useEffect(
    () => () => transitionAnimation.current?.stop(),
    [transitionAnimation],
  );

  const handleStageLayout = (event: LayoutChangeEvent) => {
    setStageHeight(event.nativeEvent.layout.height);
  };

  return (
    <View
      testID="birthday-screen"
      onLayout={handleStageLayout}
      style={styles.container}
    >
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
          testID="love-quote-animation"
          accessibilityElementsHidden={isShowingImage}
          style={[
            styles.quote,
            {
              opacity: isShowingImage ? 0 : transition,
              transform: [
                {
                  translateY: transition.interpolate({
                    inputRange: [0, 1],
                    outputRange: [14, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text testID="love-quote" style={styles.quoteText}>
            {loveQuotes[Math.min(slideIndex, loveQuotes.length - 1)]}
          </Text>
          <Text style={styles.quoteAttribution}>With all my heart</Text>
        </Animated.View>

        <Animated.View
          testID="birthday-card-animation"
          accessibilityElementsHidden={!isShowingImage}
          importantForAccessibility={
            isShowingImage ? "auto" : "no-hide-descendants"
          }
          style={[
            styles.imageMotion,
            {
              opacity: isShowingImage ? transition : 0,
              zIndex: isShowingImage ? 2 : 0,
              elevation: isShowingImage ? 2 : 0,
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

      {stageHeight > 0 && (
        <View
          testID="snowfall"
          pointerEvents="none"
          accessibilityElementsHidden
          style={styles.snowfall}
        >
          {snowflakes.map((flake, index) => (
            <Snowflake key={index} {...flake} height={stageHeight} />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
    alignItems: "center",
    backgroundColor: "#ffe8d6",
  },
  heading: {
    color: "#db370a",
    fontSize: 25,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    color: "#db370a",
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
  quote: {
    position: "absolute",
    zIndex: 1,
    width: "88%",
    alignItems: "center",
  },
  quoteText: {
    color: "#db370a",
    fontSize: 26,
    fontWeight: "600",
    lineHeight: 36,
    textAlign: "center",
  },
  quoteAttribution: {
    color: "#db370a",
    fontSize: 14,
    marginTop: 18,
    textAlign: "center",
  },
  imageMotion: {
      ...absoluteFill,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  hearts: {
      ...absoluteFill,
    zIndex: 3,
    elevation: 3,
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
    color: "#d94970",
    fontSize: 15,
    fontWeight: "600",
    marginTop: 8,
    textAlign: "center",
  },
  snowfall: {
    ...absoluteFill,
    zIndex: 4,
    elevation: 4,
    overflow: "hidden",
  },
  snowflake: {
    position: "absolute",
    top: 0,
  },
  snowflakeText: {
    color: "#ffffff",
    textShadowColor: "rgba(73, 50, 58, 0.35)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});

export default VinnyBday;
