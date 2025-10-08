import React, { useEffect } from "react";

/**
 * TransactionForm
 * Props:
 * - msg, onCloseMsg, onSubmit,
 * - categories, items,
 * - categoryId, setCategoryId, categoryText, setCategoryText,
 * - itemId, setItemId, itemText, setItemText,
 * - unit, quantity, setQuantity,
 * - md, setMd, exp, setExp, noBatch, setNoBatch,
 * - description, setDescription, categoryName
 */

export default function TransactionForm(props) {
  const {
    msg, onCloseMsg, onSubmit,
    categories, items,
    categoryId, setCategoryId, categoryText, setCategoryText,
    itemId, setItemId, itemText, setItemText,
    unit, quantity, setQuantity,
    md, setMd, exp, setExp, noBatch, setNoBatch,
    description, setDescription, categoryName
  } = props;

  useEffect(() => {
    const el = document.querySelector("#kategori");
    if (el) el.focus();
  }, []);

  return (
    <div className="container">
      <h1>Form Transaksi Masuk</h1>

      {msg && (
        <div className={`alert ${msg.type === "error" ? "alert-error" : "alert-success"}`}>
          <div>
            <strong>{msg.type === "error" ? "Error: " : "Sukses: "}</strong>
            <span>{msg.text}</span>
          </div>
          <button onClick={onCloseMsg} style={{ background: "transparent", border: "none", fontSize: 18 }}>×</button>
        </div>
      )}

      <form onSubmit={onSubmit}>
        <label htmlFor="kategori">Kategori</label>
        <input
          id="kategori"
          list="kategori-list"
          value={categoryText}
          onChange={(e) => {
            const text = e.target.value;
            setCategoryText(text);
            const cat = categories.find(c => c.name.toLowerCase() === text.toLowerCase());
            setCategoryId(cat ? cat.id : "");
          }}
          placeholder="Ketik / pilih kategori..."
          required
        />
        <datalist id="kategori-list">
          {categories.map(c => <option key={c.id} value={c.name} />)}
        </datalist>

        <label htmlFor="item">Item</label>
        <input
          id="item"
          list="item-list"
          value={itemText}
          onChange={(e) => {
            const text = e.target.value;
            setItemText(text);
            const it = items.find(i => i.name.toLowerCase() === text.toLowerCase());
            setItemId(it ? it.id : "");
          }}
          placeholder="Ketik / pilih item..."
          disabled={!categoryId}
          required
        />
        <datalist id="item-list">
          {items.map(i => <option key={i.id} value={i.name} />)}
        </datalist>

        <div className="grid-2">
          <div>
            <label>Satuan</label>
            <input value={unit} readOnly />
          </div>
          <div>
            <label>Jumlah</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              step="0.0001"
              min="0.0001"
              required
            />
          </div>
        </div>

        <div className="grid-2">
          <div>
            <label>MD (Tanggal Produksi)</label>
            <input
              type="date"
              value={md}
              onChange={(e) => setMd(e.target.value)}
              disabled={categoryName !== "produk"}
            />
          </div>
          <div>
            <label>EXP (Tanggal Kadaluarsa)</label>
            <input
              type="date"
              value={exp}
              onChange={(e) => setExp(e.target.value)}
              disabled={categoryName !== "produk" && categoryName !== "bahan kemas"}
            />
          </div>
        </div>

        <label>No Batch</label>
        <input
          value={noBatch}
          onChange={(e) => setNoBatch(e.target.value || "-")}
          placeholder="Isi '-' jika tidak ada"
          required
        />

        <label>Keterangan</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />

        <button type="submit">💾 Simpan Transaksi</button>
      </form>
    </div>
  );
}
