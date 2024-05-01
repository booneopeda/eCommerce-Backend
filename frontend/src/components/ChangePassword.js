import { Button, Modal, Form } from "react-bootstrap";
import { useState } from "react";
import Swal from "sweetalert2";

export default function ChangePassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showEdit, setShowEdit] = useState(false);

  const closeEdit = () => {
    setShowEdit(false);
    setPassword("");
    setConfirmPassword("");
  };
  const openEdit = () => {
    setShowEdit(true);
  };

  const changePassword = (e) => {
    e.preventDefault();

    fetch(`${process.env.REACT_APP_API_BASE_URL}/users/update-password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        newPassword: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Password updated successfully") {
          Swal.fire({
            title: "Success",
            icon: "success",
            text: "Password updated successfully",
            confirmButtonColor: "#2d1b07",
          });
          closeEdit();
        } else {
          Swal.fire({
            title: "Change Password Failed",
            icon: "error",
            text: "Please try again",
            confirmButtonColor: "#2d1b07",
          });
          closeEdit();
        }
      });
  };

  return (
    <>
      <Button className="mt-3" variant="success" size="sm" onClick={openEdit}>
        Change Password
      </Button>

      {/* EDIT MODAL */}
      <Modal show={showEdit} onHide={closeEdit}>
        <Form
          onSubmit={(e) => {
            changePassword(e);
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Change User Password</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="productName">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="productDescription">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeEdit}>
              Close
            </Button>
            {password !== "" &&
            confirmPassword !== "" &&
            password === confirmPassword ? (
              <Button variant="success" type="submit">
                Submit
              </Button>
            ) : (
              <Button variant="danger" disabled>
                Submit
              </Button>
            )}
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
