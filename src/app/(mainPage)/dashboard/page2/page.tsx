"use client";

import React, { useState, useEffect } from "react";
import useReportStore from "@/utils/zustand/ReportStore";

const ReportsPage = () => {
    const { getReports, changeReportStatus } = useReportStore();
    const [reports, setReports] = useState<any[]>([]);
    const [filteredReports, setFilteredReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters state
    const [filters, setFilters] = useState({
        search: "",
        crimeType: "",
        barangay: "",
        status: "",
    });

    const [selectedReport, setSelectedReport] = useState<any | null>(null);

    const crimes = {
        serious: [
            "Theft / Robbery",
            "Physical Assault",
            "Domestic Violence",
            "Illegal Drugs",
            "Sexual Harassment",
            "Murder / Homicide",
            "Human Trafficking",
            "Kidnapping",
            "Fraud / Scam",
        ],
        moderate: [
            "Vandalism",
            "Trespassing",
            "Illegal Gambling",
            "Public Disturbance / Fighting",
            "Threats / Verbal Harassment",
            "Cybercrime / Online Harassment",
            "Stalking",
            "Animal Cruelty",
        ],
        minor: [
            "Noise Complaint",
            "Curfew Violation",
            "Littering / Illegal Dumping",
            "Drinking in Public",
            "Smoking in Prohibited Areas",
            "Jaywalking",
            "Loitering",
            "Minor Traffic Violation",
            "Unleashed Pets / Stray Animals",
            "Illegal Parking",
        ],
    };

    const barangays = [
        "Almanza Dos",
        "Almanza Uno",
        "B.F. CAA International Village",
        "Aldana",
        "Manuyo Dos",
        "Manuyo Uno",
        "Pamplona Dos",
        "Pamplona Tres",
        "Pamplona Uno",
        "Pilar",
        "Pulang Lupa Dos",
        "Pulang Lupa Uno",
        "Talon Dos",
        "Talon Kuatro",
        "Talon Singko",
        "Talon Tres",
        "Talon Uno",
        "Zapote",
    ];

    // Fetch reports on mount
    useEffect(() => {
        async function fetchReports() {
            setLoading(true);
            const data = await getReports();
            if (data && data.reports) {
                setReports(data.reports);
                setFilteredReports(data.reports);
            }
            setLoading(false);
        }
        fetchReports();
    }, [getReports]);

    // Filtering logic
    useEffect(() => {
        if (!reports.length) return;

        let filtered = [...reports];

        if (filters.crimeType) {
            filtered = filtered.filter((r) => r.crime === filters.crimeType);
        }

        if (filters.barangay) {
            filtered = filtered.filter((r) => r.barangay === filters.barangay);
        }

        if (filters.status) {
            filtered = filtered.filter((r) => {
                const status = r.status?.toLowerCase() || "pending";
                return status === filters.status.toLowerCase();
            });
        }

        if (filters.search.trim()) {
            const searchLower = filters.search.toLowerCase();
            filtered = filtered.filter(
                (r) =>
                    r.complainantName?.toLowerCase().includes(searchLower) ||
                    r.crime?.toLowerCase().includes(searchLower)
            );
        }

        setFilteredReports(filtered);
    }, [filters, reports]);

    const totalReports = filteredReports.length;
    const solvedCount = filteredReports.filter(
        (r) => r.status?.toLowerCase() === "solved"
    ).length;
    const unsolvedCount = filteredReports.filter(
        (r) => r.status?.toLowerCase() === "unsolved"
    ).length;

    const crimeFrequency = filteredReports.reduce<Record<string, number>>((acc, r) => {
        acc[r.crime] = (acc[r.crime] || 0) + 1;
        return acc;
    }, {});
    const mostCommonCrime = Object.entries(crimeFrequency).reduce(
        (max, entry) => (entry[1] > max[1] ? entry : max),
        ["N/A", 0]
    )[0];

    function handleFilterChange(
        e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
    ) {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value === "" ? "" : value,
        }));
    }

    function resetFilters() {
        setFilters({
            search: "",
            crimeType: "",
            barangay: "",
            status: "",
        });
    }

    return (
        <div className="flex items-center justify-center w-full min-h-screen bg-[#0F1120] text-white p-6">
            <div className="w-full max-w-[1200px] space-y-6">
                {/* Header Section */}
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Crime Reports Dashboard</h1>
                </div>

                {/* Filters */}
                <div className="flex gap-4 flex-wrap items-center">
                    <input
                        type="text"
                        name="search"
                        value={filters.search}
                        onChange={handleFilterChange}
                        placeholder="🔍 Search by complainant or crime"
                        className="bg-[#1C1E2E] px-3 py-2 rounded-lg text-sm w-64"
                    />

                    <select
                        name="crimeType"
                        value={filters.crimeType}
                        onChange={handleFilterChange}
                        className="bg-[#1C1E2E] px-3 py-2 rounded-lg text-sm cursor-pointer"
                    >
                        <option value="">Crime Type</option>
                        <optgroup label="🚨 Serious Crimes">
                            {crimes.serious.map((c, idx) => (
                                <option key={idx} className="text-red-500" value={c}>
                                    {c}
                                </option>
                            ))}
                        </optgroup>
                        <optgroup label="⚖️ Moderate Offenses">
                            {crimes.moderate.map((c, idx) => (
                                <option key={idx} className="text-yellow-400" value={c}>
                                    {c}
                                </option>
                            ))}
                        </optgroup>
                        <optgroup label="📝 Minor Violations">
                            {crimes.minor.map((c, idx) => (
                                <option key={idx} className="text-green-400" value={c}>
                                    {c}
                                </option>
                            ))}
                        </optgroup>
                    </select>

                    <select
                        name="barangay"
                        value={filters.barangay}
                        onChange={handleFilterChange}
                        className="bg-[#1C1E2E] px-3 py-2 rounded-lg text-sm cursor-pointer"
                    >
                        <option value="">Barangay</option>
                        {barangays.map((b, idx) => (
                            <option key={idx} value={b}>
                                {b}
                            </option>
                        ))}
                    </select>

                    <select
                        name="status"
                        value={filters.status}
                        onChange={handleFilterChange}
                        className="bg-[#1C1E2E] px-3 py-2 rounded-lg text-sm cursor-pointer"
                    >
                        <option value="">Status</option>
                        <option value="Solved">Solved</option>
                        <option value="Unsolved">Unsolved</option>
                        <option value="Pending">Pending</option>
                    </select>

                    {/* Reset Filters Button */}
                    <button
                        onClick={resetFilters}
                        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-sm font-medium cursor-pointer"
                    >
                        Reset Filters
                    </button>
                </div>

                {/* Report Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-[#1C1E2E] p-4 rounded-xl shadow">
                        <h2 className="text-sm text-gray-400">Total Reports</h2>
                        <p className="text-xl font-bold">{loading ? "Loading..." : totalReports}</p>
                    </div>
                    <div className="bg-[#1C1E2E] p-4 rounded-xl shadow">
                        <h2 className="text-sm text-gray-400">Most Common Crime</h2>
                        <p className="text-xl font-bold">{loading ? "Loading..." : mostCommonCrime}</p>
                    </div>
                    <div className="bg-[#1C1E2E] p-4 rounded-xl shadow">
                        <h2 className="text-sm text-gray-400">Solved Cases</h2>
                        <p className="text-xl font-bold">{loading ? "Loading..." : solvedCount}</p>
                    </div>
                    <div className="bg-[#1C1E2E] p-4 rounded-xl shadow">
                        <h2 className="text-sm text-gray-400">Unsolved Cases</h2>
                        <p className="text-xl font-bold">{loading ? "Loading..." : unsolvedCount}</p>
                    </div>
                </div>

                {/* Reports Table */}
                <div className="bg-[#1C1E2E] rounded-xl p-4 overflow-x-auto">
                    {loading ? (
                        <p className="text-center text-gray-400">Loading reports...</p>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left border-b border-gray-700">
                                    <th className="p-2">Report ID</th>
                                    <th className="p-2">Complainant</th>
                                    <th className="p-2">Crime</th>
                                    <th className="p-2">Barangay</th>
                                    <th className="p-2">Date</th>
                                    <th className="p-2">Status</th>
                                    <th className="p-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredReports.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="p-4 text-center text-gray-400">
                                            No reports found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredReports.map((report, idx) => {
                                        let statusText = report.status || "Pending";

                                        const allCrimes = [...crimes.serious, ...crimes.moderate, ...crimes.minor];
                                        let crimeColor = "text-white";
                                        if (crimes.serious.includes(report.crime)) crimeColor = "text-red-400";
                                        else if (crimes.moderate.includes(report.crime)) crimeColor = "text-yellow-400";
                                        else if (crimes.minor.includes(report.crime)) crimeColor = "text-green-400";

                                        return (
                                            <tr key={report._id || idx} className="border-b border-gray-800">
                                                <td className="p-2">{report._id}</td>
                                                <td className="p-2">{report.complainantName}</td>
                                                <td className={`p-2 ${crimeColor}`}>{report.crime}</td>
                                                <td className="p-2">{report.barangay}</td>
                                                <td className="p-2">{report.date}</td>
                                                <td className="p-2">
                                                    <select
                                                        value={statusText}
                                                        onChange={(e) => {
                                                            const newStatus = e.target.value;
                                                            setReports((prev) =>
                                                                prev.map((r) =>
                                                                    r._id === report._id ? { ...r, status: newStatus } : r
                                                                )
                                                            );

                                                            changeReportStatus(report?._id, e.target.value)

                                                        }}
                                                        className="bg-[#2A2C3E] text-sm px-2 py-1 rounded-lg border border-gray-600 cursor-pointer"
                                                    >
                                                        <option value="Pending">🟡 Pending</option>
                                                        <option value="Solved">🟢 Solved</option>
                                                        <option value="Unsolved">🔴 Unsolved</option>
                                                    </select>
                                                </td>
                                                <td className="p-2">
                                                    <button
                                                        onClick={() => setSelectedReport(report)}
                                                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg text-xs cursor-pointer"
                                                    >
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Detailed Case Modal */}
                {selectedReport && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-[#1C1E2E] p-6 rounded-xl w-[700px] max-h-[85vh] overflow-y-auto shadow-xl">
                            <h2 className="text-2xl font-bold mb-6 text-center border-b border-gray-600 pb-3">
                                Case Details
                            </h2>

                            {/* Report Info */}
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="font-semibold text-gray-300">Report ID</p>
                                    <p className="text-gray-400 break-all">{selectedReport._id}</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-300">Status</p>
                                    <span
                                        className={`px-2 py-1 rounded-lg text-xs font-semibold ${selectedReport.status === "Resolved"
                                            ? "bg-green-600 text-white"
                                            : selectedReport.status === "Ongoing"
                                                ? "bg-yellow-500 text-black"
                                                : "bg-gray-500 text-white"
                                            }`}
                                    >
                                        {selectedReport.status || "Pending"}
                                    </span>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-300">Complainant</p>
                                    <p className="text-gray-400">{selectedReport.complainantName}</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-300">Contact Number</p>
                                    <p className="text-gray-400">{selectedReport.contactNumber}</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-300">Address</p>
                                    <p className="text-gray-400">{selectedReport.address}</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-300">Barangay</p>
                                    <p className="text-gray-400">{selectedReport.barangay}</p>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="my-4 border-t border-gray-600"></div>

                            {/* Crime Details */}
                            <h3 className="text-lg font-semibold mb-2">Crime Information</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="font-semibold text-gray-300">Crime</p>
                                    <p className="text-gray-400">{selectedReport.crime}</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-300">Date & Time</p>
                                    <p className="text-gray-400">
                                        {selectedReport.date} at {selectedReport.time}
                                    </p>
                                </div>
                                <div className="col-span-2">
                                    <p className="font-semibold text-gray-300">Description</p>
                                    <p className="text-gray-400">{selectedReport.description}</p>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="my-4 border-t border-gray-600"></div>

                            {/* Extra Details */}
                            <h3 className="text-lg font-semibold mb-2">Additional Information</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="font-semibold text-gray-300">Suspect</p>
                                    <p className="text-gray-400">{selectedReport.suspectName || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-300">Witness</p>
                                    <p className="text-gray-400">{selectedReport.witnessName || "N/A"}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="font-semibold text-gray-300">Created At</p>
                                    <p className="text-gray-400">
                                        {new Date(selectedReport.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => setSelectedReport(null)}
                                    className="px-5 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-sm font-medium cursor-pointer"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div >
        </div >
    );
};

export default ReportsPage;
