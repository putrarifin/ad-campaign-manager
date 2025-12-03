import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import Seo from "../components/Seo";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/users");
      setUsers(data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this user?");
    if (!confirmDelete) return;

    setError("");
    try {
      await api.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to delete user");
    }
  };

  return (
    <div className="card">
      <Seo
        title="Ad Campaign Manager | User List"
        description="Kelola akun pengguna yang dapat mengakses dashboard."
      />
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <h2 style={{ margin: 0 }}>Users</h2>
        <Link to="/users/new" className="btn">
          + New User
        </Link>
      </div>

      {error && <p style={{ color: "#b91c1c", marginBottom: 12 }}>{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : users.length === 0 ? (
        <p>Belum ada user.</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Dibuat</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.email}</td>
                  <td>{u.created_at ? new Date(u.created_at).toLocaleString() : "-"}</td>
                  <td>
                    <Link
                      to={`/users/edit/${u.id}`}
                      className="btn secondary"
                      style={{ marginRight: 6 }}
                    >
                      Edit
                    </Link>
                    <button className="btn danger" onClick={() => handleDelete(u.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
