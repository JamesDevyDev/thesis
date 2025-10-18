"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import toast, { Toaster } from 'react-hot-toast';


const CrimeMap = dynamic(() => import("@/components/reusable/CrimeMap"), { ssr: false });

import useReportStore from "@/utils/zustand/ReportStore";
import useAuthStore from "@/utils/zustand/useAuthStore";
import { useRouter } from "next/navigation";

// -------------------- Types --------------------
type VictimInfo = {
    name: string;
    age: string;
    gender: string;
    harmed: string;
    nationality: string;
    occupation: string;
};

type SuspectInfo = {
    name: string;
    age: string;
    gender: string;
    status: string;
    nationality: string;
    occupation: string;
};

type CrimeForm = {
    blotterNo: string;
    dateEncoded: string;
    barangay: string;
    street: string;
    typeOfPlace: string;
    dateReported: string;
    timeReported: string;
    dateCommitted: string;
    timeCommitted: string;
    modeOfReporting: string;
    stageOfFelony: string;
    offense: string;
    victim: VictimInfo;
    suspect: SuspectInfo;
    suspectMotive: string;
    narrative: string;
    status: string;
    location: { lat: number; lng: number } | null;
};

// -------------------- Data Lists --------------------
const barangays = [
    "Almanza Dos", "Almanza Uno", "B.F. CAA International Village", "Daniel Fajardo",
    "Elias Aldana", "Ilaya", "Manuyo Uno", "Manuyo Dos", "Pamplona Uno", "Pamplona Dos",
    "Pamplona Tres", "Pilar", "Pulang Lupa Uno", "Pulang Lupa Dos", "Talon Uno",
    "Talon Dos", "Talon Tres", "Talon Cuatro", "Talon Singko", "Zapote",
];

const offenseCategories = [
    {
        label: "🚨 Index Crimes",
        color: "text-red-400 font-semibold",
        offenses: ["Murder", "Homicide", "Rape", "Physical Injury", "Robbery", "Theft", "Carnapping", "Cattle Rustling"],
    },
    {
        label: "⚖️ Non-Index Crimes",
        color: "text-yellow-400 font-semibold",
        offenses: ["Drug Offense", "Illegal Firearms", "Child Abuse", "Cybercrime", "Estafa", "Direct Assault", "Grave Threats", "Other Forms of Trespass", "Violence Against Women & Children (VAWC)", "Illegal Logging"],
    },
    {
        label: "🚗 Traffic Violations",
        color: "text-blue-400 font-semibold",
        offenses: ["Reckless Driving", "Illegal Parking", "Overspeeding", "Driving Without License", "Road Accident"],
    },
    {
        label: "📜 Ordinance Violations",
        color: "text-gray-400 font-semibold",
        offenses: ["Curfew Violation", "Public Disturbance", "Littering", "Noise Complaint", "Illegal Vending", "Drinking in Public", "Alarms and Scandals", "Unjust Vexations", "Light Threats", "Malicious Mischief"],
    },
];

// -------------------- Component --------------------
const CrimeReportForm = () => {
    const router = useRouter();
    const { addReports } = useReportStore();
    const { getAuthUserFunction, authUser } = useAuthStore();

    // Auth
    const [authLoading, setAuthLoading] = useState(true);
    useEffect(() => {
        const checkAuth = async () => {
            await getAuthUserFunction();
            setAuthLoading(false);
        };
        checkAuth();
    }, [getAuthUserFunction]);

    useEffect(() => {
        if (!authLoading && authUser === null) {
            router.push('/');
        }
    }, [authUser, authLoading, router]);

    const [form, setForm] = useState<CrimeForm>({
        blotterNo: "",
        dateEncoded: new Date().toLocaleString(),
        barangay: "",
        street: "",
        typeOfPlace: "",
        dateReported: "",
        timeReported: "",
        dateCommitted: "",
        timeCommitted: "",
        modeOfReporting: "",
        stageOfFelony: "",
        offense: "",
        victim: { name: "", age: "", gender: "", harmed: "", nationality: "", occupation: "" },
        suspect: { name: "", age: "", gender: "", status: "", nationality: "", occupation: "" },
        suspectMotive: "",
        narrative: "",
        status: "Solved",
        location: { lat: 14.4445, lng: 120.9939 },
    });

    const handleSubmit = () => {
        const {
            blotterNo, dateEncoded, barangay, street, typeOfPlace, dateReported,
            timeReported, dateCommitted, timeCommitted, modeOfReporting, stageOfFelony,
            offense, narrative, location,
        } = form;

        // Validation with toast notifications
        if (!blotterNo.trim()) return toast.error("Please enter the blotter number.");
        if (!dateEncoded.trim()) return toast.error("Date encoded is missing.");
        if (!barangay.trim()) return toast.error("Please select a Barangay.");
        if (!street.trim()) return toast.error("Please enter the Street.");
        if (!typeOfPlace.trim()) return toast.error("Please specify the Type of Place.");
        if (!dateReported.trim()) return toast.error("Please enter the Date Reported.");
        if (!timeReported.trim()) return toast.error("Please enter the Time Reported.");
        if (!dateCommitted.trim()) return toast.error("Please enter the Date Committed.");
        if (!timeCommitted.trim()) return toast.error("Please enter the Time Committed.");
        if (!modeOfReporting.trim()) return toast.error("Please select a Mode of Reporting.");
        if (!stageOfFelony.trim()) return toast.error("Please select a Stage of Felony.");
        if (!offense.trim()) return toast.error("Please select an Offense.");
        if (!location || !location.lat || !location.lng) return toast.error("Please select a location on the map.");
        if (!narrative.trim()) return toast.error("Please enter the Narrative or Case Details.");

        // Submit
        addReports(form);
        console.log(form);

        toast.success("Crime report submitted successfully!");

        // Clear form
        setForm({
            blotterNo: "",
            dateEncoded: new Date().toLocaleString(),
            barangay: "",
            street: "",
            typeOfPlace: "",
            dateReported: "",
            timeReported: "",
            dateCommitted: "",
            timeCommitted: "",
            modeOfReporting: "",
            stageOfFelony: "",
            offense: "",
            victim: { name: "", age: "", gender: "", harmed: "", nationality: "", occupation: "" },
            suspect: { name: "", age: "", gender: "", status: "", nationality: "", occupation: "" },
            suspectMotive: "",
            narrative: "",
            status: "Solved",
            location: { lat: 14.4445, lng: 120.9939 },
        });
    };

    // Auto-generate blotter number
    useEffect(() => {
        const generateBlotterNumber = () => {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const reports = useReportStore.getState().reports || [];
            const currentPeriodPrefix = `${year}-${month}`;
            const currentPeriodReports = reports.filter((report: any) =>
                report.blotterNo && report.blotterNo.startsWith(currentPeriodPrefix)
            );
            let maxNumber = 0;
            currentPeriodReports.forEach((report: any) => {
                const match = report.blotterNo.match(/-(\d{4})$/);
                if (match) {
                    const num = parseInt(match[1], 10);
                    if (num > maxNumber) maxNumber = num;
                }
            });
            const nextNumber = String(maxNumber + 1).padStart(4, '0');
            return `${year}-${month}-${nextNumber}`;
        };
        setForm((prev) => ({ ...prev, blotterNo: generateBlotterNumber() }));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleNestedChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
        category: "victim" | "suspect"
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [category]: { ...prev[category], [name]: value },
        }));
    };

    const handleSetCoords = (coords: [number, number]) => {
        setForm((prev) => ({ ...prev, location: { lat: coords[0], lng: coords[1] } }));
    };

    const inputClass = "bg-slate-800/50 border border-slate-700/50 hover:border-slate-600/70 focus:border-cyan-400/50 focus:outline-none text-white px-4 py-2.5 rounded-lg w-full transition-all placeholder-gray-500";
    const labelClass = "font-semibold text-gray-300 mb-2 block text-sm uppercase tracking-wider";



    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-8">
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#1e293b',
                        color: '#fff',
                        border: '1px solid #334155',
                    },
                    success: {
                        iconTheme: {
                            primary: '#10b981',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: '#fff',
                        },
                    },
                }}
            />

            <div className="w-full max-w-5xl mx-auto space-y-8">
                <div className="space-y-2 text-center">
                    <h1 className="text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
                        Crime Report Form
                    </h1>
                    <p className="text-gray-400 text-sm">File and manage barangay crime incidents</p>
                </div>

                <form className="space-y-8">
                    {/* Basic Info */}
                    <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 space-y-4">
                        <h2 className="text-lg font-bold text-gray-100 uppercase tracking-wider flex items-center gap-2">
                            📋 Basic Information
                        </h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Blotter Number</label>
                                <input name="blotterNo" value={form.blotterNo} readOnly className={`${inputClass} bg-slate-800/70 cursor-not-allowed`} />
                            </div>

                            <div>
                                <label className={labelClass}>Barangay</label>
                                <select name="barangay" value={form.barangay} onChange={handleChange} className={inputClass}>
                                    <option value="">Select Barangay</option>
                                    {barangays.map((b) => (
                                        <option key={b} className="bg-slate-800" value={b}>{b}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className={labelClass}>Street</label>
                                <input name="street" value={form.street} onChange={handleChange} placeholder="Enter street name" className={inputClass} />
                            </div>

                            <div>
                                <label className={labelClass}>Type of Place</label>
                                <select name="typeOfPlace" value={form.typeOfPlace} onChange={handleChange} className={inputClass}>
                                    <option value="">Select Type</option>
                                    <option className="bg-slate-800" value="Along the Street">Along the Street</option>
                                    <option className="bg-slate-800" value="Residential">Residential</option>
                                    <option className="bg-slate-800" value="Commercial">Commercial</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Offense */}
                    <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 space-y-4">
                        <h2 className="text-lg font-bold text-gray-100 uppercase tracking-wider flex items-center gap-2">
                            ⚖️ Offense Details
                        </h2>
                        <div>
                            <label className={labelClass}>Offense</label>
                            <select name="offense" value={form.offense} onChange={handleChange} className={inputClass}>
                                <option value="">Select an offense</option>
                                {offenseCategories.map((group) => (
                                    <optgroup key={group.label} label={group.label} className={group.color}>
                                        {group.offenses.map((off) => (
                                            <option key={off} className="bg-slate-800" value={off}>{off}</option>
                                        ))}
                                    </optgroup>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Report & Incident Dates */}
                    <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 space-y-4">
                        <h2 className="text-lg font-bold text-gray-100 uppercase tracking-wider flex items-center gap-2">
                            📅 Date and Time Information
                        </h2>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Date Reported</label>
                                <input
                                    type="date"
                                    name="dateReported"
                                    value={form.dateReported}
                                    onChange={handleChange}
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Time Reported</label>
                                <input
                                    type="time"
                                    name="timeReported"
                                    value={form.timeReported}
                                    onChange={handleChange}
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Date Committed</label>
                                <input
                                    type="date"
                                    name="dateCommitted"
                                    value={form.dateCommitted}
                                    onChange={handleChange}
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Time Committed</label>
                                <input
                                    type="time"
                                    name="timeCommitted"
                                    value={form.timeCommitted}
                                    onChange={handleChange}
                                    className={inputClass}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Mode of Reporting & Stage of Felony */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 space-y-4">
                            <label className="text-lg font-bold text-gray-100 uppercase tracking-wider">Mode of Reporting</label>
                            <select
                                name="modeOfReporting"
                                value={form.modeOfReporting}
                                onChange={handleChange}
                                className={inputClass}
                            >
                                <option value="">Select Mode</option>
                                <option className="bg-slate-800" value="N/A">N/A</option>
                                <option className="bg-slate-800" value="In Person">In Person</option>
                                <option className="bg-slate-800" value="Phone Call">Phone Call</option>
                                <option className="bg-slate-800" value="Online">Walk In</option>
                            </select>
                        </div>

                        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 space-y-4">
                            <label className="text-lg font-bold text-gray-100 uppercase tracking-wider">Stage of Felony</label>
                            <select
                                name="stageOfFelony"
                                value={form.stageOfFelony}
                                onChange={handleChange}
                                className={inputClass}
                            >
                                <option value="">Select Stage</option>
                                <option className="bg-slate-800" value="N/A">N/A</option>
                                <option className="bg-slate-800" value="Attempted">Attempted</option>
                                <option className="bg-slate-800" value="Frustrated">Frustrated</option>
                                <option className="bg-slate-800" value="Consummated">Consummated</option>
                            </select>
                        </div>
                    </div>

                    {/* Victim Info */}
                    <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 space-y-4">
                        <h2 className="text-lg font-bold text-gray-100 uppercase tracking-wider flex items-center gap-2">
                            🙍 Victim Information
                        </h2>
                        <div className="grid md:grid-cols-3 gap-3">
                            {Object.keys(form.victim).map((key) => {
                                if (key === "gender" || key === "harmed") {
                                    return (
                                        <div key={key}>
                                            <label className={labelClass}>{key}</label>
                                            <select
                                                name={key}
                                                value={(form.victim as any)[key]}
                                                onChange={(e) => handleNestedChange(e, "victim")}
                                                className={inputClass}
                                            >
                                                <option value="">Select {key}</option>
                                                {key === "gender" && (
                                                    <>
                                                        <option className="bg-slate-800" value="N/A">N/A</option>
                                                        <option className="bg-slate-800" value="Male">Male</option>
                                                        <option className="bg-slate-800" value="Female">Female</option>
                                                    </>
                                                )}
                                                {key === "harmed" && (
                                                    <>
                                                        <option className="bg-slate-800" value="N/A">N/A</option>
                                                        <option className="bg-slate-800" value="Harmed">Harmed</option>
                                                        <option className="bg-slate-800" value="Unharmed">Unharmed</option>
                                                    </>
                                                )}
                                            </select>
                                        </div>
                                    );
                                }
                                return (
                                    <div key={key}>
                                        <label className={labelClass}>{key}</label>
                                        <input
                                            name={key}
                                            placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                                            value={(form.victim as any)[key]}
                                            onChange={(e) => handleNestedChange(e, "victim")}
                                            className={inputClass}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Suspect Info */}
                    <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 space-y-4">
                        <h2 className="text-lg font-bold text-gray-100 uppercase tracking-wider flex items-center gap-2">
                            🕵️ Suspect Information
                        </h2>
                        <div className="grid md:grid-cols-3 gap-3">
                            {Object.keys(form.suspect).map((key) => {
                                if (key === "gender" || key === "status") {
                                    return (
                                        <div key={key}>
                                            <label className={labelClass}>{key}</label>
                                            <select
                                                name={key}
                                                value={(form.suspect as any)[key]}
                                                onChange={(e) => handleNestedChange(e, "suspect")}
                                                className={inputClass}
                                            >
                                                <option value="">Select {key}</option>
                                                {key === "gender" && (
                                                    <>
                                                        <option className="bg-slate-800" value="N/A">N/A</option>
                                                        <option className="bg-slate-800" value="Male">Male</option>
                                                        <option className="bg-slate-800" value="Female">Female</option>
                                                    </>
                                                )}
                                                {key === "status" && (
                                                    <>
                                                        <option className="bg-slate-800" value="N/A">N/A</option>
                                                        <option className="bg-slate-800" value="Arrested">Arrested</option>
                                                        <option className="bg-slate-800" value="Detained">Detained</option>
                                                        <option className="bg-slate-800" value="At Large">At Large</option>
                                                    </>
                                                )}
                                            </select>
                                        </div>
                                    );
                                }
                                return (
                                    <div key={key}>
                                        <label className={labelClass}>{key}</label>
                                        <input
                                            name={key}
                                            placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                                            value={(form.suspect as any)[key]}
                                            onChange={(e) => handleNestedChange(e, "suspect")}
                                            className={inputClass}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Motive & Narrative */}
                    <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 space-y-4">
                        <h2 className="text-lg font-bold text-gray-100 uppercase tracking-wider flex items-center gap-2">
                            📝 Additional Details
                        </h2>
                        <div>
                            <label className={labelClass}>Suspect Motive</label>
                            <input
                                name="suspectMotive"
                                value={form.suspectMotive}
                                onChange={handleChange}
                                placeholder="Enter suspect motive"
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Narrative</label>
                            <textarea
                                name="narrative"
                                value={form.narrative}
                                onChange={handleChange}
                                placeholder="Describe the incident in detail..."
                                className={`${inputClass} h-32 resize-none`}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Case Status</label>
                            <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
                                <option className="bg-slate-800" value="Solved">Solved</option>
                                <option className="bg-slate-800" value="Cleared">Cleared</option>
                                <option className="bg-slate-800" value="Unsolved">Unsolved</option>
                            </select>
                        </div>
                    </div>

                    {/* Map & Manual Coordinates */}
                    <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 space-y-4">
                        <h2 className="text-lg font-bold text-gray-100 uppercase tracking-wider flex items-center gap-2">
                            📍 Incident Location
                        </h2>

                        {/* Manual Coordinates Input */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Latitude</label>
                                <input
                                    type="number"
                                    step="any"
                                    value={form.location?.lat ?? ""}
                                    onChange={(e) => {
                                        const newLat = parseFloat(e.target.value) || 0;
                                        setForm((prev) => ({
                                            ...prev,
                                            location: { lat: newLat, lng: prev.location?.lng ?? 0 },
                                        }));
                                    }}
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Longitude</label>
                                <input
                                    type="number"
                                    step="any"
                                    value={form.location?.lng ?? ""}
                                    onChange={(e) => {
                                        const newLng = parseFloat(e.target.value) || 0;
                                        setForm((prev) => ({
                                            ...prev,
                                            location: { lat: prev.location?.lat ?? 0, lng: newLng },
                                        }));
                                    }}
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        {/* Interactive Map */}
                        <div className="h-96 w-full rounded-xl overflow-hidden border border-slate-700/50 shadow-lg">
                            <CrimeMap
                                setCoords={handleSetCoords}
                                coords={[form.location?.lat ?? 14.4445, form.location?.lng ?? 120.9939]}
                            />
                        </div>

                        {form.location && (
                            <div className="bg-gradient-to-r from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 rounded-lg p-3">
                                <p className="text-sm text-emerald-300 font-semibold">
                                    Selected Location: {form.location.lat.toFixed(5)}, {form.location.lng.toFixed(5)}
                                </p>
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() => handleSubmit()}
                        className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all uppercase tracking-wider"
                    >
                        Submit Report
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CrimeReportForm;