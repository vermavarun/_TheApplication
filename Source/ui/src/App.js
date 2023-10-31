import "./App.css";
import Calculator from './components/calculator/calculator'
import TopBar from './components/topbar/topbar';

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
      <TopBar/>
     Response From API: <span className="appspan"></span>
     <Calculator/>
    </div>
  );
}

export default App;
