

function callApi() {
  var apiUrl = process.env.REACT_APP_API_URL+"/add?num1=1&num2=2";
  console.log(apiUrl);
  fetch(apiUrl, { method: "GET" })
    .then((response) => response.text())
    .then(
      (data) => (document.getElementsByClassName("add")[0].innerHTML = data)
    );
}

function Add() {
    return <div className="add">
        <button onClick={callApi}>Add</button>
    </div>;
}
export default Add