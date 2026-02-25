import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";

function Overview() {
  const { id: projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        setLoading(true);
        const response = await api.projects.getById(projectId);
        setProject(response.project);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch project details:", err);
        setError("Failed to load project overview.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!project) {
    return <div className="p-8 text-center text-gray-500">Project not found.</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-primary">Project Overview</h1>
        <p className="text-gray-500 mt-1">Key metrics and status summary for <strong>{project.title}</strong>.</p>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Executive Summary</h3>
        <p className="text-gray-600 leading-relaxed mb-6">
          {project.description || "No description provided for this project."}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-6 border-t border-gray-100">
          <div>
            <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Budget</span>
            <span className="text-2xl font-bold text-primary">₹ {Number(project.budget || 0).toLocaleString('en-IN')}</span>
          </div>
          <div>
            <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Status</span>
            <span className="text-2xl font-bold text-gray-700">{project.status}</span>
          </div>
          <div>
            <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Location</span>
            <span className="text-2xl font-bold text-gray-700 truncate">{project.location || "N/A"}</span>
          </div>
          <div>
            <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Customer</span>
            <span className="text-2xl font-bold text-gray-700">{project.customer_name || "N/A"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Overview;
