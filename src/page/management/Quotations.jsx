import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

function Quotations() {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuotations = async () => {
      try {
        setLoading(true);
        // Fetch all projects and filter for those needing quotations/bidding
        const data = await api.projects.getAll();
        const filtered = data.projects.filter(p =>
          p.status === 'Bidding'
        );
        setQuotations(filtered);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuotations();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading quotations...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-8 animate-fade-in p-8">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-primary">Quotations</h1>
        <p className="text-gray-500 mt-1">Review and approve contractor bids.</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-700 text-xs uppercase font-bold tracking-wider">
            <tr>
              <th className="p-4 border-b border-gray-200">Quote ID</th>
              <th className="p-4 border-b border-gray-200">Project</th>
              <th className="p-4 border-b border-gray-200">Amount</th>
              <th className="p-4 border-b border-gray-200">Status</th>
              <th className="p-4 border-b border-gray-200 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {quotations.map((q) => (
              <tr key={q.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4 text-sm font-semibold text-gray-500">P-{q.id.toString().padStart(4, '0')}</td>
                <td className="p-4 text-sm text-gray-800">{q.title}</td>
                <td className="p-4 text-sm font-bold text-gray-800">₹ {Number(q.budget).toLocaleString()}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs font-bold rounded ${q.status === 'Bidding' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                    {q.status}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <Link to={`/management/bids/${q.id}`} className="text-primary text-xs font-bold hover:underline">
                    View Bids
                  </Link>
                </td>
              </tr>
            ))}
            {quotations.length === 0 && (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500">No projects currently awaiting quotations.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Quotations;
