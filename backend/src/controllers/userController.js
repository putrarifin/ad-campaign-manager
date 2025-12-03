import bcrypt from "bcryptjs";
import db from "../db/connection.js";

const sanitizeUser = (row) => ({
  id: row.id,
  email: row.email,
  created_at: row.created_at,
  updated_at: row.updated_at,
});

export async function getAllUsers(req, res) {
  try {
    const result = await db.query(
      "SELECT id, email, created_at, updated_at FROM users ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error getAllUsers:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getUserById(req, res) {
  const { id } = req.params;
  try {
    const result = await db.query(
      "SELECT id, email, created_at, updated_at FROM users WHERE id = $1 LIMIT 1",
      [id]
    );

    const user = result.rows[0];
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Error getUserById:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createUser(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email dan password wajib diisi" });
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await db.query(
      `INSERT INTO users (email, password_hash, created_at, updated_at)
       VALUES ($1, $2, NOW(), NOW())
       RETURNING *`,
      [email, hash]
    );

    res.status(201).json(sanitizeUser(result.rows[0]));
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ message: "Email sudah terdaftar" });
    }
    console.error("Error createUser:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateUser(req, res) {
  const { id } = req.params;
  const { email, password } = req.body;

  if (!email && !password) {
    return res.status(400).json({ message: "Email atau password harus diisi" });
  }

  try {
    let query = "UPDATE users SET ";
    const values = [];
    let idx = 1;

    if (email) {
      query += `email = $${idx}, `;
      values.push(email);
      idx += 1;
    }

    if (password) {
      const hash = await bcrypt.hash(password, 10);
      query += `password_hash = $${idx}, `;
      values.push(hash);
      idx += 1;
    }

    query += `updated_at = NOW() WHERE id = $${idx} RETURNING *`;
    values.push(id);

    const result = await db.query(query, values);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(sanitizeUser(user));
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ message: "Email sudah terdaftar" });
    }
    console.error("Error updateUser:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteUser(req, res) {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM users WHERE id = $1", [id]);
    res.status(204).send();
  } catch (err) {
    console.error("Error deleteUser:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}
