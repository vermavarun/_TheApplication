import './App.css';

function callApi() {
  fetch('https://vv-api.azurewebsites.net/', { method: 'GET' })
    .then(data => data.json()) // Parsing the data into a JavaScript object
    .then(json => alert(JSON.stringify(json))) // Displaying the stringified data in an alert popup
}

function App() {
  return (
    <div className="App">
      <button onClick={callApi}>Call API</button>
    </div>
  );
}



export default App;
