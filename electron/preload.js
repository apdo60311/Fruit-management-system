import { contextBridge, ipcRenderer } from "electron";

// Expose protected methods that allow the renderer process to use
// specific electron APIs without exposing the entire object
contextBridge.exposeInMainWorld("electronAPI", {
  // App information
  getAppVersion: () => ipcRenderer.invoke("app:getVersion"),

  // Data store operations
  getData: (key) => ipcRenderer.invoke("store:getData", key),

  // Authentication
  checkAuth: (token) => ipcRenderer.invoke("auth:check", token),

  // Branch management
  getBranchStatus: (branchId) =>
    ipcRenderer.invoke("branch:getStatus", branchId),

  // Inventory operations
  getInventory: (branchId) => ipcRenderer.invoke("inventory:getAll", branchId),
  updateStock: (item) => ipcRenderer.invoke("inventory:update", item),

  // Financial operations
  getFinancialData: (branchId, period) =>
    ipcRenderer.invoke("finance:getData", branchId, period),
  recordTransaction: (data) =>
    ipcRenderer.invoke("finance:recordTransaction", data),

  // Shift management
  clockIn: (employeeId, branchId) =>
    ipcRenderer.invoke("shift:clockIn", employeeId, branchId),
  clockOut: (employeeId, branchId) =>
    ipcRenderer.invoke("shift:clockOut", employeeId, branchId),

  // Suppliers
  getSuppliers: () => ipcRenderer.invoke("suppliers:getAll"),
  createOrder: (orderData) =>
    ipcRenderer.invoke("suppliers:createOrder", orderData),

  // System
  syncData: () => ipcRenderer.invoke("system:sync"),
  backup: () => ipcRenderer.invoke("system:backup"),
});
