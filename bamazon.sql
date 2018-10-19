DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products(
    id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(100),
    dept_name VARCHAR(100),
    price DECIMAL(10,4),
    on_hand_qty INT, 
    PRIMARY KEY (id)  
);

-- Ten Items
INSERT INTO products(product_name, dept_name, price, on_hand_qty)
VALUES ("Stereo", "Electronics", 199.99, 15);

INSERT INTO products(product_name, dept_name, price, on_hand_qty)
VALUES ("Limited edition Pug Print", "Home", 38.00, 1);

INSERT INTO products(product_name, dept_name, price, on_hand_qty)
VALUES ("CRT 13in T.V.", "Electronics", .50, 2);

INSERT INTO products(product_name, dept_name, price, on_hand_qty)
VALUES ("Garrett's Slightly Used MacBook Pro 13in", "Electronics", 745.99, 1);

INSERT INTO products(product_name, dept_name, price, on_hand_qty)
VALUES ("Weber Grill", "Outdoor", 149.99, 5);

INSERT INTO products(product_name, dept_name, price, on_hand_qty)
VALUES ("Movie Quality Chewbacca Mask", "Holiday", 500.00, 1);

INSERT INTO products(product_name, dept_name, price, on_hand_qty)
VALUES ("Flux Capacitor", "Electronics", 1985.00, 1);

INSERT INTO products(product_name, dept_name, price, on_hand_qty)
VALUES ("Pork Chop Express", "Automotive", 24999.00, 1);

INSERT INTO products(product_name, dept_name, price, on_hand_qty)
VALUES ("Pretty Hate Machine LP", "Audio", 19.99, 144);

INSERT INTO products(product_name, dept_name, price, on_hand_qty)
VALUES ("Kitchen-Aid Stand Mixer", "Kitchen", 249.99, 48);