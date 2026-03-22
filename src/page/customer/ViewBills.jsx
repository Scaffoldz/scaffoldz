import { useState, useEffect } from "react";
import api from "../../services/api";

export default function ViewBills() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBill, setSelectedBill] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    const fetchBills = async () => {
      try {
        setLoading(true);
        const data = await api.bills.getCustomerBills();
        setBills(data.bills || []);
      } catch (err) {
        setError("Failed to load bills.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBills();
  }, []);

  const filtered = bills.filter((b) => {
    const matchesSearch =
      !search ||
      b.bill_number?.toLowerCase().includes(search.toLowerCase()) ||
      b.project_name?.toLowerCase().includes(search.toLowerCase()) ||
      (b.vendor_name || b.vendor_full_name)?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "All" || b.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalAmount = bills.reduce((sum, b) => sum + parseFloat(b.total_amount || 0), 0);
  const paidAmount = bills.filter((b) => b.status === "Paid").reduce((sum, b) => sum + parseFloat(b.total_amount || 0), 0);
  const pendingAmount = bills.filter((b) => b.status !== "Paid").reduce((sum, b) => sum + parseFloat(b.total_amount || 0), 0);

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
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">🧾 My Bills</h1>
          <p className="text-gray-500 mt-1 text-sm">
            View all AI-generated supply bills from your vendors
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Bills</p>
          <h3 className="text-3xl font-bold text-gray-800">{bills.length}</h3>
          <p className="text-xs text-gray-400 mt-1">across all projects</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Amount</p>
          <h3 className="text-2xl font-bold text-gray-800">
            ₹{totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </h3>
          <p className="text-xs text-green-600 mt-1 font-semibold">
            ₹{paidAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })} paid
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Pending Amount</p>
          <h3 className="text-2xl font-bold text-amber-600">
            ₹{pendingAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </h3>
          <p className="text-xs text-amber-500 mt-1 font-semibold">awaiting payment</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search bills, projects, vendors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />
        <div className="flex gap-2">
          {["All", "Sent", "Paid", "Draft"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                filterStatus === status
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-500 border-gray-200 hover:border-primary/40 hover:text-primary"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Bills List */}
      {filtered.length === 0 ? (
        <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center space-y-3">
          <span className="text-6xl opacity-20">🧾</span>
          <p className="text-gray-400 font-medium">
            {bills.length === 0
              ? "No bills have been generated for your projects yet."
              : "No bills match your search filter."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-widest">Bill #</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-widest">Project</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-widest">Vendor</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-widest">Amount</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-widest">Date</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((bill) => (
                <tr key={bill.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4 font-mono text-xs text-gray-600 font-bold whitespace-nowrap">
                    {bill.bill_number}
                  </td>
                  <td className="px-5 py-4 font-medium text-gray-700">{bill.project_name || "—"}</td>
                  <td className="px-5 py-4 text-gray-600">
                    {bill.vendor_name || bill.vendor_full_name || "—"}
                    {bill.vendor_email && (
                      <p className="text-xs text-gray-400">{bill.vendor_email}</p>
                    )}
                  </td>
                  <td className="px-5 py-4 font-bold text-gray-800 whitespace-nowrap">
                    ₹{Number(bill.total_amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${statusColors[bill.status] || "bg-gray-100 text-gray-500"}`}>
                      {bill.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-500 text-xs whitespace-nowrap">
                    {new Date(bill.created_at).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => { setSelectedBill(bill); setShowModal(true); }}
                      className="text-primary text-sm font-bold hover:underline whitespace-nowrap"
                    >
                      View Bill →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Bill Detail Modal */}
      {showModal && selectedBill && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-start px-6 py-4 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-gray-800 text-lg">{selectedBill.bill_number}</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {selectedBill.project_name ? `Project: ${selectedBill.project_name}` : "No project linked"}
                </p>
                <p className="text-xs text-gray-400">
                  Vendor: {selectedBill.vendor_name || selectedBill.vendor_full_name || "—"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${statusColors[selectedBill.status] || "bg-gray-100 text-gray-500"}`}>
                  {selectedBill.status}
                </span>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-700 font-bold text-2xl leading-none ml-2"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Bill Content — AI Generated */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
                  ✨ AI Generated
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(selectedBill.created_at).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="bg-gray-50 rounded-xl p-5 font-mono text-sm text-gray-700 whitespace-pre-wrap leading-relaxed border border-gray-100">
                {selectedBill.bill_content}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-500">
                  Subtotal: ₹{Number(selectedBill.subtotal).toLocaleString("en-IN", { minimumFractionDigits: 2 })} ·
                  GST: ₹{Number(selectedBill.tax_amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </p>
                <p className="text-base font-bold text-gray-800 mt-0.5">
                  Total: ₹{Number(selectedBill.total_amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all"
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
