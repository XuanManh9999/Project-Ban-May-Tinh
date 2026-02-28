import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FaShoppingCart, FaMinus, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import ProductCard from '../components/ProductCard';
import { formatVND } from '../utils/format';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchProduct();
    fetchRelatedProducts();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getById(id);
      const data = response.data.data;
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Không thể tải thông tin sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      setRelatedLoading(true);
      const response = await productAPI.getRelated(id, 0, 8);
      setRelatedProducts(response.data.data.content);
    } catch (error) {
      console.error('Error fetching related products:', error);
    } finally {
      setRelatedLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.warning('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
      navigate('/login');
      return;
    }

    const result = await addToCart(product.id, quantity);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    if (quantity < product.stockQuantity) setQuantity(quantity + 1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Không tìm thấy sản phẩm</h2>
        </div>
      </div>
    );
  }

  const hasAttributes = product.attributes && product.attributes.length > 0;

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="bg-gray-200 rounded-lg overflow-hidden">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} className="w-full h-96 object-cover" />
            ) : (
              <div className="w-full h-96 flex items-center justify-center">
                <span className="text-gray-400 text-xl">No Image</span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>

            <div className="mb-4">
              <span className="text-sm text-gray-600">Danh mục:</span>
              <span className="ml-2 text-primary-600 font-semibold">{product.categoryName}</span>
            </div>

            <div className="text-4xl font-bold text-primary-600 mb-6">
              {formatVND(product.price)}
            </div>

            {/* Dynamic Attributes / Specs */}
            {hasAttributes && (
              <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Thông số kỹ thuật</h3>
                <table className="w-full text-sm">
                  <tbody>
                    {product.attributes.map((attr, index) => (
                      <tr key={attr.id || index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="py-2 px-3 font-medium text-gray-700 w-2/5">{attr.name}</td>
                        <td className="py-2 px-3 text-gray-600">{attr.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Mô tả sản phẩm</h3>
              <div
                className="prose max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: product.description || '<p>Không có mô tả</p>' }}
              />
            </div>

            <div className="mb-6">
              {product.stockQuantity > 0 ? (
                <span className="text-green-600 font-semibold">Còn {product.stockQuantity} sản phẩm</span>
              ) : (
                <span className="text-red-600 font-semibold">Hết hàng</span>
              )}
            </div>

            {product.stockQuantity > 0 && (
              <>
                <div className="flex items-center space-x-4 mb-6">
                  <span className="text-gray-700 font-semibold">Số lượng:</span>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button onClick={decreaseQuantity} className="px-4 py-2 hover:bg-gray-100"><FaMinus /></button>
                    <span className="px-6 py-2 border-x border-gray-300">{quantity}</span>
                    <button onClick={increaseQuantity} className="px-4 py-2 hover:bg-gray-100"><FaPlus /></button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="w-full md:w-auto px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition flex items-center justify-center space-x-2"
                >
                  <FaShoppingCart />
                  <span>Thêm vào giỏ hàng</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Sản phẩm liên quan</h2>
            {relatedLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
