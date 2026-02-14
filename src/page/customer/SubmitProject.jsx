function SubmitProject() {
  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">

      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-primary">
          Submit New Project
        </h1>
        <p className="text-gray-500 mt-1">Fill in the details to request a new construction project.</p>
      </div>

      <form className="bg-white p-8 rounded-xl shadow-md border border-gray-100 space-y-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Project Title</label>
            <input
              type="text"
              placeholder="e.g. Skyline Apartments"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Location</label>
            <input
              type="text"
              placeholder="e.g. Sector 45, Gurgaon"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Project Description</label>
          <textarea
            placeholder="Describe the scope of work..."
            rows="4"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Estimated Budget (₹)</label>
            <input
              type="number"
              placeholder="0.00"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Start Date</label>
            <input
              type="date"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Deadline</label>
            <input
              type="date"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-4">
          <button
            type="button"
            className="px-6 py-3 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-primary text-white px-8 py-3 rounded-lg shadow-md hover:bg-primary/90 transition-all font-bold"
          >
            Submit Project
          </button>
        </div>

      </form>
    </div>
  );
}

export default SubmitProject;
