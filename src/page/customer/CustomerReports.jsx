import { useState, useEffect } from "react";
import api from "../../services/api";

function CustomerReports() {
  const [projects, setProjects] = useState([]);
  const [reportsByProject, setReportsByProject] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedReport, setExpandedReport] = useState(null);
  const [activeProject, setActiveProject] = useState("all");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const projResponse = await api.projects.getAll();
        const allProjects = (projResponse.projects || []).filter(
          (p) =>
            p.assigned_contractor_id ||
            ["Assigned", "In Progress", "Completed", "On Hold"].includes(p.status)
        );
        setProjects(allProjects);

        const reportsMap = {};
        await Promise.all(
          allProjects.map(async (project) => {
            try {
              const response = await api.reports.getByProject(project.id);
              reportsMap[project.id] = response.reports || [];
            } catch {
              reportsMap[project.id] = [];
            }
          })
        );
        setReportsByProject(reportsMap);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch reports:", err);
        setError("Failed to load reports. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const totalReports = Object.values(reportsByProject).reduce(
    (sum, arr) => sum + arr.length,
    0
  );

  const visibleProjects =
    activeProject === "all"
      ? projects
      : projects.filter((p) => String(p.id) === String(activeProject));

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (val) =>
    `₹ ${Number(val || 0).toLocaleString("en-IN")}`;

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-3">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-gray-400 text-sm font-medium animate-pulse">Loading reports…</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in py-8 px-4 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-4xl font-bold text-primary tracking-tight">Daily Reports</h1>
        <p className="text-gray-500 mt-2">
          Contractor progress reports filed across all your active projects.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm font-medium">
          ⚠️ {error}
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
            Total Reports
          </span>
          <span className="text-3xl font-bold text-primary">{totalReports}</span>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
            Active Projects
          </span>
          <span className="text-3xl font-bold text-gray-800">{projects.length}</span>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 col-span-2 md:col-span-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
            Latest Report
          </span>
          <span className="text-xl font-bold text-gray-800">
            {totalReports > 0
              ? formatDate(
                  Object.values(reportsByProject)
                    .flat()
                    .sort((a, b) => new Date(b.report_date) - new Date(a.report_date))[0]
                    ?.report_date
                )
              : "No reports yet"}
          </span>
        </div>
      </div>

      {/* Project Filter Tabs */}
      {projects.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setActiveProject("all")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
              activeProject === "all"
                ? "bg-primary text-white border-primary shadow-sm"
                : "bg-white text-gray-500 border-gray-200 hover:border-primary/40 hover:text-primary"
            }`}
          >
            All Projects
          </button>
          {projects.map((p) => (
            <button
              key={p.id}
              onClick={() => setActiveProject(String(p.id))}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                String(activeProject) === String(p.id)
                  ? "bg-primary text-white border-primary shadow-sm"
                  : "bg-white text-gray-500 border-gray-200 hover:border-primary/40 hover:text-primary"
              }`}
            >
              {p.title}
            </button>
          ))}
        </div>
      )}

      {/* No active projects at all */}
      {projects.length === 0 && (
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-16 flex flex-col items-center text-center space-y-4">
          <span className="text-6xl opacity-20">📋</span>
          <h3 className="text-xl font-bold text-gray-700">No Active Projects</h3>
          <p className="text-gray-400 max-w-md text-sm">
            Reports will appear here once a contractor is assigned to one of your projects and starts submitting daily progress.
          </p>
        </div>
      )}

      {/* Reports grouped by Project */}
      {visibleProjects.map((project) => {
        const reports = reportsByProject[project.id] || [];
        return (
          <div key={project.id} className="space-y-3">
            {/* Project header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-800">{project.title}</h2>
                <p className="text-xs text-gray-400">📍 {project.location}</p>
              </div>
              <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-widest">
                {reports.length} {reports.length === 1 ? "report" : "reports"}
              </span>
            </div>

            {reports.length === 0 ? (
              <div className="bg-white rounded-xl border border-dashed border-gray-200 p-8 text-center text-gray-400 text-sm">
                No reports submitted for this project yet.
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase font-bold tracking-widest border-b border-gray-100">
                    <tr>
                      <th className="p-4">Date</th>
                      <th className="p-4">Work Summary</th>
                      <th className="p-4">Workers</th>
                      <th className="p-4 text-right">Daily Cost</th>
                      <th className="p-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {reports.map((report) => (
                      <>
                        <tr
                          key={report.id}
                          className="hover:bg-gray-50/70 transition-colors cursor-pointer"
                          onClick={() =>
                            setExpandedReport(
                              expandedReport === report.id ? null : report.id
                            )
                          }
                        >
                          <td className="p-4 text-sm font-bold text-gray-800 whitespace-nowrap">
                            {formatDate(report.report_date)}
                          </td>
                          <td className="p-4 text-sm text-gray-600 max-w-xs">
                            <span className="line-clamp-2">{report.work_done || "—"}</span>
                          </td>
                          <td className="p-4 text-sm font-medium text-gray-500 whitespace-nowrap">
                            {report.labour_count || 0} workers
                          </td>
                          <td className="p-4 text-sm font-bold text-gray-800 text-right whitespace-nowrap">
                            {formatCurrency(report.daily_cost)}
                          </td>
                          <td className="p-4 text-right">
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${
                                expandedReport === report.id
                                  ? "text-primary"
                                  : "text-gray-400 hover:text-primary"
                              }`}
                            >
                              {expandedReport === report.id ? "▲ Close" : "▼ Details"}
                            </span>
                          </td>
                        </tr>

                        {/* Expanded Details Row */}
                        {expandedReport === report.id && (
                          <tr key={`${report.id}-detail`}>
                            <td colSpan={5} className="bg-primary/5 border-t border-primary/10 p-0">
                              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5 animate-fade-in">
                                <div>
                                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                                    Work Done
                                  </span>
                                  <p className="text-sm text-gray-700 leading-relaxed">
                                    {report.work_done || "—"}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                                    Materials Used
                                  </span>
                                  <p className="text-sm text-gray-700 leading-relaxed">
                                    {report.materials_used || "Not specified"}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                                    Remarks
                                  </span>
                                  <p className="text-sm text-gray-700 leading-relaxed">
                                    {report.remarks || "No remarks"}
                                  </p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                                      Labour Count
                                    </span>
                                    <span className="text-lg font-bold text-gray-800">
                                      {report.labour_count || 0}
                                    </span>
                                    <span className="text-xs text-gray-400 ml-1">workers</span>
                                  </div>
                                  <div>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                                      Daily Cost
                                    </span>
                                    <span className="text-lg font-bold text-primary">
                                      {formatCurrency(report.daily_cost)}
                                    </span>
                                  </div>
                                </div>
                                {report.submitted_by_name && (
                                  <div className="md:col-span-2 pt-3 border-t border-primary/10">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                      Submitted by:{" "}
                                    </span>
                                    <span className="text-xs text-gray-600 font-semibold">
                                      {report.submitted_by_name}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default CustomerReports;
