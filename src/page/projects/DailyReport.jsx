import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";

const emptyLabour = (name = "", type = "", wage = "") => ({ name, type, hours: "", wage });
const emptyMaterial = () => ({ name: "", quantity: "", unit: "", costPerUnit: "" });
const emptyPhoto = () => ({ url: "", caption: "" });

function DailyReport() {
    const { id: projectId } = useParams();
    const today = new Date().toISOString().split("T")[0];

    const [reportDate, setReportDate] = useState(today);
    const [workDone, setWorkDone] = useState("");
    const [remarks, setRemarks] = useState("");
    const [labourRows, setLabourRows] = useState([emptyLabour()]);
    const [materialRows, setMaterialRows] = useState([emptyMaterial()]);
    const [photoRows, setPhotoRows] = useState([emptyPhoto()]);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(null); // holds last submitted summary
    const [roster, setRoster] = useState([]);
    const [rosterLoading, setRosterLoading] = useState(true);
    const [showRegisterForm, setShowRegisterForm] = useState(false);
    const [newWorker, setNewWorker] = useState({ name: "", type: "", wage: "" });
    const [showRoster, setShowRoster] = useState(true);

    // Fetch project roster from past attendance
    useEffect(() => {
        const loadRoster = async () => {
            try {
                setRosterLoading(true);
                const data = await api.attendance.getWorkers(projectId);
                setRoster(data.workers || []);
            } catch {
                setRoster([]);
            } finally {
                setRosterLoading(false);
            }
        };
        loadRoster();
    }, [projectId]);

    // --- Labour helpers ---
    const updateLabour = (i, field, value) =>
        setLabourRows(rows => rows.map((r, idx) => idx === i ? { ...r, [field]: value } : r));
    const addLabour = () => setLabourRows(r => [...r, emptyLabour()]);
    const removeLabour = (i) => setLabourRows(r => r.filter((_, idx) => idx !== i));

    // Add a roster worker to today's labour list
    const addFromRoster = (worker) => {
        // Check if already added
        const alreadyAdded = labourRows.some(r => r.name === worker.name);
        if (alreadyAdded) return;
        // Replace first empty row if present, else append
        const firstEmpty = labourRows.findIndex(r => !r.name.trim());
        if (firstEmpty >= 0) {
            setLabourRows(rows => rows.map((r, idx) =>
                idx === firstEmpty ? emptyLabour(worker.name, worker.type || "", worker.wage || "") : r
            ));
        } else {
            setLabourRows(r => [...r, emptyLabour(worker.name, worker.type || "", worker.wage || "")]);
        }
    };

    // Register a new worker to the roster
    const handleRegisterWorker = async (e) => {
        e.preventDefault();
        if (!newWorker.name.trim()) return;
        // Add a one-hour attendance placeholder just to register them in the DB
        try {
            await api.attendance.mark({
                projectId: parseInt(projectId),
                workerName: newWorker.name,
                workerType: newWorker.type,
                attendanceDate: today,
                hoursWorked: 0,
                wagePerHour: parseFloat(newWorker.wage) || 0,
                totalWage: 0,
                remarks: "Worker registered"
            });
            setRoster(r => [...r, { name: newWorker.name, type: newWorker.type, wage: newWorker.wage }]);
            setNewWorker({ name: "", type: "", wage: "" });
            setShowRegisterForm(false);
        } catch (err) {
            alert("Failed to register worker: " + err.message);
        }
    };

    // --- Material helpers ---
    const updateMaterial = (i, field, value) =>
        setMaterialRows(rows => rows.map((r, idx) => idx === i ? { ...r, [field]: value } : r));
    const addMaterial = () => setMaterialRows(r => [...r, emptyMaterial()]);
    const removeMaterial = (i) => setMaterialRows(r => r.filter((_, idx) => idx !== i));

    // --- Photo helpers ---
    const updatePhoto = (i, field, value) =>
        setPhotoRows(rows => rows.map((r, idx) => idx === i ? { ...r, [field]: value } : r));
    const addPhoto = () => setPhotoRows(r => [...r, emptyPhoto()]);
    const removePhoto = (i) => setPhotoRows(r => r.filter((_, idx) => idx !== i));

    // --- Cost calculations ---
    const labourCost = labourRows.reduce((sum, r) =>
        sum + (parseFloat(r.hours) || 0) * (parseFloat(r.wage) || 0), 0);
    const materialCost = materialRows.reduce((sum, r) =>
        sum + (parseFloat(r.quantity) || 0) * (parseFloat(r.costPerUnit) || 0), 0);
    const totalDailyCost = labourCost + materialCost;

    // --- Submit ---
    const handleSubmit = async () => {
        if (!workDone.trim()) {
            alert("Please describe what work was done today.");
            return;
        }
        setSubmitting(true);
        try {
            const labourSummary = labourRows.filter(r => r.name)
                .map(r => `${r.name} (${r.type || "worker"}) - ${r.hours}hrs @ ₹${r.wage}/hr`).join("; ");
            const materialsSummary = materialRows.filter(r => r.name)
                .map(r => `${r.name}: ${r.quantity} ${r.unit} @ ₹${r.costPerUnit}/unit`).join("; ");
            const validWorkers = labourRows.filter(r => r.name.trim());

            // Submit the report
            const reportRes = await api.reports.create({
                projectId: parseInt(projectId),
                reportDate, workDone,
                labourCount: validWorkers.length,
                materialsUsed: materialsSummary,
                remarks,
                dailyCost: totalDailyCost,
            });

            const reportId = reportRes.report.id;

            // Record individual attendance entries for each worker
            await Promise.all(validWorkers.map(r =>
                api.attendance.mark({
                    projectId: parseInt(projectId),
                    workerName: r.name,
                    workerType: r.type,
                    attendanceDate: reportDate,
                    hoursWorked: parseFloat(r.hours) || 0,
                    wagePerHour: parseFloat(r.wage) || 0,
                    totalWage: (parseFloat(r.hours) || 0) * (parseFloat(r.wage) || 0),
                    remarks: `Auto-logged from daily report`
                })
            ));

            // Submit photos
            const validPhotos = photoRows.filter(p => p.url.trim());
            await Promise.all(validPhotos.map(p =>
                api.reports.addPhoto(reportId, { photoUrl: p.url, caption: p.caption })
            ));

            setSubmitted({
                date: reportDate, labourCost, materialCost, total: totalDailyCost,
                workers: validWorkers.length,
                detections: reportRes.aiDetections || [],
                updated: reportRes.updatedMilestones || [],
            });
            setWorkDone(""); setRemarks("");
            setLabourRows([emptyLabour()]); setMaterialRows([emptyMaterial()]);
            setPhotoRows([emptyPhoto()]); setReportDate(today);
        } catch (err) {
            alert("Failed to submit report: " + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const fmt = (n) => `₹ ${Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="border-b border-gray-200 pb-4">
                <h1 className="text-3xl font-bold text-primary">Daily Site Report</h1>
                <p className="text-gray-500 mt-1">Log today's labour, materials, site photos and notes.</p>
            </div>

            {/* Success Banner */}
            {submitted && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 space-y-3">
                    <div className="flex items-center gap-2">
                        <span className="text-green-600 text-xl">✅</span>
                        <h3 className="font-bold text-green-700">Report Submitted for {submitted.date}</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: "Labour Cost", value: fmt(submitted.labourCost) },
                            { label: "Material Cost", value: fmt(submitted.materialCost) },
                            { label: "Workers", value: submitted.workers },
                            { label: "Total Daily Cost", value: fmt(submitted.total), highlight: true },
                        ].map((c) => (
                            <div key={c.label} className={`rounded-lg p-3 text-center border ${c.highlight ? 'bg-primary/10 border-primary/20' : 'bg-white border-green-100'}`}>
                                <p className={`text-xs uppercase tracking-widest font-bold ${c.highlight ? 'text-primary' : 'text-gray-400'}`}>{c.label}</p>
                                <p className={`font-bold ${c.highlight ? 'text-primary text-lg' : 'text-gray-800'}`}>{c.value}</p>
                            </div>
                        ))}
                    </div>
                    {/* AI Milestone Detections */}
                    {submitted.detections.length > 0 && (
                        <div className="border-t border-green-100 pt-3">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">🤖 AI Milestone Analysis</p>
                            <div className="flex flex-wrap gap-2">
                                {submitted.detections.map((d, i) => {
                                    const matchedUpdate = submitted.updated.find(u =>
                                        u.title && d.label && u.title.toLowerCase().includes(d.label.split(' ')[0].toLowerCase())
                                    );
                                    return (
                                        <div key={i} className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${d.status === 'Completed'
                                                ? 'bg-green-100 border-green-300 text-green-700'
                                                : 'bg-blue-50 border-blue-200 text-blue-700'
                                            }`}>
                                            <span>{d.status === 'Completed' ? '✅' : '🔄'}</span>
                                            <span>{d.label}</span>
                                            <span className="opacity-60">· {(d.confidence * 100).toFixed(0)}%</span>
                                            {matchedUpdate && (
                                                <span className={`text-[9px] px-1 rounded ${matchedUpdate.action === 'created' ? 'bg-amber-100 text-amber-700' : 'bg-white/70 text-gray-600'}`}>
                                                    {matchedUpdate.action === 'created' ? '+ Added to timeline' : 'Updated'}
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                            {submitted.updated.length === 0 && submitted.detections.length > 0 && (
                                <p className="text-[10px] text-gray-400 mt-1">No matching milestones found in project timeline to update.</p>
                            )}
                        </div>
                    )}
                    <button onClick={() => setSubmitted(null)} className="text-xs text-green-600 hover:underline">Submit another report →</button>
                </div>
            )}

            {/* Report Details */}
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm space-y-4">
                <h2 className="font-bold text-gray-700 text-sm uppercase tracking-widest">📋 Report Details</h2>
                <div>
                    <label className="block text-sm font-bold text-gray-600 mb-1">Report Date</label>
                    <input type="date" value={reportDate} onChange={e => setReportDate(e.target.value)}
                        className="w-full md:w-64 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-600 mb-1">Work Done Today <span className="text-red-400">*</span></label>
                    <textarea value={workDone} onChange={e => setWorkDone(e.target.value)} rows={3}
                        placeholder="Describe what work was completed today..."
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary outline-none resize-none" />
                </div>
            </div>

            {/* ── Labour Management + Daily Labour Entries ── */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">

                {/* Workforce Roster */}
                <div className="p-6 border-b border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-3">
                            <h2 className="font-bold text-gray-700 text-sm uppercase tracking-widest">👷 Workforce Roster</h2>
                            <span className="text-[10px] bg-gray-100 text-gray-500 font-bold px-2 py-0.5 rounded-full">
                                {roster.length} registered
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => setShowRoster(s => !s)}
                                className="text-xs text-gray-400 hover:text-primary font-bold px-3 py-1 rounded-lg border border-gray-200 hover:border-primary/30 transition-all">
                                {showRoster ? "Hide" : "Show"} Roster
                            </button>
                            <button onClick={() => setShowRegisterForm(s => !s)}
                                className="text-xs bg-primary text-white font-bold px-3 py-1 rounded-lg hover:bg-primary/90 transition-all">
                                + Register Worker
                            </button>
                        </div>
                    </div>

                    {/* Register Form */}
                    {showRegisterForm && (
                        <form onSubmit={handleRegisterWorker} className="bg-gray-50 rounded-xl p-4 mb-4 grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Full Name</label>
                                <input required type="text" placeholder="e.g. Rahul Sharma"
                                    value={newWorker.name} onChange={e => setNewWorker({ ...newWorker, name: e.target.value })}
                                    className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-primary outline-none bg-white" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Trade / Role</label>
                                <input type="text" placeholder="e.g. Mason"
                                    value={newWorker.type} onChange={e => setNewWorker({ ...newWorker, type: e.target.value })}
                                    className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-primary outline-none bg-white" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Wage/Hr (₹)</label>
                                <input type="number" placeholder="e.g. 120"
                                    value={newWorker.wage} onChange={e => setNewWorker({ ...newWorker, wage: e.target.value })}
                                    className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-primary outline-none bg-white" />
                            </div>
                            <button type="submit"
                                className="bg-primary text-white rounded-lg py-2 px-4 text-sm font-bold hover:bg-primary/90 transition-all">
                                Register
                            </button>
                        </form>
                    )}

                    {/* Roster List */}
                    {showRoster && (
                        rosterLoading ? (
                            <p className="text-xs text-gray-400 italic">Loading roster...</p>
                        ) : roster.length === 0 ? (
                            <p className="text-xs text-gray-400 italic">No workers registered yet. Register workers above to quickly add them to daily reports.</p>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {roster.map((w, i) => {
                                    const isAdded = labourRows.some(r => r.name === w.name);
                                    return (
                                        <button key={i} onClick={() => addFromRoster(w)} disabled={isAdded}
                                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all ${isAdded
                                                ? 'bg-green-50 border-green-200 text-green-600 cursor-default'
                                                : 'bg-white border-gray-200 text-gray-700 hover:border-primary/40 hover:bg-primary/5'
                                                }`}>
                                            <span className="font-bold">{w.name}</span>
                                            {w.type && <span className="text-[10px] text-gray-400">{w.type}</span>}
                                            {w.wage && <span className="text-[10px] text-gray-400">₹{w.wage}/hr</span>}
                                            {isAdded ? <span className="text-[10px] text-green-500">✓ Added</span> : <span className="text-[10px] text-primary">+ Add</span>}
                                        </button>
                                    );
                                })}
                            </div>
                        )
                    )}
                </div>

                {/* Today's Labour Entries */}
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-bold text-gray-700 text-sm uppercase tracking-widest">Today's Labour</h2>
                        <span className="text-sm font-bold text-primary">Total: {fmt(labourCost)}</span>
                    </div>
                    <div className="space-y-3">
                        {labourRows.map((row, i) => (
                            <div key={i} className="grid grid-cols-2 md:grid-cols-5 gap-3 items-center bg-gray-50 p-3 rounded-lg">
                                <input type="text" placeholder="Worker Name" value={row.name}
                                    onChange={e => updateLabour(i, "name", e.target.value)}
                                    className="border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-primary outline-none bg-white" />
                                <input type="text" placeholder="Type (Mason, etc.)" value={row.type}
                                    onChange={e => updateLabour(i, "type", e.target.value)}
                                    className="border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-primary outline-none bg-white" />
                                <input type="number" placeholder="Hours Worked" value={row.hours}
                                    onChange={e => updateLabour(i, "hours", e.target.value)}
                                    className="border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-primary outline-none bg-white" />
                                <input type="number" placeholder="Wage/Hr (₹)" value={row.wage}
                                    onChange={e => updateLabour(i, "wage", e.target.value)}
                                    className="border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-primary outline-none bg-white" />
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold text-gray-600">
                                        {fmt((parseFloat(row.hours) || 0) * (parseFloat(row.wage) || 0))}
                                    </span>
                                    {labourRows.length > 1 && (
                                        <button onClick={() => removeLabour(i)} className="text-red-400 hover:text-red-600 text-xs ml-2">✕</button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <button onClick={addLabour} className="mt-3 text-sm text-primary font-bold hover:underline">+ Add Row</button>
                </div>
            </div>

            {/* Materials Section */}
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="font-bold text-gray-700 text-sm uppercase tracking-widest">🧱 Materials Used</h2>
                    <span className="text-sm font-bold text-primary">Total: {fmt(materialCost)}</span>
                </div>
                <div className="space-y-3">
                    {materialRows.map((row, i) => (
                        <div key={i} className="grid grid-cols-2 md:grid-cols-5 gap-3 items-center bg-gray-50 p-3 rounded-lg">
                            <input type="text" placeholder="Material Name" value={row.name}
                                onChange={e => updateMaterial(i, "name", e.target.value)}
                                className="border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-primary outline-none bg-white" />
                            <input type="number" placeholder="Quantity" value={row.quantity}
                                onChange={e => updateMaterial(i, "quantity", e.target.value)}
                                className="border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-primary outline-none bg-white" />
                            <input type="text" placeholder="Unit (bags, m³...)" value={row.unit}
                                onChange={e => updateMaterial(i, "unit", e.target.value)}
                                className="border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-primary outline-none bg-white" />
                            <input type="number" placeholder="Cost/Unit (₹)" value={row.costPerUnit}
                                onChange={e => updateMaterial(i, "costPerUnit", e.target.value)}
                                className="border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-primary outline-none bg-white" />
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-gray-600">
                                    {fmt((parseFloat(row.quantity) || 0) * (parseFloat(row.costPerUnit) || 0))}
                                </span>
                                {materialRows.length > 1 && (
                                    <button onClick={() => removeMaterial(i)} className="text-red-400 hover:text-red-600 text-xs ml-2">✕</button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={addMaterial} className="text-sm text-primary font-bold hover:underline">+ Add Material</button>
            </div>

            {/* Site Photos */}
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm space-y-4">
                <h2 className="font-bold text-gray-700 text-sm uppercase tracking-widest">📷 Site Photos</h2>
                <div className="space-y-3">
                    {photoRows.map((row, i) => (
                        <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center bg-gray-50 p-3 rounded-lg">
                            <input type="url" placeholder="Photo URL" value={row.url}
                                onChange={e => updatePhoto(i, "url", e.target.value)}
                                className="md:col-span-2 border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-primary outline-none bg-white" />
                            <div className="flex items-center gap-2">
                                <input type="text" placeholder="Caption (optional)" value={row.caption}
                                    onChange={e => updatePhoto(i, "caption", e.target.value)}
                                    className="flex-1 border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-primary outline-none bg-white" />
                                {photoRows.length > 1 && (
                                    <button onClick={() => removePhoto(i)} className="text-red-400 hover:text-red-600 text-xs">✕</button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={addPhoto} className="text-sm text-primary font-bold hover:underline">+ Add Photo</button>
            </div>

            {/* Notes */}
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm space-y-3">
                <h2 className="font-bold text-gray-700 text-sm uppercase tracking-widest">📝 Additional Notes</h2>
                <textarea value={remarks} onChange={e => setRemarks(e.target.value)} rows={4}
                    placeholder="Any issues, observations, or important notes for management..."
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary outline-none resize-none" />
            </div>

            {/* Cost Summary + Submit */}
            <div className="bg-white border border-primary/20 rounded-xl p-6 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Estimated Daily Cost</p>
                        <div className="flex gap-6 text-sm text-gray-600">
                            <span>Labour: <strong>{fmt(labourCost)}</strong></span>
                            <span>Materials: <strong>{fmt(materialCost)}</strong></span>
                        </div>
                        <p className="text-2xl font-bold text-primary">
                            {fmt(totalDailyCost)} <span className="text-sm text-gray-400 font-normal">total for today</span>
                        </p>
                    </div>
                    <button onClick={handleSubmit} disabled={submitting}
                        className="px-10 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed">
                        {submitting ? "Submitting..." : "Submit Daily Report"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DailyReport;
