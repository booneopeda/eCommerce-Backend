import Cart from "../assets/images/carticon.png";
import "./CartSummary.css";
import { Button, Modal, Form } from "react-bootstrap";
import { useState, useContext, useEffect } from "react";
import CartItem from "./CartItem";
import { Table } from "react-bootstrap";
import UserContext from "../UserContext";
import Swal from "sweetalert2";

export default function CartSummary({
  productsData,
  fetchData,
  showCart,
  setShowCart,
  isEmpty,
  setIsEmpty,
  fetchProductsData,
}) {
  const { user, retrieveUserDetails } = useContext(UserContext);

  const [cartData, setCartData] = useState([]);
  const [cart, setCart] = useState([]);

  function increment(productId, price, quantity) {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/update-cart-quantity`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        cartItems: [
          {
            productId: productId,
            quantity: quantity + 1,
            subtotal: price * (quantity + 1),
          },
        ],
      }),
      user: JSON.stringify(user),
    })
      .then((res) => res.json())
      .then((data) => {
        fetchCartData();
      });
  }
  function decrement(productId, price, quantity) {
    if (quantity >= 2) {
      fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/update-cart-quantity`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          cartItems: [
            {
              productId: productId,
              quantity: quantity - 1,
              subtotal: price * (quantity - 1),
            },
          ],
        }),
        user: JSON.stringify(user),
      })
        .then((res) => res.json())
        .then((data) => {
          fetchCartData();
        });
    } else {
      return null;
    }
  }

  function deleteCartItem(productId) {
    fetch(
      `${process.env.REACT_APP_API_BASE_URL}/cart/${productId}/remove-from-cart`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
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
              setIsEmpty(true);
            } else {
              setIsEmpty(false);
            }
            fetchCartData();
          });
      });
  }

  function handleCheckOut() {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/orders/checkout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Checkout successful") {
          Swal.fire({
            title: "Check Out Successful",
            icon: "success",
            confirmButtonColor: "#2d1b07",
          });
          fetchProductsData();
          clearCart();
          setShowCart(false);
          setIsEmpty(true);
        }
      });
  }

  function clearCart() {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/clear-cart`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    setIsEmpty(true);
  }

  function handleShowCart() {
    setShowCart(() => true);
    fetchCartData();
  }

  function handleCloseCart() {
    setShowCart(() => false);
    fetchProductsData();
  }

  function fetchCartData() {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/add-to-cart`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setCart(data.cart[0]);
        setCartData(
          data.cart[0].cartItems.map((product) => {
            let productInfo = productsData.filter((productItem) => {
              return productItem._id === product.productId;
            });

            return (
              <CartItem
                key={product._id}
                cart={product}
                product={productInfo}
                increment={increment}
                decrement={decrement}
                deleteCartItem={deleteCartItem}
              />
            );
          })
        );
      });
  }
  useEffect(() => {
    fetchData();
    fetchProductsData();
  }, []);

  return (
    <>
      {isEmpty ? null : (
        <img
          onClick={handleShowCart}
          src={Cart}
          alt="Cart"
          className="img-fluid"
          id="cart-image"
        />
      )}
      <Modal show={showCart} onHide={handleCloseCart} size="lg">
        <Form
          onSubmit={(e) => handleCheckOut(e)}
          // style={{ backgroundColor: "rgba(229, 199, 171, .7)" }}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <h1 className="text-center">Cart Summary</h1>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Table className="text-start" hover>
              <thead>
                <tr
                  id="table-row"
                  style={{ backgroundColor: "rgba(229, 199, 171, .7)" }}
                >
                  <th style={{ paddingLeft: "10px" }}>Qty</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>{cartData}</tbody>
            </Table>
          </Modal.Body>
          <Modal.Footer>
            <div className="container">
              <div className="d-flex justify-content-between">
                <h5 className="">
                  Total Price:{` P ${Number(cart.totalPrice).toFixed(2)}`}
                </h5>
                {isEmpty ? (
                  <Button
                    disabled
                    variant="danger"
                    type="button"
                    onClick={() => handleCheckOut()}
                  >
                    Check Out
                  </Button>
                ) : (
                  <Button
                    variant="success"
                    type="button"
                    onClick={() => handleCheckOut()}
                  >
                    Check Out
                  </Button>
                )}
              </div>
            </div>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
