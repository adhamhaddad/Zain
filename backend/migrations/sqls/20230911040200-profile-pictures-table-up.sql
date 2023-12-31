CREATE TABLE IF NOT EXISTS profile_pictures (
  id SERIAL PRIMARY KEY,
  image_url VARCHAR(200) NOT NULL,
  user_id INT NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT timezone('UTC', now())
);