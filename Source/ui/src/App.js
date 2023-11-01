import "./App.css";
import Calculator from "./components/calculator/calculator";
import TopBar from "./components/topbar/topbar";
import Footer from "./components/footer/footer";

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
