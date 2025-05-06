/// <reference types="vite/client" />

interface Window {
  electronAPI?: {
    getAppVersion: () => Promise<string>;
    getData: (key: string) => Promise<any>;
    checkAuth: (token?: string) => Promise<{authenticated: boolean, username?: string}>;
    getBranchStatus: (branchId: string) => Promise<any>;
    getInventory: (branchId: string) => Promise<any>;
    updateStock: (item: any) => Promise<any>;
    getFinancialData: (branchId: string, period: string) => Promise<any>;
    recordTransaction: (data: any) => Promise<any>;
    clockIn: (employeeId: string, branchId: string) => Promise<any>;
    clockOut: (employeeId: string, branchId: string) => Promise<any>;
    getSuppliers: () => Promise<any>;
    createOrder: (orderData: any) => Promise<any>;
    syncData: () => Promise<any>;
    backup: () => Promise<any>;
  };
}