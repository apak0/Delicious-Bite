import React, { useState, useEffect } from "react";
import {
  X,
  Image,
  DollarSign,
  Package,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "./ui/Button";
import { Input, Textarea, Select } from "./ui/Input";

interface Product {
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  available: boolean;
}

interface ProductFormProps {
  initialData?: Partial<Product>;
  onSubmit: (data: Product) => void;
  onCancel: () => void;
}

// Common food categories for restaurants
const COMMON_CATEGORIES = [
  "Appetizers",
  "Chicken",
  "Beef",
  "Soups",
  "Salads",
  "Sandwiches",
  "Desserts",
  "Main Courses",
  "Burgers",
  "Pizza",
  "Pasta",
  "Seafood",
  "Vegetarian",
  "Desserts",
  "Beverages",
  "Sides",
];

export default function ProductForm({
  initialData,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const [formData, setFormData] = useState<Product>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price || 0,
    image_url: initialData?.image_url || "",
    category: initialData?.category || "",
    available: initialData?.available ?? true,
  });

  // Form validation
  const [errors, setErrors] = useState({
    name: "",
    description: "",
    price: "",
    image_url: "",
    category: "",
  });

  // Image preview
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Set image preview when URL changes
  useEffect(() => {
    if (formData.image_url) {
      setImagePreview(formData.image_url);
    } else {
      setImagePreview(null);
    }
  }, [formData.image_url]);

  // Field handling
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    // For number inputs, ensure they're parsed as floats
    if (type === "number") {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? "" : parseFloat(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear validation errors when field is edited
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // Form validation function
  const validateForm = (): boolean => {
    let valid = true;
    const newErrors = { ...errors };

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
      valid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
      valid = false;
    } else if (formData.description.length < 10) {
      newErrors.description = "Description should be at least 10 characters";
      valid = false;
    }

    if (formData.price <= 0) {
      newErrors.price = "Price must be greater than 0";
      valid = false;
    }

    if (!formData.image_url.trim()) {
      newErrors.image_url = "Image URL is required";
      valid = false;
    } else {
      try {
        new URL(formData.image_url);
      } catch (e) {
        newErrors.image_url = "Please enter a valid URL";
        valid = false;
      }
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  // Custom category handling (to allow both selection and custom input)
  const [customCategory, setCustomCategory] = useState(
    !COMMON_CATEGORIES.includes(formData.category) && formData.category !== ""
  );

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    if (value === "custom") {
      setCustomCategory(true);
      setFormData((prev) => ({ ...prev, category: "" }));
    } else {
      setCustomCategory(false);
      setFormData((prev) => ({ ...prev, category: value }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Product Details
          </h3>

          <Input
            label="Product Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Chicken Alfredo Pasta"
            error={errors.name}
            fullWidth
            required
            className="mb-4"
            icon={<Package className="h-5 w-5 text-gray-400" />}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price"
              type="number"
              name="price"
              value={formData.price.toString()}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              error={errors.price}
              fullWidth
              required
              icon={<DollarSign className="h-5 w-5 text-gray-400" />}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Availability
              </label>
              <div className="mt-1 flex items-center">
                <div
                  className={`w-full py-2 px-1 flex items-center justify-between rounded-md ${
                    formData.available
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-gray-50 text-gray-500 border border-gray-200"
                  }`}
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="available"
                      id="available"
                      checked={formData.available}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <label
                      htmlFor="available"
                      className="mx-2 block text-sm font-medium"
                    >
                      Available
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            {customCategory ? (
              <div className="space-y-2">
                <Input
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="Enter custom category"
                  error={errors.category}
                  fullWidth
                  required
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-1"
                  onClick={() => setCustomCategory(false)}
                >
                  Use Common Category
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Select
                  options={[
                    { value: "", label: "Select a category" },
                    ...COMMON_CATEGORIES.map((cat) => ({
                      value: cat,
                      label: cat,
                    })),
                    { value: "custom", label: "+ Add Custom Category" },
                  ]}
                  name="category"
                  value={formData.category}
                  onChange={handleCategoryChange}
                  error={errors.category}
                  fullWidth
                  required
                />
              </div>
            )}
          </div>

          <Textarea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the dish including key ingredients and preparation method"
            rows={4}
            error={errors.description}
            fullWidth
            required
          />
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Product Image
          </h3>

          <Input
            label="Image URL"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            placeholder="URL"
            error={errors.image_url}
            fullWidth
            required
            icon={<Image className="h-5 w-5 text-gray-400" />}
          />

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image Preview
            </label>
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 h-64 flex items-center justify-center">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Product Preview"
                  className="w-full h-full object-contain"
                  onError={() => setImagePreview(null)}
                />
              ) : (
                <div className="text-center p-4">
                  <Image className="h-16 w-16 text-gray-300 mx-auto" />
                  <p className="text-gray-500 mt-2">Preview will appear here</p>
                  <p className="text-gray-400 text-sm">
                    Enter a valid image URL above
                  </p>
                </div>
              )}
            </div>
            {errors.image_url && (
              <p className="mt-1 text-sm text-red-500 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.image_url}
              </p>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mt-4">
            <h4 className="font-medium text-gray-700 flex items-center">
              <AlertCircle className="h-4 w-4 mr-2 text-gray-400" />
              Tips for Great Images
            </h4>
            <ul className="mt-2 text-sm text-gray-600 space-y-1 ml-6 list-disc">
              <li>Use high-resolution images (at least 800x600 pixels)</li>
              <li>Ensure good lighting to showcase the food</li>
              <li>Food should be the main focus of the image</li>
              <li>Square or landscape images work best</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-5 border-t border-gray-200 flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {initialData?.name ? "Update Product" : "Add Product"}
        </Button>
      </div>
    </form>
  );
}
