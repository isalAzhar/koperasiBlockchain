const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../../config/database");

async function registerUser({ nama, email, password, role }) {
const allowedRoles = ["admin", "anggota"];

  if (!nama || !email || !password || !role) {
    throw new Error("Nama, email, password, dan role wajib diisi");
  }

  if (!allowedRoles.includes(role)) {
    throw new Error("Role tidak valid");
  }

  const existingUser = await pool.query(
    "SELECT id_user FROM users WHERE email = $1",
    [email]
  );

  if (existingUser.rows.length > 0) {
    throw new Error("Email sudah digunakan");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users (nama, email, password, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id_user, nama, email, role, created_at`,
    [nama, email, hashedPassword, role]
  );

  return result.rows[0];
}

async function loginUser({ email, password }) {
  if (!email || !password) {
    throw new Error("Email dan password wajib diisi");
  }

  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  const user = result.rows[0];

  if (!user) {
    throw new Error("Email atau password salah");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Email atau password salah");
  }

  const token = jwt.sign(
    {
      id_user: user.id_user,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  return {
    token,
    user: {
      id_user: user.id_user,
      nama: user.nama,
      email: user.email,
      role: user.role,
    },
  };
}

async function getUserById(id_user) {
  const result = await pool.query(
    `SELECT id_user, nama, email, role, created_at
     FROM users
     WHERE id_user = $1`,
    [id_user]
  );

  return result.rows[0];
}

module.exports = {
  registerUser,
  loginUser,
  getUserById,
};