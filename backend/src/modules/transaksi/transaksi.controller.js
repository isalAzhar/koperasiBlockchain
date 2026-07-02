const transaksiService = require("./transaksi.service");

async function getAll(req, res) {
  try {
    const data = await transaksiService.getAllTransaksi();

    res.json({
      message: "Data transaksi berhasil diambil",
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

    const data = await transaksiService.getTransaksiById(id);

    if (!data) {
      return res.status(404).json({
        message: "Transaksi tidak ditemukan",
      });
    }

    res.json({
      message: "Detail transaksi berhasil diambil",
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
    const data = await transaksiService.createTransaksi(req.body, req.user);

    res.status(201).json({
      message: "Transaksi berhasil ditambahkan dan block blockchain berhasil dibuat",
      data,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
}

async function getByAnggota(req, res) {
  try {
    const { id_anggota } = req.params;

    const data = await transaksiService.getTransaksiByAnggota(id_anggota);

    res.json({
      message: "Riwayat transaksi anggota berhasil diambil",
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan server",
      error: error.message,
    });
  }
}

module.exports = {
  getAll,
  getById,
  create,
  getByAnggota,
};