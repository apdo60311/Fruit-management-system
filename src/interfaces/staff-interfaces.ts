import { ShiftPreference } from "./shift-interface";

export interface StaffFormProps {
    open: boolean;
    onClose: () => void;
    editingStaff: Staff | null;
}

export interface Staff extends Omit<Employee, 'shiftPreferences'> {
    email: string;
    phone: string;
    shiftPreferences: ShiftPreference[];
}


export interface EmployeeTimeLog {
    id: string;
    employeeId: string;
    shiftId: string;
    clockIn: string;
    clockOut?: string;
    breaks: Array<{
        start: string;
        end?: string;
    }>;
    totalWorkMinutes: number;
    totalBreakMinutes: number;
}

export interface Employee {
    id: string;
    name: string;
    role: string;
    status: 'active' | 'on-break' | 'off-duty';
    branch: string;
    startTime?: string;
    totalActiveTime?: number;
    currentBreakStart?: string;
    timeLogs: EmployeeTimeLog[];
    wage: number;
    wageType: 'hourly' | 'daily' | 'monthly';
    defaultShifts?: string[];
    shiftPreferences: {
        type: 'morning' | 'night';
        branchId: string;
    }[];
}

// interface Employee {
//     id: string;
//     name: string;
//     role: string;
//     branch: string;
//     status: 'active' | 'on-break' | 'off-duty';
//     wage: number;
//     wageType: 'hourly' | 'daily' | 'monthly';
//     defaultShifts?: string[];
//     timeLogs: any[];
//   }