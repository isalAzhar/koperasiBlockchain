import { useEffect, useState } from "react";
import {
  Users,
  ReceiptText,
  Blocks,
  Wallet,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";
import api from "../api/api";
import Layout from "../components/Layout";
import StatCard from "../components/StatCard";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [latest, setLatest] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatRupiah = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(Number(value || 0));
  };

  const fetchDashboard = async () => {
    try {
      const [summaryRes, latestRes] = await Promise.all([
        api.get("/dashboard/summary"),
        api.get("/dashboard/transaksi-terbaru"),
      ]);

      setSummary(summaryRes.data.data);
      setLatest(latestRes.data.data);
    } catch (error) {
      console.error("Gagal mengambil dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <Layout>
      <section className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Ringkasan transaksi koperasi dan status integritas blockchain.</p>
        </div>

        <div
          className={
            summary?.blockchain?.valid
              ? "status-pill success"
              : "status-pill danger"
          }
        >
          {summary?.blockchain?.valid ? "Blockchain Valid" : "Blockchain Tidak Valid"}
        </div>
      </section>

      {loading ? (
        <div className="loading-box">Memuat dashboard...</div>
      ) : (
        <>
          <div className="stats-grid">
            <StatCard
              title="Total Anggota"
              value={summary?.total_anggota || 0}
              icon={Users}
              description="Anggota aktif"
            />

            <StatCard
              title="Total Transaksi"
              value={summary?.total_transaksi || 0}
              icon={ReceiptText}
              description="Semua transaksi"
            />

            <StatCard
              title="Total Block"
              value={summary?.total_block || 0}
              icon={Blocks}
              description="Ledger blockchain"
            />

            <StatCard
              title="Total Simpanan"
              value={formatRupiah(summary?.total_simpanan)}
              icon={Wallet}
              description="Dana simpanan"
            />

            <StatCard
              title="Total Pinjaman"
              value={formatRupiah(summary?.total_pinjaman)}
              icon={TrendingUp}
              description="Pinjaman anggota"
            />

            <StatCard
              title="Status Integritas"
              value={summary?.blockchain?.valid ? "Valid" : "Tidak Valid"}
              icon={ShieldCheck}
              description={summary?.blockchain?.message}
            />
          </div>

          <div className="content-card">
            <div className="card-header">
              <h3>Transaksi Terbaru</h3>
              <p>5 transaksi terakhir yang tercatat di sistem.</p>
            </div>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Kode</th>
                    <th>Anggota</th>
                    <th>Jenis</th>
                    <th>Jumlah</th>
                    <th>Tanggal</th>
                  </tr>
                </thead>
                <tbody>
                  {latest.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="empty-cell">
                        Belum ada transaksi
                      </td>
                    </tr>
                  ) : (
                    latest.map((item) => (
                      <tr key={item.id_transaksi}>
                        <td>{item.kode_transaksi}</td>
                        <td>{item.nama_anggota || "-"}</td>
                        <td>
                          <span className="type-badge">
                            {item.jenis_transaksi}
                          </span>
                        </td>
                        <td>{formatRupiah(item.jumlah)}</td>
                        <td>{String(item.tanggal_transaksi).slice(0, 10)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}