import EditProduct from "./EditProduct";
import ArchiveProduct from "./ArchiveProduct";

export default function AdminProductItem({ product, fetchData }) {
  return (
    <tr style={{ border: "solid thin black" }}>
      <td className="px-3 py-3">{product.name}</td>
      <td>{product.description}</td>
      <td className="text-center">
        &#8369;{` ${Number(product.price).toFixed(2)}`}
      </td>
      <td
        className={
          product.isActive
            ? " text-center text-white"
            : " text-center  text-white"
        }
      >
        {product.isActive ? "Available" : "Unavailable"}
      </td>
      <td>
        <EditProduct product={product._id} fetchData={fetchData} />
      </td>
      <td>
        <ArchiveProduct
          product={product._id}
          isActive={product.isActive}
          fetchData={fetchData}
        />
      </td>
    </tr>
  );
}
