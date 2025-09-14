import { create } from 'zustand'

interface reportStore {
    reports: any[];
    getReports: () => Promise<any>;
    addReports: (report: any) => Promise<any>;

}

const useReportStore = create<reportStore>((set, get) => ({
    reports: [],
    getReports: async () => {
        try {
            const res = await fetch(`/api/report`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            const data = await res.json();

            if (!res.ok) {
                return { error: true };
            }

            console.log(data)

            return data;
        } catch (err) {
            console.error(err)
        }
    },
    addReports: async (report) => {
        try {
            const res = await fetch(`/api/report`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(report)
            });
            const data = await res.json();

            if (!res.ok) {
                return { error: true };
            }

            console.log(data)

            return data;
        } catch (err) {
            console.error(err)
        }
    }
}));

export default useReportStore;