const anggotaService = require("./anggota.service");

async function getAll(req, res) {
  try {
    const data = await anggotaService.getAllAnggota();

    res.json({
      message: "Data anggota berhasil diambil",
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan server",
      error: error.message,
    });
  }
}

async function getById(req, res) {
  try {
    const { id } = req.params;

    const data = await anggotaService.getAnggotaById(id);

    if (!data) {
      return res.status(404).json({
        message: "Anggota tidak ditemukan",
      });
    }

    res.json({
      message: "Detail anggota berhasil diambil",
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan server",
      error: error.message,
    });
  }
}

async function create(req, res) {
  try {
    const data = await anggotaService.createAnggota(req.body);

    res.status(201).json({
      message: "Anggota berhasil ditambahkan",
      data,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
}

async function update(req, res) {
  try {
    const { id } = req.params;

    const data = await anggotaService.updateAnggota(id, req.body);

    res.json({
      message: "Anggota berhasil diperbarui",
      data,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
}

async function remove(req, res) {
  try {
    const { id } = req.params;

    const data = await anggotaService.deleteAnggota(id);

    res.json({
      message: "Anggota berhasil dinonaktifkan",
      data,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};