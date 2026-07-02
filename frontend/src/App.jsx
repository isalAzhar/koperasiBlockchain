import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Anggota from "./pages/Anggota";
import TambahTransaksi from "./pages/TambahTransaksi";
import Transaksi from "./pages/Transaksi";
import BlockchainLedger from "./pages/BlockchainLedger";
import VerifikasiBlockchain from "./pages/VerifikasiBlockchain";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/anggota"
          element={
            <ProtectedRoute>
              <Anggota />
            </ProtectedRoute>
          }
        />

        <Route
          path="/transaksi/tambah"
          element={
            <ProtectedRoute>
              <TambahTransaksi />
            </ProtectedRoute>
          }
        />

        <Route
          path="/transaksi"
          element={
            <ProtectedRoute>
              <Transaksi />
            </ProtectedRoute>
          }
        />

        <Route
          path="/blockchain"
          element={
            <ProtectedRoute>
              <BlockchainLedger />
            </ProtectedRoute>
          }
        />

        <Route
          path="/verifikasi"
          element={
            <ProtectedRoute>
              <VerifikasiBlockchain />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}