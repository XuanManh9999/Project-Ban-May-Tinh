import React, { useState, useEffect } from 'react';
import { promotionAPI } from '../../services/api';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Pagination from '../../components/admin/Pagination';
import AdminLayout from '../../components/admin/AdminLayout';

const Promotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    discountType: 'PERCENTAGE',
    discountValue: '',
    minOrderAmount: '',
    maxDiscountAmount: '',
    startDate: '',
    endDate: '',
    usageLimit: 0,
    active: true,
  });

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      const response = await promotionAPI.getAll();
      setPromotions(response.data.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        discountValue: parseFloat(formData.discountValue),
        minOrderAmount: formData.minOrderAmount ? parseFloat(formData.minOrderAmount) : null,
        maxDiscountAmount: formData.maxDiscountAmount ? parseFloat(formData.maxDiscountAmount) : null,
      };

      if (editing) {
        await promotionAPI.update(editing.id, data);
        toast.success('Cập nhật khuyến mãi thành công');
      } else {
        await promotionAPI.create(data);
        toast.success('Tạo khuyến mãi thành công');
      }
      setShowModal(false);
      setEditing(null);
      resetForm();
      fetchPromotions();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleEdit = (promotion) => {
    setEditing(promotion);
    setFormData({
      code: promotion.code,
      name: promotion.name,
      description: promotion.description || '',
      discountType: promotion.discountType,
      discountValue: promotion.discountValue,
      minOrderAmount: promotion.minOrderAmount || '',
      maxDiscountAmount: promotion.maxDiscountAmount || '',
      startDate: promotion.startDate.substring(0, 16),
      endDate: promotion.endDate.substring(0, 16),
      usageLimit: promotion.usageLimit,
      active: promotion.active,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await promotionAPI.delete(id);
      toast.success('Xóa khuyến mãi thành công');
      fetchPromotions();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      description: '',
      discountType: 'PERCENTAGE',
      discountValue: '',
      minOrderAmount: '',
      maxDiscountAmount: '',
      startDate: '',
      endDate: '',
      usageLimit: 0,
      active: true,
    });
  };

  const totalPages = Math.ceil(promotions.length / pageSize) || 0;
  const paginatedPromotions = promotions.slice(
    currentPage * pageSize,
    currentPage * pageSize + pageSize
  );

  if (loading && promotions.length === 0) {
    return <div className="flex justify-center p-12">Loading...</div>;
  }

  return (
    <AdminLayout title="Quản lý khuyến mãi">
      <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Quản lý khuyến mãi</h1>
        <button
          onClick={() => {
            setEditing(null);
            resetForm();
            setShowModal(true);
          }}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center space-x-2"
        >
          <FaPlus />
          <span>Thêm khuyến mãi</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giảm giá</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thời gian</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sử dụng</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedPromotions.map((promo) => (
              <tr key={promo.id}>
                <td className="px-6 py-4 font-medium">{promo.code}</td>
                <td className="px-6 py-4">{promo.name}</td>
                <td className="px-6 py-4">
                  {promo.discountValue}{promo.discountType === 'PERCENTAGE' ? '%' : 'đ'}
                </td>
                <td className="px-6 py-4 text-sm">
                  {new Date(promo.startDate).toLocaleDateString('vi-VN')} -<br />
                  {new Date(promo.endDate).toLocaleDateString('vi-VN')}
                </td>
                <td className="px-6 py-4">
                  {promo.usedCount}/{promo.usageLimit || '∞'}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${promo.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {promo.active ? 'Hoạt động' : 'Ẩn'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button onClick={() => handleEdit(promo)} className="text-blue-600 hover:text-blue-800">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(promo.id)} className="text-red-600 hover:text-red-800">
                      <FaTrash />
                    </button>
                  </div>
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
          <span>khuyến mãi / trang</span>
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editing ? 'Cập nhật khuyến mãi' : 'Thêm khuyến mãi'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 font-medium">Mã khuyến mãi</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium">Tên</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block mb-2 font-medium">Mô tả</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  rows="2"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 font-medium">Loại giảm</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="PERCENTAGE">Phần trăm (%)</option>
                    <option value="FIXED_AMOUNT">Số tiền cố định (đ)</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 font-medium">Giá trị</label>
                  <input
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 font-medium">Đơn tối thiểu</label>
                  <input
                    type="number"
                    value={formData.minOrderAmount}
                    onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium">Giảm tối đa</label>
                  <input
                    type="number"
                    value={formData.maxDiscountAmount}
                    onChange={(e) => setFormData({ ...formData, maxDiscountAmount: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 font-medium">Ngày bắt đầu</label>
                  <input
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium">Ngày kết thúc</label>
                  <input
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block mb-2 font-medium">Giới hạn sử dụng (0 = không giới hạn)</label>
                <input
                  type="number"
                  value={formData.usageLimit}
                  onChange={(e) => setFormData({ ...formData, usageLimit: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="mr-2"
                />
                <label>Kích hoạt</label>
              </div>
              <div className="flex space-x-2 pt-4">
                <button type="submit" className="flex-1 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                  {editing ? 'Cập nhật' : 'Tạo'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditing(null);
                    resetForm();
                  }}
                  className="flex-1 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </AdminLayout>
  );
};

export default Promotions;

