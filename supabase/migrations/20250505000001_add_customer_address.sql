/*
  # Add customer_address column to orders table

  1. Changes
    - Add customer_address column to orders table for delivery information
    - Column is TEXT type and nullable initially to maintain backward compatibility
    - Update will allow storing delivery addresses for orders
*/

-- Add the customer_address column to the orders table
ALTER TABLE orders
ADD COLUMN customer_address TEXT;

-- Add comment to the column
COMMENT ON COLUMN orders.customer_address IS 'The delivery address provided by the customer';