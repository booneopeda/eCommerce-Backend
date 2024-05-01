import {
  Button,
  Modal,
  Form,
  Card,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import "./ProductDetailsView.css";
import UserContext from "../UserContext";
import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

export default function ProductDetailsView({
  setShowDetails,
  showDetails,
  name,
  description,
  price,
  imgUrl,
  productId,
  showCart,
  setShowCart,
  fetchData,
  isEmpty,
  setIsEmpty,
  fetchProductsData,
}) {
  const { user } = useContext(UserContext);
  const [quantity, setQuantity] = useState(1);

  const closeProductDetails = () => {
    setShowDetails(false);
    setQuantity(1);
  };

  function increment(quantity) {
    setQuantity(() => quantity + 1);
  }
  function decrement(quantity) {
    if (quantity > 1) {
      setQuantity(() => quantity - 1);
    }
  }

  function clearCart() {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/clear-cart`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  }

  const checkOut = (e, name, description, price, user, productId) => {
    e.preventDefault();

    fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/add-to-cart`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (
          data.message === "No cart found" ||
          data.cart[0].cartItems.length === 0
        ) {
          fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/add-to-cart`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              cartItems: [
                {
                  productId: productId,
                  quantity: quantity,
                  subtotal: price * quantity,
                },
              ],
              totalPrice: (price * quantity).toFixed(2),
            }),
            user: JSON.stringify(user),
          })
            .then((res) => res.json())
            .then((data) => {
              fetch(`${process.env.REACT_APP_API_BASE_URL}/orders/checkout`, {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              })
                .then((res) => res.json())
                .then((data) => {
                  fetchProductsData();
                  if (data.message === "Checkout successful") {
                    Swal.fire({
                      title: "Check Out Successful",
                      icon: "success",
                      confirmButtonColor: "#2d1b07",
                    });

                    clearCart();
                    setShowDetails(false);
                    setQuantity(1);
                  }
                });
            });
        } else {
          setShowDetails(false);
          setShowCart(true);
        }
      });
  };

  const addToCart = (user, productId, quantity, price) => {
    console.log(user);
    fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/add-to-cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        cartItems: [
          {
            productId: productId,
            quantity: quantity,
            subtotal: price * quantity,
          },
        ],
        totalPrice: price * quantity,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Cart successfully created") {
          Swal.fire({
            title: "Added to Cart",
            icon: "success",
            confirmButtonColor: "#2d1b07",
          });
        } else if (data.message === "Cart updated") {
          Swal.fire({
            title: "Added to Cart",
            icon: "success",
            confirmButtonColor: "#2d1b07",
          });
        }
        setShowDetails(false);
        setQuantity(1);
        setIsEmpty(false);
      });
  };

  useEffect(() => {
    // fetchProductsData();
    // fetchData();
  }, []);

  return (
    <Modal
      show={showDetails}
      onHide={closeProductDetails}
      size="lg"
      style={{ overflow: "hidden" }}
    >
      <Form
        onSubmit={(e) => checkOut(e, name, description, price, user, productId)}
        style={{
          backgroundColor: "rgba(229, 199, 171, .7)",
          border: "solid thin",
          borderRadius: "8px",
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <h1 className="text-center">{name}</h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container fluid>
            <Row>
              <Col xs={6} md={7}>
                <Card.Img
                  variant="top"
                  src={imgUrl}
                  alt="productPhoto"
                  style={{ width: "25rem" }}
                  className="img-fluid"
                />
              </Col>
              <Col xs={6} md={5}>
                <div>
                  <p style={{ fontSize: "13px" }}>
                    <strong>Description:</strong> {description}
                  </p>
                  <div className="mb-2">
                    <span className="me-2">
                      <strong>Qty: </strong>
                    </span>
                    <button
                      onClick={() => decrement(quantity)}
                      type="button"
                      style={{
                        backgroundColor: "rgba(229, 199, 171, 1)",
                        border: "solid thin black ",
                        fontSize: "15px",
                        paddingLeft: "8px",
                        paddingRight: "8px",
                      }}
                    >
                      -
                    </button>
                    <span style={{ paddingLeft: "20px", paddingRight: "20px" }}>
                      {`${quantity}`}
                    </span>
                    <button
                      onClick={() => increment(quantity)}
                      type="button"
                      style={{
                        backgroundColor: "rgba(229, 199, 171, 1)",
                        border: "solid thin ",
                        fontSize: "15px",
                      }}
                    >
                      +
                    </button>
                  </div>
                  <h4 className="mt-3">
                    <strong>PRICE: </strong>&#8369;{" "}
                    {`${Number(price * quantity).toFixed(2)}`}
                  </h4>
                </div>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          {user.id ? (
            <div className="d-flex justify-content-center">
              <Button
                variant="secondary"
                onClick={() => addToCart(user, productId, quantity, price)}
                className="me-3"
              >
                Add to Cart
              </Button>
              {isEmpty ? (
                <Button variant="success" type="submit">
                  Buy Now
                </Button>
              ) : null}
            </div>
          ) : (
            <Link className="login-link" to={"/login"}>
              <Button variant="success" type="button">
                Login to Buy
              </Button>
            </Link>
          )}
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
