const pool = require("../../config/database");
const blockchainService = require("../blockchain/blockchain.service");

function generateKodeTransaksi() {
  const now = new Date();
  const timestamp = now.getTime();

  return `TRX-${timestamp}`;
}

async function getAllTransaksi() {
  const result = await pool.query(`
    SELECT
      t.id_transaksi,
      t.kode_transaksi,
      t.id_anggota,
      a.nama AS nama_anggota,
      t.id_user,
      u.nama AS dicatat_oleh,
      t.jenis_transaksi,
      t.jumlah,
      t.keterangan,
      t.tanggal_transaksi,
      t.created_at
    FROM transaksi t
    LEFT JOIN anggota a ON a.id_anggota = t.id_anggota
    LEFT JOIN users u ON u.id_user = t.id_user
    ORDER BY t.id_transaksi DESC
  `);

  return result.rows;
}

async function getTransaksiById(id_transaksi) {
  const result = await pool.query(
    `
    SELECT
      t.id_transaksi,
      t.kode_transaksi,
      t.id_anggota,
      a.nama AS nama_anggota,
      t.id_user,
      u.nama AS dicatat_oleh,
      t.jenis_transaksi,
      t.jumlah,
      t.keterangan,
      t.tanggal_transaksi,
      t.created_at
    FROM transaksi t
    LEFT JOIN anggota a ON a.id_anggota = t.id_anggota
    LEFT JOIN users u ON u.id_user = t.id_user
    WHERE t.id_transaksi = $1
    `,
    [id_transaksi]
  );

  return result.rows[0];
}

async function createTransaksi(data, userLogin) {
  const {
    id_anggota,
    jenis_transaksi,
    jumlah,
    keterangan,
    tanggal_transaksi,
  } = data;

  const allowedJenis = [
    "simpanan",
    "penarikan",
    "pinjaman",
    "angsuran",
    "pemasukan",
    "pengeluaran",
  ];

  if (!jenis_transaksi || !jumlah || !tanggal_transaksi) {
    throw new Error("Jenis transaksi, jumlah, dan tanggal transaksi wajib diisi");
  }

  if (!allowedJenis.includes(jenis_transaksi)) {
    throw new Error("Jenis transaksi tidak valid");
  }

  if (Number(jumlah) <= 0) {
    throw new Error("Jumlah transaksi harus lebih dari 0");
  }

  if (["simpanan", "penarikan", "pinjaman", "angsuran"].includes(jenis_transaksi)) {
    if (!id_anggota) {
      throw new Error("Anggota wajib dipilih untuk transaksi ini");
    }

    const anggotaResult = await pool.query(
      "SELECT id_anggota, status FROM anggota WHERE id_anggota = $1",
      [id_anggota]
    );

    const anggota = anggotaResult.rows[0];

    if (!anggota) {
      throw new Error("Anggota tidak ditemukan");
    }

    if (anggota.status !== "aktif") {
      throw new Error("Anggota tidak aktif");
    }
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const kodeTransaksi = generateKodeTransaksi();

    const transaksiResult = await client.query(
      `
      INSERT INTO transaksi
        (kode_transaksi, id_anggota, id_user, jenis_transaksi, jumlah, keterangan, tanggal_transaksi)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
      `,
      [
        kodeTransaksi,
        id_anggota || null,
        userLogin.id_user,
        jenis_transaksi,
        jumlah,
        keterangan || null,
        tanggal_transaksi,
      ]
    );

    const transaksi = transaksiResult.rows[0];

    const block = await blockchainService.createBlock(transaksi, client);

    await client.query(
      `
      INSERT INTO log_aktivitas
        (id_user, aktivitas, keterangan)
      VALUES
        ($1, $2, $3)
      `,
      [
        userLogin.id_user,
        "CREATE_TRANSAKSI",
        `Membuat transaksi ${kodeTransaksi} dan block ${block.index_block}`,
      ]
    );

    await client.query("COMMIT");

    return {
      transaksi,
      block,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function getTransaksiByAnggota(id_anggota) {
  const result = await pool.query(
    `
    SELECT
      t.id_transaksi,
      t.kode_transaksi,
      t.id_anggota,
      a.nama AS nama_anggota,
      t.jenis_transaksi,
      t.jumlah,
      t.keterangan,
      t.tanggal_transaksi,
      t.created_at
    FROM transaksi t
    LEFT JOIN anggota a ON a.id_anggota = t.id_anggota
    WHERE t.id_anggota = $1
    ORDER BY t.id_transaksi DESC
    `,
    [id_anggota]
  );

  return result.rows;
}

module.exports = {
  getAllTransaksi,
  getTransaksiById,
  createTransaksi,
  getTransaksiByAnggota,
};