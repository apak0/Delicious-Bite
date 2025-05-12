import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingBag, Menu, X, UserCircle, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart } from "./ShoppingCart";
import { useOrders } from "../hooks/useOrders";
import { useAuth } from "../context/AuthContext";

// Animation variants
const dropdownVariants = {
  hidden: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: {
      duration: 0.2,
    },
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: {
      duration: 0.2,
    },
  },
};

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { cart } = useOrders();
  const { user, signOut, isStaff } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Ref for the user menu dropdown
  const userMenuRef = useRef<HTMLDivElement>(null);
  const userButtonRef = useRef<HTMLButtonElement>(null);

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    signOut();
    setIsUserMenuOpen(false);
    navigate("/");
  };

  // Handle clicks outside of the user menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isUserMenuOpen &&
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node) &&
        userButtonRef.current &&
        !userButtonRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/menu", label: "Menu" },
  ];

  const adminLinks = [
    { to: "/orders", label: "Orders" },
    { to: "/products", label: "Products" },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleCart = () => setIsCartOpen(!isCartOpen);
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {" "}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img
                src="/logo.svg"
                alt="DeliciousBite Logo"
                className="h-9 w-9"
              />
              <span className="ml-2 text-xl font-bold text-gray-900">
                DeliciousBite
              </span>
            </Link>
          </div>
          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-base font-medium transition-colors duration-200 ${
                  location.pathname === link.to
                    ? "text-red-600 border-b-2 border-red-600"
                    : "text-gray-500 hover:text-red-600"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {isStaff &&
              adminLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-base font-medium transition-colors duration-200 ${
                    location.pathname === link.to
                      ? "text-red-600 border-b-2 border-red-600"
                      : "text-gray-500 hover:text-red-600"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
          </nav>
          <div className="flex items-center">
            {/* Cart button */}
            <div className="ml-4 flow-root">
              <button
                className="group -m-2 p-2 flex items-center relative"
                onClick={toggleCart}
              >
                <ShoppingBag
                  className="flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-red-600"
                  aria-hidden="true"
                />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 rounded-full w-5 h-5 flex items-center justify-center text-xs text-white">
                    {cartItemsCount}
                  </span>
                )}
              </button>
            </div>

            {/* User menu */}
            <div className="ml-4 relative">
              <button
                ref={userButtonRef}
                className="flex items-center focus:outline-none"
                onClick={toggleUserMenu}
              >
                <UserCircle className="h-8 w-8 text-gray-400 hover:text-red-600" />
              </button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.ul
                    role="menu"
                    ref={userMenuRef}
                    className="absolute right-0 z-10 mt-2 min-w-[220px] overflow-auto rounded-lg border border-slate-200 bg-white p-1.5 shadow-lg shadow-sm focus:outline-none"
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    style={{ originX: 1, originY: 0 }}
                  >
                    <div className="py-1">
                      {user ? (
                        <>
                          <div className="px-4 py-2">
                            <p className="text-sm font-medium text-gray-900">
                              {user.name}
                            </p>
                            <p className="text-xs text-gray-500 capitalize">
                              {user.role}
                            </p>
                          </div>
                          <Link
                            to="/orders"
                            className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 items-center"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <ShoppingBag size={16} className="mr-2" />
                            My Orders
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link
                            to="/login"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            Login
                          </Link>
                          <Link
                            to="/signup"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            Sign Up
                          </Link>
                        </>
                      )}
                    </div>

                    {user && (
                      <div className="py-1">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                        >
                          <LogOut size={16} className="mr-2" />
                          Logout
                        </button>
                      </div>
                    )}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden ml-4">
              <button
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-red-600 hover:bg-gray-100 focus:outline-none"
                onClick={toggleMenu}
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`block px-3 py-2 text-base font-medium ${
                    location.pathname === link.to
                      ? "text-red-600 bg-red-50"
                      : "text-gray-500 hover:bg-gray-50 hover:text-red-600"
                  }`}
                  onClick={toggleMenu}
                >
                  {link.label}
                </Link>
              ))}

              {isStaff &&
                adminLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`block px-3 py-2 text-base font-medium ${
                      location.pathname === link.to
                        ? "text-red-600 bg-red-50"
                        : "text-gray-500 hover:bg-gray-50 hover:text-red-600"
                    }`}
                    onClick={toggleMenu}
                  >
                    {link.label}
                  </Link>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Shopping Cart */}
      <AnimatePresence>
        {isCartOpen && (
          <ShoppingCart
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
          />
        )}
      </AnimatePresence>
    </header>
  );
}
