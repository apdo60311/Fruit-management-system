import { EmployeeTimeLog } from "./staff-interfaces";

export interface ShiftPreference {
    type: 'morning' | 'night';
    branchId: string;
}

export interface ShiftExpense {
    id: string;
    description: string;
    amount: number;
    category: string;
    date: string;
    branchId: string;
    shiftId: string;
}

export interface Shift {
    id: string;
    name: string;
    type: 'morning' | 'night';
    startTime: string;
    endTime: string;
    branch: string;
    employees: string[];
    status: 'active' | 'upcoming' | 'completed';
    tasks: {
        id: string;
        description: string;
        assignedTo: string;
        status: 'pending' | 'completed';
    }[];
    expenses: ShiftExpense[];
    scheduledStart: string;
    scheduledEnd: string;
    actualStart: string;
    actualEnd?: string;
    timeLogs: EmployeeTimeLog[];
}
