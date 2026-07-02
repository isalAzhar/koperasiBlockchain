const dashboardService = require("./dashboard.service");

async function summary(req, res) {
  try {
    const data = await dashboardService.getSummary();

    res.json({
      message: "Summary dashboard berhasil diambil",
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan server",
      error: error.message,
    });
  }
}

async function statistikJenisTransaksi(req, res) {
  try {
    const data = await dashboardService.getStatistikJenisTransaksi();

    res.json({
      message: "Statistik jenis transaksi berhasil diambil",
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan server",
      error: error.message,
    });
  }
}

async function transaksiTerbaru(req, res) {
  try {
    const data = await dashboardService.getTransaksiTerbaru();

    res.json({
      message: "Transaksi terbaru berhasil diambil",
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
  summary,
  statistikJenisTransaksi,
  transaksiTerbaru,
};