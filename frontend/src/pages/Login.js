import { Form, Container, Row } from "react-bootstrap";
import { useState, useEffect, useContext } from "react";
import UserContext from "../UserContext";
import Swal from "sweetalert2";
import { Navigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import "./Login.css";

export default function Login({
  fetchData,
  setAllProductsData,
  fetchProductsData,
}) {
  const { user, retieveUserDetails } = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isActive, setIsActive] = useState(false);

  function authenticate(e) {
    e.preventDefault();

    fetch(`${process.env.REACT_APP_API_BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.access) {
          localStorage.setItem("token", data.access);
          retieveUserDetails(data.access);

          Swal.fire({
            title: "Login Successful",
            icon: "success",
            text: "Welcome to Ecommerce Store!",
            confirmButtonColor: "#2d1b07",
          });
          setEmail("");
          setPassword("");
        } else if (data.error === "No Email Found") {
          Swal.fire({
            title: "Something went wrong",
            icon: "error",
            text: `${email} does not exist`,
            confirmButtonColor: "#2d1b07",
          });
        } else {
          Swal.fire({
            title: "Authentication failed",
            icon: "error",
            text: `Check your login details and try again`,
            confirmButtonColor: "#2d1b07",
          });
        }
        fetchData();
        fetchProductsData();
      });
  }
  function registerGoogleUser(decoded) {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/users/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: decoded.given_name,
        lastName: decoded.family_name,
        email: decoded.email,
        mobileNo: "           ",
        password: decoded.sub,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        loginGoogleUser(decoded);
      });
  }
  function loginGoogleUser(decoded) {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: decoded.email,
        password: decoded.sub,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.access) {
          localStorage.setItem("token", data.access);
          retieveUserDetails(data.access);

          Swal.fire({
            title: "Login Successful",
            icon: "success",
            text: "Welcome to Ecommerce Store!",
            confirmButtonColor: "#2d1b07",
          });
        } else {
          Swal.fire({
            title: "Authentication failed",
            icon: "error",
            text: `Check your login details and try again`,
            confirmButtonColor: "#2d1b07",
          });
        }
        fetchData();
        fetchProductsData();
      });
  }
  function checkEmailDuplicate(credentialResponse) {
    const token = credentialResponse.credential;
    const decoded = jwtDecode(token);

    fetch(`${process.env.REACT_APP_API_BASE_URL}/users/checkEmail`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: decoded.email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "No Duplicate Email Found") {
          registerGoogleUser(decoded);
        } else {
          loginGoogleUser(decoded);
        }
      });
  }

  useEffect(() => {
    if (email !== "" && password !== "") {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [email, password]);

  return user.id !== null ? (
    <Navigate to="/products" />
  ) : (
    <Container fluid>
      <Row>
        <div className="background-loginpage">
          <div className="loginFormContainer text-center container-fluid">
            <div className="loginForm">
              <Form onSubmit={(e) => authenticate(e)}>
                <h1 className="my-5 text-center">Login</h1>
                <Form.Group controlId="userEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="text-center"
                  />
                </Form.Group>

                <Form.Group controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="text-center"
                  />
                </Form.Group>

                {isActive ? (
                  <button
                    className="mt-3 btn-active"
                    type="submit"
                    id="submitBtn"
                  >
                    Submit
                  </button>
                ) : (
                  <button disabled className="mt-3 btn-inactive">
                    Submit
                  </button>
                )}
                <p className="mt-2">
                  Don't have an account?{" "}
                  <Link className="register-link" to={"/Register"}>
                    <span>Register here</span>
                  </Link>
                </p>
                {process.env.REACT_APP_GOOGLE_CLIENT_ID !== undefined ? (
                  <>
                    <p>or</p>
                    <div className="d-flex justify-content-center ">
                      <GoogleLogin
                        onSuccess={(credentialResponse) => {
                          checkEmailDuplicate(credentialResponse);
                        }}
                        onError={() => {
                          console.log("Login Failed");
                        }}
                      />
                    </div>
                  </>
                ) : null}
              </Form>
            </div>
          </div>
        </div>
      </Row>
    </Container>
  );
}
