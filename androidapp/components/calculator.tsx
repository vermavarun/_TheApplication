import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const BUTTONS = [
  ["C", "DEL", "%", "÷"],
  ["7", "8", "9", "×"],
  ["4", "5", "6", "-"],
  ["1", "2", "3", "+"],
  ["0", ".", "="],
];

const isOperator = (v) => ["+", "-", "×", "÷", "%"].includes(v);

const Calculator = () => {
  const [display, setDisplay] = useState("0");
  const [first, setFirst] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForSecond, setWaitingForSecond] = useState(false);

  const resetAll = () => {
    setDisplay("0");
    setFirst(null);
    setOperator(null);
    setWaitingForSecond(false);
  };

  const inputNumber = (num) => {
    if (waitingForSecond) {
      setDisplay(num);
      setWaitingForSecond(false);
      return;
    }
    setDisplay((prev) => (prev === "0" ? num : prev + num));
  };

  const inputDot = () => {
    if (waitingForSecond) {
      setDisplay("0.");
      setWaitingForSecond(false);
      return;
    }
    if (!display.includes(".")) setDisplay((prev) => prev + ".");
  };

  const deleteLast = () => {
    if (waitingForSecond) return;
    setDisplay((prev) => (prev.length <= 1 ? "0" : prev.slice(0, -1)));
  };

  const compute = (a, op, b) => {
    switch (op) {
      case "+":
        return a + b;
      case "-":
        return a - b;
      case "×":
        return a * b;
      case "÷":
        return b === 0 ? "Error" : a / b;
      case "%":
        return a % b;
      default:
        return b;
    }
  };

  const inputOperator = (nextOperator) => {
    const inputValue = parseFloat(display);

    if (first === null) {
      setFirst(inputValue);
    } else if (operator && !waitingForSecond) {
      const result = compute(first, operator, inputValue);
      if (result === "Error") {
        setDisplay("Error");
        setFirst(null);
        setOperator(null);
        setWaitingForSecond(true);
        return;
      }
      const fixed = Number(result.toFixed(10)).toString();
      setDisplay(fixed);
      setFirst(parseFloat(fixed));
    }

    setOperator(nextOperator);
    setWaitingForSecond(true);
  };

  const onEqual = () => {
    if (operator === null || first === null) return;
    const second = parseFloat(display);
    const result = compute(first, operator, second);

    if (result === "Error") {
      setDisplay("Error");
      setFirst(null);
      setOperator(null);
      setWaitingForSecond(true);
      return;
    }

    const fixed = Number(result.toFixed(10)).toString();
    setDisplay(fixed);
    setFirst(null);
    setOperator(null);
    setWaitingForSecond(false);
  };

  const onPress = (value) => {
    if (value === "C") return resetAll();
    if (value === "DEL") return deleteLast();
    if (value === ".") return inputDot();
    if (value === "=") return onEqual();
    if (isOperator(value)) return inputOperator(value);
    return inputNumber(value);
  };

  const buttonStyle = (value) => {
    if (value === "=") return [styles.button, styles.equalButton];
    if (isOperator(value) || value === "C" || value === "DEL")
      return [styles.button, styles.operatorButton];
    if (value === "0") return [styles.button, styles.zeroButton];
    return styles.button;
  };

  return (
    <View style={styles.container}>
      <View style={styles.displayWrap}>
        <Text numberOfLines={1} adjustsFontSizeToFit style={styles.display}>
          {display}
        </Text>
      </View>

      {BUTTONS.map((row, idx) => (
        <View key={idx} style={styles.row}>
          {row.map((btn) => (
            <TouchableOpacity
              key={btn}
              style={buttonStyle(btn)}
              onPress={() => onPress(btn)}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>{btn}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#b05a5a",
    justifyContent: "flex-end",
  },
  displayWrap: {
    minHeight: 120,
    justifyContent: "center",
    alignItems: "flex-end",
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  display: {
    color: "#fff",
    fontSize: 56,
    fontWeight: "300",
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },
  button: {
    flex: 1,
    height: 68,
    marginHorizontal: 5,
    borderRadius: 14,
    backgroundColor: "#2A2A2A",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "600",
  },
  operatorButton: {
    backgroundColor: "#3D5AFE",
  },
  equalButton: {
    backgroundColor: "#00C853",
  },
  zeroButton: {
    flex: 2.1,
  },
});

export default Calculator;