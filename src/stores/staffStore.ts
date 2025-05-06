import { create } from 'zustand';

interface Staff {
    id: string;
    name: string;
    branch: string;
    role: string;
    phone: string;
    email: string;
    status: 'active' | 'inactive';
    joinDate: string;
}

interface StaffStore {
    staff: Staff[];
    addStaff: (staff: Omit<Staff, 'id'>) => void;
    updateStaff: (id: string, staff: Partial<Staff>) => void;
    deleteStaff: (id: string) => void;
    getStaffByBranch: (branch: string) => Staff[];
}

const useStaffStore = create<StaffStore>((set, get) => ({
    staff: [],
    addStaff: (newStaff) => {
        set((state) => ({
            staff: [...state.staff, { ...newStaff, id: Math.random().toString(36).substr(2, 9) }],
        }));
    },
    updateStaff: (id, updatedStaff) => {
        set((state) => ({
            staff: state.staff.map((s) => (s.id === id ? { ...s, ...updatedStaff } : s)),
        }));
    },
    deleteStaff: (id) => {
        set((state) => ({
            staff: state.staff.filter((s) => s.id !== id),
        }));
    },
    getStaffByBranch: (branch) => {
        return get().staff.filter((s) => s.branch === branch);
    },
}));

export default useStaffStore;