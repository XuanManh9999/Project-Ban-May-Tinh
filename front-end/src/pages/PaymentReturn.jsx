import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { paymentAPI } from '../services/api';
import { toast } from 'react-toastify';
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';

const PaymentReturn = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing'); // processing, success, failed
  const [orderNumber, setOrderNumber] = useState('');

  useEffect(() => {
    verifyPayment();
  }, []);

  const verifyPayment = async () => {
    try {
      // Convert URLSearchParams to object
      const params = {};
      for (const [key, value] of searchParams.entries()) {
        params[key] = value;
      }

      // Call backend API to verify payment
      const response = await paymentAPI.verifyVNPay(params);
      
      if (response.data.success && response.data.data.success) {
        setStatus('success');
        setOrderNumber(response.data.data.orderNumber);
        toast.success('Thanh toán thành công!');
        
        // Redirect to orders page after 3 seconds
        setTimeout(() => {
          navigate('/orders');
        }, 3000);
      } else {
        setStatus('failed');
        setOrderNumber(response.data.data.orderNumber);
        toast.error('Thanh toán thất bại!');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      setStatus('failed');
      toast.error('Có lỗi xảy ra khi xác thực thanh toán');
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
        {status === 'processing' && (
          <>
            <FaSpinner className="text-6xl text-blue-500 mx-auto mb-4 animate-spin" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Đang xác thực thanh toán...
            </h2>
            <p className="text-gray-600">Vui lòng đợi trong giây lát</p>
          </>
        )}

        {status === 'success' && (
          <>
            <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Thanh toán thành công!
            </h2>
            <p className="text-gray-600 mb-4">
              Đơn hàng <span className="font-semibold">{orderNumber}</span> đã được thanh toán.
            </p>
            <p className="text-sm text-gray-500">
              Đang chuyển hướng đến trang đơn hàng...
            </p>
          </>
        )}

        {status === 'failed' && (
          <>
            <FaTimesCircle className="text-6xl text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Thanh toán thất bại!
            </h2>
            {orderNumber && (
              <p className="text-gray-600 mb-4">
                Đơn hàng <span className="font-semibold">{orderNumber}</span> chưa được thanh toán.
              </p>
            )}
            <button
              onClick={() => navigate('/orders')}
              className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Xem đơn hàng
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentReturn;

