import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Cart = () => {
  const { cart, updateCartItem, removeFromCart, loading } = useCart();
  const navigate = useNavigate();

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    const result = await updateCartItem(itemId, newQuantity);
    if (!result.success) {
      toast.error(result.message || 'Không thể cập nhật số lượng');
    }
  };

  const handleRemove = async (itemId, productName) => {
    if (!window.confirm(`Bạn có chắc muốn xóa "${productName}" khỏi giỏ hàng?`)) {
      return;
    }
    
    const result = await removeFromCart(itemId);
    if (result.success) {
      toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
    } else {
      toast.error(result.message || 'Không thể xóa sản phẩm');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Giỏ hàng trống</h2>
        <Link
          to="/products"
          className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
        >
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Giỏ hàng</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md">
            {cart.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 border-b last:border-b-0"
              >
                <img
                  src={item.productImage || '/placeholder.png'}
                  alt={item.productName}
                  className="w-20 h-20 object-cover rounded"
                />
                
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{item.productName}</h3>
                  <p className="text-primary-600 font-semibold">
                    {item.price.toLocaleString('vi-VN')}đ
                  </p>
                  <p className="text-sm text-gray-500">
                    Còn {item.stockQuantity} sản phẩm
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center border border-gray-300 rounded">
                  <button
                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                    className="px-3 py-1 hover:bg-gray-100"
                  >
                    <FaMinus size={12} />
                  </button>
                  <span className="px-4 py-1 border-x border-gray-300">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.stockQuantity}
                    className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50"
                  >
                    <FaPlus size={12} />
                  </button>
                </div>

                {/* Subtotal */}
                <div className="text-right">
                  <p className="font-semibold text-gray-800">
                    {item.subtotal.toLocaleString('vi-VN')}đ
                  </p>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemove(item.id, item.productName)}
                  className="text-red-500 hover:text-red-700 p-2"
                  title="Xóa sản phẩm"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Tóm tắt đơn hàng</h2>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Tổng sản phẩm:</span>
                <span className="font-semibold">{cart.totalItems}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Tổng cộng:</span>
                <span className="text-primary-600">
                  {cart.totalAmount.toLocaleString('vi-VN')}đ
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold"
            >
              Tiến hành thanh toán
            </button>

            <Link
              to="/products"
              className="block text-center mt-4 text-primary-600 hover:text-primary-700"
            >
              ← Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

