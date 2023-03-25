import logo from './logo.svg';
import "./App.css";

function callApi() {
  fetch("https://vv-api.azurewebsites.net/", { method: "GET" })
    .then((data) => data.json()) // Parsing the data into a JavaScript object
    .then((json) => alert(JSON.stringify(json))); // Displaying the stringified data in an alert popup
}

function App() {
  return (
    <div className="App">
      <button onClick={callApi}>Call API</button>

      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
