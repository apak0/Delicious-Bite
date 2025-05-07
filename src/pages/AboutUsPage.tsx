import React from "react";
import { motion } from "framer-motion";

export function AboutUsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto max-w-4xl px-4 py-12"
    >
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
        About Us
      </h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-10">
        <h2 className="text-2xl font-semibold text-red-600 mb-4">Our Story</h2>
        <p className="text-gray-700 mb-6">
          DeliciousBite was founded in 2010 with a simple mission: to create
          delicious, high-quality meals that bring people together. What started
          as a small family-owned restaurant has grown into a beloved dining
          destination, while still maintaining our commitment to fresh
          ingredients and authentic flavors.
        </p>

        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="flex-1">
            <img
              src="https://images.unsplash.com/photo-1581349485608-9469926a8e5e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              alt="Restaurant interior"
              className="rounded-lg w-full h-64 object-cover"
            />
          </div>
          <div className="flex-1">
            <img
              src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              alt="Our chef cooking"
              className="rounded-lg w-full h-64 object-cover"
            />
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-red-600 mb-4">
          Our Philosophy
        </h2>
        <p className="text-gray-700 mb-6">
          At DeliciousBite, we believe that great food starts with great
          ingredients. We source locally and seasonally whenever possible,
          working directly with farmers and suppliers who share our passion for
          quality and sustainability.
        </p>
        <p className="text-gray-700 mb-8">
          Every dish is prepared with care and attention to detail, combining
          traditional techniques with innovative flavors to create a memorable
          dining experience.
        </p>

        <h2 className="text-2xl font-semibold text-red-600 mb-4">Our Team</h2>
        <p className="text-gray-700 mb-6">
          Our team of talented chefs and dedicated staff are the heart of
          DeliciousBite. Led by Executive Chef Maria Rodriguez, our kitchen team
          brings decades of culinary expertise and a passion for creating
          exceptional food.
        </p>
        <p className="text-gray-700">
          From our kitchen to our dining room, every member of our team is
          committed to providing you with outstanding service and an
          unforgettable dining experience.
        </p>
      </div>

      <motion.div
        className="bg-white rounded-lg shadow-md p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold text-red-600 mb-4">Visit Us</h2>
        <p className="text-gray-700 mb-4">
          We'd love to welcome you to DeliciousBite. Whether you're joining us
          for a casual lunch, a special celebration, or ordering takeout for a
          cozy night at home, we're committed to making your experience
          exceptional.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 items-center">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800 mb-2">Address</h3>
            <p className="text-gray-700">123 Restaurant St</p>
            <p className="text-gray-700">Foodie City, FC 12345</p>
            <p className="text-gray-700 mt-2">(123) 456-7890</p>
            <p className="text-gray-700">info@deliciousbite.com</p>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800 mb-2">Hours</h3>
            <p className="text-gray-700">
              <span className="font-medium">Monday - Friday:</span> 11:00 AM -
              10:00 PM
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Saturday - Sunday:</span> 10:00 AM -
              11:00 PM
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
