import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { productAPI, orderAPI, categoryAPI } from '../../services/api';
import { formatVND } from '../../utils/format';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell, AreaChart, Area, LineChart, Line, ComposedChart,
} from 'recharts';
import { FaCalendarAlt, FaDownload, FaChartBar, FaChartPie, FaChartLine, FaTable } from 'react-icons/fa';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16', '#14b8a6', '#f97316'];

const STATUS_LABELS = {
  PENDING: 'Chờ xác nhận', CONFIRMED: 'Đã xác nhận', PROCESSING: 'Đang xử lý',
  SHIPPED: 'Đang giao', DELIVERED: 'Đã giao', CANCELLED: 'Đã hủy',
};
const PAYMENT_LABELS = { COD: 'COD', VNPAY: 'VNPay', BANK_TRANSFER: 'Chuyển khoản' };

const Reports = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('revenue');

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [ordersRes, productsRes, catsRes] = await Promise.all([
        orderAPI.getAllOrders(0, 1000),
        productAPI.getAll(0, 500),
        categoryAPI.getAll(),
      ]);
      setOrders(ordersRes.data.data?.content || []);
      setProducts(productsRes.data.data?.content || []);
      setCategories(catsRes.data.data || []);
    } catch (e) {
      console.error('Error loading reports', e);
    } finally {
      setLoading(false);
    }
  };

  // ---- Computed data ----

  const revenueByDay = (() => {
    const map = {};
    orders.forEach(o => {
      if (o.paymentStatus === 'PAID' || o.status === 'DELIVERED') {
        const d = o.createdAt?.slice(0, 10);
        if (d) map[d] = (map[d] || 0) + (o.finalAmount || 0);
      }
    });
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b)).slice(-30)
      .map(([date, revenue]) => ({ date: date.slice(5), revenue }));
  })();

  const ordersByDay = (() => {
    const map = {};
    orders.forEach(o => {
      const d = o.createdAt?.slice(0, 10);
      if (d) map[d] = (map[d] || 0) + 1;
    });
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b)).slice(-30)
      .map(([date, count]) => ({ date: date.slice(5), orders: count }));
  })();

  const revenueAndOrders = (() => {
    const revMap = {}, ordMap = {};
    orders.forEach(o => {
      const d = o.createdAt?.slice(0, 10);
      if (!d) return;
      ordMap[d] = (ordMap[d] || 0) + 1;
      if (o.paymentStatus === 'PAID' || o.status === 'DELIVERED') {
        revMap[d] = (revMap[d] || 0) + (o.finalAmount || 0);
      }
    });
    const allDates = [...new Set([...Object.keys(revMap), ...Object.keys(ordMap)])].sort();
    return allDates.slice(-30).map(d => ({
      date: d.slice(5),
      revenue: revMap[d] || 0,
      orders: ordMap[d] || 0,
    }));
  })();

  const orderStatusData = (() => {
    const map = {};
    orders.forEach(o => { const k = o.status || 'KHÁC'; map[k] = (map[k] || 0) + 1; });
    return Object.entries(map).map(([key, value]) => ({ name: STATUS_LABELS[key] || key, value }));
  })();

  const paymentMethodData = (() => {
    const map = {};
    orders.forEach(o => { const k = o.paymentMethod || 'KHÁC'; map[k] = (map[k] || 0) + 1; });
    return Object.entries(map).map(([key, value]) => ({ name: PAYMENT_LABELS[key] || key, value }));
  })();

  const categoryRevenue = (() => {
    const catProductMap = {};
    products.forEach(p => {
      const cn = p.categoryName || 'Khác';
      if (!catProductMap[cn]) catProductMap[cn] = new Set();
      catProductMap[cn].add(p.id);
    });
    const catRev = {};
    const catQty = {};
    orders.forEach(o => {
      if (o.paymentStatus !== 'PAID' && o.status !== 'DELIVERED') return;
      (o.orderItems || []).forEach(item => {
        const productId = item.productId;
        let catName = 'Khác';
        for (const [cn, ids] of Object.entries(catProductMap)) {
          if (ids.has(productId)) { catName = cn; break; }
        }
        catRev[catName] = (catRev[catName] || 0) + (item.subtotal || 0);
        catQty[catName] = (catQty[catName] || 0) + (item.quantity || 0);
      });
    });
    return Object.entries(catRev).sort((a, b) => b[1] - a[1])
      .map(([name, revenue]) => ({ name, revenue, quantity: catQty[name] || 0 }));
  })();

  const topProducts = (() => {
    const productSales = {};
    orders.forEach(o => {
      if (o.paymentStatus !== 'PAID' && o.status !== 'DELIVERED') return;
      (o.orderItems || []).forEach(item => {
        const pid = item.productId || item.productName || 'N/A';
        if (!productSales[pid]) productSales[pid] = { name: item.productName || `SP #${pid}`, quantity: 0, revenue: 0 };
        productSales[pid].quantity += item.quantity || 0;
        productSales[pid].revenue += item.subtotal || 0;
      });
    });
    return Object.values(productSales).sort((a, b) => b.revenue - a.revenue).slice(0, 10);
  })();

  const categoryProductCount = (() => {
    const map = {};
    products.forEach(p => { const cn = p.categoryName || 'Khác'; map[cn] = (map[cn] || 0) + 1; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).map(([name, value]) => ({ name, value }));
  })();

  const summaryStats = (() => {
    let totalRevenue = 0, totalOrders = orders.length, totalPaid = 0, totalCancelled = 0;
    let avgOrderValue = 0;
    orders.forEach(o => {
      if (o.paymentStatus === 'PAID' || o.status === 'DELIVERED') {
        totalRevenue += o.finalAmount || 0;
        totalPaid++;
      }
      if (o.status === 'CANCELLED') totalCancelled++;
    });
    avgOrderValue = totalPaid > 0 ? totalRevenue / totalPaid : 0;
    return { totalRevenue, totalOrders, totalPaid, totalCancelled, avgOrderValue, totalProducts: products.length };
  })();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm">
          <p className="font-semibold text-gray-800 mb-1">{label}</p>
          {payload.map((entry, i) => (
            <p key={i} style={{ color: entry.color }} className="flex justify-between gap-4">
              <span>{entry.name}:</span>
              <span className="font-semibold">
                {entry.name.toLowerCase().includes('doanh thu') || entry.name.toLowerCase().includes('revenue')
                  ? formatVND(entry.value)
                  : entry.value.toLocaleString('vi-VN')}
              </span>
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

  const tabs = [
    { id: 'revenue', label: 'Doanh thu', icon: FaChartLine },
    { id: 'orders', label: 'Đơn hàng', icon: FaChartBar },
    { id: 'products', label: 'Sản phẩm', icon: FaChartPie },
    { id: 'details', label: 'Chi tiết', icon: FaTable },
  ];

  if (loading) {
    return (
      <AdminLayout title="Thống kê & Báo cáo">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Thống kê & Báo cáo">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        {[
          { label: 'Tổng doanh thu', value: formatVND(summaryStats.totalRevenue), color: 'text-indigo-600' },
          { label: 'Tổng đơn hàng', value: summaryStats.totalOrders, color: 'text-blue-600' },
          { label: 'Đã thanh toán', value: summaryStats.totalPaid, color: 'text-emerald-600' },
          { label: 'Đã hủy', value: summaryStats.totalCancelled, color: 'text-red-500' },
          { label: 'Giá trị TB/đơn', value: formatVND(Math.round(summaryStats.avgOrderValue)), color: 'text-amber-600' },
          { label: 'Tổng sản phẩm', value: summaryStats.totalProducts, color: 'text-purple-600' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <p className="text-xs text-gray-500 mb-1">{s.label}</p>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Icon className="mr-2" size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'revenue' && (
        <div className="space-y-6">
          {/* Revenue + Orders Combined */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Doanh thu & Đơn hàng theo ngày</h3>
            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart data={revenueAndOrders}>
                <defs>
                  <linearGradient id="gradRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" fontSize={12} tickLine={false} />
                <YAxis yAxisId="left" fontSize={12} tickLine={false} tickFormatter={(v) => v >= 1e6 ? `${(v / 1e6).toFixed(0)}tr` : v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} />
                <YAxis yAxisId="right" orientation="right" fontSize={12} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area yAxisId="left" type="monotone" dataKey="revenue" name="Doanh thu" stroke="#6366f1" strokeWidth={2} fill="url(#gradRev)" />
                <Bar yAxisId="right" dataKey="orders" name="Số đơn" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue by Category */}
          {categoryRevenue.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Doanh thu theo danh mục</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" fontSize={11} tickLine={false} />
                  <YAxis fontSize={12} tickLine={false} tickFormatter={(v) => v >= 1e6 ? `${(v / 1e6).toFixed(0)}tr` : `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="revenue" name="Doanh thu" radius={[4, 4, 0, 0]}>
                    {categoryRevenue.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Order Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Phân bố trạng thái đơn hàng</h3>
              {orderStatusData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={orderStatusData} cx="50%" cy="50%" labelLine={false} label={PieLabel} outerRadius={100} dataKey="value">
                        {orderStatusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {orderStatusData.map((item, i) => (
                      <div key={i} className="flex items-center text-sm">
                        <div className="w-3 h-3 rounded-full mr-2 flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span className="text-gray-600 truncate">{item.name}</span>
                        <span className="ml-auto font-semibold text-gray-800 pl-1">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : <p className="text-gray-400 text-center py-8">Chưa có dữ liệu</p>}
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Phương thức thanh toán</h3>
              {paymentMethodData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={paymentMethodData} cx="50%" cy="50%" labelLine={false} label={PieLabel} outerRadius={100} innerRadius={50} dataKey="value">
                        {paymentMethodData.map((_, i) => <Cell key={i} fill={COLORS[(i + 3) % COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {paymentMethodData.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[(i + 3) % COLORS.length] }} />
                          <span className="text-gray-600">{item.name}</span>
                        </div>
                        <span className="font-semibold text-gray-800">{item.value} đơn</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : <p className="text-gray-400 text-center py-8">Chưa có dữ liệu</p>}
            </div>
          </div>

          {/* Orders per day line chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Số đơn hàng theo ngày</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={ordersByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" fontSize={12} tickLine={false} />
                <YAxis fontSize={12} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="orders" name="Số đơn" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Products by Category */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Sản phẩm theo danh mục</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={categoryProductCount} cx="50%" cy="50%" labelLine={false} label={PieLabel} outerRadius={110} dataKey="value">
                    {categoryProductCount.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-3 space-y-1.5">
                {categoryProductCount.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="text-gray-600">{item.name}</span>
                    </div>
                    <span className="font-semibold text-gray-800">{item.value} SP</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Selling Products */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Top sản phẩm bán chạy</h3>
              {topProducts.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={topProducts} layout="vertical" margin={{ left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" fontSize={12} tickLine={false} />
                    <YAxis dataKey="name" type="category" fontSize={10} tickLine={false} width={120} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="quantity" name="Số lượng bán" fill="#6366f1" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : <p className="text-gray-400 text-center py-8">Chưa có dữ liệu bán hàng</p>}
            </div>
          </div>

          {/* Stock overview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Tồn kho theo danh mục</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={(() => {
                const map = {};
                products.forEach(p => {
                  const cn = p.categoryName || 'Khác';
                  if (!map[cn]) map[cn] = { name: cn, inStock: 0, outOfStock: 0 };
                  if (p.stockQuantity > 0) map[cn].inStock++;
                  else map[cn].outOfStock++;
                });
                return Object.values(map);
              })()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" fontSize={11} tickLine={false} />
                <YAxis fontSize={12} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="inStock" name="Còn hàng" fill="#10b981" radius={[4, 4, 0, 0]} stackId="stack" />
                <Bar dataKey="outOfStock" name="Hết hàng" fill="#ef4444" radius={[4, 4, 0, 0]} stackId="stack" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === 'details' && (
        <div className="space-y-6">
          {/* Top Products Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Bảng chi tiết sản phẩm bán chạy</h3>
            {topProducts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-3 px-4 text-left font-semibold text-gray-600">#</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-600">Sản phẩm</th>
                      <th className="py-3 px-4 text-right font-semibold text-gray-600">Số lượng bán</th>
                      <th className="py-3 px-4 text-right font-semibold text-gray-600">Doanh thu</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {topProducts.map((item, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-500">{i + 1}</td>
                        <td className="py-3 px-4 font-medium text-gray-800">{item.name}</td>
                        <td className="py-3 px-4 text-right text-gray-700">{item.quantity.toLocaleString('vi-VN')}</td>
                        <td className="py-3 px-4 text-right font-semibold text-indigo-600">{formatVND(item.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <p className="text-gray-400 text-center py-8">Chưa có dữ liệu</p>}
          </div>

          {/* Revenue by Category Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Doanh thu theo danh mục</h3>
            {categoryRevenue.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-3 px-4 text-left font-semibold text-gray-600">#</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-600">Danh mục</th>
                      <th className="py-3 px-4 text-right font-semibold text-gray-600">Số lượng bán</th>
                      <th className="py-3 px-4 text-right font-semibold text-gray-600">Doanh thu</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {categoryRevenue.map((item, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-500">{i + 1}</td>
                        <td className="py-3 px-4 font-medium text-gray-800">{item.name}</td>
                        <td className="py-3 px-4 text-right text-gray-700">{item.quantity.toLocaleString('vi-VN')}</td>
                        <td className="py-3 px-4 text-right font-semibold text-emerald-600">{formatVND(item.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <p className="text-gray-400 text-center py-8">Chưa có dữ liệu</p>}
          </div>

          {/* All Orders Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Tổng hợp trạng thái đơn hàng</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-4 text-left font-semibold text-gray-600">Trạng thái</th>
                    <th className="py-3 px-4 text-right font-semibold text-gray-600">Số đơn</th>
                    <th className="py-3 px-4 text-right font-semibold text-gray-600">Tỷ lệ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orderStatusData.map((item, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                          <span className="font-medium text-gray-800">{item.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right text-gray-700">{item.value}</td>
                      <td className="py-3 px-4 text-right font-semibold text-gray-800">
                        {orders.length > 0 ? `${((item.value / orders.length) * 100).toFixed(1)}%` : '0%'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Reports;
