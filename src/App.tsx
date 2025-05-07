import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { PageTransition } from "./components/layout/PageTransition";
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

// AnimatedRoutes component to handle AnimatePresence with useLocation
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <HomePage />
            </PageTransition>
          }
        />
        <Route
          path="/menu"
          element={
            <PageTransition>
              <MenuPage />
            </PageTransition>
          }
        />
        <Route
          path="/track-order"
          element={
            <PageTransition>
              <OrderTrackingPage />
            </PageTransition>
          }
        />
        <Route
          path="/orders"
          element={
            <PageTransition>
              <OrderListPage />
            </PageTransition>
          }
        />
        <Route
          path="/products"
          element={
            <PageTransition>
              <ProductManagementPage />
            </PageTransition>
          }
        />
        <Route
          path="/login"
          element={
            <PageTransition>
              <LoginPage />
            </PageTransition>
          }
        />
        <Route
          path="/signup"
          element={
            <PageTransition>
              <SignupPage />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

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
                    <AnimatedRoutes />
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
