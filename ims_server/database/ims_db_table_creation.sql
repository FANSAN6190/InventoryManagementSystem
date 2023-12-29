CREATE TABLE ims_schema.users(
	user_code VARCHAR(12) PRIMARY KEY,
	user_name VARCHAR(20) UNIQUE NOT NULL CHECK (user_name ~ '^[A-Za-z0-9_]{8,20}$'),         ---atleast 8 characters
	full_name VARCHAR(100) CHECK (full_name ~ '^[A-Za-z ]*$'),
	dob DATE,
	email VARCHAR(50) UNIQUE NOT NULL CHECK (email ~ '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
	country_code VARCHAR(4) NOT NULL CHECK (country_code ~ '^\+[0-9]{1,3}$'),
	phone_no VARCHAR(10) UNIQUE NOT NULL CHECK (phone_no ~ '^[0-9]{10}$'),
	--inventory_id VARCHAR(20) REFERENCES ims_schema.inventory(inventory_id)
	hash_pwd TEXT NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	user_preferences JSONB
);

CREATE TABLE ims_schema.inventory(
	inventory_code VARCHAR(10) PRIMARY KEY,
	inventory_id VARCHAR(20) UNIQUE NOT NULL CHECK (inventory_id ~ '^[A-Za-z0-9_]*$'),
	inventory_name VARCHAR(100),
	user_name VARCHAR(20) NOT NULL REFERENCES ims_schema.users(user_name),
	no_of_products INT DEFAULT 0,
	product_catalogue JSONB,
	total_volume INT DEFAULT 0,
	inventory_worth NUMERIC(10, 2) DEFAULT 0.00,
	last_update TIMESTAMP,
	created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ims_schema.suppliers(
	supplier_id VARCHAR(10) PRIMARY KEY,
	supplier_name VARCHAR NOT NULL CHECK (supplier_name ~ '^[A-Za-z ]*$'),
	address VARCHAR,
	phone_no VARCHAR(10) UNIQUE NOT NULL CHECK (phone_no ~ '^[0-9]{10}$'),
	email  VARCHAR(50) UNIQUE CHECK (email ~ '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
	no_of_products INT DEFAULT 0,
	product_catalogue JSONB
); 

CREATE TABLE ims_schema.products(
	product_id VARCHAR(15) PRIMARY KEY,
	product_name VARCHAR NOT NULL,
	price NUMERIC(10, 2),
	supplier_id VARCHAR(10) REFERENCES ims_schema.suppliers(supplier_id),
	product_details JSONB
);

CREATE TABLE ims_schema.inventory_stock(
	inventory_id VARCHAR(20) NOT NULL REFERENCES ims_schema.inventory(inventory_id),
	product_id VARCHAR(15) NOT NULL REFERENCES ims_schema.products(product_id),
	product_name VARCHAR,
	price NUMERIC(10, 2),
	supplier_id VARCHAR(10) REFERENCES ims_schema.suppliers(supplier_id),
	supplier_name VARCHAR,
	current_quantity INT,
	recent_update TIMESTAMP 
);


CREATE TABLE ims_schema.supplier_orders(
	order_id VARCHAR(8) PRIMARY KEY,
	supplier_id VARCHAR(10) REFERENCES ims_schema.suppliers(supplier_id),
	supplier_name VARCHAR,
	order_details JSONB,
	total_amount INT,
	order_status VARCHAR(15),
	transaction_details JSONB
);

CREATE TABLE ims_schema.customer_orders(
	order_id VARCHAR(8) PRIMARY KEY,
	order_details JSONB,
	customer_details JSONB,
	total_amount NUMERIC(10, 2),
	order_status VARCHAR(15),
	transaction_details JSONB
);

CREATE TABLE ims_schema.transactions(
	transaction_id VARCHAR PRIMARY KEY,
	customer_order_id  VARCHAR(8) REFERENCES ims_schema.customer_orders(order_id),
	supplier_order_id  VARCHAR(8) REFERENCES ims_schema.supplier_orders(order_id),
	user_name VARCHAR(20) REFERENCES ims_schema.users(user_name),
	transaction_type VARCHAR NOT NULL,
	transaction_date_time TIMESTAMP NOT NULL,
	transaction_amount NUMERIC(10, 2) NOT NULL
	CHECK (
        (customer_order_id IS NULL)::integer + 
        (supplier_order_id IS NULL)::integer = 1
    )
);
