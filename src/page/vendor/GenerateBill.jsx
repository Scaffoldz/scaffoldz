import { useState, useEffect } from "react";
import api from "../../services/api";

export default function GenerateBill() {
  const [orders, setOrders] = useState([]);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [form, setForm] = useState({
    projectId: "",
    supplyOrderId: "",
    notes: "",
    items: [{ name: "", quantity: "", unit: "pcs", unitPrice: "" }],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [ordersData, billsData] = await Promise.all([
          api.procurement.getVendorOrders(),
          api.bills.getVendorBills(),
        ]);
        setOrders(ordersData.orders || []);
        setBills(billsData.bills || []);
      } catch (err) {
        console.error("Failed to load data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleOrderSelect = (e) => {
    const orderId = e.target.value;
    const order = orders.find((o) => String(o.id) === orderId);
    if (order) {
      setForm((f) => ({
        ...f,
        supplyOrderId: orderId,
        projectId: String(order.project_id || ""),
        items: [
          {
            name: order.material_type || "",
            quantity: String(order.quantity || ""),
            unit: order.unit || "pcs",
            unitPrice: order.total_amount
              ? String((parseFloat(order.total_amount) / parseFloat(order.quantity || 1)).toFixed(2))
              : "",
          },
        ],
      }));
    } else {
      setForm((f) => ({ ...f, supplyOrderId: "", projectId: "" }));
    }
  };

  const addItem = () =>
    setForm((f) => ({
      ...f,
      items: [...f.items, { name: "", quantity: "", unit: "pcs", unitPrice: "" }],
    }));

  const removeItem = (idx) =>
    setForm((f) => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));

  const updateItem = (idx, field, value) =>
    setForm((f) => ({
      ...f,
      items: f.items.map((item, i) => (i === idx ? { ...item, [field]: value } : item)),
    }));

  const subtotal = form.items.reduce(
    (sum, item) => sum + (parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0),
    0
  );
  const taxAmount = subtotal * 0.18;
  const total = subtotal + taxAmount;

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const validItems = form.items.filter(
      (item) => item.name.trim() && parseFloat(item.quantity) > 0 && parseFloat(item.unitPrice) > 0
    );
    if (validItems.length === 0) {
      setError("Please add at least one valid item with name, quantity, and unit price.");
      return;
    }

    setGenerating(true);
    try {
      const payload = {
        projectId: form.projectId ? parseInt(form.projectId) : null,
        supplyOrderId: form.supplyOrderId ? parseInt(form.supplyOrderId) : null,
        items: validItems,
        notes: form.notes,
      };
      const data = await api.bills.generate(payload);
      setBills((prev) => [data.bill, ...prev]);
      setSuccess("✅ Bill generated successfully with AI!");
      setForm({
        projectId: "",
        supplyOrderId: "",
        notes: "",
        items: [{ name: "", quantity: "", unit: "pcs", unitPrice: "" }],
      });
      setSelectedBill(data.bill);
      setShowModal(true);
    } catch (err) {
      setError(err.message || "Failed to generate bill. Please check your Gemini API key.");
    } finally {
      setGenerating(false);
    }
  };

  const statusColors = {
    Draft: "bg-gray-100 text-gray-600",
    Sent: "bg-blue-100 text-blue-700",
    Paid: "bg-green-100 text-green-700",
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">🧾 Generate Bill</h1>
          <p className="text-gray-500 mt-1 text-sm">Use Gemini AI to create professional supply bills</p>
        </div>
        <div className="text-xs text-purple-600 font-semibold bg-purple-50 px-3 py-1.5 rounded-full border border-purple-200">
          ✨ Powered by Gemini AI
        </div>
      </div>

      {/* Alert messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-medium">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Bill Form */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <h2 className="text-lg font-bold text-gray-800">Bill Details</h2>

          <form onSubmit={handleGenerate} className="space-y-5">
            {/* Link to Supply Order */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                Link to Supply Order (Optional)
              </label>
              <select
                value={form.supplyOrderId}
                onChange={handleOrderSelect}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              >
                <option value="">— Select a Supply Order —</option>
                {orders.map((o) => (
                  <option key={o.id} value={o.id}>
                    #{o.id} — {o.project_name} · {o.material_type} ({o.quantity} {o.unit})
                  </option>
                ))}
              </select>
            </div>

            {/* Line Items */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Bill Items
                </label>
                <button
                  type="button"
                  onClick={addItem}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  + Add Item
                </button>
              </div>
              <div className="space-y-3">
                {form.items.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                    <input
                      className="col-span-4 border border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:border-primary"
                      placeholder="Item name"
                      value={item.name}
                      onChange={(e) => updateItem(idx, "name", e.target.value)}
                      required
                    />
                    <input
                      className="col-span-2 border border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:border-primary"
                      placeholder="Qty"
                      type="number"
                      min="0"
                      value={item.quantity}
                      onChange={(e) => updateItem(idx, "quantity", e.target.value)}
                      required
                    />
                    <input
                      className="col-span-2 border border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:border-primary"
                      placeholder="Unit"
                      value={item.unit}
                      onChange={(e) => updateItem(idx, "unit", e.target.value)}
                    />
                    <input
                      className="col-span-3 border border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:border-primary"
                      placeholder="Unit Price ₹"
                      type="number"
                      min="0"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(idx, "unitPrice", e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(idx)}
                      disabled={form.items.length === 1}
                      className="col-span-1 text-gray-300 hover:text-red-500 transition-colors disabled:opacity-30 text-center font-bold text-lg"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm border border-gray-100">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>GST (18%)</span>
                <span>₹{taxAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-800 border-t border-gray-200 pt-2">
                <span>Total</span>
                <span>₹{total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                Additional Notes
              </label>
              <textarea
                rows={3}
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                placeholder="Payment terms, delivery notes, etc."
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={generating}
              className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {generating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Generating with AI...
                </>
              ) : (
                "✨ Generate Bill with AI"
              )}
            </button>
          </form>
        </div>

        {/* Preview / Tips */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-100 rounded-2xl p-5">
            <h3 className="font-bold text-purple-800 mb-3 flex items-center gap-2">
              <span>✨</span> How AI Bill Generation Works
            </h3>
            <ul className="text-sm text-purple-700 space-y-2">
              <li>• Fill in your bill items with quantity &amp; pricing</li>
              <li>• Gemini AI crafts a professional bill document</li>
              <li>• The bill is automatically saved and sent to your customer</li>
              <li>• Customers can view all bills on their dashboard</li>
            </ul>
          </div>
          <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 text-sm text-orange-700">
            <p className="font-bold mb-1">💡 Pro Tip</p>
            <p>Link a Supply Order to auto-populate item details directly from your approved quotation.</p>
          </div>
        </div>
      </div>

      {/* Generated Bills List */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-5">Your Generated Bills</h2>
        {bills.length === 0 ? (
          <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 p-10 text-center">
            <span className="text-5xl opacity-20">🧾</span>
            <p className="text-gray-400 mt-3 font-medium">No bills generated yet. Create your first bill above!</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-widest">Bill #</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-widest">Project</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-widest">Amount</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-widest">Date</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bills.map((bill) => (
                  <tr key={bill.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs text-gray-600 font-bold">{bill.bill_number}</td>
                    <td className="px-5 py-4 font-medium text-gray-700">{bill.project_name || "—"}</td>
                    <td className="px-5 py-4 font-bold text-gray-800">
                      ₹{Number(bill.total_amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${statusColors[bill.status] || "bg-gray-100 text-gray-500"}`}>
                        {bill.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-xs">
                      {new Date(bill.created_at).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => { setSelectedBill(bill); setShowModal(true); }}
                        className="text-primary text-sm font-bold hover:underline"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Bill Modal */}
      {showModal && selectedBill && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-gray-800 text-lg">{selectedBill.bill_number}</h3>
                <p className="text-xs text-gray-400">
                  {selectedBill.project_name ? `Project: ${selectedBill.project_name}` : "No project linked"} ·{" "}
                  {new Date(selectedBill.created_at).toLocaleDateString("en-IN")}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${statusColors[selectedBill.status] || "bg-gray-100 text-gray-500"}`}>
                  {selectedBill.status}
                </span>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-700 font-bold text-xl leading-none">×</button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <div className="bg-gray-50 rounded-xl p-5 font-mono text-sm text-gray-700 whitespace-pre-wrap leading-relaxed border border-gray-100">
                {selectedBill.bill_content}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center bg-gray-50/50">
              <p className="text-sm font-bold text-gray-700">
                Total: ₹{Number(selectedBill.total_amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </p>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
