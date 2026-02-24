import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBox, FaShoppingCart, FaTags, FaList } from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';
import { productAPI, promotionAPI, orderAPI } from '../../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    promotions: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, ordersRes, promosRes] = await Promise.all([
          productAPI.getAll(0, 1),
          orderAPI.getAllOrders(0, 1),
          promotionAPI.getAll(),
        ]);

        setStats({
          products: productsRes.data.data.totalElements,
          orders: ordersRes.data.data.totalElements,
          promotions: promosRes.data.data.length,
        });
      } catch (error) {
        console.error('Error loading dashboard stats', error);
      }
    };

    fetchStats();
  }, []);

  const menuItems = [
    {
      title: 'Quản lý sản phẩm',
      icon: FaBox,
      path: '/admin/products',
      description: 'Thêm, sửa, xóa sản phẩm',
      color: 'bg-blue-500',
    },
    {
      title: 'Quản lý đơn hàng',
      icon: FaShoppingCart,
      path: '/admin/orders',
      description: 'Xem và cập nhật trạng thái đơn hàng',
      color: 'bg-green-500',
    },
    {
      title: 'Quản lý khuyến mãi',
      icon: FaTags,
      path: '/admin/promotions',
      description: 'Tạo và quản lý mã khuyến mãi',
      color: 'bg-purple-500',
    },
    {
      title: 'Quản lý danh mục',
      icon: FaList,
      path: '/admin/categories',
      description: 'Quản lý danh mục sản phẩm',
      color: 'bg-orange-500',
    },
  ];

  return (
    <AdminLayout title="Bảng điều khiển">
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500">Tổng sản phẩm</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{stats.products}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500">Tổng đơn hàng</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{stats.orders}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500">Chương trình khuyến mãi</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{stats.promotions}</p>
        </div>
      </div>

      {/* Quick navigation */}
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Chức năng quản trị</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="bg-white rounded-lg shadow-md hover:shadow-xl transition p-6"
          >
            <div className={`${item.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
              <item.icon className="text-white text-2xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {item.title}
            </h3>
            <p className="text-gray-600 text-sm">{item.description}</p>
          </Link>
        ))}
      </div>
    </AdminLayout>
  );
};

export default Dashboard;

