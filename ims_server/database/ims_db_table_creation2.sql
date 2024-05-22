CREATE TABLE ims_schema.users(
	user_id varchar PRIMARY KEY CHECK (user_id ~ '^[A-Za-z0-9_]{6,20}$'),
	user_code varchar UNIQUE NOT NULL,
	full_name varchar(100) NOT NULL CHECK (full_name ~ '^[A-Za-z ]*$'),
	email VARCHAR(50) UNIQUE NOT NULL CHECK (email ~ '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
	phone_no VARCHAR(15) UNIQUE NOT NULL,
	dob DATE,
	hash_pwd TEXT NOT NULL,
	created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	user_preferences JSONB
);

CREATE TABLE ims_schema.inventory(
	inventory_id VARCHAR PRIMARY KEY CHECK (inventory_id ~ '^[A-Za-z0-9_]*$'),
	inventory_name VARCHAR(100),
	user_code VARCHAR NOT NULL REFERENCES ims_schema.users(user_code),
	no_of_products INT DEFAULT 0,
	product_id_list VARCHAR[],
	total_volume INT DEFAULT 0,
	inventory_worth NUMERIC(10, 2) DEFAULT 0.00,
	last_update TIMESTAMP,	
	created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ims_schema.products(
	item_code VARCHAR UNIQUE NOT NULL,
	inventory_id VARCHAR NOT NULL REFERENCES ims_schema.inventory(inventory_id),
	item_category VARCHAR,
	item_type VARCHAR,
	brand VARCHAR,
	product_name VARCHAR NOT NULL,
	product_discription TEXT,
	hssn_code VARCHAR,
	price NUMERIC(10, 2),
	gst_rate NUMERIC(10, 2),
	price_with_gst NUMERIC(10, 2),
	last_update TIMESTAMP,
	other_details JSONB DEFAULT '[]',

	PRIMARY KEY (item_code, inventory_id)
);



CREATE TABLE ims_schema.stock_count(
	item_code VARCHAR NOT NULL REFERENCES ims_schema.products(item_code),
	inventory_id VARCHAR NOT NULL REFERENCES ims_schema.inventory(inventory_id),
	current_quantity INT,
	last_change_in_quantity INT,
	last_update TIMESTAMP,

	PRIMARY KEY (item_code, inventory_id)
);

CREATE TABLE ims_schema.suppliers(
	supplier_id VARCHAR UNIQUE NOT NULL,
	inventory_id VARCHAR NOT NULL REFERENCES ims_schema.inventory(inventory_id),
	supplier_name VARCHAR NOT NULL CHECK (supplier_name ~ '^[A-Za-z ]*$'),
	street_address VARCHAR,
	sup_city VARCHAR,
	sup_state VARCHAR,
	sup_country VARCHAR,
	sup_pincode VARCHAR,
	contact_number VARCHAR(15) UNIQUE NOT NULL,
	email  VARCHAR(50) UNIQUE CHECK (email ~ '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),

	PRIMARY KEY (supplier_id, inventory_id)
);

CREATE TABLE ims_schema.transactions(
	transaction_id VARCHAR UNIQUE NOT NULL,
	user_code VARCHAR NOT NULL REFERENCES ims_schema.users(user_code),
	inventory_id VARCHAR REFERENCES ims_schema.inventory(inventory_id),
	transaction_type VARCHAR(15),
	transaction_amount NUMERIC(10, 2),
	from_account VARCHAR,
	to_account VARCHAR,
	transaction_timestamp TIMESTAMP,

	PRIMARY KEY (transaction_id, user_code, inventory_id)
);

CREATE TABLE ims_schema.customer_orders(
	cus_order_id VARCHAR UNIQUE NOT NULL,
	inventory_id VARCHAR NOT NULL REFERENCES ims_schema.inventory(inventory_id),
	customer_details JSONB,
	order_volume INT,
	total_amount NUMERIC(10, 2),
	order_status VARCHAR(15),
	order_timestamp TIMESTAMP,
	transaction_id VARCHAR REFERENCES ims_schema.transactions(transaction_id),

	PRIMARY KEY (cus_order_id, inventory_id)
);

CREATE TABLE ims_schema.supplier_orders(
	sup_order_id VARCHAR UNIQUE NOT NULL,
	inventory_id VARCHAR NOT NULL REFERENCES ims_schema.inventory(inventory_id),
	supplier_id VARCHAR REFERENCES ims_schema.suppliers(supplier_id),
	order_volume INT,
	total_amount NUMERIC(10, 2),
	order_status VARCHAR(15),
	order_timestamp TIMESTAMP,
	transaction_id VARCHAR REFERENCES ims_schema.transactions(transaction_id),
	
	PRIMARY KEY (sup_order_id, inventory_id)
);

CREATE TABLE ims_schema.ordered_products(
	item_code VARCHAR NOT NULL REFERENCES ims_schema.products(item_code),
	inventory_id VARCHAR NOT NULL REFERENCES ims_schema.inventory(inventory_id),
	cus_order_id VARCHAR REFERENCES ims_schema.customer_orders(cus_order_id),
	sup_order_id VARCHAR REFERENCES ims_schema.supplier_orders(sup_order_id),
	ordered_qty INT,
	total_amount NUMERIC(10, 2),
	hssn_code VARCHAR,
	gst_amount NUMERIC(10, 2),
	total_amount_with_gst NUMERIC(10, 2),

	PRIMARY KEY (item_code, inventory_id, cus_order_id, sup_order_id)
);

CREATE TABLE ims_schema.billings(
	bill_no VARCHAR UNIQUE NOT NULL,
	transaction_id VARCHAR REFERENCES ims_schema.transactions(transaction_id),
	inventory_id VARCHAR REFERENCES ims_schema.inventory(inventory_id),
	bill_info JSONB,  -- will contain customer details and other billing info
	total_amount NUMERIC(10, 2),
	gst_no VARCHAR,
	cgst_amount NUMERIC(10, 2),
	sgst_amount NUMERIC(10, 2),
	billing_amount NUMERIC(10, 2),
	billing_timestamp TIMESTAMP,

	PRIMARY KEY (bill_no, transaction_id, inventory_id)
);
CREATE SEQUENCE ims_schema.user_code_seq START 1;


-- Create an audit table
CREATE TABLE ims_schema.stock_count_audit(
    audit_id SERIAL PRIMARY KEY,
    item_code VARCHAR NOT NULL REFERENCES ims_schema.products(item_code),
    inventory_id VARCHAR NOT NULL REFERENCES ims_schema.inventory(inventory_id),
    old_quantity INT,
    new_quantity INT,
    change_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create a trigger function
CREATE OR REPLACE FUNCTION audit_stock_count() RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO ims_schema.stock_count_audit(item_code, inventory_id, old_quantity, new_quantity)
    VALUES (OLD.item_code, OLD.inventory_id, OLD.current_quantity, NEW.current_quantity);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger
CREATE TRIGGER stock_count_audit_trigger
AFTER UPDATE ON ims_schema.stock_count
FOR EACH ROW EXECUTE PROCEDURE audit_stock_count();
