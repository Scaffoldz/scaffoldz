import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";

function Reports() {
  const { id: projectId } = useParams();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await api.reports.getByProject(projectId);
        setReports(response.reports || []);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch project reports:", err);
        setError("Failed to load project reports.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in p-8">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-primary">Daily Progress Reports</h1>
        <p className="text-gray-500 mt-1">Detailed evidence and onsite data logs for verification.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-gray-400 text-[10px] uppercase font-bold tracking-widest">
              <tr>
                <th className="p-4">Report Date</th>
                <th className="p-4">Work Done Summary</th>
                <th className="p-4">Labour Count</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {reports.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-500">No reports filed for this project yet.</td>
                </tr>
              ) : (
                reports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 text-sm font-bold text-gray-800">
                      {new Date(report.report_date).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-sm text-gray-600 max-w-md truncate">
                      {report.work_done_summary}
                    </td>
                    <td className="p-4 text-sm font-medium text-gray-500">
                      {report.labour_count || 0} Workers
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-[10px] font-bold text-primary uppercase hover:bg-primary/5 px-3 py-1 rounded transition-colors">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Reports;
