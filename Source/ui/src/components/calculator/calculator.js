
import React, { useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import Add from "./add";
import Sub from "./sub";
import Mul from "./mul";
import Div from "./div";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
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

  function handleSetResult(data) {
    setResult(data);
    if (isNaN(data))
      toast.error(data)
    else
      toast.success(data)
  };

  return (

    <div className="calculator">
      <pre>
        <label>Calculator</label>
        <br />
        Number 1 <input type="number" min={0} onChange={handleNum1Change} value={num1}></input>
        <br />
        Number 2 <input type="number" min={0} onChange={handleNum2Change} value={num2}></input>
        <br />
        Result is :: {result}
      </pre>
      <div className="caloperations">
        <Container><Row>
          <Col><Add num1={num1} num2={num2} onResultCalculated={handleSetResult} /></Col>
          <Col><Sub num1={num1} num2={num2} onResultCalculated={handleSetResult} /></Col>
          <Col><Mul num1={num1} num2={num2} onResultCalculated={handleSetResult} /></Col>
          <Col><Div num1={num1} num2={num2} onResultCalculated={handleSetResult} /></Col>
        </Row>
        </Container>
      </div>
      <div><Toaster position="top-right" reverseOrder={false} /></div>
    </div>
  );
}
export default Calculator;
