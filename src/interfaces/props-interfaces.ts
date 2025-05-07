export interface TaskFormProps {
    open: boolean;
    onClose: () => void;
    shiftId: string;
    employees: Array<{ id: string; name: string }>;
}

export interface ExpenseFormProps {
    open: boolean;
    onClose: () => void;
    shiftId: string;
    branchId: string;
}

export interface SalesUploadFormProps {
    open: boolean;
    onClose: () => void;
    shiftId: string;
}

export interface ShiftFormProps {
    open: boolean;
    onClose: () => void;
    branch: string;
    shiftType: 'morning' | 'night';
}