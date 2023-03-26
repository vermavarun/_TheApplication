import "./App.css";

callApi();

function callApi() {
  var apiUrl = process.env.REACT_APP_API_URL;
  console.log(apiUrl);
  fetch(apiUrl, { method: "GET" })
    .then(response => response.text())
    .then((data) => document.getElementsByClassName("appspan")[0].innerHTML=data);  

}

function App() {
  return (

    <div className="App">
     From API: <span className="appspan"></span>
    </div>
  );
}

export default App;
