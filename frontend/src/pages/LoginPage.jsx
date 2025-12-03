import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import Seo from "../components/Seo";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({
    email: "admin@example.com",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || "/";

  if (user) {
    return <Navigate to={from} replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login gagal, coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <Seo title="Login | Ad Campaign Manager" description="Masuk untuk mengelola campaign iklan." />
      <div className="auth-card">
        <div>
          <p className="eyebrow">Ad Campaign Manager</p>
          <h1>Masuk ke dashboard</h1>
          <p className="muted">Gunakan akun admin bawaan atau akun yang telah terdaftar.</p>
        </div>

        {error && <p className="error-text">{error}</p>}

        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="********"
              required
            />
          </label>

          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Memproses..." : "Login"}
          </button>
        </form>

        <p className="muted small" style={{ marginTop: 12 }}>
          Admin default: admin@example.com / password123
        </p>
      </div>
    </div>
  );
}
