CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  middle_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(30) UNIQUE NOT NULL,
  role user_roles NOT NULL,
  created_at TIMESTAMP DEFAULT timezone('UTC', now())
);