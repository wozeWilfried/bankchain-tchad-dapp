CREATE DATABASE IF NOT EXISTS bankchain
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE bankchain;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Demo accounts (passwords in plain text – dev only)
INSERT IGNORE INTO users (email, password, name) VALUES
  ('admin@bankchain.td', 'admin123', 'Administrateur'),
  ('user@bankchain.td',  'user123',  'Utilisateur');
