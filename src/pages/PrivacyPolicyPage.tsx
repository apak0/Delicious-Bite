import React from "react";
import { motion } from "framer-motion";

export function PrivacyPolicyPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto max-w-4xl px-4 py-12"
    >
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
        Privacy Policy
      </h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <p className="text-gray-700 mb-6">
          At DeliciousBite, we take your privacy seriously. This Privacy Policy
          explains how we collect, use, disclose, and safeguard your information
          when you visit our website, use our mobile application, or dine at our
          restaurant.
        </p>
        <p className="text-gray-700 mb-6">Last updated: May 1, 2025</p>

        <div className="space-y-8">
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-2xl font-semibold text-red-600 mb-4">
              Information We Collect
            </h2>
            <div className="pl-4 border-l-4 border-red-100">
              <h3 className="font-semibold text-gray-800 mb-2">
                Personal Information
              </h3>
              <p className="text-gray-700 mb-4">
                We may collect personal information that you voluntarily provide
                to us when you:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Create an account with us</li>
                <li>Place an order online or through our mobile app</li>
                <li>Make a reservation</li>
                <li>
                  Sign up for our newsletter or promotional communications
                </li>
                <li>Participate in surveys or contests</li>
                <li>Contact our customer service</li>
              </ul>
              <p className="text-gray-700">
                This information may include your name, email address, phone
                number, delivery address, payment information, and dining
                preferences.
              </p>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-semibold text-red-600 mb-4">
              How We Use Your Information
            </h2>
            <div className="pl-4 border-l-4 border-red-100">
              <p className="text-gray-700 mb-4">
                We use the information we collect for various business and
                commercial purposes, including:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Processing and fulfilling your orders</li>
                <li>Managing your account and providing customer support</li>
                <li>Sending transactional messages and order updates</li>
                <li>Sending marketing communications (with your consent)</li>
                <li>Improving our services, website, and mobile app</li>
                <li>Analyzing usage patterns and trends</li>
                <li>
                  Preventing fraudulent transactions and monitoring against
                  theft
                </li>
                <li>Complying with legal obligations</li>
              </ul>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-semibold text-red-600 mb-4">
              Sharing Your Information
            </h2>
            <div className="pl-4 border-l-4 border-red-100">
              <p className="text-gray-700 mb-4">
                We may share your information with:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Service providers that help us operate our business</li>
                <li>Payment processors to complete transactions</li>
                <li>Delivery partners to fulfill your orders</li>
                <li>Marketing partners (with your consent)</li>
                <li>Legal authorities when required by law</li>
              </ul>
              <p className="text-gray-700">
                We do not sell your personal information to third parties.
              </p>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-semibold text-red-600 mb-4">
              Your Rights
            </h2>
            <div className="pl-4 border-l-4 border-red-100">
              <p className="text-gray-700 mb-4">
                Depending on your location, you may have certain rights
                regarding your personal information, including:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>The right to access your personal information</li>
                <li>The right to correct inaccurate information</li>
                <li>The right to delete your information</li>
                <li>The right to object to or restrict processing</li>
                <li>The right to data portability</li>
                <li>The right to withdraw consent</li>
              </ul>
              <p className="text-gray-700">
                To exercise these rights, please contact us at
                privacy@deliciousbite.com.
              </p>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-2xl font-semibold text-red-600 mb-4">
              Contact Us
            </h2>
            <div className="pl-4 border-l-4 border-red-100">
              <p className="text-gray-700 mb-4">
                If you have any questions or concerns about our Privacy Policy
                or data practices, please contact us at:
              </p>
              <p className="text-gray-700">
                <strong>Email:</strong> privacy@deliciousbite.com
                <br />
                <strong>Address:</strong> 123 Restaurant St, Foodie City, FC
                12345
                <br />
                <strong>Phone:</strong> (123) 456-7890
              </p>
            </div>
          </motion.section>
        </div>
      </div>
    </motion.div>
  );
}
