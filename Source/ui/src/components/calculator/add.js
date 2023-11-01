function callApi(num1, num2) {
  var apiUrl =
    process.env.REACT_APP_API_URL + "/add?num1=" + num1 + "&num2=" + num2;
  console.log(apiUrl);
  console.log(num1);
  fetch(apiUrl, { method: "GET" })
    .then((response) => response.text())
    .then(
      (data) =>
        (document.getElementsByClassName("addresult")[0].innerHTML = data)
    );
}

function Add(data) {
  return (
    <div className="add">
      <button onClick={() => callApi(data.num1, data.num2)}>Add</button>
      <div className="addresult"></div>
    </div>
  );
}
export default Add;
