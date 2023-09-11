CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  post_caption TEXT,
  unit_id INT NOT NULL REFERENCES units(id) ON UPDATE CASCADE ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT timezone('UTC', now()),
  updated_at TIMESTAMP
);