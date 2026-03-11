import { useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";

const emptyLabour = () => ({ name: "", type: "", hours: "", wage: "" });
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
    const [submitted, setSubmitted] = useState(null); // holds last submitted cost summary

    // --- Labour helpers ---
    const updateLabour = (i, field, value) => {
        setLabourRows(rows => rows.map((r, idx) => idx === i ? { ...r, [field]: value } : r));
    };
    const addLabour = () => setLabourRows(r => [...r, emptyLabour()]);
    const removeLabour = (i) => setLabourRows(r => r.filter((_, idx) => idx !== i));

    // --- Material helpers ---
    const updateMaterial = (i, field, value) => {
        setMaterialRows(rows => rows.map((r, idx) => idx === i ? { ...r, [field]: value } : r));
    };
    const addMaterial = () => setMaterialRows(r => [...r, emptyMaterial()]);
    const removeMaterial = (i) => setMaterialRows(r => r.filter((_, idx) => idx !== i));

    // --- Photo helpers ---
    const updatePhoto = (i, field, value) => {
        setPhotoRows(rows => rows.map((r, idx) => idx === i ? { ...r, [field]: value } : r));
    };
    const addPhoto = () => setPhotoRows(r => [...r, emptyPhoto()]);
    const removePhoto = (i) => setPhotoRows(r => r.filter((_, idx) => idx !== i));

    // --- Cost calculations ---
    const labourCost = labourRows.reduce((sum, r) => {
        const cost = (parseFloat(r.hours) || 0) * (parseFloat(r.wage) || 0);
        return sum + cost;
    }, 0);

    const materialCost = materialRows.reduce((sum, r) => {
        const cost = (parseFloat(r.quantity) || 0) * (parseFloat(r.costPerUnit) || 0);
        return sum + cost;
    }, 0);

    const totalDailyCost = labourCost + materialCost;

    // --- Submit ---
    const handleSubmit = async () => {
        if (!workDone.trim()) {
            alert("Please describe what work was done today.");
            return;
        }

        setSubmitting(true);
        try {
            // Build text summaries for existing report fields
            const labourSummary = labourRows
                .filter(r => r.name)
                .map(r => `${r.name} (${r.type || "worker"}) - ${r.hours}hrs @ ₹${r.wage}/hr`)
                .join("; ");

            const materialsSummary = materialRows
                .filter(r => r.name)
                .map(r => `${r.name}: ${r.quantity} ${r.unit} @ ₹${r.costPerUnit}/unit`)
                .join("; ");

            const validWorkers = labourRows.filter(r => r.name).length;

            // Submit the report
            const reportRes = await api.reports.create({
                projectId: parseInt(projectId),
                reportDate,
                workDone,
                labourCount: validWorkers,
                materialsUsed: materialsSummary,
                remarks,
                dailyCost: totalDailyCost,
            });

            const reportId = reportRes.report.id;

            // Submit photos linked to the report
            const validPhotos = photoRows.filter(p => p.url.trim());
            await Promise.all(
                validPhotos.map(p => api.reports.addPhoto(reportId, { photoUrl: p.url, caption: p.caption }))
            );

            setSubmitted({
                date: reportDate,
                labourCost,
                materialCost,
                total: totalDailyCost,
                workers: validWorkers,
                photos: validPhotos.length,
            });

            // Reset form
            setWorkDone("");
            setRemarks("");
            setLabourRows([emptyLabour()]);
            setMaterialRows([emptyMaterial()]);
            setPhotoRows([emptyPhoto()]);
            setReportDate(today);
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
                        <div className="bg-white rounded-lg p-3 text-center border border-green-100">
                            <p className="text-xs text-gray-400 uppercase tracking-widest">Labour Cost</p>
                            <p className="font-bold text-gray-800">{fmt(submitted.labourCost)}</p>
                        </div>
                        <div className="bg-white rounded-lg p-3 text-center border border-green-100">
                            <p className="text-xs text-gray-400 uppercase tracking-widest">Material Cost</p>
                            <p className="font-bold text-gray-800">{fmt(submitted.materialCost)}</p>
                        </div>
                        <div className="bg-white rounded-lg p-3 text-center border border-green-100">
                            <p className="text-xs text-gray-400 uppercase tracking-widest">Workers</p>
                            <p className="font-bold text-gray-800">{submitted.workers}</p>
                        </div>
                        <div className="bg-primary/10 rounded-lg p-3 text-center border border-primary/20">
                            <p className="text-xs text-primary uppercase tracking-widest font-bold">Total Daily Cost</p>
                            <p className="font-bold text-primary text-lg">{fmt(submitted.total)}</p>
                        </div>
                    </div>
                    <button onClick={() => setSubmitted(null)} className="text-xs text-green-600 hover:underline">
                        Submit another report →
                    </button>
                </div>
            )}

            {/* Date + Work Done */}
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm space-y-4">
                <h2 className="font-bold text-gray-700 text-sm uppercase tracking-widest">📋 Report Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-600 mb-1">Report Date</label>
                        <input
                            type="date"
                            value={reportDate}
                            onChange={e => setReportDate(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary outline-none"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-600 mb-1">Work Done Today <span className="text-red-400">*</span></label>
                    <textarea
                        value={workDone}
                        onChange={e => setWorkDone(e.target.value)}
                        rows={3}
                        placeholder="Describe what work was completed today..."
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary outline-none resize-none"
                    />
                </div>
            </div>

            {/* Labour Section */}
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="font-bold text-gray-700 text-sm uppercase tracking-widest">👷 Labour Entries</h2>
                    <span className="text-sm font-bold text-primary">Total: {fmt(labourCost)}</span>
                </div>
                <div className="space-y-3">
                    {labourRows.map((row, i) => (
                        <div key={i} className="grid grid-cols-2 md:grid-cols-5 gap-3 items-center bg-gray-50 p-3 rounded-lg">
                            <input
                                type="text"
                                placeholder="Worker Name"
                                value={row.name}
                                onChange={e => updateLabour(i, "name", e.target.value)}
                                className="border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-primary outline-none bg-white"
                            />
                            <input
                                type="text"
                                placeholder="Type (Mason, etc.)"
                                value={row.type}
                                onChange={e => updateLabour(i, "type", e.target.value)}
                                className="border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-primary outline-none bg-white"
                            />
                            <input
                                type="number"
                                placeholder="Hours Worked"
                                value={row.hours}
                                onChange={e => updateLabour(i, "hours", e.target.value)}
                                className="border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-primary outline-none bg-white"
                            />
                            <input
                                type="number"
                                placeholder="Wage/Hr (₹)"
                                value={row.wage}
                                onChange={e => updateLabour(i, "wage", e.target.value)}
                                className="border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-primary outline-none bg-white"
                            />
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
                <button onClick={addLabour} className="text-sm text-primary font-bold hover:underline flex items-center gap-1">
                    + Add Worker
                </button>
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
                            <input
                                type="text"
                                placeholder="Material Name"
                                value={row.name}
                                onChange={e => updateMaterial(i, "name", e.target.value)}
                                className="border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-primary outline-none bg-white"
                            />
                            <input
                                type="number"
                                placeholder="Quantity"
                                value={row.quantity}
                                onChange={e => updateMaterial(i, "quantity", e.target.value)}
                                className="border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-primary outline-none bg-white"
                            />
                            <input
                                type="text"
                                placeholder="Unit (bags, m³...)"
                                value={row.unit}
                                onChange={e => updateMaterial(i, "unit", e.target.value)}
                                className="border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-primary outline-none bg-white"
                            />
                            <input
                                type="number"
                                placeholder="Cost/Unit (₹)"
                                value={row.costPerUnit}
                                onChange={e => updateMaterial(i, "costPerUnit", e.target.value)}
                                className="border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-primary outline-none bg-white"
                            />
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
                <button onClick={addMaterial} className="text-sm text-primary font-bold hover:underline flex items-center gap-1">
                    + Add Material
                </button>
            </div>

            {/* Site Photos */}
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm space-y-4">
                <h2 className="font-bold text-gray-700 text-sm uppercase tracking-widest">📷 Site Photos</h2>
                <div className="space-y-3">
                    {photoRows.map((row, i) => (
                        <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center bg-gray-50 p-3 rounded-lg">
                            <input
                                type="url"
                                placeholder="Photo URL"
                                value={row.url}
                                onChange={e => updatePhoto(i, "url", e.target.value)}
                                className="md:col-span-2 border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-primary outline-none bg-white"
                            />
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    placeholder="Caption (optional)"
                                    value={row.caption}
                                    onChange={e => updatePhoto(i, "caption", e.target.value)}
                                    className="flex-1 border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-primary outline-none bg-white"
                                />
                                {photoRows.length > 1 && (
                                    <button onClick={() => removePhoto(i)} className="text-red-400 hover:text-red-600 text-xs">✕</button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={addPhoto} className="text-sm text-primary font-bold hover:underline flex items-center gap-1">
                    + Add Photo
                </button>
            </div>

            {/* Notes */}
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm space-y-3">
                <h2 className="font-bold text-gray-700 text-sm uppercase tracking-widest">📝 Additional Notes</h2>
                <textarea
                    value={remarks}
                    onChange={e => setRemarks(e.target.value)}
                    rows={4}
                    placeholder="Any issues, observations, or important notes for management..."
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary outline-none resize-none"
                />
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
                        <p className="text-2xl font-bold text-primary">{fmt(totalDailyCost)} <span className="text-sm text-gray-400 font-normal">total for today</span></p>
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="px-10 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {submitting ? "Submitting..." : "Submit Daily Report"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DailyReport;
