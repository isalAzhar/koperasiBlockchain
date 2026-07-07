import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ReceiptText,
  PlusCircle,
  Blocks,
  ShieldCheck,
  LogOut,
} from "lucide-react";

export default function Layout({ children }) {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link to="/" className="brand">
          <div className="brand-logo">K</div>
          <div>
            <h1>KoperasiChain</h1>
            <p>Blockchain Ledger</p>
          </div>
        </Link>

        <nav className="side-menu">
          <NavLink to="/" end>
            <LayoutDashboard size={20} />
            Dashboard
          </NavLink>

          <NavLink to="/anggota">
            <Users size={20} />
            Anggota
          </NavLink>

          <NavLink to="/transaksi/tambah">
            <PlusCircle size={20} />
            Tambah Transaksi
          </NavLink>

          <NavLink to="/transaksi" end>
            <ReceiptText size={20} />
            Riwayat Transaksi
          </NavLink>

          <NavLink to="/blockchain">
            <Blocks size={20} />
            Ledger Blockchain
          </NavLink>

          <NavLink to="/verifikasi">
            <ShieldCheck size={20} />
            Verifikasi
          </NavLink>
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={19} />
          Logout
        </button>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <h2>Sistem Transaksi Koperasi</h2>
            <p>Implementasi blockchain untuk menjaga integritas data transaksi</p>
          </div>

          <div className="user-pill">
            <span>{user.nama || "User"}</span>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}