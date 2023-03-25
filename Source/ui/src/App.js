import "./App.css";

callApi();

function callApi() {
  fetch("https://vv-api.azurewebsites.net/", { method: "GET" })
    .then(response => response.text())
    .then((data) => document.getElementsByClassName("appspan")[0].innerHTML=data);  // Parsing the data into a JavaScript object
}

function App() {
  return (

    <div className="App">
     From API: <span className="appspan"></span>
    </div>
  );
}

export default App;
