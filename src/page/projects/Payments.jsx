import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";

function Payments() {
  const { id: projectId } = useParams();
  const [data, setData] = useState({ payments: [], milestones: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        setLoading(true);
        const [paymentsRes, milestonesRes] = await Promise.all([
          api.payments.getByProject(projectId),
          api.milestones.getByProject(projectId)
        ]);

        setData({
          payments: paymentsRes.payments || [],
          milestones: milestonesRes.milestones || []
        });
        setError(null);
      } catch (err) {
        console.error("Failed to fetch payment data:", err);
        setError("Failed to load financial data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentData();
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const { payments, milestones } = data;
  const totalPaid = payments
    .filter(p => p.status === 'Completed')
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const nextMilestones = milestones.filter(m => m.status !== 'Completed');
  const upcomingDue = nextMilestones.length > 0 ? nextMilestones[0] : null;

  return (
    <div className="space-y-8 animate-fade-in p-8">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-primary">Financial Milestones</h1>
        <p className="text-gray-500 mt-1">Track payment schedules, processed transactions, and upcoming dues.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-primary p-8 rounded-2xl shadow-lg text-white">
          <p className="text-primary-foreground/60 text-[10px] font-bold uppercase tracking-widest mb-1">Total Paid</p>
          <p className="text-3xl font-bold">₹ {(totalPaid / 100000).toFixed(2)} L</p>
          <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center text-xs">
            <span className="opacity-60">Next: {upcomingDue?.title || "None"}</span>
            <span className="font-bold">₹ {upcomingDue ? (Number(upcomingDue.amount) / 100000).toFixed(2) : "0"} L</span>
          </div>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Upcoming Due</p>
          <p className="text-3xl font-bold text-gray-800">
            ₹ {upcomingDue ? Number(upcomingDue.amount).toLocaleString('en-IN') : "0"}
          </p>
          <p className="text-xs text-orange-600 font-bold mt-2">
            {upcomingDue?.due_date ? `Due on ${new Date(upcomingDue.due_date).toLocaleDateString()}` : "No upcoming dues"}
          </p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Total Project Budget</p>
          <p className="text-3xl font-bold text-gray-800">
            ₹ {milestones.reduce((sum, m) => sum + Number(m.amount), 0).toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-gray-400 mt-2 font-medium">Based on defined milestones</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 bg-gray-50/30">
          <h3 className="font-bold text-gray-800">Payment Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-gray-400 text-[10px] uppercase font-bold tracking-widest">
              <tr>
                <th className="p-4">Milestone</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Due Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Payment Info</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {milestones.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">No milestone payments defined.</td>
                </tr>
              ) : (
                milestones.map((m, i) => {
                  const payment = payments.find(p => p.milestone_id === m.id);
                  return (
                    <tr key={m.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 font-bold text-gray-800 text-sm">{m.title}</td>
                      <td className="p-4 text-sm text-gray-700 font-mono font-bold">₹ {Number(m.amount).toLocaleString('en-IN')}</td>
                      <td className="p-4 text-xs text-gray-500 font-medium">
                        {m.due_date ? new Date(m.due_date).toLocaleDateString() : "—"}
                      </td>
                      <td className="p-4">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${m.status === 'Completed' ? 'bg-green-100 text-green-700' :
                            m.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                          }`}>{m.status}</span>
                      </td>
                      <td className="p-4 text-right text-xs text-gray-400 font-medium">
                        {payment ? `${payment.payment_method || 'Paid'} - ${payment.transaction_id || ''}` : "—"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Payments;
