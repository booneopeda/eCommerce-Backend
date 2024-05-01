import { useEffect, useState } from "react";
import { Container, Row, Accordion } from "react-bootstrap";
import OrderDataEntry from "./OrderDataEntry";
import "./OrderHistoryItem.css";

function OrderHistoryItem({ user, orderData, fetchData, allProductsData }) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/users/getUserDetails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        userId: user,
      }),
    })
      .then((res) => res.json())
      .then((userData) => {
        setUserData(userData.user);
        setEmail(userData.user.email);
        setFirstName(userData.user.firstName);
        setLastName(userData.user.lastName);
      });
  }, []);

  return (
    <Container fluid>
      <Row>
        <Accordion>
          <Accordion.Item
            style={{ backgroundColor: "rgba(229, 199, 171, 0.1)" }}
          >
            <Accordion.Header>
              <h6>
                <strong>{`Orders by ${firstName} ${lastName} - ${email}`}</strong>
              </h6>
            </Accordion.Header>
            <Accordion.Body className="text-white">
              <OrderDataEntry
                key={userData._id}
                orderData={orderData}
                userData={userData}
                fetchData={fetchData}
                allProductsData={allProductsData}
              />
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Row>
    </Container>
  );
}

export default OrderHistoryItem;
