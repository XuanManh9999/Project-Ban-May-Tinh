import React, { useState, useEffect } from 'react';
import { orderAPI } from '../../services/api';
import { toast } from 'react-toastify';
import Pagination from '../../components/admin/Pagination';
import AdminLayout from '../../components/admin/AdminLayout';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination & filters
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [currentPage, pageSize]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getAllOrders(currentPage, pageSize);
      const page = response.data.data;
      setOrders(page.content);
      setTotalPages(page.totalPages);
      setTotalElements(page.totalElements);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, status) => {
    try {
      await orderAPI.updateStatus(orderId, status);
      toast.success('Cập nhật trạng thái thành công');
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const statusOptions = [
    'PENDING',
    'CONFIRMED',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
  ];

  const statusTexts = {
    PENDING: 'Chờ xác nhận',
    CONFIRMED: 'Đã xác nhận',
    PROCESSING: 'Đang xử lý',
    SHIPPED: 'Đang giao',
    DELIVERED: 'Đã giao',
    CANCELLED: 'Đã hủy',
  };

  const filteredOrders = orders.filter((order) => {
    const matchStatus = statusFilter ? order.status === statusFilter : true;
    const matchPayment = paymentFilter ? order.paymentStatus === paymentFilter : true;
    return matchStatus && matchPayment;
  });

  return (
    <AdminLayout title="Quản lý đơn hàng">
      <div className="max-w-6xl mx-auto">
      {/* Filter bar */}
      <div className="bg-white rounded-lg shadow p-4 mb-6 flex flex-wrap gap-4 items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">
            Tổng cộng: <span className="font-semibold">{totalElements}</span> đơn hàng
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="">Tất cả trạng thái</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {statusTexts[status]}
              </option>
            ))}
          </select>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="">Tất cả thanh toán</option>
            <option value="PAID">Đã thanh toán</option>
            <option value="PENDING">Chưa thanh toán</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Mã đơn
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Khách hàng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Tổng tiền
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Thanh toán
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Ngày đặt
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  Không có đơn hàng phù hợp bộ lọc
                </td>
              </tr>
            ) : (
            filteredOrders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 font-medium">{order.orderNumber}</td>
                <td className="px-6 py-4">{order.userName}</td>
                <td className="px-6 py-4">{order.finalAmount.toLocaleString()}đ</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.paymentStatus === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={order.status}
                    onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                    className="px-2 py-1 border rounded"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {statusTexts[status]}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4">
                  {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>Hiển thị</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(0);
            }}
            className="px-2 py-1 border border-gray-300 rounded"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span>đơn / trang</span>
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
      </div>
    </AdminLayout>
  );
};

export default Orders;

