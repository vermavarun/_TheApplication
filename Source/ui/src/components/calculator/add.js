
function Add(props) {

    const callApi = (num1, num2) => {
    var apiUrl =
      process.env.REACT_APP_API_URL + "/add?num1=" + num1 + "&num2=" + num2;
    console.log(apiUrl);
    fetch(apiUrl, { method: "GET" })
      .then((response) => response.text())
      .then((data) => props.onResultCalculated(data));
  };

  return (
    <div className="add">
      <button onClick={() => callApi(props.num1, props.num2)} disabled={props.num1 === '' || props.num2 === ''} >Add</button>
    </div>
  );
}
export default Add;
