import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import EmailVerify from "./pages/EmailVerify";
import ResetPassword from "./pages/ResetPassword";
import Home from "./pages/Home";
import UserProfile from "./pages/UserProfile";
import AdminDashboard from "./pages/AdminDashboard";
import { ToastContainer } from "react-toastify";
import { AppContent } from "./context/AppContext";
import { CartProvider } from "./context/CartContext";
import Layout from "./components/Layout";
import DefectClassificationGame from "./components/DefectClassificationGame";

// Route protection components
import ProtectedRoute from "./components/routes/ProtectedRoute";
import AdminRoute from "./components/routes/AdminRoute";
import PublicRoute from "./components/routes/PublicRoute";

// Page imports
import ContactUs from "./pages/ContactUs";
import AboutUs from "./pages/AboutUs";
import AppointmentHistory from "./pages/AppointmentHistory";
import OrderHistory from "./pages/OrderHistory";
import Inquiries from "./pages/Inquiries";
import Support from "./pages/Support";
import ProfileSettings from "./pages/ProfileSettings";

//Inventory imports
import ProductList from "./pages/Inventory/ProductList";
import ProductCreate from "./pages/Inventory/ProductCreate";
import ProductEdit from "./pages/Inventory/ProductEdit";
import ProductDetail from "./pages/Inventory/ProductDetail";
import ProductView from "./pages/Inventory/ProductView";

// Order imports
import Cart from "./pages/Order/Cart";
import Checkout from "./pages/Order/Checkout";
import OrderDetail from "./pages/Order/OrderDetail";
import OrderSuccess from "./pages/Order/OrderSuccess";
import AdminOrders from "./pages/Order/AdminOrders";
import OrderCreate from "./pages/Order/OrderCreate";
import OrderTracking from "./pages/Order/OrderTracking";
import OrderReturns from "./pages/Order/OrderReturns";
import OrderReports from "./pages/Order/OrderReports";
import OrderIncome from "./pages/Order/OrderIncome";

// Employee Salary Management import
import EmployeeSalaryManagement from "./pages/Admin/EmployeeSalaryManagement";
import TestEmployeeCreation from "./pages/Admin/TestEmployeeCreation";

// Finance Management import
import FinanceDashboard from "./pages/Finance/FinanceDashboard";

import "react-toastify/ReactToastify.css";

const App = () => {
  const { isLoggedin, userRole, isLoading } = useContext(AppContent);

  return (
    <CartProvider>
      <Layout>
        <ToastContainer />
        <Routes>
          {/* Public routes - accessible to everyone */}
          <Route path="/" element={<Landing />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/defect-game" element={<DefectClassificationGame />} />

          {/* Authentication routes - only for non-logged in users */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/reset-password"
            element={
              <PublicRoute>
                <ResetPassword />
              </PublicRoute>
            }
          />

          {/* Protected routes - require authentication */}
          <Route
            path="/Home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/email-verify"
            element={
              <ProtectedRoute>
                <EmailVerify />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointments"
            element={
              <ProtectedRoute>
                <AppointmentHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrderHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute>
                <OrderDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <Cart />
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-success/:id"
            element={
              <ProtectedRoute>
                <OrderSuccess />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-tracking"
            element={
              <OrderTracking />
            }
          />
          <Route
            path="/order-returns"
            element={
              <ProtectedRoute>
                <OrderReturns />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inquiries"
            element={
              <ProtectedRoute>
                <Inquiries />
              </ProtectedRoute>
            }
          />
          <Route
            path="/support"
            element={
              <ProtectedRoute>
                <Support />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile-settings"
            element={
              <ProtectedRoute>
                <ProfileSettings />
              </ProtectedRoute>
            }
          />

          {/* Admin only routes */}
          <Route
            path="/admin-dashboard/*"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          
          {/* Employee Salary Management */}
          <Route
            path="/admin/employee-salary"
            element={
              <AdminRoute>
                <EmployeeSalaryManagement />
              </AdminRoute>
            }
          />
          
          {/* Test Employee Creation (for debugging) */}
          <Route
            path="/admin/test-employee"
            element={
              <AdminRoute>
                <TestEmployeeCreation />
              </AdminRoute>
            }
          />
          
          {/* Finance Dashboard */}
          <Route
            path="/admin/finance"
            element={
              <AdminRoute>
                <FinanceDashboard />
              </AdminRoute>
            }
          />
          
          {/* Admin order management routes */}
          <Route
            path="/admin/orders"
            element={
              <AdminRoute>
                <AdminOrders />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/order-create"
            element={
              <AdminRoute>
                <OrderCreate />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/order-reports"
            element={
              <AdminRoute>
                <OrderReports />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/order-income"
            element={
              <AdminRoute>
                <OrderIncome />
              </AdminRoute>
            }
          />
          
          {/* Inventory routes */}
          <Route 
            path="/admin/inventory" 
            element={
              <AdminRoute>
                <ProductList />
              </AdminRoute>
            } 
          />
          <Route 
            path="/products/create" 
            element={
              <ProtectedRoute>
                <ProductCreate />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/products/:id" 
            element={
                <ProductDetail />

            } 
          />
          <Route 
            path="/products/:id/edit" 
            element={
              <ProtectedRoute>
                <ProductEdit />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/products" 
            element={
                <ProductView />
            } 
          />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </CartProvider>
  );
};

export default App;
