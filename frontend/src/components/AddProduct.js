import { Button, Modal, Form } from "react-bootstrap";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function AddProduct({ fetchData }) {
  const [imgUrl, setImgUrl] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const showAddProduct = () => {
    setShowModal(true);
  };
  const closeAddProduct = () => {
    setShowModal(false);
    setName("");
    setDescription("");
    setPrice(0);
  };
  const addProduct = (e) => {
    //prevent submit event's default behavior
    e.preventDefault();

    let token = localStorage.getItem("token");

    fetch(`${process.env.REACT_APP_API_BASE_URL}/products/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: name,
        description: description,
        price: price,
        imgUrl: imgUrl,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.error === "Product already exists.") {
          Swal.fire({
            icon: "error",
            title: "Product already exists.",
          });
        } else if (data.error === "Failed to save the course.") {
          Swal.fire({
            icon: "error",
            title: "Unsuccessful Product Addition",
            text: data.error,
          });
        } else {
          Swal.fire({
            icon: "success",
            title: "Product Added",
          });

          navigate("/products");
          setShowModal(false);
        }
      });

    setName("");
    setDescription("");
    setPrice(0);
    setImgUrl("");
    fetchData();
  };

  return (
    <>
      <div
        style={{ marginRight: "3rem" }}
        className="d-flex justify-content-end"
      >
        <Button
          variant="success"
          size="sm"
          className="mb-3"
          onClick={() => showAddProduct()}
        >
          Add Product
        </Button>
      </div>

      <Modal show={showModal} onHide={closeAddProduct}>
        <Form onSubmit={(e) => addProduct(e)}>
          <Modal.Header closeButton>
            <Modal.Title>Add Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="productName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                placeholder="Enter Product Name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="productDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                placeholder="Enter Product Description"
                type="text"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="productPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control
                placeholder="Enter Product Price"
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="productUrl">
              <Form.Label>Product Image URL</Form.Label>
              <Form.Control
                placeholder="Enter Product image URL"
                type="text"
                required
                value={imgUrl}
                onChange={(e) => setImgUrl(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeAddProduct}>
              Close
            </Button>
            <Button variant="success" type="submit">
              Submit
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
