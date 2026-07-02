const authService = require("./auth.service");

async function register(req, res) {
  try {
    const user = await authService.registerUser(req.body);

    res.status(201).json({
      message: "Register berhasil",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
}

async function login(req, res) {
  try {
    const result = await authService.loginUser(req.body);

    res.json({
      message: "Login berhasil",
      data: result,
    });
  } catch (error) {
    res.status(401).json({
      message: error.message,
    });
  }
}

async function me(req, res) {
  try {
    const user = await authService.getUserById(req.user.id_user);

    if (!user) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    res.json({
      message: "Data user login",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan server",
      error: error.message,
    });
  }
}

module.exports = {
  register,
  login,
  me,
};