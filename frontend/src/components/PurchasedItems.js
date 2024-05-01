import { useEffect, useState } from "react";

function PurchasedItems({
  purchasedItemsData,
  userData,
  orderData,
  fetchData,
  allProductsData,
}) {
  const [itemsBought, setItemsBought] = useState([]);

  useEffect(() => {
    let itemsPurchased = [];
    purchasedItemsData?.forEach((item) => {
      allProductsData.products?.map((product) => {
        if (item.productId === product._id) {
          return itemsPurchased.push({
            name: product.name,
            quantity: item.quantity,
          });
        }
        setItemsBought(itemsPurchased);
      });
    });
  }, [purchasedItemsData, fetchData]);

  return (
    <div>
      {itemsBought.map((item) => {
        return (
          <li key={item.name}>{`${item.name}   Qty: ${item.quantity}`}</li>
        );
      })}
    </div>
  );
}

export default PurchasedItems;
