function Timeline() {
  const phases = [
    { name: "Site Clearance & Foundation", start: "Jan 15", end: "Feb 28", progress: 100, status: "Completed" },
    { name: "Basement & RCC Structure", start: "Mar 01", end: "Jun 15", progress: 65, status: "In Progress" },
    { name: "Brickwork & Plastering", start: "Jun 16", end: "Aug 30", progress: 0, status: "Pending" },
    { name: "Electrical & Plumbing", start: "Sep 01", end: "Oct 15", progress: 0, status: "Pending" },
    { name: "Flooring & Finishing", start: "Oct 16", end: "Dec 10", progress: 0, status: "Pending" },
  ];

  return (
    <div className="space-y-8 animate-fade-in p-8">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-primary">Construction Master Schedule</h1>
        <p className="text-gray-500 mt-1">Real-time tracking of project milestones and phase completion.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Total Duration</p>
          <p className="text-2xl font-bold text-gray-800">330 Days</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Days Elapsed</p>
          <p className="text-2xl font-bold text-primary">142 Days</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Current Phase</p>
          <p className="text-xl font-bold text-amber-600">RCC Structure</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Estimated Completion</p>
          <p className="text-2xl font-bold text-gray-800">Dec 10, 2024</p>
        </div>
      </div>

      {/* Gantt Style Tracker */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-8 flex items-center gap-2">
          <span className="w-2 h-6 bg-primary rounded-full"></span>
          Phase-wise Progress
        </h3>

        <div className="space-y-12 relative">
          {/* Connecting Line */}
          <div className="absolute left-[23px] top-4 bottom-4 w-0.5 bg-gray-100 z-0"></div>

          {phases.map((p, i) => (
            <div key={i} className="relative z-10 flex gap-8 group">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-white shadow-sm font-bold text-white transition-all ${p.status === 'Completed' ? 'bg-green-500' :
                  p.status === 'In Progress' ? 'bg-primary animate-pulse' : 'bg-gray-200'
                }`}>
                {p.status === 'Completed' ? '✓' : i + 1}
              </div>

              <div className="flex-1 bg-gray-50/50 p-6 rounded-xl border border-transparent group-hover:border-gray-100 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-bold text-gray-800">{p.name}</h4>
                    <p className="text-xs text-gray-400 mt-0.5">{p.start} — {p.end}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.status === 'Completed' ? 'bg-green-100 text-green-700' :
                      p.status === 'In Progress' ? 'bg-primary/10 text-primary' : 'bg-gray-200 text-gray-500'
                    }`}>{p.status}</span>
                </div>

                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-1000 ${p.status === 'Completed' ? 'bg-green-500' : 'bg-primary'
                      }`}
                    style={{ width: `${p.progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Progress</span>
                  <span className="text-[10px] text-primary font-bold">{p.progress}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Timeline;
