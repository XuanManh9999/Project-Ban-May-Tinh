import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productAPI, categoryAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import { FaSearch } from 'react-icons/fa';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 12,
    totalPages: 0,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const categoryId = searchParams.get('category');
    if (categoryId) {
      setSelectedCategory(categoryId);
    }
    fetchProducts();
  }, [searchParams, pagination.page]);

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      setCategories(response.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        keyword: searchParams.get('keyword') || '',
        categoryId: searchParams.get('category') || null,
        page: pagination.page,
        size: pagination.size,
      };

      const response = await productAPI.search(params);
      setProducts(response.data.data.content);
      setPagination((prev) => ({
        ...prev,
        totalPages: response.data.data.totalPages,
      }));
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = {};
    if (searchKeyword.trim()) {
      params.keyword = searchKeyword.trim();
    }
    if (selectedCategory) {
      params.category = selectedCategory;
    }
    setSearchParams(params);
    setPagination((prev) => ({ ...prev, page: 0 }));
  };

  const handleCategoryFilter = (categoryId) => {
    setSelectedCategory(categoryId);
    const params = {};
    if (searchKeyword.trim()) {
      params.keyword = searchKeyword.trim();
    }
    if (categoryId) {
      params.category = categoryId;
    }
    setSearchParams(params);
    setPagination((prev) => ({ ...prev, page: 0 }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Sản phẩm</h1>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="Tìm kiếm sản phẩm..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition flex items-center space-x-2"
          >
            <FaSearch />
            <span>Tìm kiếm</span>
          </button>
        </div>
      </form>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCategoryFilter(null)}
              className={`px-4 py-2 rounded-lg transition ${
                !selectedCategory
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Tất cả
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryFilter(category.id)}
                className={`px-4 py-2 rounded-lg transition ${
                  selectedCategory == category.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Products Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: pagination.totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPagination((prev) => ({ ...prev, page: i }))}
                  className={`px-4 py-2 rounded ${
                    pagination.page === i
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">
            Không tìm thấy sản phẩm phù hợp
          </p>
        </div>
      )}
    </div>
  );
};

export default Products;

