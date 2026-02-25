import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";

function Budget() {
  const { id: projectId } = useParams();
  const [data, setData] = useState({ milestones: [], payments: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBudgetData = async () => {
      try {
        setLoading(true);
        const [milestonesRes, paymentsRes] = await Promise.all([
          api.milestones.getByProject(projectId),
          api.payments.getByProject(projectId)
        ]);

        setData({
          milestones: milestonesRes.milestones || [],
          payments: paymentsRes.payments || []
        });
        setError(null);
      } catch (err) {
        console.error("Failed to fetch budget data:", err);
        setError("Failed to load financial analysis.");
      } finally {
        setLoading(false);
      }
    };

    fetchBudgetData();
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const { milestones, payments } = data;
  const totalBudgeted = milestones.reduce((sum, m) => sum + Number(m.amount), 0);
  const totalActual = payments
    .filter(p => p.status === 'Completed')
    .reduce((sum, p) => sum + Number(p.amount), 0);
  const remaining = totalBudgeted - totalActual;

  return (
    <div className="space-y-8 animate-fade-in p-8">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-primary">Budget & Cost Analysis</h1>
        <p className="text-gray-500 mt-1">Financial monitoring based on project milestones and payments.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm border-l-4 border-l-primary">
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Total Budgeted</p>
          <p className="text-2xl font-bold text-gray-800">₹ {totalBudgeted.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm border-l-4 border-l-amber-400">
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Total Spent (Actual)</p>
          <p className="text-2xl font-bold text-gray-800">₹ {totalActual.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm border-l-4 border-l-green-400">
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Remaining Balance</p>
          <p className="text-2xl font-bold text-green-600">₹ {remaining.toLocaleString('en-IN')}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
          <h3 className="font-bold text-gray-800">Milestone-wise Expenditure</h3>
          <button className="text-[10px] font-bold text-primary uppercase border border-primary/20 px-3 py-1 rounded">Download Audit</button>
        </div>
        <div className="p-6">
          <div className="space-y-8">
            {milestones.length === 0 && <p className="text-center text-gray-500 py-8">No milestones defined for this project.</p>}
            {milestones.map((m, i) => {
              const payment = payments.find(p => p.milestone_id === m.id && p.status === 'Completed');
              const paidAmount = payment ? Number(payment.amount) : 0;
              const utilization = (paidAmount / Number(m.amount)) * 100;

              return (
                <div key={m.id} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm">{m.title}</h4>
                      <p className="text-[10px] text-gray-400 font-medium">
                        Spent: ₹ {paidAmount.toLocaleString('en-IN')} / Allocated: ₹ {Number(m.amount).toLocaleString('en-IN')}
                      </p>
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${m.status === 'Completed' ? 'bg-green-50 text-green-600' :
                        m.status === 'In Progress' ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-400'
                      }`}>{m.status}</span>
                  </div>
                  <div className="relative h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full relative transition-all duration-1000 ${utilization >= 100 ? 'bg-green-500' : 'bg-primary'
                        }`}
                      style={{ width: `${Math.min(100, utilization)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-gray-400 uppercase tracking-tighter">Phase Utilization</span>
                    <span className={utilization >= 100 ? 'text-green-500' : 'text-primary'}>
                      {utilization.toFixed(1)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Budget;
