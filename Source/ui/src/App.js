import "./App.css";
import Calculator from "./components/calculator/calculator";
import TopBar from "./components/topbar/topbar";
import Footer from "./components/footer/footer";

callApi();

function callApi() {
  var apiUrl = process.env.REACT_APP_API_URL;
  console.log(apiUrl);
  fetch(apiUrl, { method: "GET" })
    .then((response) => response.text())
    .then(
      (data) => (document.getElementsByClassName("AppData")[0].innerHTML = data)
    );
}

function App() {
  return (
    <>
      <TopBar />
      <div className="App">
        <div className="AppData"></div>
        <Calculator />
      </div>
      <Footer />
    </>
  );
}

export default App;
