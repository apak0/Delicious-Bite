import React from "react";
import { motion } from "framer-motion";

export function TermsConditionsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto max-w-4xl px-4 py-12"
    >
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
        Terms & Conditions
      </h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <p className="text-gray-700 mb-6">
          Welcome to DeliciousBite. By accessing or using our website, mobile
          application, or our services, you agree to be bound by these Terms and
          Conditions. Please read them carefully before placing an order or
          using our services.
        </p>
        <p className="text-gray-700 mb-6">Last updated: May 1, 2025</p>

        <div className="space-y-8">
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-2xl font-semibold text-red-600 mb-4">
              1. Acceptance of Terms
            </h2>
            <div className="pl-4 border-l-4 border-red-100">
              <p className="text-gray-700 mb-4">
                By accessing our website, placing an order, or using our
                services, you acknowledge that you have read, understood, and
                agree to be bound by these Terms and Conditions. If you do not
                agree to these terms, please do not use our services.
              </p>
              <p className="text-gray-700">
                We reserve the right to modify these terms at any time. Your
                continued use of our services following any changes constitutes
                your acceptance of the revised terms.
              </p>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-semibold text-red-600 mb-4">
              2. Ordering and Payment
            </h2>
            <div className="pl-4 border-l-4 border-red-100">
              <p className="text-gray-700 mb-4">
                When you place an order through our website or mobile app, you
                are making an offer to purchase the products you have selected.
                We reserve the right to accept or reject your order for any
                reason.
              </p>
              <p className="text-gray-700 mb-4">
                All prices listed on our website or mobile app are in USD and
                include applicable taxes. Delivery fees may apply and will be
                clearly displayed before checkout.
              </p>
              <p className="text-gray-700">
                Payment must be made at the time of ordering. We accept major
                credit cards, debit cards, and other payment methods as
                indicated during the checkout process.
              </p>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-semibold text-red-600 mb-4">
              3. Delivery and Pickup
            </h2>
            <div className="pl-4 border-l-4 border-red-100">
              <p className="text-gray-700 mb-4">
                Delivery times are estimates and may vary depending on order
                volume, weather conditions, and other factors beyond our
                control. We will make reasonable efforts to deliver your order
                within the estimated time frame.
              </p>
              <p className="text-gray-700 mb-4">
                For pickup orders, please bring a valid ID that matches the name
                on the order. Orders not picked up within 30 minutes after the
                scheduled pickup time may be discarded, and no refund will be
                issued.
              </p>
              <p className="text-gray-700">
                We reserve the right to limit our delivery area and may refuse
                delivery to certain locations for safety or operational reasons.
              </p>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-semibold text-red-600 mb-4">
              4. Cancellations and Refunds
            </h2>
            <div className="pl-4 border-l-4 border-red-100">
              <p className="text-gray-700 mb-4">
                Orders may be cancelled within 5 minutes of placing them. After
                this time, cancellations may not be possible as food preparation
                may have begun.
              </p>
              <p className="text-gray-700 mb-4">
                If your order is incorrect, incomplete, or not of acceptable
                quality, please contact us immediately. We may offer a refund,
                replacement, or store credit at our discretion.
              </p>
              <p className="text-gray-700">
                Refunds will be processed using the original payment method and
                may take 3-5 business days to appear on your account.
              </p>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-2xl font-semibold text-red-600 mb-4">
              5. User Accounts
            </h2>
            <div className="pl-4 border-l-4 border-red-100">
              <p className="text-gray-700 mb-4">
                You are responsible for maintaining the confidentiality of your
                account credentials and for all activities that occur under your
                account. You agree to notify us immediately of any unauthorized
                use of your account.
              </p>
              <p className="text-gray-700">
                We reserve the right to terminate or suspend your account at any
                time for any reason, including violation of these Terms and
                Conditions.
              </p>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-2xl font-semibold text-red-600 mb-4">
              6. Limitation of Liability
            </h2>
            <div className="pl-4 border-l-4 border-red-100">
              <p className="text-gray-700 mb-4">
                To the maximum extent permitted by law, DeliciousBite shall not
                be liable for any indirect, incidental, special, consequential,
                or punitive damages, or any loss of profits or revenues, whether
                incurred directly or indirectly.
              </p>
              <p className="text-gray-700">
                Our total liability for any claims under these terms shall not
                exceed the amount paid by you for the order giving rise to such
                claim.
              </p>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <h2 className="text-2xl font-semibold text-red-600 mb-4">
              7. Contact Information
            </h2>
            <div className="pl-4 border-l-4 border-red-100">
              <p className="text-gray-700 mb-4">
                If you have any questions or concerns about these Terms and
                Conditions, please contact us at:
              </p>
              <p className="text-gray-700">
                <strong>Email:</strong> terms@deliciousbite.com
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
