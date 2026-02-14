function Budget() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Project Budget</h1>

      <form className="bg-white p-8 rounded-xl shadow space-y-6 max-w-2xl">

        <div>
          <label className="block text-sm font-medium mb-1">
            Project Name
          </label>
          <input
            type="text"
            placeholder="Enter project name"
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Estimated Budget
          </label>
          <input
            type="number"
            placeholder="Enter amount"
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            rows="4"
            placeholder="Enter project details"
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Save Budget
        </button>

      </form>
    </div>
  );
}

export default Budget;
