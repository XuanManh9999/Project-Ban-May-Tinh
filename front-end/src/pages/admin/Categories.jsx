import React, { useState, useEffect } from 'react';
import { categoryAPI } from '../../services/api';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import AdminLayout from '../../components/admin/AdminLayout';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      setCategories(response.data.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await categoryAPI.update(editing.id, formData);
        toast.success('Cập nhật danh mục thành công');
      } else {
        await categoryAPI.create(formData);
        toast.success('Tạo danh mục thành công');
      }
      setShowModal(false);
      setEditing(null);
      resetForm();
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleEdit = (category) => {
    setEditing(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      imageUrl: category.imageUrl || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await categoryAPI.delete(id);
      toast.success('Xóa danh mục thành công');
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', imageUrl: '' });
  };

  if (loading) return <div className="flex justify-center p-12">Loading...</div>;

  return (
    <AdminLayout title="Quản lý danh mục">
      <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Quản lý danh mục</h1>
        <button
          onClick={() => {
            setEditing(null);
            resetForm();
            setShowModal(true);
          }}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center space-x-2"
        >
          <FaPlus />
          <span>Thêm danh mục</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
            <p className="text-gray-600 mb-4">{category.description}</p>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(category)}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center space-x-1"
              >
                <FaEdit />
                <span>Sửa</span>
              </button>
              <button
                onClick={() => handleDelete(category.id)}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center justify-center space-x-1"
              >
                <FaTrash />
                <span>Xóa</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">
              {editing ? 'Cập nhật danh mục' : 'Thêm danh mục'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-2 font-medium">Tên danh mục</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">Mô tả</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  rows="3"
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">URL hình ảnh</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
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

export default Categories;

