CREATE TABLE IF NOT EXISTS post_images (
  id SERIAL PRIMARY KEY,
  image_url TEXT NOT NULL,
  post_id INT NOT NULL REFERENCES posts(id) ON UPDATE CASCADE ON DELETE CASCADE
);