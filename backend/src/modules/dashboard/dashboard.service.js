const pool = require("../../config/database");
const blockchainService = require("../blockchain/blockchain.service");

async function getSummary() {
  const anggotaResult = await pool.query(`
    SELECT COUNT(*)::int AS total_anggota
    FROM anggota
    WHERE status = 'aktif'
  `);

  const transaksiResult = await pool.query(`
    SELECT COUNT(*)::int AS total_transaksi
    FROM transaksi
  `);

  const blockResult = await pool.query(`
    SELECT COUNT(*)::int AS total_block
    FROM blockchain
  `);

  const nominalResult = await pool.query(`
    SELECT
      COALESCE(SUM(CASE WHEN jenis_transaksi = 'simpanan' THEN jumlah ELSE 0 END), 0) AS total_simpanan,
      COALESCE(SUM(CASE WHEN jenis_transaksi = 'penarikan' THEN jumlah ELSE 0 END), 0) AS total_penarikan,
      COALESCE(SUM(CASE WHEN jenis_transaksi = 'pinjaman' THEN jumlah ELSE 0 END), 0) AS total_pinjaman,
      COALESCE(SUM(CASE WHEN jenis_transaksi = 'angsuran' THEN jumlah ELSE 0 END), 0) AS total_angsuran,
      COALESCE(SUM(CASE WHEN jenis_transaksi = 'pemasukan' THEN jumlah ELSE 0 END), 0) AS total_pemasukan,
      COALESCE(SUM(CASE WHEN jenis_transaksi = 'pengeluaran' THEN jumlah ELSE 0 END), 0) AS total_pengeluaran
    FROM transaksi
  `);

  const blockchainStatus = await blockchainService.verifyBlockchain();

  return {
    total_anggota: anggotaResult.rows[0].total_anggota,
    total_transaksi: transaksiResult.rows[0].total_transaksi,
    total_block: blockResult.rows[0].total_block,
    ...nominalResult.rows[0],
    blockchain: blockchainStatus,
  };
}

async function getStatistikJenisTransaksi() {
  const result = await pool.query(`
    SELECT
      jenis_transaksi,
      COUNT(*)::int AS total_transaksi,
      COALESCE(SUM(jumlah), 0) AS total_nominal
    FROM transaksi
    GROUP BY jenis_transaksi
    ORDER BY jenis_transaksi ASC
  `);

  return result.rows;
}

async function getTransaksiTerbaru() {
  const result = await pool.query(`
    SELECT
      t.id_transaksi,
      t.kode_transaksi,
      a.nama AS nama_anggota,
      t.jenis_transaksi,
      t.jumlah,
      t.keterangan,
      t.tanggal_transaksi,
      t.created_at
    FROM transaksi t
    LEFT JOIN anggota a ON a.id_anggota = t.id_anggota
    ORDER BY t.id_transaksi DESC
    LIMIT 5
  `);

  return result.rows;
}

module.exports = {
  getSummary,
  getStatistikJenisTransaksi,
  getTransaksiTerbaru,
};