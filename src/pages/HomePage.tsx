import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { ArrowRight, Star, Clock, Award, Tag } from "lucide-react";
import { PopularDishes } from "../components/PopularDishes";

export function HomePage() {
  const features = [
    {
      icon: <Clock className="h-8 w-8 text-red-600" />,
      title: "Quick Service",
      description:
        "From kitchen to table in under 20 minutes. We value your time.",
    },
    {
      icon: <Star className="h-8 w-8 text-red-600" />,
      title: "Quality Ingredients",
      description: "Fresh, locally-sourced ingredients for the best flavors.",
    },
    {
      icon: <Award className="h-8 w-8 text-red-600" />,
      title: "Award Winning",
      description: "Multiple awards for best dining experience and service.",
    },
    {
      icon: <Tag className="h-8 w-8 text-red-600" />,
      title: "Special Offers",
      description: "Regular promotions and discounts for our loyal customers.",
    },
  ];

  return (
    <main>
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent z-10"></div>
        <div
          className="h-[500px] bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
          }}
        ></div>
        <div className="absolute inset-0 flex items-center z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-lg">
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
                Delicious Food,{" "}
                <span className="text-red-600">Delivered Fast</span>
              </h1>
              <p className="mt-4 text-xl text-gray-300">
                Experience the best flavors in town with our chef-prepared meals
                made from fresh ingredients.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link to="/menu">
                  <Button variant="primary" className="sm:w-auto w-full">
                    View Menu
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Dishes Section */}
      <PopularDishes />

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Why Choose DeliciousBite?
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              We're passionate about good food and excellent service.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-100 transition-transform duration-300 hover:-translate-y-2"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              What Our Customers Say
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Don't just take our word for it. Here's what our happy customers
              have to say.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "The food was absolutely delicious! Fast delivery and the order
                was exactly as requested. Will definitely order again!"
              </p>
              <div className="mt-4">
                <p className="font-medium text-gray-900">Sarah Johnson</p>
                <p className="text-sm text-gray-500">Regular Customer</p>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "Best pizza in town! The crust is perfect and the toppings are
                fresh. Their online ordering system is also very convenient."
              </p>
              <div className="mt-4">
                <p className="font-medium text-gray-900">Michael Brown</p>
                <p className="text-sm text-gray-500">Food Enthusiast</p>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="flex items-center mb-4">
                {[...Array(4)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 text-yellow-400 fill-current"
                  />
                ))}
                <Star className="h-5 w-5 text-gray-300" />
              </div>
              <p className="text-gray-600 mb-4">
                "Great food and reasonable prices. The ability to track my order
                in real-time was a nice touch. Highly recommend their burgers!"
              </p>
              <div className="mt-4">
                <p className="font-medium text-gray-900">Emily Chen</p>
                <p className="text-sm text-gray-500">First Time Customer</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-red-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Ready to Order?
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-red-100 mx-auto">
            Satisfy your cravings now with our delicious menu options.
          </p>
          <div className="mt-8">
            <Link to="/menu">
              <Button variant="secondary" className="text-lg px-8 py-3">
                Order Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
