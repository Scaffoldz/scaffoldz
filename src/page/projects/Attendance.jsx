import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";

function Attendance() {
  const { id } = useParams();
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [newAttendance, setNewAttendance] = useState({
    worker_name: "",
    shift: "Morning",
    status: "Present",
    note: ""
  });

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        // Fetching for the selected date
        const data = await api.attendance.getByProject(id, selectedDate, selectedDate);
        setAttendance(data.attendance || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [id, selectedDate]);

  const handleMarkAttendance = async (e) => {
    e.preventDefault();
    try {
      const data = await api.attendance.mark({
        project_id: id,
        date: selectedDate,
        ...newAttendance
      });
      setAttendance([data.attendance, ...attendance]);
      setIsModalOpen(false);
      setNewAttendance({ worker_name: "", shift: "Morning", status: "Present", note: "" });
    } catch (err) {
      alert("Failed to mark attendance: " + err.message);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading attendance...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  const presentCount = attendance.filter(a => a.status === 'Present').length;
  const totalCount = attendance.length;

  return (
    <div className="space-y-6 animate-fade-in p-6">
      <div className="flex justify-between items-end border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Site Attendance</h1>
          <p className="text-sm text-gray-500 mt-1">Daily labor tracking and shift management.</p>
        </div>
        <div className="flex gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="p-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-primary outline-none"
          />
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-primary/90 transition-colors"
          >
            + Mark Attendance
          </button>
        </div>
      </div>

      {/* Attendance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Present Today</p>
            <p className="text-3xl font-bold text-primary mt-1">{presentCount} <span className="text-gray-300 text-sm font-normal">/ {totalCount}</span></p>
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-primary/10 border-t-primary flex items-center justify-center font-bold text-primary text-xs">
            {totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0}%
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Current Status</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <p className="text-sm font-bold text-gray-800 uppercase tracking-wide">Site Active</p>
          </div>
          <p className="text-xs text-gray-500 mt-1">Recording {selectedDate === new Date().toISOString().split('T')[0] ? 'today\'s' : 'selected date\'s'} staff activity.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase font-bold tracking-widest">
            <tr>
              <th className="p-4 border-b border-gray-100">Worker Name</th>
              <th className="p-4 border-b border-gray-100">Shift</th>
              <th className="p-4 border-b border-gray-100">Status</th>
              <th className="p-4 border-b border-gray-100">Notes</th>
              <th className="p-4 border-b border-gray-100 text-right">Time Logged</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {attendance.map((a) => (
              <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500 border border-gray-200">
                      {a.worker_name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="font-bold text-gray-800 text-sm">{a.worker_name}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">{a.shift}</span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-[10px] font-bold rounded ${a.status === 'Present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                    {a.status}
                  </span>
                </td>
                <td className="p-4 text-xs text-gray-500 max-w-xs truncate">{a.note || "-"}</td>
                <td className="p-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                  {new Date(a.created_at || a.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </td>
              </tr>
            ))}
            {attendance.length === 0 && (
              <tr>
                <td colSpan="5" className="p-12 text-center text-gray-400 italic">No attendance records for {selectedDate}.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mark Attendance Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-scale-in">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-gray-800">Mark Attendance</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl font-light">&times;</button>
            </div>
            <form onSubmit={handleMarkAttendance} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Worker Name</label>
                <input
                  required
                  type="text"
                  value={newAttendance.worker_name}
                  onChange={(e) => setNewAttendance({ ...newAttendance, worker_name: e.target.value })}
                  className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-primary outline-none"
                  placeholder="e.g., John Doe"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Shift</label>
                  <select
                    value={newAttendance.shift}
                    onChange={(e) => setNewAttendance({ ...newAttendance, shift: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-primary outline-none bg-white"
                  >
                    <option value="Morning">Morning (8-4)</option>
                    <option value="Evening">Evening (4-12)</option>
                    <option value="Night">Night (12-8)</option>
                    <option value="Overtime">Overtime</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Status</label>
                  <select
                    value={newAttendance.status}
                    onChange={(e) => setNewAttendance({ ...newAttendance, status: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-primary outline-none bg-white"
                  >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                    <option value="Late">Late Entry</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Note (Optional)</label>
                <textarea
                  value={newAttendance.note}
                  onChange={(e) => setNewAttendance({ ...newAttendance, note: e.target.value })}
                  className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-primary outline-none"
                  placeholder="Add any specific details..."
                  rows="3"
                />
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-primary text-white py-3 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-primary/20 transition-all"
                >
                  Confirm & Mark
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Attendance;
