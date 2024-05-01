import { Button } from "react-bootstrap";
import Swal from "sweetalert2";

export default function ArchiveProduct({ product, isActive, fetchData }) {
  const archiveToggle = (productId) => {
    fetch(
      `${process.env.REACT_APP_API_BASE_URL}/products/${productId}/archive`,
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
        console.log(data);

        if (data.message === "Product archived successfully") {
          Swal.fire({
            title: "Success",
            icon: "success",
            text: "Product successfully disabled",
            confirmButtonColor: "#2d1b07",
          });

          fetchData();
        } else {
          Swal.fire({
            title: "Something went wrong!",
            icon: "error",
            text: "Please try again.",
            confirmButtonColor: "#2d1b07",
          });

          fetchData();
        }
      });
  };

  const activateToggle = (productId) => {
    fetch(
      `${process.env.REACT_APP_API_BASE_URL}/products/${productId}/activate`,
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
        console.log(data);

        if (data.message === "Product activated successfully") {
          Swal.fire({
            title: "Success",
            icon: "success",
            text: "Product successfully enabled",
            confirmButtonColor: "#2d1b07",
          });

          fetchData();
        } else {
          Swal.fire({
            title: "Something went wrong!",
            icon: "error",
            text: "Please try again.",
            confirmButtonColor: "#2d1b07",
          });

          fetchData();
        }
      });
  };

  return (
    <>
      {isActive ? (
        <Button
          variant="danger"
          size="sm"
          className="mx-2 my-2"
          onClick={() => archiveToggle(product)}
        >
          Archive
        </Button>
      ) : (
        <Button
          variant="success"
          size="sm"
          className="mx-2 my-2"
          onClick={() => activateToggle(product)}
        >
          Activate
        </Button>
      )}
    </>
  );
}
