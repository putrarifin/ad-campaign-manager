import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import Seo from "../components/Seo";

export default function CampaignList() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/campaigns");
      setCampaigns(data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load campaigns");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this campaign?");
    if (!confirmDelete) return;

    setError("");
    try {
      await api.delete(`/campaigns/${id}`);
      setCampaigns((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to delete campaign");
    }
  };

  return (
    <div className="card">
      <Seo
        title="Ad Campaign Manager | Campaign List"
        description="Lihat dan kelola daftar campaign iklan beserta status, budget, dan channel."
      />
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <h2 style={{ margin: 0 }}>Campaign List</h2>
        <Link to="/new" className="btn">
          + New Campaign
        </Link>
      </div>

      {error && <p style={{ color: "#b91c1c", marginBottom: 12 }}>{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : campaigns.length === 0 ? (
        <p>Belum ada campaign.</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Client</th>
                <th>Channel</th>
                <th>Status</th>
                <th>Budget</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c.id}>
                  <td>{c.title}</td>
                  <td>{c.client_name}</td>
                  <td>{c.channel}</td>
                  <td>
                    <span className={`badge badge-${(c.status || "draft").toLowerCase()}`}>
                      {c.status}
                    </span>
                  </td>
                  <td>{c.budget}</td>
                  <td>
                    <Link
                      to={`/edit/${c.id}`}
                      className="btn secondary"
                      style={{ marginRight: 6 }}
                    >
                      Edit
                    </Link>
                    <button className="btn danger" onClick={() => handleDelete(c.id)}>
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
