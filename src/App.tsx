import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";
import { MenuPage } from "./pages/MenuPage";
import { OrderTrackingPage } from "./pages/OrderTrackingPage";
import { OrderListPage } from "./pages/OrderListPage";
import { ProductManagementPage } from "./pages/ProductManagementPage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { ProductProvider } from "./context/ProductContext";
import { OrderProvider } from "./context/OrderContext";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./components/ui/Toast";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <ProductProvider>
            <OrderProvider>
              <ToastProvider>
                <div className="min-h-screen flex flex-col">
                  <Header />
                  <div className="flex-1 bg-gray-50 dark:bg-gray-800">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/menu" element={<MenuPage />} />
                      <Route
                        path="/track-order"
                        element={<OrderTrackingPage />}
                      />
                      <Route path="/orders" element={<OrderListPage />} />
                      <Route
                        path="/products"
                        element={<ProductManagementPage />}
                      />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/signup" element={<SignupPage />} />
                    </Routes>
                  </div>
                  <Footer />
                </div>
              </ToastProvider>
            </OrderProvider>
          </ProductProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
