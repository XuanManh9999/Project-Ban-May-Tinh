import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import OrderDetail from './pages/OrderDetail'
import PaymentReturn from './pages/PaymentReturn'
import Profile from './pages/Profile'
import AdminDashboard from './pages/admin/Dashboard'
import AdminProducts from './pages/admin/ProductsEnhanced'
import AdminOrders from './pages/admin/Orders'
import AdminPromotions from './pages/admin/Promotions'
import AdminCategories from './pages/admin/Categories'
import PrivateRoute from './components/PrivateRoute'
import AdminRoute from './components/AdminRoute'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                
                {/* Protected Routes */}
                <Route path="/cart" element={
                  <PrivateRoute>
                    <Cart />
                  </PrivateRoute>
                } />
                <Route path="/checkout" element={
                  <PrivateRoute>
                    <Checkout />
                  </PrivateRoute>
                } />
                <Route path="/orders" element={
                  <PrivateRoute>
                    <Orders />
                  </PrivateRoute>
                } />
                <Route path="/orders/:id" element={
                  <PrivateRoute>
                    <OrderDetail />
                  </PrivateRoute>
                } />
                <Route path="/payment/return" element={
                  <PrivateRoute>
                    <PaymentReturn />
                  </PrivateRoute>
                } />
                <Route path="/profile" element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                } />
                
                {/* Admin Routes */}
                <Route path="/admin" element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } />
                <Route path="/admin/products" element={
                  <AdminRoute>
                    <AdminProducts />
                  </AdminRoute>
                } />
                <Route path="/admin/orders" element={
                  <AdminRoute>
                    <AdminOrders />
                  </AdminRoute>
                } />
                <Route path="/admin/promotions" element={
                  <AdminRoute>
                    <AdminPromotions />
                  </AdminRoute>
                } />
                <Route path="/admin/categories" element={
                  <AdminRoute>
                    <AdminCategories />
                  </AdminRoute>
                } />
                
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
            <Footer />
          </div>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </Router>
      </CartProvider>
    </AuthProvider>
  )
}

export default App

