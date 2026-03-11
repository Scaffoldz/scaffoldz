import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";

function Budget() {
  const { id: projectId } = useParams();
  const [project, setProject] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [actualCost, setActualCost] = useState({ cost: 0, reportCount: 0 });
  const [dailyCosts, setDailyCosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBudgetData = async () => {
      try {
        setLoading(true);
        const [projectRes, milestonesRes, actualCostRes, dailyCostsRes] = await Promise.all([
          api.projects.getById(projectId),
          api.milestones.getByProject(projectId),
          api.reports.getActualCost(projectId),
          api.reports.getDailyCosts(projectId),
        ]);

        setProject(projectRes.project || projectRes);
        setMilestones(milestonesRes.milestones || []);
        setActualCost({
          cost: actualCostRes.actualCost || 0,
          reportCount: actualCostRes.reportCount || 0
        });
        setDailyCosts(dailyCostsRes.dailyCosts || []);
      } catch (err) {
        console.error("Failed to fetch budget data:", err);
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

  // Use project.budget as the source of truth for total budget
  const totalBudgeted = project ? Number(project.budget || 0) : 0;
  const remaining = totalBudgeted - actualCost.cost;

  // Daily graph calculations
  const maxDaily = Math.max(...dailyCosts.map(d => Number(d.daily_cost)), 1);
  const cumulativeData = dailyCosts.reduce((acc, d, i) => {
    const prev = i > 0 ? acc[i - 1].cumulative : 0;
    acc.push({ ...d, cumulative: prev + Number(d.daily_cost) });
    return acc;
  }, []);
  const maxCumulative = Math.max(...cumulativeData.map(d => d.cumulative), 1);

  const fmt = (n) => `₹ ${Number(n).toLocaleString('en-IN')}`;

  return (
    <div className="space-y-8 animate-fade-in p-8">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-primary">Budget & Cost Analysis</h1>
        <p className="text-gray-500 mt-1">Financial monitoring based on project budget and daily site reports.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm border-l-4 border-l-primary">
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Total Budget</p>
          <p className="text-2xl font-bold text-gray-800">{fmt(totalBudgeted)}</p>
          {project?.title && <p className="text-[10px] text-gray-400 mt-1">{project.title}</p>}
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm border-l-4 border-l-orange-400">
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Actual Site Expense</p>
          <p className="text-2xl font-bold text-orange-600">{fmt(actualCost.cost)}</p>
          <p className="text-[10px] text-gray-400 mt-1">from {actualCost.reportCount} daily report{actualCost.reportCount !== 1 ? 's' : ''}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm border-l-4 border-l-green-400">
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Remaining Budget</p>
          <p className={`text-2xl font-bold ${remaining < 0 ? 'text-red-500' : 'text-green-600'}`}>
            {fmt(Math.abs(remaining))}{remaining < 0 ? ' over budget' : ''}
          </p>
        </div>
      </div>

      {/* Daily Expense Graph */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-bold text-gray-800">Daily Site Expense</h3>
            <p className="text-[10px] text-gray-400 mt-0.5">From submitted contractor daily reports</p>
          </div>
          {dailyCosts.length > 0 && (
            <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400">
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-primary inline-block rounded"></span> Cumulative</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-orange-300 rounded-sm inline-block"></span> Daily</span>
              {totalBudgeted > 0 && <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-red-300 border-dashed inline-block rounded"></span> Budget</span>}
            </div>
          )}
        </div>

        {dailyCosts.length === 0 ? (
          <div className="h-52 flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-100 rounded-xl">
            <span className="text-4xl opacity-20 mb-3">📈</span>
            <p className="text-gray-400 text-sm font-medium">No daily reports yet</p>
            <p className="text-gray-400 text-xs mt-1">Cost data will appear here once the contractor submits daily reports.</p>
          </div>
        ) : (() => {
          // SVG chart dimensions
          const W = 800, H = 200, PAD = { top: 16, right: 20, bottom: 28, left: 56 };
          const chartW = W - PAD.left - PAD.right;
          const chartH = H - PAD.top - PAD.bottom;

          const maxVal = Math.max(totalBudgeted, ...cumulativeData.map(d => d.cumulative)) * 1.1 || 1;
          const n = cumulativeData.length;
          const barW = Math.max(4, Math.min(20, chartW / n - 6));

          const xPos = (i) => PAD.left + (i + 0.5) * (chartW / n);
          const yPos = (v) => PAD.top + chartH - (v / maxVal) * chartH;

          // Area path for cumulative
          const points = cumulativeData.map((d, i) => `${xPos(i)},${yPos(d.cumulative)}`).join(' ');
          const areaPath = `M${xPos(0)},${yPos(0)} ` +
            cumulativeData.map((d, i) => `L${xPos(i)},${yPos(d.cumulative)}`).join(' ') +
            ` L${xPos(n - 1)},${PAD.top + chartH} L${xPos(0)},${PAD.top + chartH} Z`;

          // Y axis ticks
          const ticks = [0, 0.25, 0.5, 0.75, 1].map(f => ({ v: maxVal * f, y: yPos(maxVal * f) }));

          return (
            <div className="relative overflow-x-auto">
              <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 220 }}>
                {/* Grid lines */}
                {ticks.map((t, i) => (
                  <g key={i}>
                    <line x1={PAD.left} x2={W - PAD.right} y1={t.y} y2={t.y}
                      stroke="#f0f0f0" strokeWidth="1" />
                    <text x={PAD.left - 6} y={t.y + 4} textAnchor="end"
                      className="fill-gray-400" style={{ fontSize: 9, fontFamily: 'inherit', fontWeight: 600 }}>
                      {t.v >= 100000
                        ? `₹${(t.v / 100000).toFixed(0)}L`
                        : t.v > 0 ? `₹${Math.round(t.v / 1000)}k` : '0'}
                    </text>
                  </g>
                ))}

                {/* Budget ceiling line */}
                {totalBudgeted > 0 && totalBudgeted <= maxVal && (
                  <line x1={PAD.left} x2={W - PAD.right}
                    y1={yPos(totalBudgeted)} y2={yPos(totalBudgeted)}
                    stroke="#fca5a5" strokeWidth="1.5" strokeDasharray="5,4" />
                )}

                {/* Area fill */}
                <path d={areaPath} fill="url(#areaGrad)" opacity="0.5" />

                {/* Cumulative line */}
                <polyline points={points} fill="none"
                  stroke="var(--color-primary, #1e40af)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

                {/* Daily cost bars */}
                {cumulativeData.map((d, i) => {
                  const barH = Math.max(2, (Number(d.daily_cost) / maxVal) * chartH);
                  return (
                    <rect key={i}
                      x={xPos(i) - barW / 2}
                      y={PAD.top + chartH - barH}
                      width={barW}
                      height={barH}
                      rx="2"
                      fill="#fdba74"
                      opacity="0.85"
                    />
                  );
                })}

                {/* Hover dots + X labels */}
                {cumulativeData.map((d, i) => {
                  const label = new Date(d.report_date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
                  return (
                    <g key={i} className="group cursor-pointer">
                      <circle cx={xPos(i)} cy={yPos(d.cumulative)} r="5"
                        fill="white" stroke="var(--color-primary,#1e40af)" strokeWidth="2"
                        className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      {/* Tooltip */}
                      <g className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <rect x={xPos(i) - 44} y={yPos(d.cumulative) - 44} width="88" height="38" rx="6" fill="#1f2937" />
                        <text x={xPos(i)} y={yPos(d.cumulative) - 28} textAnchor="middle"
                          fill="white" style={{ fontSize: 9, fontWeight: 700, fontFamily: 'inherit' }}>{label}</text>
                        <text x={xPos(i)} y={yPos(d.cumulative) - 14} textAnchor="middle"
                          fill="#fdba74" style={{ fontSize: 9, fontFamily: 'inherit' }}>Day: {fmt(d.daily_cost)}</text>
                      </g>
                      {/* X axis label */}
                      <text x={xPos(i)} y={H - 4} textAnchor="middle"
                        fill="#9ca3af" style={{ fontSize: 8, fontFamily: 'inherit', fontWeight: 600 }}>
                        {label}
                      </text>
                    </g>
                  );
                })}

                {/* Gradient def */}
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary,#1e40af)" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="var(--color-primary,#1e40af)" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Burn rate bar */}
              {totalBudgeted > 0 && (
                <div className="mt-2 space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold text-gray-400 px-1">
                    <span>Budget Burn</span>
                    <span className={actualCost.cost > totalBudgeted ? 'text-red-500' : 'text-orange-500'}>
                      {((actualCost.cost / totalBudgeted) * 100).toFixed(1)}% of {fmt(totalBudgeted)}
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-700 ${actualCost.cost > totalBudgeted ? 'bg-red-400' : 'bg-orange-400'}`}
                      style={{ width: `${Math.min(100, (actualCost.cost / totalBudgeted) * 100)}%` }} />
                  </div>
                </div>
              )}
            </div>
          );
        })()}
      </div>

      {/* Milestone Breakdown */}
      {milestones.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 bg-gray-50/30">
            <h3 className="font-bold text-gray-800">Milestone Breakdown</h3>
          </div>
          <div className="p-6 space-y-8">
            {milestones.map((m) => {
              const milestoneShare = totalBudgeted > 0 ? (Number(m.amount) / totalBudgeted) * 100 : 0;
              return (
                <div key={m.id} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm">{m.title}</h4>
                      <p className="text-[10px] text-gray-400 font-medium">Allocated: {fmt(m.amount)} ({milestoneShare.toFixed(1)}% of budget)</p>
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${m.status === 'Completed' ? 'bg-green-50 text-green-600' :
                      m.status === 'In Progress' ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-400'}`}>
                      {m.status}
                    </span>
                  </div>
                  <div className="relative h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-1000 ${m.status === 'Completed' ? 'bg-green-500' : 'bg-primary'}`}
                      style={{ width: `${Math.min(100, milestoneShare)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default Budget;
