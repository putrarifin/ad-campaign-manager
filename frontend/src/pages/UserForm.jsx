import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import Seo from "../components/Seo";

const initialForm = {
  email: "",
  password: "",
};

export default function UserForm() {
  const { id } = useParams();
  const isEdit = useMemo(() => Boolean(id), [id]);
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const pageTitle = isEdit ? "Edit User" : "New User";

  useEffect(() => {
    if (!isEdit) return;

    const fetchUser = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get(`/users/${id}`);
        setForm({
          email: data.email || "",
          password: "",
        });
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to load user");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = { email: form.email };
      if (form.password.trim()) {
        payload.password = form.password;
      }

      if (isEdit) {
        await api.put(`/users/${id}`, payload);
      } else {
        if (!payload.password) {
          setError("Password wajib diisi untuk user baru");
          setLoading(false);
          return;
        }
        await api.post("/users", payload);
      }

      navigate("/users");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to save user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <Seo
        title={`Ad Campaign Manager | ${pageTitle}`}
        description="Kelola akun pengguna yang dapat mengakses dashboard."
      />
      <h2>{pageTitle}</h2>
      {error && (
        <p style={{ color: "#b91c1c", marginTop: 4, marginBottom: 12 }}>{error}</p>
      )}

      <form onSubmit={handleSubmit} className="form-grid">
        <label>
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="user@example.com"
          />
        </label>

        <label>
          Password {isEdit ? "(kosongkan jika tidak diubah)" : ""}
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="********"
          />
        </label>

        <div className="form-actions">
          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            className="btn secondary"
            onClick={() => navigate("/users")}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
