import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";

const DEFAULT_PHASES = [
  "Site Preparation", "Foundation", "Plinth",
  "Structural Frame (Columns, Beams, Slabs)", "Wall Construction",
  "Roofing", "Plastering", "Flooring",
  "Electrical & Plumbing", "Finishing Works",
];

function Timeline() {
  const { id: projectId } = useParams();
  const userRole = localStorage.getItem("userRole");
  const isManagement = userRole === "management";

  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [newMs, setNewMs] = useState({ title: "", description: "", amount: "", dueDate: "" });
  const [saving, setSaving] = useState(false);

  const fetchMilestones = async () => {
    try {
      setLoading(true);
      const response = await api.milestones.getByProject(projectId);
      setMilestones(response.milestones || []);
    } catch (err) {
      console.error("Failed to fetch milestones:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMilestones(); }, [projectId]);

  // Seed all 10 standard construction milestones for this project
  const handleSeedPhases = async () => {
    if (!window.confirm("Add all 10 standard construction phases to this project's timeline?")) return;
    setSeeding(true);
    try {
      for (const phase of DEFAULT_PHASES) {
        await api.milestones.create({ projectId: parseInt(projectId), title: phase, description: "", amount: 0 });
      }
      await fetchMilestones();
    } catch (err) {
      alert("Failed to seed phases: " + err.message);
    } finally {
      setSeeding(false);
    }
  };

  const handleAddMilestone = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.milestones.create({
        projectId: parseInt(projectId),
        title: newMs.title,
        description: newMs.description,
        amount: parseFloat(newMs.amount) || 0,
        dueDate: newMs.dueDate || null,
      });
      setNewMs({ title: "", description: "", amount: "", dueDate: "" });
      setShowAddModal(false);
      await fetchMilestones();
    } catch (err) {
      alert("Failed to add milestone: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (milestoneId, newStatus) => {
    try {
      await api.milestones.update(milestoneId, { status: newStatus });
      await fetchMilestones();
    } catch (err) {
      alert("Failed to update status: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const completed = milestones.filter(m => m.status === "Completed").length;
  const inProgress = milestones.filter(m => m.status === "In Progress").length;
  const progressPercent = milestones.length > 0 ? Math.round((completed / milestones.length) * 100) : 0;
  const currentMilestone = milestones.find(m => m.status === "In Progress") || milestones.find(m => m.status === "Pending");

  return (
    <div className="space-y-8 animate-fade-in p-8">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Construction Timeline</h1>
          <p className="text-gray-500 mt-1">Real-time tracking of project phases and milestone completion.</p>
        </div>
        {isManagement && (
          <div className="flex gap-2">
            {milestones.length === 0 && (
              <button onClick={handleSeedPhases} disabled={seeding}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-bold hover:bg-amber-600 transition-all disabled:opacity-60">
                {seeding ? "Adding..." : "⚡ Add Standard Phases"}
              </button>
            )}
            <button onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-all">
              + Add Milestone
            </button>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Phases", value: milestones.length, color: "text-gray-800" },
          { label: "Completed", value: completed, color: "text-green-600" },
          { label: "In Progress", value: inProgress, color: "text-primary" },
          { label: "Progress", value: `${progressPercent}%`, color: "text-amber-600" },
        ].map((s, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Overall Progress Bar */}
      {milestones.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-2">
          <div className="flex justify-between text-sm font-bold">
            <span className="text-gray-600">Overall Completion</span>
            <span className="text-primary">{progressPercent}%</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-green-500 rounded-full transition-all duration-1000"
              style={{ width: `${progressPercent}%` }} />
          </div>
          {currentMilestone && (
            <p className="text-xs text-gray-400">
              Currently: <span className="font-bold text-primary">{currentMilestone.title}</span>
            </p>
          )}
        </div>
      )}

      {/* Empty State */}
      {milestones.length === 0 && (
        <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-16 text-center">
          <span className="text-5xl mb-4 block opacity-30">🏗️</span>
          <p className="font-bold text-gray-500 text-lg">No milestones yet</p>
          <p className="text-gray-400 text-sm mt-1 mb-6">
            {isManagement
              ? 'Add the standard 10-phase construction timeline or create custom milestones.'
              : 'Management has not yet defined milestones for this project.'}
          </p>
          {isManagement && (
            <button onClick={handleSeedPhases} disabled={seeding}
              className="px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-all shadow-md">
              {seeding ? "Adding phases..." : "⚡ Add All 10 Standard Phases"}
            </button>
          )}
        </div>
      )}

      {/* Timeline */}
      {milestones.length > 0 && (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-8 flex items-center gap-2">
            <span className="w-2 h-6 bg-primary rounded-full"></span>
            Phase-wise Progress
          </h3>

          <div className="space-y-8 relative">
            {/* Connecting Line */}
            <div className="absolute left-[23px] top-4 bottom-4 w-0.5 bg-gray-100 z-0"></div>

            {milestones.map((m, i) => (
              <div key={m.id} className="relative z-10 flex gap-6 group">
                {/* Status Dot */}
                <div className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center border-4 border-white shadow-sm font-bold text-white transition-all ${m.status === "Completed" ? "bg-green-500" :
                    m.status === "In Progress" ? "bg-primary animate-pulse" : "bg-gray-200"
                  }`}>
                  {m.status === "Completed" ? "✓" : <span className="text-gray-500 text-sm font-bold">{i + 1}</span>}
                </div>

                <div className="flex-1 bg-gray-50/60 p-5 rounded-xl border border-transparent group-hover:border-gray-100 transition-all">
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <div>
                      <h4 className="font-bold text-gray-800">{m.title}</h4>
                      {m.due_date && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          Due: {new Date(m.due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      )}
                      {m.completed_at && m.status === "Completed" && (
                        <p className="text-xs text-green-500 mt-0.5">
                          ✓ Completed on {new Date(m.completed_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {isManagement ? (
                        <select
                          value={m.status}
                          onChange={e => handleStatusChange(m.id, e.target.value)}
                          className={`text-[10px] font-bold px-2 py-1 rounded-full border cursor-pointer outline-none focus:ring-2 focus:ring-primary/30 ${m.status === "Completed" ? "bg-green-50 text-green-700 border-green-200" :
                              m.status === "In Progress" ? "bg-primary/10 text-primary border-primary/20" :
                                "bg-gray-100 text-gray-500 border-gray-200"
                            }`}>
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      ) : (
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${m.status === "Completed" ? "bg-green-100 text-green-700" :
                            m.status === "In Progress" ? "bg-primary/10 text-primary" : "bg-gray-200 text-gray-500"
                          }`}>{m.status}</span>
                      )}
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-1000 ${m.status === "Completed" ? "bg-green-500" : "bg-primary"}`}
                      style={{ width: m.status === "Completed" ? "100%" : m.status === "In Progress" ? "50%" : "0%" }} />
                  </div>

                  {m.description && (
                    <p className="text-sm text-gray-500 mt-3">{m.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Milestone Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-primary">Add Milestone</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
            </div>
            <form onSubmit={handleAddMilestone} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Phase Title *</label>
                <input required type="text" placeholder="e.g. Foundation"
                  value={newMs.title} onChange={e => setNewMs({ ...newMs, title: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Description</label>
                <textarea rows={2} placeholder="Optional notes..."
                  value={newMs.description} onChange={e => setNewMs({ ...newMs, description: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary outline-none resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Budget (₹)</label>
                  <input type="number" placeholder="0"
                    value={newMs.amount} onChange={e => setNewMs({ ...newMs, amount: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Due Date</label>
                  <input type="date"
                    value={newMs.dueDate} onChange={e => setNewMs({ ...newMs, dueDate: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary outline-none" />
                </div>
              </div>
              <button type="submit" disabled={saving}
                className="w-full bg-primary text-white py-3 rounded-xl font-bold text-sm hover:bg-primary/90 transition-all shadow-md disabled:opacity-60">
                {saving ? "Adding..." : "Add Milestone"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Timeline;
