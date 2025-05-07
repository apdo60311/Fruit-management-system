import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Employee, EmployeeTimeLog } from '../interfaces/staff-interfaces';
import { Shift, ShiftExpense } from '../interfaces/shift-interface';

export interface ShiftState {
    employees: Employee[];
    shifts: Shift[];
    branches: { id: string; name: string }[];
    currentShift: string | null;

    addBranch: (branch: { name: string }) => void;
    removeBranch: (id: string) => void;

    addEmployee: (employee: Omit<Employee, 'id' | 'status' | 'startTime' | 'totalActiveTime' | 'currentBreakStart' | 'timeLogs'>) => void;
    updateEmployee: (id: string, employee: Partial<Employee>) => void;
    removeEmployee: (id: string) => void;

    addShift: (shift: Omit<Shift, 'id' | 'tasks' | 'expenses' | 'scheduledStart' | 'scheduledEnd' | 'actualStart' | 'actualEnd' | 'timeLogs'>) => void;
    updateShift: (id: string, shift: Partial<Shift>) => void;
    removeShift: (id: string) => void;
    setCurrentShift: (id: string | null) => void;
    startShift: (branchId: string) => void;
    endShift: (shiftId: string) => void;

    clockIn: (employeeId: string, branchId: string) => void;
    clockOut: (employeeId: string) => void;
    setBreak: (employeeId: string, onBreak: boolean) => void;

    addTask: (shiftId: string, task: Omit<Shift['tasks'][0], 'id'>) => void;
    updateTask: (shiftId: string, taskId: string, update: Partial<Shift['tasks'][0]>) => void;
    removeTask: (shiftId: string, taskId: string) => void;

    addExpense: (expense: Omit<ShiftExpense, 'id'>) => void;
    updateExpense: (id: string, expense: Partial<ShiftExpense>) => void;
    removeExpense: (shiftId: string, expenseId: string) => void;
    getShiftExpenses: (shiftId: string) => ShiftExpense[];
    getBranchExpenses: (branchId: string, startDate: string, endDate: string) => ShiftExpense[];

    getEmployeeShiftStats: (employeeId: string, shiftId: string) => {
        totalWork: number;
        totalBreak: number;
        isLate: boolean;
        lateMinutes: number;
        overtime: number;
    };

    addStaffToShift: (shiftId: string, employeeId: string) => void;
    removeStaffFromShift: (shiftId: string, employeeId: string) => void;

    endShiftWithSales: (shiftId: string, salesData: {
        productId: string;
        quantity: number;
        price: number;
        cost: number;
    }[]) => {
        totalSales: number;
        totalCost: number;
        profit: number;
        staffWages: number;
    };
}

const useShiftStore = create<ShiftState>()(
    persist(
        (set, get) => ({
            employees: [],
            shifts: [],
            branches: [
                { id: 'main', name: 'Main Branch' },
                { id: 'secondary', name: 'Secondary Branch' }
            ],
            currentShift: null,

            addBranch: (branch) => {
                const newBranch = {
                    ...branch,
                    id: crypto.randomUUID(),
                };
                set((state) => ({
                    branches: [...state.branches, newBranch],
                }));
            },

            removeBranch: (id) => {
                set((state) => ({
                    branches: state.branches.filter((b) => b.id !== id),
                }));
            },

            addEmployee: (employee) => {
                const newEmployee = {
                    ...employee,
                    id: crypto.randomUUID(),
                    status: 'off-duty' as const,
                    startTime: undefined,
                    totalActiveTime: 0,
                    timeLogs: [],
                };
                set((state) => ({
                    employees: [...state.employees, newEmployee],
                }));
            },

            updateEmployee: (id, employee) => {
                set((state) => ({
                    employees: state.employees.map((e) =>
                        e.id === id ? { ...e, ...employee } : e
                    ),
                }));
            },

            removeEmployee: (id) => {
                set((state) => ({
                    employees: state.employees.filter((e) => e.id !== id),
                }));
            },

            addShift: (shift) => {
                const now = new Date();
                const newShift: Shift = {
                    ...shift,
                    id: crypto.randomUUID(),
                    scheduledStart: "10:00",
                    scheduledEnd: "22:00",
                    actualStart: now.toISOString(),
                    actualEnd: undefined,
                    tasks: [],
                    expenses: [],
                    timeLogs: [],
                };
                set((state) => ({
                    shifts: [...state.shifts, newShift],
                }));
            },

            updateShift: (id, shift) => {
                set((state) => ({
                    shifts: state.shifts.map((s) =>
                        s.id === id ? { ...s, ...shift } : s
                    ),
                }));
            },

            removeShift: (id) => {
                set((state) => ({
                    shifts: state.shifts.filter((s) => s.id !== id),
                    currentShift: state.currentShift === id ? null : state.currentShift,
                }));
            },

            setCurrentShift: (id) => {
                set({ currentShift: id });
            },

            startShift: (branchId) => {
                const newShift: Shift = {
                    id: crypto.randomUUID(),
                    name: `${new Date().toLocaleDateString()}`,
                    type: 'morning',
                    startTime: new Date().toISOString(),
                    endTime: '',
                    branch: branchId,
                    employees: [],
                    status: 'active',
                    tasks: [],
                    expenses: [],
                    scheduledStart: "10:00",
                    scheduledEnd: "22:00",
                    actualStart: new Date().toISOString(),
                    actualEnd: undefined,
                    timeLogs: [],
                };

                set((state) => ({
                    shifts: [...state.shifts, newShift],
                    currentShift: newShift.id,
                }));

                const availableStaff = get().employees.filter(e =>
                    e.branch === branchId &&
                    e.shiftPreferences.some(p => p.branchId === branchId && p.type === newShift.type)
                );

                availableStaff.forEach(employee => {
                    get().addStaffToShift(newShift.id, employee.id);
                });
            },

            endShift: (shiftId) => {
                set((state) => ({
                    shifts: state.shifts.map((s) =>
                        s.id === shiftId
                            ? {
                                ...s,
                                endTime: new Date().toISOString(),
                                status: 'completed' as const,
                            }
                            : s
                    ),
                    currentShift: state.currentShift === shiftId ? null : state.currentShift,
                }));

                const activeEmployees = get().employees.filter((e) => e.status === 'active');
                activeEmployees.forEach((employee) => {
                    get().clockOut(employee.id);
                });
            },

            clockIn: (employeeId, branchId) => {
                const now = new Date();
                const currentShift = get().currentShift;
                const timeLogId = crypto.randomUUID();

                if (!currentShift) return;

                const newTimeLog: EmployeeTimeLog = {
                    id: timeLogId,
                    employeeId,
                    shiftId: currentShift,
                    clockIn: now.toISOString(),
                    breaks: [],
                    totalWorkMinutes: 0,
                    totalBreakMinutes: 0,
                };

                set((state) => ({
                    employees: state.employees.map((e) =>
                        e.id === employeeId
                            ? {
                                ...e,
                                status: 'active',
                                startTime: now.toISOString(),
                                branch: branchId,
                                timeLogs: [...(e.timeLogs || []), newTimeLog]
                            }
                            : e
                    ),
                    shifts: state.shifts.map((s) =>
                        s.id === currentShift
                            ? { ...s, timeLogs: [...(s.timeLogs || []), newTimeLog] }
                            : s
                    ),
                }));
            },

            clockOut: (employeeId) => {
                const now = new Date();
                const currentShift = get().currentShift;
                const employee = get().employees.find((e) => e.id === employeeId);

                if (!employee?.startTime || !currentShift) return;

                const timeLog = employee.timeLogs.find(
                    (log) => log.shiftId === currentShift && !log.clockOut
                );

                if (!timeLog) return;

                const workMinutes = Math.floor(
                    (now.getTime() - new Date(timeLog.clockIn).getTime()) / 60000
                );

                const breakMinutes = timeLog.breaks.reduce((total, breakPeriod) => {
                    if (!breakPeriod.end) return total;
                    return total + Math.floor(
                        (new Date(breakPeriod.end).getTime() - new Date(breakPeriod.start).getTime()) / 60000
                    );
                }, 0);

                const updatedTimeLog = {
                    ...timeLog,
                    clockOut: now.toISOString(),
                    totalWorkMinutes: workMinutes - breakMinutes,
                    totalBreakMinutes: breakMinutes,
                };

                set((state) => ({
                    employees: state.employees.map((e) =>
                        e.id === employeeId
                            ? {
                                ...e,
                                status: 'off-duty',
                                startTime: undefined,
                                currentBreakStart: undefined,
                                timeLogs: e.timeLogs.map((log) =>
                                    log.id === timeLog.id ? updatedTimeLog : log
                                ),
                            }
                            : e
                    ),
                    shifts: state.shifts.map((s) =>
                        s.id === currentShift
                            ? {
                                ...s,
                                timeLogs: s.timeLogs.map((log) =>
                                    log.id === timeLog.id ? updatedTimeLog : log
                                ),
                            }
                            : s
                    ),
                }));
            },

            setBreak: (employeeId, onBreak) => {
                const now = new Date();
                const currentShift = get().currentShift;
                const employee = get().employees.find((e) => e.id === employeeId);

                if (!employee || !currentShift) return;

                const timeLog = employee.timeLogs.find(
                    (log) => log.shiftId === currentShift && !log.clockOut
                );

                if (!timeLog) return;

                if (onBreak) {
                    const updatedTimeLog = {
                        ...timeLog,
                        breaks: [
                            ...timeLog.breaks,
                            { start: now.toISOString() }
                        ],
                    };

                    set((state) => ({
                        employees: state.employees.map((e) =>
                            e.id === employeeId
                                ? {
                                    ...e,
                                    status: 'on-break',
                                    currentBreakStart: now.toISOString(),
                                    timeLogs: e.timeLogs.map((log) =>
                                        log.id === timeLog.id ? updatedTimeLog : log
                                    ),
                                }
                                : e
                        ),
                        shifts: state.shifts.map((s) =>
                            s.id === currentShift
                                ? {
                                    ...s,
                                    timeLogs: s.timeLogs.map((log) =>
                                        log.id === timeLog.id ? updatedTimeLog : log
                                    ),
                                }
                                : s
                        ),
                    }));
                } else {
                    const currentBreak = timeLog.breaks[timeLog.breaks.length - 1];
                    if (!currentBreak) return;

                    const updatedTimeLog = {
                        ...timeLog,
                        breaks: timeLog.breaks.map((breakPeriod, index) =>
                            index === timeLog.breaks.length - 1
                                ? { ...breakPeriod, end: now.toISOString() }
                                : breakPeriod
                        ),
                    };

                    set((state) => ({
                        employees: state.employees.map((e) =>
                            e.id === employeeId
                                ? {
                                    ...e,
                                    status: 'active',
                                    currentBreakStart: undefined,
                                    timeLogs: e.timeLogs.map((log) =>
                                        log.id === timeLog.id ? updatedTimeLog : log
                                    ),
                                }
                                : e
                        ),
                        shifts: state.shifts.map((s) =>
                            s.id === currentShift
                                ? {
                                    ...s,
                                    timeLogs: s.timeLogs.map((log) =>
                                        log.id === timeLog.id ? updatedTimeLog : log
                                    ),
                                }
                                : s
                        ),
                    }));
                }
            },

            addTask: (shiftId, task) => {
                const newTask = {
                    ...task,
                    id: crypto.randomUUID(),
                };
                set((state) => ({
                    shifts: state.shifts.map((s) =>
                        s.id === shiftId
                            ? { ...s, tasks: [...s.tasks, newTask] }
                            : s
                    ),
                }));
            },

            updateTask: (shiftId, taskId, update) => {
                set((state) => ({
                    shifts: state.shifts.map((s) =>
                        s.id === shiftId
                            ? {
                                ...s,
                                tasks: s.tasks.map((t) =>
                                    t.id === taskId ? { ...t, ...update } : t
                                ),
                            }
                            : s
                    ),
                }));
            },

            removeTask: (shiftId, taskId) => {
                set((state) => ({
                    shifts: state.shifts.map((s) =>
                        s.id === shiftId
                            ? { ...s, tasks: s.tasks.filter((t) => t.id !== taskId) }
                            : s
                    ),
                }));
            },

            addExpense: (expense) => {
                const newExpense = {
                    ...expense,
                    id: crypto.randomUUID(),
                };
                set((state) => ({
                    shifts: state.shifts.map((s) =>
                        s.id === expense.shiftId
                            ? { ...s, expenses: [...s.expenses, newExpense] }
                            : s
                    ),
                }));
            },

            updateExpense: (id, expense) => {
                set((state) => ({
                    shifts: state.shifts.map((s) => ({
                        ...s,
                        expenses: s.expenses.map((e) =>
                            e.id === id ? { ...e, ...expense } : e
                        ),
                    })),
                }));
            },

            removeExpense: (shiftId, expenseId) => {
                set((state) => ({
                    shifts: state.shifts.map((s) =>
                        s.id === shiftId
                            ? { ...s, expenses: s.expenses.filter((e) => e.id !== expenseId) }
                            : s
                    ),
                }));
            },

            getShiftExpenses: (shiftId) => {
                const shift = get().shifts.find((s) => s.id === shiftId);
                return shift?.expenses || [];
            },

            getBranchExpenses: (branchId, startDate, endDate) => {
                const shifts = get().shifts.filter(
                    (s) =>
                        s.branch === branchId &&
                        s.startTime >= startDate &&
                        s.startTime <= endDate
                );
                return shifts.flatMap((s) => s.expenses);
            },

            getEmployeeShiftStats: (employeeId, shiftId) => {
                const shift = get().shifts.find((s) => s.id === shiftId);
                if (!shift) {
                    return {
                        totalWork: 0,
                        totalBreak: 0,
                        isLate: false,
                        lateMinutes: 0,
                        overtime: 0,
                    };
                }

                const timeLog = shift.timeLogs?.find((log) => log.employeeId === employeeId);

                if (!timeLog) {
                    return {
                        totalWork: 0,
                        totalBreak: 0,
                        isLate: false,
                        lateMinutes: 0,
                        overtime: 0,
                    };
                }

                const shiftStart = new Date(timeLog.clockIn);
                const scheduledStart = new Date(shiftStart);
                const [hours, minutes] = (shift.scheduledStart || "10:00").split(':').map(Number);
                scheduledStart.setHours(hours, minutes, 0, 0);

                const isLate = shiftStart.getTime() > scheduledStart.getTime();
                const lateMinutes = isLate ? Math.floor((shiftStart.getTime() - scheduledStart.getTime()) / 60000) : 0;
                const expectedMinutes = 12 * 60;
                const overtime = Math.max(0, timeLog.totalWorkMinutes - expectedMinutes);

                return {
                    totalWork: timeLog.totalWorkMinutes,
                    totalBreak: timeLog.totalBreakMinutes,
                    isLate,
                    lateMinutes,
                    overtime,
                };
            },

            addStaffToShift: (shiftId, employeeId) => {
                const shift = get().shifts.find(s => s.id === shiftId);
                const employee = get().employees.find(e => e.id === employeeId);

                if (shift && employee && employee.shiftPreferences.some(p =>
                    p.branchId === shift.branch && p.type === shift.type
                )) {
                    set((state) => ({
                        shifts: state.shifts.map((s) =>
                            s.id === shiftId
                                ? { ...s, employees: [...s.employees, employeeId] }
                                : s
                        ),
                    }));
                }
            },

            removeStaffFromShift: (shiftId, employeeId) => {
                set((state) => ({
                    shifts: state.shifts.map((s) =>
                        s.id === shiftId
                            ? { ...s, employees: s.employees.filter(id => id !== employeeId) }
                            : s
                    ),
                }));
            },

            endShiftWithSales: (shiftId, salesData) => {
                const shift = get().shifts.find(s => s.id === shiftId);
                const employees = get().employees;

                if (!shift) {
                    return {
                        totalSales: 0,
                        totalCost: 0,
                        profit: 0,
                        staffWages: 0
                    };
                }

                const totalSales = salesData.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                const totalCost = salesData.reduce((sum, item) => sum + (item.cost * item.quantity), 0);

                const staffWages = shift.timeLogs.reduce((total, log) => {
                    const employee = employees.find(e => e.id === log.employeeId);
                    if (!employee) return total;

                    const workHours = log.totalWorkMinutes / 60;

                    switch (employee.wageType) {
                        case 'hourly':
                            return total + (workHours * employee.wage);
                        case 'daily':
                            return total + employee.wage;
                        case 'monthly':
                            return total + (employee.wage / 30);
                        default:
                            return total;
                    }
                }, 0);

                const profit = totalSales - totalCost - staffWages;

                get().endShift(shiftId);

                return {
                    totalSales,
                    totalCost,
                    profit,
                    staffWages
                };
            },
        }),
        {
            name: 'shift-store',
        }
    )
);

export default useShiftStore;