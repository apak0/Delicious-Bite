import React from "react";
import { DollarSign, Edit, Trash2, Eye, EyeOff, Tag } from "lucide-react";
import { Button } from "./ui/Button";
import { Card, CardImage, CardContent, CardFooter } from "./ui/Card";
import { formatCurrency } from "../utils/formatters";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  available: boolean;
}

interface ProductCardProps {
  product: Product;
  onUpdate: (id: string, data: Partial<Product>) => void;
  onDelete: (id: string) => void;
  onEdit?: (product: Product) => void;
}

export function ProductCard({
  product,
  onUpdate,
  onDelete,
  onEdit,
}: ProductCardProps) {
  // Toggle availability directly from the card
  const toggleAvailability = () => {
    onUpdate(product.id, { available: !product.available });
  };

  return (
    <Card className="h-full flex flex-col transition-all duration-200 hover:shadow-md border border-gray-200">
      <div className="relative">
        <CardImage
          src={product.image_url}
          alt={product.name}
          className="h-48 object-cover w-full"
        />
        <div className="absolute top-2 right-2">
          <Button
            variant={product.available ? "success" : "outline"}
            size="sm"
            className={`h-8 w-8 p-0 rounded-full ${
              !product.available && "bg-white"
            }`}
            onClick={toggleAvailability}
            title={
              product.available ? "Mark as unavailable" : "Mark as available"
            }
          >
            {product.available ? <Eye size={16} /> : <EyeOff size={16} />}
          </Button>
        </div>

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

        <div className="mt-4 flex items-center">
          <span
            className={`text-xs rounded-full px-2 py-0.5 ${
              product.available
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-gray-100 text-gray-800 border border-gray-200"
            }`}
          >
            {product.available ? "Available" : "Unavailable"}
          </span>
        </div>
      </CardContent>

      <CardFooter className="border-t border-gray-100 pt-4 mt-auto">
        <div className="flex justify-between w-full">
          <Button
            variant="outline"
            size="sm"
            onClick={() => (onEdit ? onEdit(product) : null)}
            className="flex-1 mr-2"
          >
            <Edit size={16} className="mr-1" />
            Edit
          </Button>

          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(product.id)}
            className="flex-1"
          >
            <Trash2 size={16} className="mr-1" />
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default ProductCard;
