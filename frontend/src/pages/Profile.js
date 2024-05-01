import { Container, Row } from "react-bootstrap";
import { useEffect, useContext, useState } from "react";
import UserContext from "../UserContext.js";
import { Navigate } from "react-router-dom";
import ChangePassword from "../components/ChangePassword.js";

function Profile({ userDetails, fetchData }) {
  const { user } = useContext(UserContext);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {user.id !== null ? (
        <Container fluid>
          <Row>
            <div className="text-center background">
              <div className="loginFormContainer text-center container-fluid">
                <div className="loginForm" style={{ marginTop: "6rem" }}>
                  <h1 style={{ marginTop: "3rem" }}>Profile</h1>
                  <div className="text-start mt-4">
                    <h5>
                      Name: {`${userDetails.firstName} ${userDetails.lastName}`}
                    </h5>
                    <h5>Email: {`${userDetails.email}`}</h5>
                    <h5>Mobile No.: {`${userDetails.mobileNo}`}</h5>
                    <ChangePassword />
                  </div>
                </div>
              </div>
            </div>
          </Row>
        </Container>
      ) : (
        <Navigate to="/login" />
      )}
    </>
  );
}

export default Profile;
