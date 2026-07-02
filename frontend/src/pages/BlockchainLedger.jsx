import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../api/api";

export default function BlockchainLedger() {
  const [blocks, setBlocks] = useState([]);

  const fetchBlocks = async () => {
    const res = await api.get("/blockchain");
    setBlocks(res.data.data);
  };

  useEffect(() => {
    fetchBlocks();
  }, []);

  const shortHash = (hash) => {
    if (!hash) return "-";
    if (hash === "GENESIS") return "GENESIS";
    return `${hash.slice(0, 12)}...${hash.slice(-8)}`;
  };

  return (
    <Layout>
      <section className="page-header">
        <div>
          <h1>Ledger Blockchain</h1>
          <p>Daftar block yang terbentuk dari transaksi koperasi.</p>
        </div>
      </section>

      <div className="ledger-grid">
        {blocks.length === 0 ? (
          <div className="content-card">
            <p>Belum ada block blockchain.</p>
          </div>
        ) : (
          blocks.map((block) => (
            <div className="block-card" key={block.id_block}>
              <div className="block-top">
                <span>Block #{block.index_block}</span>
                <small>{block.kode_transaksi}</small>
              </div>

              <h3>{block.jenis_transaksi}</h3>
              <p>{block.nama_anggota || "-"}</p>

              <div className="hash-box">
                <label>Previous Hash</label>
                <code>{shortHash(block.previous_hash)}</code>
              </div>

              <div className="hash-box">
                <label>Current Hash</label>
                <code>{shortHash(block.current_hash)}</code>
              </div>

              <div className="hash-box">
                <label>Transaction Hash</label>
                <code>{shortHash(block.transaction_hash)}</code>
              </div>
            </div>
          ))
        )}
      </div>
    </Layout>
  );
}