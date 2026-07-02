const pool = require("../../config/database");
const { generateHash } = require("../../utils/hash");

function normalizeTransactionData(transaksi) {
  return {
    id_transaksi: transaksi.id_transaksi,
    kode_transaksi: transaksi.kode_transaksi,
    id_anggota: transaksi.id_anggota,
    jenis_transaksi: transaksi.jenis_transaksi,
    jumlah: String(transaksi.jumlah),
    keterangan: transaksi.keterangan || "",
    tanggal_transaksi: String(transaksi.tanggal_transaksi).slice(0, 10),
  };
}

function generateTransactionHash(transaksi) {
  return generateHash(normalizeTransactionData(transaksi));
}

function generateBlockHash({ index_block, id_transaksi, transaction_hash, previous_hash, nonce }) {
  return generateHash({
    index_block,
    id_transaksi,
    transaction_hash,
    previous_hash,
    nonce,
  });
}

async function getLastBlock(client = pool) {
  const result = await client.query(`
    SELECT *
    FROM blockchain
    ORDER BY index_block DESC
    LIMIT 1
  `);

  return result.rows[0];
}

async function createBlock(transaksi, client = pool) {
  const lastBlock = await getLastBlock(client);

  const indexBlock = lastBlock ? Number(lastBlock.index_block) + 1 : 1;
  const previousHash = lastBlock ? lastBlock.current_hash : "GENESIS";
  const nonce = 0;

  const transactionHash = generateTransactionHash(transaksi);

  const currentHash = generateBlockHash({
    index_block: indexBlock,
    id_transaksi: transaksi.id_transaksi,
    transaction_hash: transactionHash,
    previous_hash: previousHash,
    nonce,
  });

  const result = await client.query(
    `
    INSERT INTO blockchain
      (id_transaksi, index_block, transaction_hash, previous_hash, current_hash, nonce)
    VALUES
      ($1, $2, $3, $4, $5, $6)
    RETURNING *
    `,
    [
      transaksi.id_transaksi,
      indexBlock,
      transactionHash,
      previousHash,
      currentHash,
      nonce,
    ]
  );

  return result.rows[0];
}

async function getAllBlocks() {
  const result = await pool.query(`
    SELECT
      b.id_block,
      b.index_block,
      b.id_transaksi,
      t.kode_transaksi,
      a.nama AS nama_anggota,
      t.jenis_transaksi,
      t.jumlah,
      b.transaction_hash,
      b.previous_hash,
      b.current_hash,
      b.nonce,
      b.created_at
    FROM blockchain b
    JOIN transaksi t ON t.id_transaksi = b.id_transaksi
    LEFT JOIN anggota a ON a.id_anggota = t.id_anggota
    ORDER BY b.index_block ASC
  `);

  return result.rows;
}

async function getBlockById(id_block) {
  const result = await pool.query(
    `
    SELECT
      b.id_block,
      b.index_block,
      b.id_transaksi,
      t.kode_transaksi,
      a.nama AS nama_anggota,
      t.jenis_transaksi,
      t.jumlah,
      t.keterangan,
      t.tanggal_transaksi,
      b.transaction_hash,
      b.previous_hash,
      b.current_hash,
      b.nonce,
      b.created_at
    FROM blockchain b
    JOIN transaksi t ON t.id_transaksi = b.id_transaksi
    LEFT JOIN anggota a ON a.id_anggota = t.id_anggota
    WHERE b.id_block = $1
    `,
    [id_block]
  );

  return result.rows[0];
}

async function verifyBlockchain() {
  const result = await pool.query(`
    SELECT
      b.*,
      t.kode_transaksi,
      t.id_anggota,
      t.jenis_transaksi,
      t.jumlah,
      t.keterangan,
      t.tanggal_transaksi
    FROM blockchain b
    JOIN transaksi t ON t.id_transaksi = b.id_transaksi
    ORDER BY b.index_block ASC
  `);

  const blocks = result.rows;

  if (blocks.length === 0) {
    return {
      valid: true,
      message: "Blockchain masih kosong, belum ada transaksi",
      total_blocks: 0,
    };
  }

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];

    const recalculatedTransactionHash = generateTransactionHash(block);

    if (recalculatedTransactionHash !== block.transaction_hash) {
      return {
        valid: false,
        message: `Data transaksi pada block ${block.index_block} telah berubah`,
        error_block: block.index_block,
      };
    }

    const recalculatedBlockHash = generateBlockHash({
      index_block: block.index_block,
      id_transaksi: block.id_transaksi,
      transaction_hash: block.transaction_hash,
      previous_hash: block.previous_hash,
      nonce: block.nonce,
    });

    if (recalculatedBlockHash !== block.current_hash) {
      return {
        valid: false,
        message: `Hash block ${block.index_block} tidak valid`,
        error_block: block.index_block,
      };
    }

    if (i === 0 && block.previous_hash !== "GENESIS") {
      return {
        valid: false,
        message: "Genesis block tidak valid",
        error_block: block.index_block,
      };
    }

    if (i > 0 && block.previous_hash !== blocks[i - 1].current_hash) {
      return {
        valid: false,
        message: `Rantai blockchain putus pada block ${block.index_block}`,
        error_block: block.index_block,
      };
    }
  }

  return {
    valid: true,
    message: "Blockchain valid dan data transaksi masih asli",
    total_blocks: blocks.length,
  };
}

module.exports = {
  createBlock,
  getAllBlocks,
  getBlockById,
  verifyBlockchain,
};