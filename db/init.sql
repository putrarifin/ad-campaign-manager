CREATE TABLE IF NOT EXISTS campaigns (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  client_name VARCHAR(255),
  budget NUMERIC(12,2),
  channel VARCHAR(100),
  start_date DATE,
  end_date DATE,
  status VARCHAR(50),
  ad_copy TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
