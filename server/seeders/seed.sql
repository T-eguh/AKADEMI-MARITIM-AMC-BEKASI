-- AMC Bekasi Database Initial Seed Script
-- Suitable for MySQL and PostgreSQL

-- Add Default Administrator Account
-- Username: admin
-- Password: adminamc (Bcrypt Hashed: $2a$10$I68CidgYgU0G.R6AOnM9QO3.WOf4KscTzQp.U4zIqXl1t/b.oRE8C)
INSERT INTO users (id, username, password, name, role, email, avatar)
VALUES (
  'user_admin',
  'admin',
  '$2a$10$I68CidgYgU0G.R6AOnM9QO3.WOf4KscTzQp.U4zIqXl1t/b.oRE8C',
  'Super Administrator',
  'Super Admin',
  'admin@amcbekasi.ac.id',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'
)
ON DUPLICATE KEY UPDATE username=username;
