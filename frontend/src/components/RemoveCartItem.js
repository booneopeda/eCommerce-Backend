export default function RemoveCartItem({ deleteCartItem, productId }) {
  return (
    <button
      onClick={() => deleteCartItem(productId)}
      className="border thin"
      type="button"
    >
      x
    </button>
  );
}
