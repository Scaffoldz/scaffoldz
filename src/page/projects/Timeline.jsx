function Timeline() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-primary">Project Timeline</h1>
        <p className="text-gray-500 mt-1">Gantt chart and milestone tracking.</p>
      </div>

      <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center justify-center text-center">
        <div className="text-gray-200 font-bold text-6xl mb-4">📅</div>
        <h3 className="text-lg font-bold text-gray-700">Schedule Tracker</h3>
        <p className="text-gray-400 max-w-md mt-2">
          View upcoming milestones, delays, and critical path analysis for the construction phases.
        </p>
      </div>
    </div>
  );
}

export default Timeline;
