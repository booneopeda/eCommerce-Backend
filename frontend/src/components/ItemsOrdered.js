import { useEffect, useState } from "react";

function ItemsOrdered({ activeProducts, itemsOrdered }) {
  const [itemsBought, setItemsBought] = useState([]);

  useEffect(() => {
    let itemsPurchased = [];
    itemsOrdered.forEach((item) => {
      activeProducts.map((product) => {
        if (item.productId === product._id) {
          return itemsPurchased.push({
            name: product.name,
            quantity: item.quantity,
          });
        }
        setItemsBought(itemsPurchased);
      });
    });
  }, [activeProducts, itemsOrdered]);

  return (
    <>
      {itemsBought.map((item) => {
        return (
          <li key={item.name}>{`${item.name}   Qty: ${item.quantity}`}</li>
        );
      })}
    </>
  );
}

export default ItemsOrdered;
