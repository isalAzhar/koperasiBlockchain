import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import Layout from "../components/Layout";
import api from "../api/api";

export default function Anggota() {
  const [anggota, setAnggota] = useState([]);
  const [form, setForm] = useState({
    nomor_anggota: "",
    nama: "",
    email: "",
    no_hp: "",
    alamat: "",
  });

  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);

  const fetchAnggota = async () => {
    const res = await api.get("/anggota");
    setAnggota(res.data.data);
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
      await api.post("/anggota", form);

      setForm({
        nomor_anggota: "",
        nama: "",
        email: "",
        no_hp: "",
        alamat: "",
      });

      setMessage("Anggota berhasil ditambahkan");
      fetchAnggota();
      setShowForm(false);
    } catch (error) {
      setMessage(error.response?.data?.message || "Gagal menambahkan anggota");
    }
  };

  const handleDelete = async (id) => {
    const yakin = confirm("Nonaktifkan anggota ini?");

    if (!yakin) return;

    await api.delete(`/anggota/${id}`);
    fetchAnggota();
  };

  return (
    <Layout>
      <section className="page-header">
        <div>
          <h1>Data Anggota</h1>
          <p>Kelola data anggota koperasi yang terhubung dengan transaksi.</p>
        </div>

        <button className="primary-btn" onClick={() => setShowForm(true)}>
          <Plus size={18} />
          Tambah Anggota
        </button>
      </section>

      <div className="content-card">
        <div className="card-header">
          <h3>Daftar Anggota</h3>
          <p>Total {anggota.length} anggota.</p>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>No Anggota</th>
                <th>Nama</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {anggota.map((item) => (
                <tr key={item.id_anggota}>
                  <td>{item.nomor_anggota}</td>
                  <td>{item.nama}</td>
                  <td>
                    <span
                      className={
                        item.status === "aktif"
                          ? "status-mini success"
                          : "status-mini danger"
                      }
                    >
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="small-danger-btn"
                      onClick={() => handleDelete(item.id_anggota)}
                    >
                      Nonaktifkan
                    </button>
                  </td>
                </tr>
              ))}

              {anggota.length === 0 && (
                <tr>
                  <td colSpan="4" className="empty-cell">
                    Belum ada anggota
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div
            className="modal-card content-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close"
              onClick={() => setShowForm(false)}
              aria-label="Tutup"
            >
              <X size={20} />
            </button>

            <div className="card-header">
              <h3>Tambah Anggota</h3>
              <p>Masukkan data anggota baru.</p>
            </div>

            {message && <div className="alert-info">{message}</div>}

            <form className="form-grid" onSubmit={handleSubmit}>
              <div>
                <label>Nomor Anggota</label>
                <input
                  name="nomor_anggota"
                  value={form.nomor_anggota}
                  onChange={handleChange}
                  placeholder="AGT-001"
                />
              </div>

              <div>
                <label>Nama</label>
                <input
                  name="nama"
                  value={form.nama}
                  onChange={handleChange}
                  placeholder="Nama anggota"
                />
              </div>

              <div>
                <label>Email</label>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="email@gmail.com"
                />
              </div>

              <div>
                <label>No HP</label>
                <input
                  name="no_hp"
                  value={form.no_hp}
                  onChange={handleChange}
                  placeholder="08123456789"
                />
              </div>

              <div className="full">
                <label>Alamat</label>
                <textarea
                  name="alamat"
                  value={form.alamat}
                  onChange={handleChange}
                  placeholder="Alamat anggota"
                />
              </div>

              <button className="primary-btn" type="submit">
                Simpan Anggota
              </button>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}