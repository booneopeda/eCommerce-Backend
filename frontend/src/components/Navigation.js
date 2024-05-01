import { Container, Nav, Navbar, Row } from "react-bootstrap";
import "./Navigation.css";
import { NavLink, Link } from "react-router-dom";
import UserContext from "../UserContext";
import { useContext, useEffect, useState } from "react";

export default function Navigation() {
  const { user } = useContext(UserContext);
  const [expanded, setExpanded] = useState(false);

  return (
    <Container fluid className="position-fixed inFront">
      <Row>
        <Navbar
          collapseOnSelect
          expanded={expanded}
          expand="lg"
          variant="light"
          className="mainNav vw-100"
        >
          <Container>
            <Nav.Link as={Link} to="/">
              <Navbar.Brand
                className="nav-logo"
                onClick={() => setExpanded(false)}
              >
                S T O P <strong>N</strong> S H O P
              </Navbar.Brand>
            </Nav.Link>
            <Navbar.Toggle
              onClick={() => setExpanded(!expanded)}
              aria-controls="basic-navbar-nav"
              className="nav-toggle"
            />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto">
                <div className="d-lg-flex">
                  <Nav.Link
                    onClick={() => setExpanded(false)}
                    className="nav-link text-white"
                    as={NavLink}
                    to="/"
                  >
                    Home
                  </Nav.Link>

                  <Nav.Link
                    className="nav-link text text-white"
                    as={NavLink}
                    to="/products"
                    onClick={() => setExpanded(false)}
                  >
                    {user.isAdmin ? "Dashboard" : "Products"}
                  </Nav.Link>
                  {user.id !== null ? (
                    <>
                      {user.isAdmin ? null : (
                        <Nav.Link
                          className="nav-link text-white"
                          as={NavLink}
                          to="/myorders"
                          onClick={() => setExpanded(false)}
                        >
                          My Orders
                        </Nav.Link>
                      )}
                      <Nav.Link
                        className="nav-link text-white"
                        as={NavLink}
                        to="/profile"
                        onClick={() => setExpanded(false)}
                      >
                        Profile
                      </Nav.Link>
                    </>
                  ) : null}
                </div>
              </Nav>
              <div className="d-flex">
                {user.id !== null ? (
                  <Nav.Link
                    as={Link}
                    to="/logout"
                    onClick={() => setExpanded(false)}
                  >
                    <button className="btn--nav">
                      <span> Logout</span>
                    </button>
                  </Nav.Link>
                ) : (
                  <>
                    <Nav.Link
                      as={Link}
                      to="/login"
                      onClick={() => setExpanded(false)}
                    >
                      <button className="btn--nav">
                        <span> Login</span>
                      </button>
                    </Nav.Link>
                    <Nav.Link
                      as={Link}
                      to="/register"
                      onClick={() => setExpanded(false)}
                    >
                      <button className="btn--nav">
                        <span> Sign Up</span>
                      </button>
                    </Nav.Link>
                  </>
                )}
              </div>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </Row>
    </Container>
  );
}
