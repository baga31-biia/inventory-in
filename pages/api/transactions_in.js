// pages/api/transactions.js
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { category_id, item_id, unit, quantity, type, description, md, exp, no_batch } = req.body;

  if (!category_id || !item_id || !quantity) {
    return res.status(400).json({ error: "category_id, item_id, quantity wajib diisi" });
  }

  const payload = {
    category_id,
    item_id,
    unit: unit || null,
    quantity,
    type: type || "IN",
    description: description || null,
    md: md || null,
    exp: exp || null,
    no_batch: no_batch || "-"
  };

  const { data, error } = await supabaseAdmin
    .from("stock_transactions")
    .insert([payload])
    .select();

  if (error) {
    console.error("Supabase insert:", error);
    return res.status(400).json({ error: error.message });
  }

  return res.status(200).json({ data });
}
