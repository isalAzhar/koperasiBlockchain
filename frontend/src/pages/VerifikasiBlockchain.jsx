import { useState } from "react";
import { ShieldCheck, ShieldAlert } from "lucide-react";
import Layout from "../components/Layout";
import api from "../api/api";

export default function VerifikasiBlockchain() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setLoading(true);

    try {
      const res = await api.get("/blockchain/verify");
      setResult(res.data.data);
    } catch (error) {
      setResult({
        valid: false,
        message: error.response?.data?.message || "Gagal verifikasi blockchain",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="page-header">
        <div>
          <h1>Verifikasi Blockchain</h1>
          <p>Cek apakah data transaksi masih asli atau sudah berubah.</p>
        </div>
      </section>

      <div className="verify-card">
        <div
          className={
            result?.valid === false
              ? "verify-icon danger"
              : "verify-icon success"
          }
        >
          {result?.valid === false ? (
            <ShieldAlert size={64} />
          ) : (
            <ShieldCheck size={64} />
          )}
        </div>

        <h2>
          {!result
            ? "Belum Diverifikasi"
            : result.valid
            ? "Blockchain Valid"
            : "Blockchain Tidak Valid"}
        </h2>

        <p>
          {!result
            ? "Klik tombol di bawah untuk memeriksa integritas seluruh block."
            : result.message}
        </p>

        {result?.total_blocks !== undefined && (
          <span className="verify-total">
            Total block: {result.total_blocks}
          </span>
        )}

        <button className="primary-btn" onClick={handleVerify} disabled={loading}>
          {loading ? "Memeriksa..." : "Verifikasi Sekarang"}
        </button>
      </div>
    </Layout>
  );
}