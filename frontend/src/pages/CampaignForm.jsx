import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import Seo from "../components/Seo";

const initialForm = {
  title: "",
  client_name: "",
  budget: "",
  channel: "",
  start_date: "",
  end_date: "",
  status: "draft",
  ad_copy: "",
};

const initialAIInput = {
  productName: "",
  audience: "",
  tone: "santai",
};

export default function CampaignForm() {
  const { id } = useParams();
  const isEdit = useMemo(() => Boolean(id), [id]);
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [aiInput, setAiInput] = useState(initialAIInput);
  const [loading, setLoading] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [error, setError] = useState("");
  const pageTitle = isEdit ? "Edit Campaign" : "New Campaign";

  useEffect(() => {
    if (!isEdit) return;

    const fetchCampaign = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get(`/campaigns/${id}`);
        setForm({
          title: data.title || "",
          client_name: data.client_name || "",
          budget: data.budget ?? "",
          channel: data.channel || "",
          start_date: data.start_date ? data.start_date.slice(0, 10) : "",
          end_date: data.end_date ? data.end_date.slice(0, 10) : "",
          status: data.status || "draft",
          ad_copy: data.ad_copy || "",
        });
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to load campaign");
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAIChange = (e) => {
    const { name, value } = e.target;
    setAiInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerateAI = async () => {
    setError("");
    setLoadingAI(true);
    try {
      const body = {
        productName: aiInput.productName || form.title,
        audience: aiInput.audience,
        tone: aiInput.tone || "santai",
      };

      if (!body.productName || !body.audience) {
        setError("Isi Product Name dan Audience (atau judul) untuk generate AI.");
        return;
      }

      const { data } = await api.post("/campaigns/generate-ad-copy", body);
      setForm((prev) => ({ ...prev, ad_copy: data.ad_copy || "" }));
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to generate ad copy");
    } finally {
      setLoadingAI(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = {
        ...form,
        budget: form.budget === "" ? null : Number(form.budget),
      };

      if (isEdit) {
        await api.put(`/campaigns/${id}`, payload);
      } else {
        await api.post("/campaigns", payload);
      }

      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to save campaign");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <Seo
        title={`Ad Campaign Manager | ${pageTitle}`}
        description="Buat atau edit campaign iklan, termasuk generate ad copy dengan AI."
      />
      <h2>{isEdit ? "Edit Campaign" : "New Campaign"}</h2>
      {error && (
        <p style={{ color: "#b91c1c", marginTop: 4, marginBottom: 12 }}>{error}</p>
      )}

      <form onSubmit={handleSubmit} className="form-grid">
        <label>
          Title
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            placeholder="Campaign title"
          />
        </label>

        <label>
          Client Name
          <input
            name="client_name"
            value={form.client_name}
            onChange={handleChange}
            placeholder="Nama klien"
          />
        </label>

        <label>
          Budget
          <input
            type="number"
            name="budget"
            value={form.budget}
            onChange={handleChange}
            placeholder="5000000"
          />
        </label>

        <label>
          Channel
          <select name="channel" value={form.channel} onChange={handleChange}>
            <option value="">Pilih channel</option>
            <option value="Facebook">Facebook</option>
            <option value="Instagram">Instagram</option>
            <option value="Google Ads">Google Ads</option>
            <option value="YouTube">YouTube</option>
            <option value="TikTok">TikTok</option>
            <option value="Other">Other</option>
          </select>
        </label>

        <label>
          Start Date
          <input
            type="date"
            name="start_date"
            value={form.start_date}
            onChange={handleChange}
          />
        </label>

        <label>
          End Date
          <input type="date" name="end_date" value={form.end_date} onChange={handleChange} />
        </label>

        <label>
          Status
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="ended">Ended</option>
          </select>
        </label>

        <fieldset>
          <legend>Generate Ad Copy dengan AI</legend>
          <div className="form-grid">
            <label>
              Product Name
              <input
                name="productName"
                value={aiInput.productName}
                onChange={handleAIChange}
                placeholder="Produk yang mau diiklankan"
              />
            </label>

            <label>
              Audience
              <input
                name="audience"
                value={aiInput.audience}
                onChange={handleAIChange}
                placeholder="Contoh: Ibu muda, pekerja kantoran"
              />
            </label>

            <label>
              Tone
              <select name="tone" value={aiInput.tone} onChange={handleAIChange}>
                <option value="santai">Santai</option>
                <option value="profesional">Profesional</option>
                <option value="humoris">Humoris</option>
                <option value="urgent">Urgent</option>
              </select>
            </label>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn"
              onClick={handleGenerateAI}
              disabled={loadingAI}
            >
              {loadingAI ? "Generating..." : "Generate Ad Copy"}
            </button>
          </div>
        </fieldset>

        <label>
          Ad Copy
          <textarea
            name="ad_copy"
            value={form.ad_copy}
            onChange={handleChange}
            rows={6}
            placeholder="Teks iklan..."
          />
        </label>

        <div className="form-actions">
          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            className="btn secondary"
            onClick={() => navigate("/")}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
