const blockchainService = require("./blockchain.service");

async function getAll(req, res) {
  try {
    const data = await blockchainService.getAllBlocks();

    res.json({
      message: "Data ledger blockchain berhasil diambil",
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

    const data = await blockchainService.getBlockById(id);

    if (!data) {
      return res.status(404).json({
        message: "Block tidak ditemukan",
      });
    }

    res.json({
      message: "Detail block berhasil diambil",
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan server",
      error: error.message,
    });
  }
}

async function verify(req, res) {
  try {
    const result = await blockchainService.verifyBlockchain();

    res.json({
      message: "Verifikasi blockchain selesai",
      data: result,
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
  verify,
};