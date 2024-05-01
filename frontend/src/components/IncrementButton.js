export default function IncrementButton({
  increment,
  productId,
  price,
  quantity,
}) {
  return (
    <button
      className="border thin"
      type="button"
      onClick={() => increment(productId, price, quantity)}
    >
      +
    </button>
  );
}
