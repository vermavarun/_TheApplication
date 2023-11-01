import React, { useState } from "react";

import Add from "./add";
import Sub from "./sub";
import Mul from "./mul";
import Div from "./div";

function Calculator() {
  const [num1, setValue1] = useState(0);
  const [num2, setValue2] = useState(0);

  const handleNum1Change = (event) => {
    setValue1(event.target.value);
  };

  const handleNum2Change = (event) => {
    setValue2(event.target.value);
  };

  const [result, setResult] = useState(0);

  return (
    <div className="calculator">
      <pre>
        <label>Coz I am a Calculator !</label>
        <br/>
        Number 1 <input type="number" min={0} onChange={handleNum1Change} value={num1}></input>
        <br />
        Number 2 <input type="number" min={0} onChange={handleNum2Change} value={num2}></input>
        <br/>
        Result is :: {result}
      </pre>
      <div className="caloperations">
      <Add num1={num1} num2={num2} onResultCalculated={setResult} />
      <Sub num1={num1} num2={num2} onResultCalculated={setResult} />
      <Mul num1={num1} num2={num2} onResultCalculated={setResult} />
      <Div num1={num1} num2={num2} onResultCalculated={setResult} />
      </div>
    </div>
  );
}
export default Calculator;
