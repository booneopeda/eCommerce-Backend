import { Button, Modal, Form } from "react-bootstrap";
import { useState } from "react";
import Swal from "sweetalert2";

export default function EditProduct({ product, fetchData }) {
  // State for courseId for the fetch URL
  const [productId, setProductId] = useState("");
  //   Form state
  // ADd state for the forms inpout of course
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imgUrl, setImgUrl] = useState("");

  const [showEdit, setShowEdit] = useState(false);

  const openEdit = (productId) => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        setProductId(data.product._id);
        setName(data.product.name);
        setDescription(data.product.description);
        setPrice(data.product.price);
        setImgUrl(data.product.imgUrl);
      });
    //   Then, open the modal
    setShowEdit(true);
  };

  const closeEdit = () => {
    setShowEdit(false);
    setName("");
    setDescription("");
    setPrice(0);
    setImgUrl("");
  };

  const EditProduct = (e, productId) => {
    e.preventDefault();

    fetch(
      `${process.env.REACT_APP_API_BASE_URL}/products/${productId}/update`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name,
          description,
          price,
          imgUrl,
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.message === "Product updated  successfully") {
          Swal.fire({
            title: "Success",
            icon: "success",
            text: "Product successfully updated",
            confirmButtonColor: "#2d1b07",
          });
          closeEdit();
        } else {
          Swal.fire({
            title: "Error!",
            icon: "error",
            text: "Please try again",
            confirmButtonColor: "#2d1b07",
          });
          closeEdit();
        }
        fetchData();
      });
  };

  return (
    <>
      <Button
        className="mx-2"
        variant="success"
        size="sm"
        onClick={() => openEdit(product)}
      >
        Edit
      </Button>

      {/* EDIT MODAL */}
      <Modal show={showEdit} onHide={closeEdit}>
        <Form onSubmit={(e) => EditProduct(e, productId)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="productName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="productDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="productPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="productImgUrl">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="text"
                required
                value={imgUrl}
                onChange={(e) => setImgUrl(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeEdit}>
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
