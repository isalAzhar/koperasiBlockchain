const pool = require("../../config/database");

async function getAllAnggota() {
  const result = await pool.query(`
    SELECT 
      id_anggota,
      id_user,
      nomor_anggota,
      nama,
      email,
      no_hp,
      alamat,
      status,
      created_at
    FROM anggota
    ORDER BY id_anggota DESC
  `);

  return result.rows;
}

async function getAnggotaById(id_anggota) {
  const result = await pool.query(
    `
    SELECT 
      id_anggota,
      id_user,
      nomor_anggota,
      nama,
      email,
      no_hp,
      alamat,
      status,
      created_at
    FROM anggota
    WHERE id_anggota = $1
    `,
    [id_anggota]
  );

  return result.rows[0];
}

async function createAnggota(data) {
  const { id_user, nomor_anggota, nama, email, no_hp, alamat } = data;

  if (!nomor_anggota || !nama) {
    throw new Error("Nomor anggota dan nama wajib diisi");
  }

  const existing = await pool.query(
    "SELECT id_anggota FROM anggota WHERE nomor_anggota = $1",
    [nomor_anggota]
  );

  if (existing.rows.length > 0) {
    throw new Error("Nomor anggota sudah digunakan");
  }

  const result = await pool.query(
    `
    INSERT INTO anggota 
      (id_user, nomor_anggota, nama, email, no_hp, alamat)
    VALUES 
      ($1, $2, $3, $4, $5, $6)
    RETURNING 
      id_anggota,
      id_user,
      nomor_anggota,
      nama,
      email,
      no_hp,
      alamat,
      status,
      created_at
    `,
    [
      id_user || null,
      nomor_anggota,
      nama,
      email || null,
      no_hp || null,
      alamat || null,
    ]
  );

  return result.rows[0];
}

async function updateAnggota(id_anggota, data) {
  const { id_user, nomor_anggota, nama, email, no_hp, alamat, status } = data;

  const anggota = await getAnggotaById(id_anggota);

  if (!anggota) {
    throw new Error("Anggota tidak ditemukan");
  }

  if (!nomor_anggota || !nama) {
    throw new Error("Nomor anggota dan nama wajib diisi");
  }

  const duplicate = await pool.query(
    `
    SELECT id_anggota 
    FROM anggota 
    WHERE nomor_anggota = $1 
    AND id_anggota != $2
    `,
    [nomor_anggota, id_anggota]
  );

  if (duplicate.rows.length > 0) {
    throw new Error("Nomor anggota sudah digunakan anggota lain");
  }

  const result = await pool.query(
    `
    UPDATE anggota
    SET
      id_user = $1,
      nomor_anggota = $2,
      nama = $3,
      email = $4,
      no_hp = $5,
      alamat = $6,
      status = $7
    WHERE id_anggota = $8
    RETURNING 
      id_anggota,
      id_user,
      nomor_anggota,
      nama,
      email,
      no_hp,
      alamat,
      status,
      created_at
    `,
    [
      id_user || null,
      nomor_anggota,
      nama,
      email || null,
      no_hp || null,
      alamat || null,
      status || "aktif",
      id_anggota,
    ]
  );

  return result.rows[0];
}

async function deleteAnggota(id_anggota) {
  const anggota = await getAnggotaById(id_anggota);

  if (!anggota) {
    throw new Error("Anggota tidak ditemukan");
  }

  /**
   * Kita tidak hapus permanen.
   * Status diubah menjadi nonaktif supaya riwayat transaksi tetap aman.
   */
  const result = await pool.query(
    `
    UPDATE anggota
    SET status = 'nonaktif'
    WHERE id_anggota = $1
    RETURNING 
      id_anggota,
      nomor_anggota,
      nama,
      email,
      no_hp,
      alamat,
      status,
      created_at
    `,
    [id_anggota]
  );

  return result.rows[0];
}

module.exports = {
  getAllAnggota,
  getAnggotaById,
  createAnggota,
  updateAnggota,
  deleteAnggota,
};