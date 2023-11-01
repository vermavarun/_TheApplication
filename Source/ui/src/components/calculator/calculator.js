import Add from "./add";


function Calculator() {
  return (
    <div className="calculator">
      <pre>
       Number 1 <input type="number"></input>
       <br/>
       Number 2 <input type="number"></input>
       </pre>
      <Add />
    </div>
  );
}
export default Calculator;
