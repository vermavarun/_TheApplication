import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from "react-native";

const CalculatorBasic = () => {
  const [num1, setNum1] = useState("");
  const [num2, setNum2] = useState("");
  const [result, setResult] = useState(0);

  const addNumbers = () => {
    const first = parseFloat(num1) || 0;
    const second = parseFloat(num2) || 0;
    setResult(first + second);
  };

  const subNumbers = () => {
    const first = parseFloat(num1) || 0;
    const second = parseFloat(num2) || 0;
    setResult(first - second);
  };

  const mulNumbers = () => {
    const first = parseFloat(num1) || 0;
    const second = parseFloat(num2) || 0;
    setResult(first * second);
  };

  const divNumbers = () => {
    const first = parseFloat(num1) || 0;
    const second = parseFloat(num2) || 0;
    setResult(second !== 0 ? first / second : 0);
  };

  return (
    <View style={styles.container}>

      <TouchableOpacity  onPress={() => { Alert.alert("For Vinnu Ji Tinnu! 😎"); }}>
        <Text style={styles.text}> 🤓 Well yet another calculator 🤓 </Text>
      </TouchableOpacity>


      <TextInput
        style={styles.input}
        placeholder="Enter Number 1"
        keyboardType="numeric"
        value={num1}
        onChangeText={setNum1}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Number 2"
        keyboardType="numeric"
        value={num2}
        onChangeText={setNum2}
      />

      <Text style={styles.result}>Result: {result}</Text>

    <View style={{ flexDirection: "row", alignItems: "center" }}>

      <TouchableOpacity style={styles.button} onPress={addNumbers}>
        <Text style={styles.buttonText}>Add</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={subNumbers}>
        <Text style={styles.buttonText}>Subtract</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={mulNumbers}>
        <Text style={styles.buttonText}>Multiply</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={divNumbers}>
        <Text style={styles.buttonText}>Divide</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => { setResult(0); setNum1(""); setNum2(""); }}>
        <Text style={styles.buttonText}>Reset</Text>
      </TouchableOpacity>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    marginBottom: 10,
    color: "#333",
    fontFamily: "Comic Sans MS",
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#dbea9d",
  },
  input: {
    width: "100%",
    borderWidth: 3,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  result: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 2,
    paddingHorizontal: 2,
    borderRadius: 2,
    marginHorizontal: 2,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
});


export default CalculatorBasic;