
-- Orders table
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'completed', 'cancelled', 'shipping', 'processing') DEFAULT 'pending',
  checkout_session_id VARCHAR(255),
  created_at DATETIME DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Order Items table
CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);