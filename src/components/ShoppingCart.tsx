import React, { useState } from "react";
import { ShoppingBag, X, Plus, Minus, Trash2 } from "lucide-react";
import { Button } from "./ui/Button";
import { Input, Textarea } from "./ui/Input";
import { useOrders } from "../context/OrderContext";
import { formatCurrency } from "../utils/formatters";
import { useToast } from "./ui/Toast";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShoppingCart({ isOpen, onClose }: ShoppingCartProps) {
  const { cart, cartDispatch, cartTotal, orderDispatch } = useOrders();
  const { showToast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form validation
  const [errors, setErrors] = useState({
    customerName: "",
    customerPhone: "",
    customerAddress: "",
  });

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;

    cartDispatch({
      type: "UPDATE_QUANTITY",
      payload: { id, quantity },
    });
  };

  const handleRemoveItem = (id: string) => {
    cartDispatch({
      type: "REMOVE_FROM_CART",
      payload: id,
    });
  };

  const handleUpdateInstructions = (id: string, instructions: string) => {
    cartDispatch({
      type: "UPDATE_SPECIAL_INSTRUCTIONS",
      payload: { id, instructions },
    });
  };

  const validateForm = () => {
    const newErrors = {
      customerName: "",
      customerPhone: "",
      customerAddress: "",
    };

    if (!customerName.trim()) {
      newErrors.customerName = "Name is required";
    }

    if (!customerPhone.trim()) {
      newErrors.customerPhone = "Phone number is required";
    } else if (!/^\d{10}$/.test(customerPhone.replace(/\D/g, ""))) {
      newErrors.customerPhone = "Please enter a valid 10-digit phone number";
    }

    if (!customerAddress.trim()) {
      newErrors.customerAddress = "Delivery address is required";
    }

    setErrors(newErrors);

    return !Object.values(newErrors).some((error) => error);
  };

  const handleCheckout = async () => {
    if (checkoutStep === 1) {
      // Check if user is logged in before proceeding to checkout
      if (!user) {
        showToast("Please log in to place an order", "info");
        onClose(); // Close the cart
        navigate("/login"); // Redirect to login page
        return;
      }

      // If user is logged in, proceed to checkout step
      setCheckoutStep(2);

      // Pre-fill form with user's information if available
      if (user) {
        setCustomerName(user.name || "");
      }

      return;
    }

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      // Create new order
      const result = await orderDispatch({
        type: "ADD_ORDER",
        payload: {
          items: cart,
          status: "pending",
          customerName,
          customerPhone,
          customerAddress,
          totalAmount: cartTotal,
        },
      });

      if (result) {
        // Show success toast
        showToast("Your order has been placed successfully!", "success");

        // Clear the cart
        cartDispatch({ type: "CLEAR_CART" });

        // Reset form fields
        setCustomerName("");
        setCustomerPhone("");
        setCustomerAddress("");
        setCheckoutStep(1);

        // Close the cart
        onClose();
      } else {
        showToast("Something went wrong. Please try again.", "error");
      }
    } catch (error) {
      showToast("Failed to place your order. Please try again.", "error");
      console.error("Checkout error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Cart panel */}
      <div className="relative w-full max-w-md bg-white h-full overflow-y-auto shadow-xl transition-transform transform duration-300 ease-in-out">
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <ShoppingBag className="mr-2" size={20} />
            Your Order
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <ShoppingBag size={64} className="text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">Your cart is empty</p>
            <Button variant="outline" className="mt-4" onClick={onClose}>
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            {checkoutStep === 1 ? (
              <>
                <div className="flex-1 px-4 py-4 overflow-y-auto">
                  <ul className="divide-y divide-gray-200">
                    {cart.map((item) => (
                      <li key={item.id} className="py-4">
                        <div className="flex flex-col space-y-3">
                          <div className="flex justify-between">
                            <div className="flex-1 pr-4">
                              <h3 className="text-base font-medium text-gray-900">
                                {item.name}
                              </h3>
                              <p className="mt-1 text-sm text-gray-500 line-clamp-1">
                                {item.description}
                              </p>
                            </div>
                            <p className="text-base font-medium text-gray-900">
                              {formatCurrency(item.price * item.quantity)}
                            </p>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center border border-gray-300 rounded-md">
                              <button
                                className="px-2 py-1 text-gray-600 hover:text-gray-900"
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item.id,
                                    item.quantity - 1
                                  )
                                }
                                disabled={item.quantity <= 1}
                              >
                                <Minus size={16} />
                              </button>
                              <span className="px-4 py-1 text-gray-900">
                                {item.quantity}
                              </span>
                              <button
                                className="px-2 py-1 text-gray-600 hover:text-gray-900"
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item.id,
                                    item.quantity + 1
                                  )
                                }
                              >
                                <Plus size={16} />
                              </button>
                            </div>

                            <button
                              className="text-red-600 hover:text-red-800"
                              onClick={() => handleRemoveItem(item.id)}
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>

                          <Textarea
                            placeholder="Special instructions"
                            value={item.specialInstructions || ""}
                            onChange={(e) =>
                              handleUpdateInstructions(item.id, e.target.value)
                            }
                            className="text-sm"
                            rows={2}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-gray-200 px-4 py-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-base font-medium text-gray-900">
                      Subtotal
                    </span>
                    <span className="text-base font-medium text-gray-900">
                      {formatCurrency(cartTotal)}
                    </span>
                  </div>
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={handleCheckout}
                  >
                    Checkout
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex-1 px-4 py-4 overflow-y-auto">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Complete Your Order
                </h3>

                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleCheckout();
                  }}
                >
                  <Input
                    label="Your Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    error={errors.customerName}
                    fullWidth
                    required
                  />

                  <Input
                    label="Phone Number"
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="e.g., 555-123-4567"
                    error={errors.customerPhone}
                    fullWidth
                    required
                  />

                  <Input
                    label="Delivery Address"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    placeholder="Your full delivery address"
                    error={errors.customerAddress}
                    fullWidth
                    required
                  />

                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-base font-medium text-gray-900">
                        Total
                      </span>
                      <span className="text-base font-medium text-gray-900">
                        {formatCurrency(cartTotal)}
                      </span>
                    </div>

                    <div className="flex space-x-4">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => setCheckoutStep(1)}
                        type="button"
                        disabled={isSubmitting}
                      >
                        Back
                      </Button>
                      <Button
                        variant="primary"
                        className="flex-1"
                        type="submit"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Processing..." : "Place Order"}
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
