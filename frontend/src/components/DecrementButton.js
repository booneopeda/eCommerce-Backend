export default function DecrementButton({
  decrement,
  productId,
  price,
  quantity,
}) {
  return (
    <button
      className="border thin"
      type="button"
      onClick={() => decrement(productId, price, quantity)}
    >
      -
    </button>
  );
}
