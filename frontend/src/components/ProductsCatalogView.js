import { useEffect, useContext } from "react";
import ProductCard from "./ProductCard";
import UserContext from "../UserContext.js";

function ProductsCatalogView({
  productsData,
  fetchData,
  showCart,
  setShowCart,
  isEmpty,
  setIsEmpty,
  fetchProductsData,
}) {
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user.id !== null) {
      fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/add-to-cart`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
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
        });
    }
  }, []);

  return (
    <>
      <h1
        className="text-center text-white"
        style={{ marginTop: "3rem", marginBottom: "5rem" }}
      >
        Products Catalog
      </h1>
      <div className="d-flex flex-wrap container-fluid justify-content-center pb-5">
        {productsData.map((product) => {
          return (
            <ProductCard
              key={product._id}
              product={product}
              showCart={showCart}
              setShowCart={setShowCart}
              fetchData={fetchData}
              isEmpty={isEmpty}
              setIsEmpty={setIsEmpty}
              fetchProductsData={fetchProductsData}
            />
          );
        })}
      </div>
    </>
  );
}

export default ProductsCatalogView;
