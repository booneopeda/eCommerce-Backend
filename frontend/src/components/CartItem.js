import DecrementButton from "./DecrementButton";
import IncrementButton from "./IncrementButton";
import RemoveCartItem from "./RemoveCartItem";
import { Table } from "react-bootstrap";

export default function CartItem({
  product,
  cart,
  increment,
  decrement,
  deleteCartItem,
}) {
  return (
    <>
      <tr>
        <td>
          <div className="container-fluid me-5">
            <DecrementButton
              decrement={decrement}
              productId={product[0]._id}
              price={product[0].price}
              quantity={cart.quantity}
            />
            <span style={{ paddingLeft: "7px", paddingRight: "7px" }}>
              {cart.quantity}
            </span>
            <IncrementButton
              increment={increment}
              productId={product[0]._id}
              price={product[0].price}
              quantity={cart.quantity}
            />
          </div>
        </td>
        <td>
          <span>{product[0].name}</span>
        </td>
        <td>
          <span>{`Php. ${Number(cart.subtotal).toFixed(2)}`}</span>
        </td>
        <td>
          <RemoveCartItem
            deleteCartItem={deleteCartItem}
            productId={product[0]._id}
          />
        </td>
      </tr>
    </>
  );
}
