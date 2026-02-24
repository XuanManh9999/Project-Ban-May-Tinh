import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderAPI } from '../services/api';
import { toast } from 'react-toastify';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await orderAPI.getById(id);
      setOrder(response.data.data);
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Không tìm thấy đơn hàng');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-blue-100 text-blue-800',
      PROCESSING: 'bg-purple-100 text-purple-800',
      SHIPPED: 'bg-indigo-100 text-indigo-800',
      DELIVERED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="container mx-auto px-4 py-12">
      <button
        onClick={() => navigate('/orders')}
        className="mb-4 text-primary-600 hover:text-primary-700"
      >
        ← Quay lại danh sách đơn hàng
      </button>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Đơn hàng #{order.orderNumber}
            </h1>
            <p className="text-gray-600">
              Đặt ngày: {new Date(order.createdAt).toLocaleString('vi-VN')}
            </p>
          </div>
          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
              order.status
            )}`}
          >
            {order.status}
          </span>
        </div>

        {/* Order Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pb-6 border-b">
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Thông tin giao hàng</h3>
            <p className="text-gray-600">{order.shippingAddress}</p>
            <p className="text-gray-600 mt-1">SĐT: {order.phoneNumber}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Thanh toán</h3>
            <p className="text-gray-600">
              Phương thức: {order.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng' : 'VNPay'}
            </p>
            <p className="text-gray-600">
              Trạng thái: {order.paymentStatus === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}
            </p>
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">Sản phẩm</h3>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 pb-4 border-b">
                <img
                  src={item.productImage || '/placeholder.png'}
                  alt={item.productName}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{item.productName}</h4>
                  <p className="text-gray-600">
                    {item.price.toLocaleString('vi-VN')}đ x {item.quantity}
                  </p>
                </div>
                <div className="text-right font-semibold">
                  {item.subtotal.toLocaleString('vi-VN')}đ
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Total */}
        <div className="border-t pt-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Tạm tính:</span>
              <span className="font-semibold">
                {order.totalAmount.toLocaleString('vi-VN')}đ
              </span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Giảm giá:</span>
                <span>-{order.discountAmount.toLocaleString('vi-VN')}đ</span>
              </div>
            )}
            <div className="flex justify-between text-xl font-bold pt-2 border-t">
              <span>Tổng cộng:</span>
              <span className="text-primary-600">
                {order.finalAmount.toLocaleString('vi-VN')}đ
              </span>
            </div>
          </div>
        </div>

        {order.note && (
          <div className="mt-6 pt-6 border-t">
            <h3 className="font-semibold text-gray-800 mb-2">Ghi chú</h3>
            <p className="text-gray-600">{order.note}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;

