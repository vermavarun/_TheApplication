import React from "react";
import { Image, StyleSheet, View } from "react-native";

const VinnyBday = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/bday.png")}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#dbea9d",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

export default VinnyBday;