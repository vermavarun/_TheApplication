
function Div(props) {

    const callApi = (num1, num2) => {
    var apiUrl =
      process.env.REACT_APP_API_URL + "/div?num1=" + num1 + "&num2=" + num2;
    console.log(apiUrl);
    fetch(apiUrl, { method: "GET" })
      .then((response) => response.text())
      .then((data) => props.onResultCalculated(data));
  };

  return (
    <div className="div">
      <button onClick={() => callApi(props.num1, props.num2)} disabled={props.num1 === '' || props.num2 === ''} >Div</button>
    </div>
  );
}
export default Div;
