import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaBox, FaShoppingCart, FaTags, FaList, FaChartLine, FaMoneyBillWave,
  FaClock, FaArrowUp, FaArrowDown,
} from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';
import { productAPI, promotionAPI, orderAPI, categoryAPI } from '../../services/api';
import { formatVND } from '../../utils/format';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell, AreaChart, Area,
} from 'recharts';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16'];

const STATUS_LABELS = {
  PENDING: 'Chờ xác nhận',
  CONFIRMED: 'Đã xác nhận',
  PROCESSING: 'Đang xử lý',
  SHIPPED: 'Đang giao',
  DELIVERED: 'Đã giao',
  CANCELLED: 'Đã hủy',
};

const PAYMENT_LABELS = {
  COD: 'Thanh toán khi nhận hàng',
  VNPAY: 'VNPay',
  BANK_TRANSFER: 'Chuyển khoản',
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    products: 0, orders: 0, promotions: 0, categories: 0,
    revenueTotal: 0, revenueToday: 0, pendingOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [categoryChartData, setCategoryChartData] = useState([]);
  const [orderStatusData, setOrderStatusData] = useState([]);
  const [paymentMethodData, setPaymentMethodData] = useState([]);
  const [revenueByDay, setRevenueByDay] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [productsRes, ordersRes, promosRes, catsRes] = await Promise.all([
        productAPI.getAll(0, 500),
        orderAPI.getAllOrders(0, 500),
        promotionAPI.getAll(),
        categoryAPI.getAll(),
      ]);

      const products = productsRes.data.data?.content || [];
      const orders = ordersRes.data.data?.content || [];
      const promotions = promosRes.data.data || [];
      const categories = catsRes.data.data || [];

      const todayStr = new Date().toISOString().slice(0, 10);
      let revenueTotal = 0, revenueToday = 0, pendingOrders = 0;
      const statusMap = {};
      const paymentMap = {};
      const dailyRevenue = {};

      orders.forEach((order) => {
        const isPaid = order.paymentStatus === 'PAID' || order.status === 'DELIVERED';
        if (isPaid) {
          revenueTotal += order.finalAmount || 0;
          const dateStr = order.createdAt?.slice(0, 10);
          if (dateStr === todayStr) revenueToday += order.finalAmount || 0;
          if (dateStr) {
            dailyRevenue[dateStr] = (dailyRevenue[dateStr] || 0) + (order.finalAmount || 0);
          }
        }
        if (['PENDING', 'CONFIRMED', 'PROCESSING'].includes(order.status)) pendingOrders++;

        const sk = order.status || 'KHÁC';
        statusMap[sk] = (statusMap[sk] || 0) + 1;
        const pk = order.paymentMethod || 'KHÁC';
        paymentMap[pk] = (paymentMap[pk] || 0) + 1;
      });

      const categoryCount = {};
      products.forEach((p) => {
        const name = p.categoryName || 'Khác';
        categoryCount[name] = (categoryCount[name] || 0) + 1;
      });

      const recent = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6);

      const revenueArr = Object.entries(dailyRevenue)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-14)
        .map(([date, amount]) => ({
          date: date.slice(5),
          revenue: amount,
        }));

      setStats({
        products: productsRes.data.data?.totalElements || products.length,
        orders: ordersRes.data.data?.totalElements || orders.length,
        promotions: promotions.length,
        categories: categories.length,
        revenueTotal, revenueToday, pendingOrders,
      });
      setRecentOrders(recent);
      setCategoryChartData(
        Object.entries(categoryCount)
          .sort((a, b) => b[1] - a[1])
          .map(([name, value]) => ({ name, value }))
      );
      setOrderStatusData(
        Object.entries(statusMap).map(([key, value]) => ({ name: STATUS_LABELS[key] || key, value }))
      );
      setPaymentMethodData(
        Object.entries(paymentMap).map(([key, value]) => ({ name: PAYMENT_LABELS[key] || key, value }))
      );
      setRevenueByDay(revenueArr);
    } catch (error) {
      console.error('Error loading dashboard', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Tổng sản phẩm', value: stats.products, icon: FaBox, color: 'bg-blue-500', textColor: 'text-blue-600' },
    { label: 'Tổng đơn hàng', value: stats.orders, icon: FaShoppingCart, color: 'bg-emerald-500', textColor: 'text-emerald-600' },
    { label: 'Doanh thu hôm nay', value: formatVND(stats.revenueToday), icon: FaMoneyBillWave, color: 'bg-amber-500', textColor: 'text-amber-600' },
    { label: 'Đơn chờ xử lý', value: stats.pendingOrders, icon: FaClock, color: 'bg-rose-500', textColor: 'text-rose-600' },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm">
          <p className="font-medium text-gray-800">{label}</p>
          {payload.map((entry, i) => (
            <p key={i} style={{ color: entry.color }}>
              {entry.name}: {typeof entry.value === 'number' ? formatVND(entry.value) : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const PieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight="bold">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (loading) {
    return (
      <AdminLayout title="Bảng điều khiển">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Bảng điều khiển">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{card.label}</p>
                  <p className={`text-2xl font-bold ${card.textColor}`}>{card.value}</p>
                </div>
                <div className={`${card.color} w-12 h-12 rounded-xl flex items-center justify-center`}>
                  <Icon className="text-white text-xl" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Revenue highlight */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-6 mb-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-indigo-100 text-sm mb-1">Tổng doanh thu (ước tính)</p>
            <p className="text-4xl font-bold">{formatVND(stats.revenueTotal)}</p>
            <p className="text-indigo-200 text-sm mt-2">Dựa trên các đơn đã thanh toán / đã giao hàng</p>
          </div>
          <Link
            to="/admin/reports"
            className="mt-4 md:mt-0 inline-flex items-center px-5 py-2.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
          >
            <FaChartLine className="mr-2" />
            Xem báo cáo chi tiết
          </Link>
        </div>
      </div>

      {/* Revenue Area Chart */}
      {revenueByDay.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Doanh thu theo ngày (14 ngày gần nhất)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueByDay}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" fontSize={12} tickLine={false} />
              <YAxis fontSize={12} tickLine={false} tickFormatter={(v) => v >= 1000000 ? `${(v / 1000000).toFixed(0)}tr` : v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" name="Doanh thu" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Charts row: Order Status + Payment Method + Category */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Order Status Pie */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Trạng thái đơn hàng</h2>
          {orderStatusData.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Chưa có dữ liệu</p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%" cy="50%"
                    labelLine={false}
                    label={PieLabel}
                    outerRadius={90}
                    dataKey="value"
                  >
                    {orderStatusData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-3 space-y-1.5">
                {orderStatusData.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="text-gray-600">{item.name}</span>
                    </div>
                    <span className="font-semibold text-gray-800">{item.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Payment Method Pie */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Phương thức thanh toán</h2>
          {paymentMethodData.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Chưa có dữ liệu</p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={paymentMethodData}
                    cx="50%" cy="50%"
                    labelLine={false}
                    label={PieLabel}
                    outerRadius={90}
                    dataKey="value"
                  >
                    {paymentMethodData.map((_, i) => (
                      <Cell key={i} fill={COLORS[(i + 3) % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-3 space-y-1.5">
                {paymentMethodData.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[(i + 3) % COLORS.length] }} />
                      <span className="text-gray-600">{item.name}</span>
                    </div>
                    <span className="font-semibold text-gray-800">{item.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Category Bar Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Sản phẩm theo danh mục</h2>
          {categoryChartData.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Chưa có dữ liệu</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={categoryChartData} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" fontSize={12} tickLine={false} />
                <YAxis dataKey="name" type="category" fontSize={11} tickLine={false} width={90} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" name="Số sản phẩm" radius={[0, 4, 4, 0]}>
                  {categoryChartData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Quick Nav + Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Chức năng quản trị</h2>
          <div className="space-y-3">
            {[
              { title: 'Quản lý sản phẩm', icon: FaBox, path: '/admin/products', color: 'bg-blue-500', desc: 'Thêm, sửa, xóa sản phẩm' },
              { title: 'Quản lý đơn hàng', icon: FaShoppingCart, path: '/admin/orders', color: 'bg-emerald-500', desc: 'Xem & cập nhật trạng thái' },
              { title: 'Khuyến mãi', icon: FaTags, path: '/admin/promotions', color: 'bg-purple-500', desc: 'Quản lý mã giảm giá' },
              { title: 'Danh mục', icon: FaList, path: '/admin/categories', color: 'bg-orange-500', desc: 'Quản lý danh mục SP' },
              { title: 'Báo cáo', icon: FaChartLine, path: '/admin/reports', color: 'bg-pink-500', desc: 'Thống kê & phân tích' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.path} to={item.path} className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition group">
                  <div className={`${item.color} w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon className="text-white" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-semibold text-gray-800 group-hover:text-primary-600">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Đơn hàng gần đây</h2>
            <Link to="/admin/orders" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              Xem tất cả →
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Chưa có đơn hàng nào.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="pb-3 text-left font-medium text-gray-500">Mã đơn</th>
                    <th className="pb-3 text-left font-medium text-gray-500">Tổng tiền</th>
                    <th className="pb-3 text-left font-medium text-gray-500">Thanh toán</th>
                    <th className="pb-3 text-left font-medium text-gray-500">Trạng thái</th>
                    <th className="pb-3 text-left font-medium text-gray-500">Ngày đặt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="py-3 font-semibold text-gray-800">{order.orderNumber}</td>
                      <td className="py-3 text-gray-800">{formatVND(order.finalAmount)}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {order.paymentStatus === 'PAID' ? 'Đã TT' : 'Chưa TT'}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          {STATUS_LABELS[order.status] || order.status}
                        </span>
                      </td>
                      <td className="py-3 text-gray-500 text-xs">{new Date(order.createdAt).toLocaleString('vi-VN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
