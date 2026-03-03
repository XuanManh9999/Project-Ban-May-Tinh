import React, { useState, useEffect } from 'react';
import { productAPI, categoryAPI } from '../../services/api';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Pagination from '../../components/admin/Pagination';
import AdminLayout from '../../components/admin/AdminLayout';
import ReactQuill from 'react-quill';
import { formatVND } from '../../utils/format';
import 'react-quill/dist/quill.snow.css';

const PRESET_TEMPLATES = {
  'Laptop': [
    { name: 'CPU', value: '' },
    { name: 'RAM', value: '' },
    { name: 'Ổ cứng', value: '' },
    { name: 'GPU', value: '' },
    { name: 'Màn hình', value: '' },
    { name: 'Pin', value: '' },
    { name: 'Cân nặng', value: '' },
    { name: 'Màu sắc', value: '' },
  ],
  'PC - Máy tính bộ': [
    { name: 'CPU', value: '' },
    { name: 'RAM', value: '' },
    { name: 'Ổ cứng', value: '' },
    { name: 'GPU', value: '' },
    { name: 'Mainboard', value: '' },
    { name: 'Nguồn', value: '' },
    { name: 'Vỏ case', value: '' },
  ],
  'Màn hình': [
    { name: 'Kích thước', value: '' },
    { name: 'Độ phân giải', value: '' },
    { name: 'Tấm nền', value: '' },
    { name: 'Tần số quét', value: '' },
    { name: 'Thời gian phản hồi', value: '' },
    { name: 'Cổng kết nối', value: '' },
  ],
  'Linh kiện': [
    { name: 'Loại', value: '' },
    { name: 'Thông số chính', value: '' },
    { name: 'Socket / Khe cắm', value: '' },
  ],
  'Phụ kiện': [
    { name: 'Kết nối', value: '' },
    { name: 'Tương thích', value: '' },
  ],
};

const ProductsEnhanced = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filterActive, setFilterActive] = useState('all');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    imageUrl: '',
    categoryId: '',
    active: true,
    attributes: [],
  });

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, searchKeyword, selectedCategory, filterActive]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      setCategories(response.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Không thể tải danh sách danh mục');
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      let response;

      if (searchKeyword || selectedCategory) {
        const params = {
          keyword: searchKeyword || undefined,
          categoryId: selectedCategory || undefined,
          page: currentPage,
          size: pageSize,
        };
        response = await productAPI.search(params);
      } else {
        response = await productAPI.getAll(currentPage, pageSize);
      }

      const data = response.data.data;
      let filteredProducts = data.content;

      if (filterActive === 'active') {
        filteredProducts = filteredProducts.filter(p => p.active);
      } else if (filterActive === 'inactive') {
        filteredProducts = filteredProducts.filter(p => !p.active);
      }

      setProducts(filteredProducts);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Không thể tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchKeyword(searchInput);
    setCurrentPage(0);
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setSearchKeyword('');
    setSelectedCategory('');
    setFilterActive('all');
    setCurrentPage(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        attributes: formData.attributes
          .filter(a => a.name.trim() && a.value.trim())
          .map(a => ({ name: a.name.trim(), value: a.value.trim() })),
      };

      if (editingProduct) {
        await productAPI.update(editingProduct.id, payload);
        toast.success('Cập nhật sản phẩm thành công');
      } else {
        await productAPI.create(payload);
        toast.success('Tạo sản phẩm thành công');
      }
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      try {
        await productAPI.delete(id);
        toast.success('Xóa sản phẩm thành công');
        fetchData();
      } catch (error) {
        console.error('Error:', error);
        toast.error('Không thể xóa sản phẩm');
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stockQuantity: product.stockQuantity,
      imageUrl: product.imageUrl,
      categoryId: product.categoryId || '',
      active: product.active,
      attributes: (product.attributes || []).map(a => ({ name: a.name, value: a.value })),
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      stockQuantity: '',
      imageUrl: '',
      categoryId: '',
      active: true,
      attributes: [],
    });
    setEditingProduct(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  // --- Dynamic attributes helpers ---
  const addAttribute = () => {
    setFormData(prev => ({
      ...prev,
      attributes: [...prev.attributes, { name: '', value: '' }],
    }));
  };

  const removeAttribute = (index) => {
    setFormData(prev => ({
      ...prev,
      attributes: prev.attributes.filter((_, i) => i !== index),
    }));
  };

  const updateAttribute = (index, field, val) => {
    setFormData(prev => {
      const updated = [...prev.attributes];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, attributes: updated };
    });
  };

  const applyTemplate = (categoryName) => {
    const tpl = PRESET_TEMPLATES[categoryName];
    if (tpl && formData.attributes.length === 0) {
      setFormData(prev => ({ ...prev, attributes: tpl.map(a => ({ ...a })) }));
    }
  };

  const handleCategoryChange = (catId) => {
    setFormData(prev => ({ ...prev, categoryId: catId }));
    if (!editingProduct) {
      const cat = categories.find(c => String(c.id) === String(catId));
      if (cat) applyTemplate(cat.name);
    }
  };

  const getFirstAttr = (product) => {
    if (product.attributes && product.attributes.length > 0) {
      return product.attributes.map(a => a.value).slice(0, 2).join(' | ');
    }
    return '';
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <AdminLayout title="Quản lý sản phẩm">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Quản lý sản phẩm</h1>
            <p className="text-gray-600 mt-1">Tổng cộng: {totalElements} sản phẩm</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-lg"
          >
            <FaPlus />
            <span>Thêm sản phẩm</span>
          </button>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <form onSubmit={handleSearch} className="md:col-span-2">
              <div className="relative">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </form>

            <select
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(0); }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Tất cả danh mục</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            <select
              value={filterActive}
              onChange={(e) => setFilterActive(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang bán</option>
              <option value="inactive">Ngừng bán</option>
            </select>
          </div>

          {(searchKeyword || selectedCategory || filterActive !== 'all') && (
            <div className="flex items-center space-x-2 mt-4">
              <span className="text-sm text-gray-600">Đang lọc:</span>
              {searchKeyword && (
                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                  Từ khóa: &ldquo;{searchKeyword}&rdquo;
                </span>
              )}
              {selectedCategory && (
                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                  Danh mục: {categories.find(c => String(c.id) === selectedCategory)?.name}
                </span>
              )}
              {filterActive !== 'all' && (
                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                  {filterActive === 'active' ? 'Đang bán' : 'Ngừng bán'}
                </span>
              )}
              <button onClick={handleClearFilters} className="text-sm text-red-600 hover:text-red-700 underline">
                Xóa bộ lọc
              </button>
            </div>
          )}
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hình ảnh</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên sản phẩm</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Danh mục</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giá</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tồn kho</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thuộc tính</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                      <FaFilter className="mx-auto text-4xl mb-2 text-gray-300" />
                      <p>Không tìm thấy sản phẩm nào</p>
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded-lg" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">{product.categoryName}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {formatVND(product.price)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={product.stockQuantity > 0 ? 'text-green-600' : 'text-red-600'}>
                          {product.stockQuantity}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-[200px] truncate">
                        {getFirstAttr(product) || <span className="text-gray-400 italic">Chưa có</span>}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${product.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {product.active ? 'Đang bán' : 'Ngừng bán'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button onClick={() => handleEdit(product)} className="text-blue-600 hover:text-blue-800"><FaEdit /></button>
                        <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-800"><FaTrash /></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Hiển thị</span>
                <select
                  value={pageSize}
                  onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(0); }}
                  className="px-2 py-1 border border-gray-300 rounded"
                >
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
                <span className="text-sm text-gray-600">sản phẩm</span>
              </div>
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          </div>
        </div>

        {/* Modal Form */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">
                    {editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}
                  </h2>
                  <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                    <FaTimes size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Tên sản phẩm</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Mô tả chi tiết</label>
                    <ReactQuill
                      value={formData.description}
                      onChange={(value) => setFormData({ ...formData, description: value })}
                      className="bg-white"
                      theme="snow"
                      placeholder="Nhập mô tả chi tiết sản phẩm..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Giá (VNĐ)</label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Số lượng tồn kho</label>
                      <input
                        type="number"
                        value={formData.stockQuantity}
                        onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Danh mục</label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg"
                      required
                    >
                      <option value="">Chọn danh mục</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">URL hình ảnh</label>
                    <input
                      type="text"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>

                  {/* Dynamic Attributes */}
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-sm font-semibold text-gray-700">Thông số kỹ thuật</h3>
                      <button
                        type="button"
                        onClick={addAttribute}
                        className="flex items-center space-x-1 text-sm text-primary-600 hover:text-primary-800 font-medium"
                      >
                        <FaPlus size={12} />
                        <span>Thêm thuộc tính</span>
                      </button>
                    </div>

                    {formData.attributes.length === 0 && (
                      <p className="text-sm text-gray-400 italic">
                        Chưa có thuộc tính nào. Chọn danh mục để tự động gợi ý hoặc thêm thủ công.
                      </p>
                    )}

                    <div className="space-y-2">
                      {formData.attributes.map((attr, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={attr.name}
                            onChange={(e) => updateAttribute(index, 'name', e.target.value)}
                            placeholder="Tên thuộc tính (VD: CPU)"
                            className="flex-1 px-3 py-2 border rounded-lg text-sm"
                          />
                          <input
                            type="text"
                            value={attr.value}
                            onChange={(e) => updateAttribute(index, 'value', e.target.value)}
                            placeholder="Giá trị (VD: Intel Core i7)"
                            className="flex-1 px-3 py-2 border rounded-lg text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => removeAttribute(index)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                            title="Xóa thuộc tính"
                          >
                            <FaTimes size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      className="mr-2"
                    />
                    <label className="text-sm">Sản phẩm đang hoạt động</label>
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button type="submit" className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700">
                      {editingProduct ? 'Cập nhật' : 'Tạo mới'}
                    </button>
                    <button type="button" onClick={handleCloseModal} className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600">
                      Hủy
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ProductsEnhanced;
