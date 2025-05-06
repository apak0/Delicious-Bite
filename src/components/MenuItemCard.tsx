import React, { useState } from "react";
import { DollarSign, Tag, Plus, Minus, ShoppingBag } from "lucide-react";
import { Button } from "./ui/Button";
import { Card, CardImage, CardContent, CardFooter } from "./ui/Card";
import { formatCurrency } from "../utils/formatters";
import { useOrders } from "../hooks/useOrders";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  available: boolean;
}

interface MenuItemCardProps {
  product: Product;
}

export function MenuItemCard({ product }: MenuItemCardProps) {
  const { cartDispatch, cart } = useOrders();
  const [quantity, setQuantity] = useState(1);

  // Check if product is already in cart
  const cartItem = cart.find((item) => item.id === product.id);
  const isInCart = Boolean(cartItem);

  const handleAddToCart = () => {
    cartDispatch({
      type: "ADD_TO_CART",
      payload: {
        ...product,
        quantity,
      },
    });
    setQuantity(1); // Reset quantity after adding
  };

  const handleIncreaseQuantity = () => {
    setQuantity((prev) => Math.min(prev + 1, 10)); // Max 10 items
  };

  const handleDecreaseQuantity = () => {
    setQuantity((prev) => Math.max(prev - 1, 1)); // Min 1 item
  };

  return (
    <Card className="h-full flex flex-col transition-all duration-200 hover:shadow-md border border-gray-200">
      <div className="relative">
        <CardImage
          src={product.image_url}
          alt={product.name}
          className="h-48 object-cover w-full"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
          <div className="flex justify-between items-center">
            <span className="bg-white/90 text-gray-800 text-xs px-2 py-1 rounded-full flex items-center">
              <Tag size={12} className="mr-1" />
              {product.category}
            </span>
            <span className="bg-red-600/90 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
              <DollarSign size={12} className="mr-0.5" />
              {formatCurrency(product.price).replace("$", "")}
            </span>
          </div>
        </div>
      </div>

      <CardContent className="flex-grow">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 mt-1">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mt-2 line-clamp-3">
          {product.description}
        </p>
      </CardContent>

      <CardFooter className="border-t border-gray-100 pt-4 mt-auto">
        {isInCart ? (
          <div className="w-full">
            <Button
              variant="outline"
              size="sm"
              className="w-full text-green-700 border-green-200 bg-green-50"
              disabled
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Already in Cart ({cartItem?.quantity})
            </Button>
          </div>
        ) : (
          <div className="w-full">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  className="px-2 py-1 text-gray-600 hover:text-gray-900 disabled:opacity-50"
                  onClick={handleDecreaseQuantity}
                  disabled={quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                <span className="px-4 py-1 text-gray-900">{quantity}</span>
                <button
                  className="px-2 py-1 text-gray-600 hover:text-gray-900 disabled:opacity-50"
                  onClick={handleIncreaseQuantity}
                  disabled={quantity >= 10}
                >
                  <Plus size={16} />
                </button>
              </div>
              <span className="font-medium text-gray-700">
                {formatCurrency(product.price * quantity)}
              </span>
            </div>
            <Button
              variant="primary"
              size="sm"
              className="w-full"
              onClick={handleAddToCart}
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

export function MenuItemCardSkeleton() {
  return (
    <Card className="h-full flex flex-col animate-pulse border border-gray-200">
      <div className="relative">
        <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300 w-full" />
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <div className="flex justify-between items-center">
            <div className="h-6 w-20 bg-white/90 rounded-full" />
            <div className="h-6 w-16 bg-red-200 rounded-full" />
          </div>
        </div>
      </div>

      <CardContent className="flex-grow">
        <div className="h-6 w-3/4 bg-gray-200 rounded mb-3" />
        <div className="space-y-2">
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-5/6 bg-gray-200 rounded" />
        </div>
      </CardContent>

      <CardFooter className="border-t border-gray-100 pt-4 mt-auto">
        <div className="w-full space-y-3">
          <div className="flex justify-between items-center">
            <div className="h-8 w-24 bg-gray-200 rounded" />
            <div className="h-8 w-20 bg-gray-200 rounded" />
          </div>
          <div className="h-9 w-full bg-gray-200 rounded" />
        </div>
      </CardFooter>
    </Card>
  );
}

export default MenuItemCard;
