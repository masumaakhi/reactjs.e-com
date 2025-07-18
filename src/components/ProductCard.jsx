import { useCart } from "../context/CartContext";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProductCard = ({ product }) => {
  const { dispatch } = useCart();
  const navigate = useNavigate();
  const auth = getAuth();

  const addToCartHandler = () => {
    dispatch({
      type: "ADD_TO_CART",
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image?.[0],
      },
    });
    toast.success("Item added to cart!");
  };

  const handleAddToCart = () => {
    const user = auth.currentUser;

    if (!user) {
      toast.warning("Please sign in to add items to your cart.");
      navigate("/signin");
      return;
    }

    addToCartHandler();
  };

  return (
    <div className="bg-slate-900 rounded-lg shadow hover:shadow-lg transition duration-300 overflow-hidden border border-gray-500">
      {/* Image */}
      <img
        src={product.image?.[0] || "/placeholder.jpg"}
        alt={product.name}
        className="w-full h-52 object-contain bg-slate-800 p-4"
      />

      {/* Content */}
      <div className="p-4 flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-gray-200">{product.name}</h2>
        <p className="text-sm text-gray-200">
          {product.description.split(" ").slice(0, 8).join(" ")}...
        </p>
        {/* Price */}
        <div className="text-xl font-bold text-green-600">${product.price}</div>

        <button
          onClick={handleAddToCart}
          className="mt-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded transition"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
