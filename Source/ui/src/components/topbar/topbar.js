import { useMsal } from "@azure/msal-react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function TopBar(props) {
  const { instance } = useMsal();
  function handleLogout() {
    instance.logoutRedirect();
  }

  return (
    <>
      <div className="topbar">
        <Container>
          <Row>
            <Col>Welcome {props.activeAccount?.name}! </Col>
            <Col>💥 The Application 💥</Col>
            <Col onClick={handleLogout}>Logout</Col>
          </Row>
        </Container>
      </div>
    </>
  );
}
export default TopBar;
