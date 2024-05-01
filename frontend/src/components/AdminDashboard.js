import { useState, useEffect, useContext } from "react";
import { Button, Container, Row } from "react-bootstrap";
import AddProduct from "./AddProduct";
import UserContext from "../UserContext.js";
import AdminProductItem from "./AdminProductItem.js";
import OrderHistoryItem from "./OrderHistoryItem.js";

export default function AdminDashBoard({
  productsData,
  fetchData,
  allProductsData,
}) {
  const { user } = useContext(UserContext);
  const [products, setProducts] = useState(productsData);
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [uniqueUser, setUniqueUser] = useState([]);
  const [orderSummary, setOrderSummary] = useState([]);

  function handleShowOrderHistory() {
    setShowOrderHistory(!showOrderHistory);
    let token = localStorage.getItem("token");

    return fetch(`${process.env.REACT_APP_API_BASE_URL}/orders/all-orders`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((orderData) => {
        setOrderSummary(orderData);
        let uniqueUserData = orderData.orders.reduce((acc, curr) => {
          if (!acc.includes(curr.userId)) {
            acc.push(curr.userId);
          }
          return acc;
        }, []);

        setUniqueUser(uniqueUserData);
      });
  }

  useEffect(() => {
    let fetchUrl = user.isAdmin
      ? `${process.env.REACT_APP_API_BASE_URL}/products/all`
      : `${process.env.REACT_APP_API_BASE_URL}/products/`;

    fetch(fetchUrl, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products);
      });
  }, [productsData, user.isAdmin]);

  return (
    <>
      <h1 className="text-center text-white" style={{ marginTop: "4rem" }}>
        {" "}
        Admin Dashboard
      </h1>
      <h2 className="text-center mt-5 text-white">
        {showOrderHistory ? "Order History" : "Product List"}
      </h2>
      <Container fluid className="d-flex justify-content-end">
        <Button
          variant="success"
          size="sm"
          className="mb-3 me-3"
          onClick={() => handleShowOrderHistory()}
        >
          {showOrderHistory ? "Show Product List" : "Show Order History"}
        </Button>
        {showOrderHistory ? null : <AddProduct fetchData={fetchData} />}
      </Container>

      {showOrderHistory ? (
        <>
          {uniqueUser.map((user) => {
            return (
              <OrderHistoryItem
                key={user}
                user={user}
                orderData={orderSummary}
                fetchData={fetchData}
                allProductsData={allProductsData}
              />
            );
          })}
        </>
      ) : (
        <>
          <div style={{ overflowX: "auto" }} className="mx-5">
            <Container fluid>
              <Row>
                <table
                  style={{
                    border: "solid thin black",
                    borderRadius: "8px",
                    backgroundColor: "rgba(229, 199, 171, 0.6)",
                    color: "white",
                  }}
                >
                  <thead>
                    <tr className="text-center">
                      <th className="py-3">Name</th>
                      <th>Description</th>
                      <th className="px-5">Price</th>
                      <th className="px-5">Availability</th>
                      <th colSpan="2">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {products.map((product) => {
                      return (
                        <AdminProductItem
                          key={product._id}
                          product={product}
                          fetchData={fetchData}
                        />
                      );
                    })}
                  </tbody>
                </table>
              </Row>
            </Container>
          </div>
        </>
      )}
    </>
  );
}
