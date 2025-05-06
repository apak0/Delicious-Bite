import { useEffect, useState } from "react";
import Slider from "react-slick";
import { DollarSign } from "lucide-react";
import { Card, CardImage, CardContent } from "./ui/Card";
import { useProducts } from "../hooks/useProducts";
import { formatCurrency } from "../utils/formatters";
import type { DbProduct } from "../types";

export function PopularDishes() {
  const { fetchPopularProducts } = useProducts();
  const [popularProducts, setPopularProducts] = useState<DbProduct[]>([]);

  useEffect(() => {
    const loadPopularProducts = async () => {
      const products = await fetchPopularProducts();
      setPopularProducts(products);
    };
    loadPopularProducts();
  }, [fetchPopularProducts]);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  if (popularProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Our Most Popular Dishes
        </h2>
        <div className="relative">
          <Slider {...settings} className="popular-dishes-slider -mx-2">
            {popularProducts.map((product) => (
              <div key={product.id} className="px-2">
                <Card className="h-full bg-white">
                  <div className="relative">
                    <CardImage
                      src={product.image_url}
                      alt={product.name}
                      className="h-48 object-cover w-full"
                    />
                    <span className="absolute top-2 right-2 bg-red-600 text-white text-sm font-bold px-2 py-1 rounded-full flex items-center">
                      <DollarSign size={16} className="mr-0.5" />
                      {formatCurrency(product.price).replace("$", "")}
                    </span>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {product.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
}
