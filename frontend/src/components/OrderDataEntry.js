import { useEffect, useState } from "react";
import PurchasedItems from "./PurchasedItems";

function OrderDataEntry({ orderData, userData, fetchData, allProductsData }) {
  const [orders, setOrders] = useState([]);
  const [displayOrders, setDisplayOrders] = useState([]);

  useEffect(() => {
    let filteredOrders = [];
    orderData.orders.map((order) => {
      if (userData._id === order.userId) {
        filteredOrders.push(order);
      }
      setOrders(filteredOrders);
      return filteredOrders;
    });
    setDisplayOrders(
      orders?.map((order) => {
        return (
          <div className="mt-4">
            <h8>
              Purchased on{" "}
              {`${order.orderedOn.toString().slice(0, 10)} - ORDER ID# ${
                order._id
              }`}
            </h8>
            <ul>
              <PurchasedItems
                key={userData._id}
                purchasedItemsData={order.productsOrdered}
                userData={userData}
                orderData={orderData}
                fetchData={fetchData}
                allProductsData={allProductsData}
              />
            </ul>
            <h8> Price: {`P ${Number(order.totalPrice).toFixed(2)}`}</h8>
          </div>
        );
      })
    );
    console.log("orderdataentry useEffect");
  }, [orderData, userData]);

  return <>{displayOrders}</>;
}

export default OrderDataEntry;
