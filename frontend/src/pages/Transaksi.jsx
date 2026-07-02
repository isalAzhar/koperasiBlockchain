import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../api/api";

export default function Transaksi() {
  const [transaksi, setTransaksi] = useState([]);

  const formatRupiah = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(Number(value || 0));
  };

  const fetchTransaksi = async () => {
    const res = await api.get("/transaksi");
    setTransaksi(res.data.data);
  };

  useEffect(() => {
    fetchTransaksi();
  }, []);

  return (
    <Layout>
      <section className="page-header">
        <div>
          <h1>Riwayat Transaksi</h1>
          <p>Semua transaksi koperasi yang sudah tercatat.</p>
        </div>
      </section>

      <div className="content-card">
        <div className="card-header">
          <h3>Daftar Transaksi</h3>
          <p>Total {transaksi.length} transaksi.</p>
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
                <th>Dicatat Oleh</th>
              </tr>
            </thead>

            <tbody>
              {transaksi.map((item) => (
                <tr key={item.id_transaksi}>
                  <td>{item.kode_transaksi}</td>
                  <td>{item.nama_anggota || "-"}</td>
                  <td>
                    <span className="type-badge">{item.jenis_transaksi}</span>
                  </td>
                  <td>{formatRupiah(item.jumlah)}</td>
                  <td>{String(item.tanggal_transaksi).slice(0, 10)}</td>
                  <td>{item.dicatat_oleh || "-"}</td>
                </tr>
              ))}

              {transaksi.length === 0 && (
                <tr>
                  <td colSpan="6" className="empty-cell">
                    Belum ada transaksi
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}