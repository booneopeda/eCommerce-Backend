import "./Error.css";
import Diamond from "../assets/images/diamond.png";
import { Link } from "react-router-dom";
import UserContext from "../UserContext";
import { useContext } from "react";
import { Container, Row } from "react-bootstrap";

export default function HeroSection() {
  const { user } = useContext(UserContext);
  return (
    <Container fluid>
      <Row>
        <div className="text-center background">
          <h1 className="red-hat-display-main" id="title-error">
            ERROR - 404 PAGE NOT FOUND
          </h1>
          <p className="sub-heading-error d-none d-md-inline">
            The page you are looking for cannot be found.
          </p>
          <div className=" btn--container mt-4 mt-md-3">
            <Link to={"/"}>
              <button className="btn--home" id="btnshop">
                <span>HOME PAGE </span>
              </button>
            </Link>
          </div>
        </div>
      </Row>
    </Container>
  );
}
