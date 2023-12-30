-- Insert data into users
INSERT INTO ims_schema.users(user_code, user_name, full_name, dob, email, country_code, phone_no, hash_pwd)
VALUES 
('U0001', 'username1', 'User One', '1980-01-01', 'user1@example.com', '+1', '1234567890', 'pass1'),
('U0002', 'username2', 'User Two', '1985-02-02', 'user2@example.com', '+1', '2345678901', 'pass2');


-- Insert data into inventory
INSERT INTO ims_schema.inventory(inventory_code, inventory_id, inventory_name, user_name)
VALUES 
('I101', 'INV101', 'Inventory One', 'username1'),
('I102', 'INV102', 'Inventory Two', 'username2');


-- Insert data into suppliers
INSERT INTO ims_schema.suppliers(supplier_id, supplier_name, phone_no, email)
VALUES 
('S101', 'Supplier One', '1234567890', 'supplier1@example.com'),
('S102', 'Supplier Two', '2345678901', 'supplier2@example.com'),
('S103', 'Supplier Three', '3456789012', NULL);

-- Insert data into products
INSERT INTO ims_schema.products(product_id, product_name, price, supplier_id)
SELECT 
    'P' || LPAD(s.i::text, 3, '0'),
    'Product ' || s.i,
    (RANDOM() * 100)::numeric(10,2),
    CASE 
        WHEN s.i % 3 = 0 THEN 'S101'
        WHEN s.i % 3 = 1 THEN 'S102'
        ELSE 'S103'
    END
FROM generate_series(1, 20) AS s(i);

-- Insert data into inventory_stock
INSERT INTO ims_schema.inventory_stock(inventory_id, product_id, product_name, price, supplier_id, current_quantity)
SELECT 
    CASE 
        WHEN s.i % 2 = 0 THEN 'INV101'
        ELSE 'INV102'
    END,
    p.product_id,
    p.product_name,
    p.price,
    p.supplier_id,
    (RANDOM() * 100)::integer
FROM generate_series(1, 20) AS s(i)
JOIN ims_schema.products p ON p.product_id = 'P' || LPAD(s.i::text, 3, '0');


-- Insert data into supplier_orders
INSERT INTO ims_schema.supplier_orders(order_id, supplier_id, supplier_name, order_details, total_amount, order_status)
SELECT 
    'SO' || LPAD(s.i::text, 3, '0'),
    CASE 
        WHEN s.i % 3 = 0 THEN 'S101'
        WHEN s.i % 3 = 1 THEN 'S102'
        ELSE 'S103'
    END,
    'Supplier ' || ((s.i % 3) + 1),
    ('{"products": ["P' || LPAD(s.i::text, 3, '0') || '"]}')::jsonb,
    (RANDOM() * 1000)::integer,
    CASE 
        WHEN s.i % 2 = 0 THEN 'completed'
        ELSE 'pending'
    END
FROM generate_series(1, 8) AS s(i);

-- Insert data into customer_orders
INSERT INTO ims_schema.customer_orders(order_id, order_details, customer_details, total_amount, order_status)
SELECT 
    'CO' || LPAD(s.i::text, 3, '0'),
    ('{"products": ["P' || LPAD(s.i::text, 3, '0') || '"]}')::jsonb,
    ('{"name": "User ' || ((s.i % 2) + 1) || '", "address": "' || s.i || ' Street"}')::jsonb,
    (RANDOM() * 1000)::numeric(10,2),
    CASE 
        WHEN s.i % 2 = 0 THEN 'completed'
        ELSE 'pending'
    END
FROM generate_series(1, 14) AS s(i);


-- Function to check if a number is prime
CREATE OR REPLACE FUNCTION is_prime(n INT) RETURNS BOOLEAN AS $$
DECLARE
    i INT;
BEGIN
    IF n < 2 THEN
        RETURN FALSE;
    END IF;
    FOR i IN 2..SQRT(n) LOOP
        IF n % i = 0 THEN
            RETURN FALSE;
        END IF;
    END LOOP;
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;
-- Insert data into transactions
INSERT INTO ims_schema.transactions(transaction_id, customer_order_id, supplier_order_id, user_name, transaction_type, transaction_date_time, transaction_amount)
SELECT 
    'T' || LPAD(s.i::text, 3, '0'),
    CASE 
        WHEN (s.i <= 14 AND CO.order_status = 'completed') THEN 'CO' || LPAD(s.i::text, 3, '0') -- Assign customer_order_id for numbers less than or equal to 14
        ELSE NULL
    END,
    CASE 
        WHEN (s.i > 14 AND s.i <= 22 AND SO.order_status = 'completed') THEN 'SO' || LPAD((s.i - 14)::text, 3, '0') -- Assign supplier_order_id for numbers greater than 14 and less than or equal to 22
        ELSE NULL
    END,
    CASE 
        WHEN s.i % 2 = 0 THEN 'username1'
        ELSE 'username2'
    END,
    CASE 
        WHEN s.i % 4 = 0 THEN 'credit'
        WHEN s.i % 4 = 1 THEN 'cash'
        WHEN s.i % 4 = 2 THEN 'UPI'
        ELSE 'debit'
    END,
    CURRENT_TIMESTAMP,
    (RANDOM() * 1000)::numeric(10,2)
FROM generate_series(1, 22) AS s(i)
LEFT JOIN ims_schema.customer_orders CO ON CO.order_id = 'CO' || LPAD(s.i::text, 3, '0')
LEFT JOIN ims_schema.supplier_orders SO ON SO.order_id = 'SO' || LPAD((s.i - 14)::text, 3, '0')
WHERE ((s.i <= 14 AND CO.order_status = 'completed') OR (s.i > 14 AND s.i <= 22 AND SO.order_status = 'completed'));