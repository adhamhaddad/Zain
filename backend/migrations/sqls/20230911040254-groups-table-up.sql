CREATE TABLE IF NOT EXISTS groups (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  level_id INT NOT NULL REFERENCES levels(id) ON UPDATE CASCADE ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT timezone('UTC', now())
);