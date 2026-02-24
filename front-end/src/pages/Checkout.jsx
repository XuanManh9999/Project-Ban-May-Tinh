import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderAPI, paymentAPI, promotionAPI } from '../services/api';
import { toast } from 'react-toastify';
import AddressForm from '../components/AddressForm';

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [promotionCode, setPromotionCode] = useState('');
  const [promotion, setPromotion] = useState(null);
  const [addressData, setAddressData] = useState(null);
  const [formData, setFormData] = useState({
    shippingAddress: '',
    phoneNumber: '',
    note: '',
    paymentMethod: 'COD',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddressChange = (data) => {
    setAddressData(data);
    setFormData({
      ...formData,
      shippingAddress: data.fullAddress || '',
    });
  };

  const handleCheckPromotion = async () => {
    if (!promotionCode.trim()) return;
    
    try {
      const response = await promotionAPI.getByCode(promotionCode);
      setPromotion(response.data.data);
      toast.success('Áp dụng mã khuyến mãi thành công!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Mã khuyến mãi không hợp lệ');
      setPromotion(null);
    }
  };

  const calculateDiscount = () => {
    if (!promotion || !cart) return 0;
    
    let discount = 0;
    if (promotion.discountType === 'PERCENTAGE') {
      discount = cart.totalAmount * (promotion.discountValue / 100);
    } else {
      discount = promotion.discountValue;
    }
    
    if (promotion.maxDiscountAmount && discount > promotion.maxDiscountAmount) {
      discount = promotion.maxDiscountAmount;
    }
    
    return discount;
  };

  const finalAmount = cart ? cart.totalAmount - calculateDiscount() : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    
    // Validate address
    if (!addressData || !addressData.fullAddress) {
      toast.error('Vui lòng nhập đầy đủ địa chỉ giao hàng');
      setErrors({ shippingAddress: 'Vui lòng chọn địa chỉ đầy đủ' });
      return;
    }

    if (!formData.phoneNumber) {
      toast.error('Vui lòng nhập số điện thoại');
      setErrors({ phoneNumber: 'Số điện thoại không được để trống' });
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        ...formData,
        shippingAddress: addressData.fullAddress,
        promotionCode: promotion?.code || null,
      };

      const response = await orderAPI.create(orderData);
      const order = response.data.data;

      // If payment method is VNPay, redirect to payment
      if (formData.paymentMethod === 'VNPAY') {
        const paymentResponse = await paymentAPI.createVNPay(order.id);
        window.location.href = paymentResponse.data.data.paymentUrl;
      } else {
        // For COD, clear cart and redirect to orders
        await clearCart();
        toast.success('Đặt hàng thành công!');
        setTimeout(() => navigate('/orders'), 1000);
      }
    } catch (error) {
      const errorData = error.response?.data;
      if (errorData?.data && typeof errorData.data === 'object') {
        setErrors(errorData.data);
      } else {
        toast.error(errorData?.message || 'Đã có lỗi xảy ra');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Giỏ hàng trống</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Thanh toán</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Thông tin giao hàng</h2>

            <div className="space-y-4">
              {/* Address Form with Provinces API */}
              <AddressForm
                value={addressData}
                onChange={handleAddressChange}
                error={errors.shippingAddress}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại *
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                    errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ghi chú
                </label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phương thức thanh toán *
                </label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="COD">Thanh toán khi nhận hàng (COD)</option>
                  <option value="VNPAY">Thanh toán qua VNPay</option>
                </select>
              </div>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Đơn hàng</h2>

            <div className="space-y-2 mb-4 pb-4 border-b">
              {cart.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.productName} x {item.quantity}
                  </span>
                  <span className="font-semibold">
                    {item.subtotal.toLocaleString('vi-VN')}đ
                  </span>
                </div>
              ))}
            </div>

            {/* Promotion Code */}
            <div className="mb-4 pb-4 border-b">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mã khuyến mãi
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promotionCode}
                  onChange={(e) => setPromotionCode(e.target.value.toUpperCase())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="Nhập mã"
                />
                <button
                  type="button"
                  onClick={handleCheckPromotion}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
                >
                  Áp dụng
                </button>
              </div>
              {promotion && (
                <p className="text-sm text-green-600 mt-2">
                  Giảm {promotion.discountValue}
                  {promotion.discountType === 'PERCENTAGE' ? '%' : 'đ'}
                </p>
              )}
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Tạm tính:</span>
                <span className="font-semibold">
                  {cart.totalAmount.toLocaleString('vi-VN')}đ
                </span>
              </div>
              {promotion && (
                <div className="flex justify-between text-green-600">
                  <span>Giảm giá:</span>
                  <span>-{calculateDiscount().toLocaleString('vi-VN')}đ</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Tổng cộng:</span>
                <span className="text-primary-600">
                  {finalAmount.toLocaleString('vi-VN')}đ
                </span>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold disabled:bg-gray-400"
            >
              {loading ? 'Đang xử lý...' : 'Đặt hàng'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

