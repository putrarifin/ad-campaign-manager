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

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO users (email, password_hash)
SELECT 'admin@example.com', '$2b$10$bSI1ZKNUljSfnSkVxap68.Smxe4pUX3rGygPX/6GNULUK9rxnNM6e'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@example.com');
