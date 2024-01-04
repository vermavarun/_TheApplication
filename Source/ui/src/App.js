import "./App.css";
import {
  MsalProvider,
  AuthenticatedTemplate,
  useMsal,
} from "@azure/msal-react";
import Calculator from "./components/calculator/calculator";
import TopBar from "./components/topbar/topbar";
import Footer from "./components/footer/footer";
import { useEffect } from "react";

import { loginRequest } from "../src/authConfig";

function App({ instance }) {
  return (
    // <MsalProvider instance={instance}>
      <MainContent />
    // </MsalProvider>
  );
}

export default App;

const MainContent = () => {
  // const { instance } = useMsal();

  let activeAccount;

  // if (instance) {
  //   activeAccount = instance.getActiveAccount();
  // }

  // useEffect(() => {
  //   if (!activeAccount)
  //     instance.loginRedirect(loginRequest).catch((error) => console.log(error));
  // });
  return (
    // <AuthenticatedTemplate>
    <>
    <TopBar activeAccount={activeAccount} />
    
      <div className="App">
        <Calculator />
      </div>
      <Footer />
    </>
    // </AuthenticatedTemplate>


  );
};
