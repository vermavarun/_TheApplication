import { useMsal } from "@azure/msal-react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useEffect,useState } from "react";

function TopBar(props) {

  const [machineNames, setMachineNames] = useState('');

  useEffect(() => {
    if (!machineNames)
      {
        callApi()
      }
  });

  const { instance } = useMsal();
  function handleLogout() {
    return;
    instance.logoutRedirect();
  }

  const callApi = () => {
    var apiUrl =
      process.env.REACT_APP_API_URL;
    fetch(apiUrl, { method: "GET" })
      .then((response) => response.text())
      .then((data) => setMachineNames(data))
      .catch( error => console.error(error));
  };

  return (
    <>
      <div className="topbar">
        <Container>
          <Row>
            <Col>Welcome {props.activeAccount?.name}! </Col>
            <Col><span className="title-app" title={machineNames}>💥 The Application 💥</span></Col>
            <Col className="logout" onClick={handleLogout}>Logout</Col>
          </Row>
        </Container>
      </div>
    </>
  );
}
export default TopBar;
