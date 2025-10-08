import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import TransactionInForm from "../components/TransactionInForm";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [itemId, setItemId] = useState("");
  const [unit, setUnit] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [md, setMd] = useState("");
  const [exp, setExp] = useState("");
  const [noBatch, setNoBatch] = useState("-");
  const [msg, setMsg] = useState(null);
  const [categoryText, setCategoryText] = useState("");
  const [itemText, setItemText] = useState("");

  // load categories
  useEffect(() => {
    async function loadCategories() {
      const { data, error } = await supabase.from("categories").select("*").order("name");
      if (error) setMsg({ type: "error", text: error.message });
      else setCategories(data || []);
    }
    loadCategories();
  }, []);

  // load items when category changed
  useEffect(() => {
    async function loadItems() {
      if (!categoryId) { setItems([]); setItemId(""); setUnit(""); return; }
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("category_id", categoryId)
        .order("name");
      if (error) setMsg({ type: "error", text: error.message });
      else setItems(data || []);
    }
    loadItems();
  }, [categoryId]);

  // auto unit from item
  useEffect(() => {
    const it = items.find(i => String(i.id) === String(itemId));
    setUnit(it ? (it.unit || "") : "");
  }, [itemId, items]);

  const currentCategory = categories.find(c => String(c.id) === String(categoryId));
  const categoryName = currentCategory?.name?.toLowerCase() || "";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryId) return setMsg({ type: "error", text: "⚠️ Pilih kategori terlebih dahulu" });
    if (!itemId) return setMsg({ type: "error", text: "⚠️ Pilih item terlebih dahulu" });
    if (!quantity || parseFloat(quantity) <= 0) return setMsg({ type: "error", text: "⚠️ Jumlah harus valid" });
    if (!noBatch) return setMsg({ type: "error", text: "⚠️ No Batch wajib diisi" });

    const payload = {
      category_id: categoryId,
      item_id: itemId,
      unit: unit || null,
      quantity: parseFloat(quantity),
      type: "IN",
      description: description || null,
      md: categoryName === "produk" ? (md || null) : null,
      exp: (categoryName === "produk" || categoryName === "bahan kemas") ? (exp || null) : null,
      no_batch: noBatch,
    };

    try {
      console.log("Payload yang dikirim ke API:", payload);
      const res = await fetch("/api/transactions_in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal menyimpan transaksi");

      setMsg({ type: "success", text: "✅ Transaksi berhasil disimpan." });

      // reset seluruh form state (penting!)
      setCategoryId("");
      setCategoryText("");
      setItemId("");
      setItemText("");
      setUnit("");
      setQuantity("");
      setDescription("");
      setMd("");
      setExp("");
      setNoBatch("-");

      // bersihkan pesan otomatis
      setTimeout(() => setMsg(null), 5000);
    } catch (err) {
      setMsg({ type: "error", text: `❌ ${err.message}` });
      setTimeout(() => setMsg(null), 5000);
    }
  };

  return (
    <TransactionInForm
      msg={msg}
      onCloseMsg={() => setMsg(null)}
      onSubmit={handleSubmit}
      {...{
        categories, items, categoryId, setCategoryId, categoryText, setCategoryText,
        itemId, setItemId, itemText, setItemText, unit, quantity, setQuantity,
        md, setMd, exp, setExp, noBatch, setNoBatch, description, setDescription,
        categoryName
      }}
    />
  );
}
