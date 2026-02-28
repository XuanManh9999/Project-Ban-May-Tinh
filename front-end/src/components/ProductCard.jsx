import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { formatVND } from '../utils/format';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.warning('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
      navigate('/login');
      return;
    }

    setLoading(true);
    const result = await addToCart(product.id, 1);
    setLoading(false);

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const shortSpec = () => {
    if (product.attributes && product.attributes.length > 0) {
      return product.attributes.slice(0, 2).map(a => a.value).join(' | ');
    }
    return product.description;
  };

  return (
    <Link to={`/products/${product.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
        <div className="h-48 bg-gray-200 flex items-center justify-center">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-gray-400">No Image</span>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">{product.name}</h3>

          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{shortSpec()}</p>

          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary-600">
              {formatVND(product.price)}
            </span>

            <button
              onClick={handleAddToCart}
              disabled={loading || product.stockQuantity === 0}
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition ${
                product.stockQuantity === 0
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              }`}
            >
              <FaShoppingCart />
              <span>{loading ? 'Đang thêm...' : 'Thêm'}</span>
            </button>
          </div>

          <div className="mt-2">
            {product.stockQuantity > 0 ? (
              <span className="text-sm text-green-600">Còn {product.stockQuantity} sản phẩm</span>
            ) : (
              <span className="text-sm text-red-600">Hết hàng</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
