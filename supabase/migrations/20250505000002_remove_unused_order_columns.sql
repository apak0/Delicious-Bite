/*
  # Remove unused columns from orders table

  1. Changes
    - Remove estimated_delivery_time column from orders table
    - Remove table_number column from orders table
    - These columns are no longer needed in the application
*/

-- Remove the columns from the orders table
ALTER TABLE orders
DROP COLUMN IF EXISTS estimated_delivery_time,
DROP COLUMN IF EXISTS table_number;