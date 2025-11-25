CREATE DATABASE IF NOT EXISTS book_change CHARACTER SET utf8mb4;
USE book_change;

-- 用户表
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  avatar VARCHAR(255) DEFAULT '/uploads/default.jpg',
  credit INT DEFAULT 100,
  isAdmin TINYINT DEFAULT 0,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 书籍表
CREATE TABLE books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  author VARCHAR(100),
  price DECIMAL(10,2) NOT NULL,
  degree ENUM('95成新','9成新','85成新','8成新','7成新以下') DEFAULT '9成新',
  category VARCHAR(50) DEFAULT '小说',
  description TEXT,
  images JSON DEFAULT '[]',
  userId INT NOT NULL,
  status ENUM('pending','onsale','sold','offline') DEFAULT 'pending',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- 购物车
CREATE TABLE cart (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  bookId INT NOT NULL,
  quantity INT DEFAULT 1,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_cart (userId, bookId),
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (bookId) REFERENCES books(id) ON DELETE CASCADE
);

-- 订单
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  orderNo VARCHAR(30) UNIQUE NOT NULL,
  buyerId INT NOT NULL,
  sellerId INT NOT NULL,
  bookId INT NOT NULL,
  quantity INT DEFAULT 1,
  totalPrice DECIMAL(10,2) NOT NULL,
  status ENUM('pending','paid','shipped','completed','canceled') DEFAULT 'pending',
  address JSON NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 聊天消息
CREATE TABLE messages (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  fromUserId INT NOT NULL,
  toUserId INT NOT NULL,
  bookId INT NULL,
  content TEXT NOT NULL,
  isRead TINYINT DEFAULT 0,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 举报
CREATE TABLE reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  reporterId INT NOT NULL,
  reportedUserId INT NOT NULL,
  orderId INT NULL,
  reason VARCHAR(100) NOT NULL,
  description TEXT,
  status ENUM('pending','approved','rejected') DEFAULT 'pending',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 插入假数据
INSERT INTO users (username, password, isAdmin, credit) VALUES 
('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 200), -- 密码: 123456
('张三', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 0, 105),
('李四', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 0, 98);

INSERT INTO books (title, author, price, degree, category, description, images, userId, status) VALUES
('Vue.js实战', '尤雨溪', 38.00, '95成新', '计算机', '几乎全新', '[]', 2, 'onsale'),
('人间失格', '太宰治', 18.00, '9成新', '小说', '轻微使用痕迹', '[]', 3, 'onsale');