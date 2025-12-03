import db from "../db/connection.js";
import { generateAdCopyWithAI } from "../services/aiService.js";


export async function getAllCampaigns(req, res) {
  try {
    const result = await db.query(
      "SELECT * FROM campaigns ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error getAllCampaigns:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getCampaignById(req, res) {
  const { id } = req.params;
  try {
    const result = await db.query("SELECT * FROM campaigns WHERE id = $1", [id]);
    if (!result.rows[0]) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error getCampaignById:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createCampaign(req, res) {
  const {
    title,
    client_name,
    budget,
    channel,
    start_date,
    end_date,
    status,
    ad_copy,
  } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO campaigns
       (title, client_name, budget, channel, start_date, end_date, status, ad_copy, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW(),NOW())
       RETURNING *`,
      [title, client_name, budget, channel, start_date, end_date, status, ad_copy]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error createCampaign:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateCampaign(req, res) {
  const { id } = req.params;
  const {
    title,
    client_name,
    budget,
    channel,
    start_date,
    end_date,
    status,
    ad_copy,
  } = req.body;

  try {
    const result = await db.query(
      `UPDATE campaigns
       SET title = $1,
           client_name = $2,
           budget = $3,
           channel = $4,
           start_date = $5,
           end_date = $6,
           status = $7,
           ad_copy = $8,
           updated_at = NOW()
       WHERE id = $9
       RETURNING *`,
      [title, client_name, budget, channel, start_date, end_date, status, ad_copy, id]
    );

    if (!result.rows[0]) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updateCampaign:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteCampaign(req, res) {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM campaigns WHERE id = $1", [id]);
    res.status(204).send();
  } catch (err) {
    console.error("Error deleteCampaign:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function generateAdCopy(req, res) {
  const { productName, audience, tone } = req.body;

  if (!productName || !audience) {
    return res.status(400).json({
      message: "productName dan audience wajib diisi",
    });
  }

  try {
    const copy = await generateAdCopyWithAI({
      productName,
      audience,
      tone: tone || "santai",
    });

    res.json({ ad_copy: copy });
  } catch (err) {
    console.error("Error generateAdCopy:", err);
    res.status(500).json({ message: "Failed to generate ad copy" });
  }
}
