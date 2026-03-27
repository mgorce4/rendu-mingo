import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

function CartButton() {
  const { getCartCount } = useCart();
  const cartCount= getCartCount();

  const navigate = useNavigate();

  const handleShowCart = () => {
    navigate("/cart");
  };
  return (
    <div className="relative flex">
      <button
        onClick={handleShowCart}
        className="relative hover:text-gray-300 transition"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>

        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
            {cartCount}
          </span>
        )}
      </button>

      
    </div>
  );
}

export default CartButton;
