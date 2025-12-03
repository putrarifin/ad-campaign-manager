import dotenv from "dotenv";

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";

// helper: kalau belum ada API key, kita balikin teks dummy saja
function generateDummyCopy({ productName, audience, tone }) {
  return `Promo ${productName} untuk ${audience}!

Nikmati penawaran spesial kami dengan gaya bahasa yang ${tone}.
Segera dapatkan sebelum promonya berakhir!`;
}

export async function generateAdCopyWithAI({ productName, audience, tone }) {
  if (!OPENAI_API_KEY) {
    console.warn("OPENAI_API_KEY not set, using dummy ad copy");
    return generateDummyCopy({ productName, audience, tone });
  }

  const prompt = `Buatkan teks iklan singkat untuk produk "${productName}" 
dengan target audiens: ${audience}, gaya bahasa: ${tone}. 
Gunakan bahasa Indonesia, maksimal 3 paragraf yang persuasif.`;

  // Node 20+ punya global fetch, jadi ga perlu import library tambahan
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
    }),
  });

  if (!response.ok) {
    console.error("OpenAI API error:", await response.text());
    // fallback ke dummy kalau error
    return generateDummyCopy({ productName, audience, tone });
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() ?? generateDummyCopy({ productName, audience, tone });
}
