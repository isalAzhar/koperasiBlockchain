import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../api/api";

export default function TambahTransaksi() {
  const [anggota, setAnggota] = useState([]);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    id_anggota: "",
    jenis_transaksi: "simpanan",
    jumlah: "",
    tanggal_transaksi: new Date().toISOString().slice(0, 10),
    keterangan: "",
  });

  const jenisTransaksi = [
    "simpanan",
    "penarikan",
    "pinjaman",
    "angsuran",
    "pemasukan",
    "pengeluaran",
  ];

  const fetchAnggota = async () => {
    const res = await api.get("/anggota");
    setAnggota(res.data.data.filter((item) => item.status === "aktif"));
  };

  useEffect(() => {
    fetchAnggota();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await api.post("/transaksi", {
        ...form,
        id_anggota: form.id_anggota ? Number(form.id_anggota) : null,
        jumlah: Number(form.jumlah),
      });

      setMessage("Transaksi berhasil dicatat dan block blockchain berhasil dibuat");

      setForm({
        id_anggota: "",
        jenis_transaksi: "simpanan",
        jumlah: "",
        tanggal_transaksi: new Date().toISOString().slice(0, 10),
        keterangan: "",
      });
    } catch (error) {
      setMessage(error.response?.data?.message || "Gagal menambahkan transaksi");
    }
  };

  return (
    <Layout>
      <section className="page-header">
        <div>
          <h1>Tambah Transaksi</h1>
          <p>Setiap transaksi akan otomatis masuk ke ledger blockchain.</p>
        </div>
      </section>

      <div className="content-card form-card">
        <div className="card-header">
          <h3>Form Transaksi Koperasi</h3>
          <p>Isi data transaksi dengan benar.</p>
        </div>

        {message && <div className="alert-info">{message}</div>}

        <form className="form-grid" onSubmit={handleSubmit}>
          <div>
            <label>Anggota</label>
            <select
              name="id_anggota"
              value={form.id_anggota}
              onChange={handleChange}
            >
              <option value="">Pilih anggota</option>
              {anggota.map((item) => (
                <option key={item.id_anggota} value={item.id_anggota}>
                  {item.nomor_anggota} - {item.nama}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Jenis Transaksi</label>
            <select
              name="jenis_transaksi"
              value={form.jenis_transaksi}
              onChange={handleChange}
            >
              {jenisTransaksi.map((jenis) => (
                <option key={jenis} value={jenis}>
                  {jenis}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Jumlah</label>
            <input
              type="number"
              name="jumlah"
              value={form.jumlah}
              onChange={handleChange}
              placeholder="100000"
            />
          </div>

          <div>
            <label>Tanggal Transaksi</label>
            <input
              type="date"
              name="tanggal_transaksi"
              value={form.tanggal_transaksi}
              onChange={handleChange}
            />
          </div>

          <div className="full">
            <label>Keterangan</label>
            <textarea
              name="keterangan"
              value={form.keterangan}
              onChange={handleChange}
              placeholder="Contoh: Simpanan wajib bulan Juli"
            />
          </div>

          <button className="primary-btn" type="submit">
            Simpan Transaksi
          </button>
        </form>
      </div>
    </Layout>
  );
}