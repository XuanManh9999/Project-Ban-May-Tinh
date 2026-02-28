import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI, categoryAPI } from '../services/api';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        productAPI.getAll(0, 8),
        categoryAPI.getAll()
      ]);
      
      setProducts(productsRes.data.data.content);
      setCategories(categoriesRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
  <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-20">
          <div className="max-w-2xl">
          <h1 className="text-5xl font-bold mb-4 leading-tight">
              Computer Shop – Hệ sinh thái máy tính & công nghệ
            </h1>
            <p className="text-xl mb-8 text-primary-50">
              Laptop, PC lắp ráp, màn hình và linh kiện chính hãng, giá tốt, bảo hành uy tín.
            </p>
            <Link
              to="/products"
              className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition"
            >
              Mua sắm ngay
            </Link>
          </div>
        </div>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Danh mục sản phẩm</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.slice(0, 4).map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition text-center"
              >
                <h3 className="text-lg font-semibold">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Featured Products */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Sản phẩm nổi bật</h2>
          <Link
            to="/products"
            className="text-primary-600 hover:text-primary-700 font-semibold"
          >
            Xem tất cả →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;

