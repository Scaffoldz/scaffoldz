import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";

function Materials() {
  const { id } = useParams();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMaterial, setNewMaterial] = useState({
    name: "",
    quantity: "",
    unit: "",
    allocated_budget: "",
    spent_amount: "0"
  });

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setLoading(true);
        const data = await api.materials.getByProject(id);
        setMaterials(data.materials || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, [id]);

  const handleAddMaterial = async (e) => {
    e.preventDefault();
    try {
      const data = await api.materials.create({
        project_id: id,
        ...newMaterial
      });
      setMaterials([...materials, data.material]);
      setIsModalOpen(false);
      setNewMaterial({ name: "", quantity: "", unit: "", allocated_budget: "", spent_amount: "0" });
    } catch (err) {
      alert("Failed to add material: " + err.message);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading materials...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  const totalAllocated = materials.reduce((sum, m) => sum + Number(m.allocated_budget || 0), 0);
  const totalSpent = materials.reduce((sum, m) => sum + Number(m.spent_amount || 0), 0);

  return (
    <div className="space-y-6 animate-fade-in p-6">
      <div className="flex justify-between items-end border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Project Materials</h1>
          <p className="text-sm text-gray-500 mt-1">Inventory and expenditure tracking for materials.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-primary/90 transition-colors"
        >
          + Add Material
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Allocated</p>
          <p className="text-xl font-bold text-gray-800 mt-1">₹ {totalAllocated.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Spent</p>
          <p className="text-xl font-bold text-gray-800 mt-1">₹ {totalSpent.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Remaining Budget</p>
          <p className={`text-xl font-bold mt-1 ${totalAllocated - totalSpent < 0 ? 'text-red-500' : 'text-green-600'}`}>
            ₹ {(totalAllocated - totalSpent).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase font-bold tracking-widest">
            <tr>
              <th className="p-4 border-b border-gray-100">Material Name</th>
              <th className="p-4 border-b border-gray-100">Quantity</th>
              <th className="p-4 border-b border-gray-100">Allocated</th>
              <th className="p-4 border-b border-gray-100">Spent</th>
              <th className="p-4 border-b border-gray-100">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {materials.map((m) => {
              const percentSpent = (Number(m.spent_amount) / Number(m.allocated_budget)) * 100;
              return (
                <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-bold text-gray-800 text-sm">{m.name}</td>
                  <td className="p-4 text-sm text-gray-600 font-medium">{m.quantity} <span className="text-gray-400 text-xs">{m.unit}</span></td>
                  <td className="p-4 text-sm text-gray-700 font-bold">₹ {Number(m.allocated_budget).toLocaleString()}</td>
                  <td className="p-4 text-sm text-gray-700 font-bold">₹ {Number(m.spent_amount).toLocaleString()}</td>
                  <td className="p-4">
                    <div className="w-full bg-gray-100 rounded-full h-1.5 max-w-[100px] mb-1">
                      <div
                        className={`h-1.5 rounded-full ${percentSpent > 90 ? 'bg-red-500' : percentSpent > 70 ? 'bg-amber-500' : 'bg-primary'}`}
                        style={{ width: `${Math.min(percentSpent, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase">{Math.round(percentSpent)}% Used</span>
                  </td>
                </tr>
              );
            })}
            {materials.length === 0 && (
              <tr>
                <td colSpan="5" className="p-12 text-center text-gray-400 italic">No materials logged for this project yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Material Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-scale-in">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-gray-800">Add New Material</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl font-light">&times;</button>
            </div>
            <form onSubmit={handleAddMaterial} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Material Name</label>
                <input
                  required
                  type="text"
                  value={newMaterial.name}
                  onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
                  className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-primary outline-none"
                  placeholder="e.g., Cement Bags"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Quantity</label>
                  <input
                    required
                    type="number"
                    value={newMaterial.quantity}
                    onChange={(e) => setNewMaterial({ ...newMaterial, quantity: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-primary outline-none"
                    placeholder="500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Unit</label>
                  <input
                    required
                    type="text"
                    value={newMaterial.unit}
                    onChange={(e) => setNewMaterial({ ...newMaterial, unit: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-primary outline-none"
                    placeholder="Bags, Kg, etc."
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Allocated Budget (₹)</label>
                <input
                  required
                  type="number"
                  value={newMaterial.allocated_budget}
                  onChange={(e) => setNewMaterial({ ...newMaterial, allocated_budget: e.target.value })}
                  className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-primary outline-none"
                  placeholder="200000"
                />
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-primary text-white py-3 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-primary/20 transition-all"
                >
                  Log Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Materials;
