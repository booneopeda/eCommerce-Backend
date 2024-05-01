import { Form, Container, Row } from "react-bootstrap";
import { useState, useEffect, useContext } from "react";
import UserContext from "../UserContext";
import { Link, Navigate, useNavigate } from "react-router-dom";
import "./Register.css";
import Swal from "sweetalert2";

export default function Register() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isActive, setIsActive] = useState(false);

  function registerUser(e) {
    e.preventDefault();
    fetch(`${process.env.REACT_APP_API_BASE_URL}/users/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        email: email,
        mobileNo: mobileNo,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.message === "Registered Successfully") {
          setFirstName("");
          setLastName("");
          setEmail("");
          setMobileNo("");
          setPassword("");
          setConfirmPassword("");

          Swal.fire({
            title: "Registered Successfully",
            icon: "success",
            confirmButtonColor: "#2d1b07",
          });
          navigate("/login");
        } else if (data.error === "Email invalid") {
          Swal.fire({
            title: "Email invalid",
            icon: "warning",
            confirmButtonColor: "#2d1b07",
          });
        } else if (data.error === "Mobile number invalid") {
          Swal.fire({
            title: "Mobile number invalid",
            icon: "warning",
            confirmButtonColor: "#2d1b07",
          });
        } else if (data.error === "Password must be atleast 8 characters") {
          Swal.fire({
            title: "Password must be atleast 8 characters",
            icon: "warning",
            confirmButtonColor: "#2d1b07",
          });
        } else if (data.error === "Duplicate Email Found") {
          Swal.fire({
            title: "Email already registered",
            icon: "warning",
            confirmButtonColor: "#2d1b07",
          });
        } else {
          Swal.fire({
            title: "Something went wrong",
            icon: "error",
            text: "Please try again",
            confirmButtonColor: "#2d1b07",
          });
        }
      });
  }

  useEffect(() => {
    if (
      firstName !== "" &&
      lastName !== "" &&
      email !== "" &&
      mobileNo !== "" &&
      password !== "" &&
      confirmPassword !== "" &&
      password === confirmPassword &&
      mobileNo.length === 11
    ) {
      setIsActive((i) => (i = true));
    } else {
      setIsActive((i) => (i = false));
    }
  }, [firstName, lastName, email, mobileNo, password, confirmPassword]);

  return user.id !== null ? (
    <Navigate to="/login" />
  ) : (
    <Container fluid>
      <Row>
        <div className="background-regpage">
          <div className="registerFormContainer text-center container">
            <div className="registerForm background-regform">
              <Form onSubmit={(e) => registerUser(e)}>
                <h1 className="mt-5 mb-4 text-center">Sign Up</h1>
                <Form.Group>
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter First Name"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="text-center"
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Last Name"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="text-center"
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email here"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="text-center"
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Mobile No.</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter 11-digit No."
                    required
                    value={mobileNo}
                    onChange={(e) => setMobileNo(e.target.value)}
                    className="text-center"
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="text-center"
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm Password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="text-center"
                  />
                </Form.Group>
                {/* Conditionally rendered submit button based on isactive state */}
                {isActive ? (
                  <button
                    className="mt-3 btn-active"
                    type="submit"
                    onSubmit={registerUser}
                  >
                    Submit
                  </button>
                ) : (
                  <button disabled className="mt-3 btn-inactive">
                    Submit
                  </button>
                )}
                <p className="mt-2">
                  Already have an account?{" "}
                  <Link className="login-link" to={"/login"}>
                    <span>Login here</span>
                  </Link>
                </p>
              </Form>
            </div>
          </div>
        </div>
      </Row>
    </Container>
  );
}
