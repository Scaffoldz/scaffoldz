import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SubmitProject() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    description: "",
    budget: "",
    startDate: "",
    deadline: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const projectData = {
        title: formData.title,
        location: formData.location,
        description: formData.description,
        budget: parseFloat(formData.budget),
        startDate: formData.startDate,
        deadline: formData.deadline
      };

      // Import projects API
      const { projects } = await import("../../services/api");
      await projects.create(projectData);

      alert("Project submitted successfully! Management will review your request.");
      navigate("/customer/dashboard");
    } catch (err) {
      setError(err.message || "Failed to submit project. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">

      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-primary">
          Submit New Project
        </h1>
        <p className="text-gray-500 mt-1">Fill in the details to request a new construction project.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md border border-gray-100 space-y-6">

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Project Title</label>
            <input
              required
              name="title"
              value={formData.title}
              onChange={handleChange}
              type="text"
              placeholder="e.g. Skyline Apartments"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Location</label>
            <input
              required
              name="location"
              value={formData.location}
              onChange={handleChange}
              type="text"
              placeholder="e.g. Sector 45, Gurgaon"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Project Description</label>
          <textarea
            required
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the scope of work..."
            rows="4"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Estimated Budget (₹)</label>
            <input
              required
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              type="number"
              placeholder="0.00"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Start Date</label>
            <input
              required
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              type="date"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Deadline</label>
            <input
              required
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              type="date"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-white px-8 py-3 rounded-lg shadow-md hover:bg-primary/90 transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : "Submit Project"}
          </button>
        </div>

      </form>
    </div>
  );
}

export default SubmitProject;
