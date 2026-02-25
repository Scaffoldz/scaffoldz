import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";

function Timeline() {
  const { id: projectId } = useParams();
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMilestones = async () => {
      try {
        setLoading(true);
        const response = await api.milestones.getByProject(projectId);
        setMilestones(response.milestones || []);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch milestones:", err);
        setError("Failed to load project timeline.");
      } finally {
        setLoading(false);
      }
    };

    fetchMilestones();
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const completedMilestones = milestones.filter(m => m.status === 'Completed').length;
  const progressPercent = milestones.length > 0 ? Math.round((completedMilestones / milestones.length) * 100) : 0;
  const currentMilestone = milestones.find(m => m.status === 'In Progress') || milestones.find(m => m.status === 'Pending');

  return (
    <div className="space-y-8 animate-fade-in p-8">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-primary">Construction Master Schedule</h1>
        <p className="text-gray-500 mt-1">Real-time tracking of project milestones and phase completion.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Total Milestones</p>
          <p className="text-2xl font-bold text-gray-800">{milestones.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Completed</p>
          <p className="text-2xl font-bold text-primary">{completedMilestones}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Current Phase</p>
          <p className="text-xl font-bold text-amber-600 truncate">{currentMilestone?.title || "N/A"}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Overall Progress</p>
          <p className="text-2xl font-bold text-gray-800">{progressPercent}%</p>
        </div>
      </div>

      {/* Gantt Style Tracker */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-8 flex items-center gap-2">
          <span className="w-2 h-6 bg-primary rounded-full"></span>
          Phase-wise Progress
        </h3>

        {milestones.length === 0 ? (
          <p className="text-center text-gray-500 py-12">No milestones defined for this project.</p>
        ) : (
          <div className="space-y-12 relative">
            {/* Connecting Line */}
            <div className="absolute left-[23px] top-4 bottom-4 w-0.5 bg-gray-100 z-0"></div>

            {milestones.map((m, i) => (
              <div key={m.id} className="relative z-10 flex gap-8 group">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-white shadow-sm font-bold text-white transition-all ${m.status === 'Completed' ? 'bg-green-500' :
                    m.status === 'In Progress' ? 'bg-primary animate-pulse' : 'bg-gray-200'
                  }`}>
                  {m.status === 'Completed' ? '✓' : i + 1}
                </div>

                <div className="flex-1 bg-gray-50/50 p-6 rounded-xl border border-transparent group-hover:border-gray-100 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-gray-800">{m.title}</h4>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Due: {m.due_date ? new Date(m.due_date).toLocaleDateString() : "TBD"}
                      </p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${m.status === 'Completed' ? 'bg-green-100 text-green-700' :
                        m.status === 'In Progress' ? 'bg-primary/10 text-primary' : 'bg-gray-200 text-gray-500'
                      }`}>{m.status}</span>
                  </div>

                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-1000 ${m.status === 'Completed' ? 'bg-green-500' : 'bg-primary'
                        }`}
                      style={{ width: m.status === 'Completed' ? '100%' : m.status === 'In Progress' ? '50%' : '0%' }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500 mt-3">{m.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Timeline;
