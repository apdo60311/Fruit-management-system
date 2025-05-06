import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import isDev from "electron-is-dev";
import { fileURLToPath } from "url";

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Keep a global reference of the window object to prevent it from being garbage collected
let mainWindow;

async function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
    show: false,
    titleBarStyle: "hidden",
  });

  // Load the app
  if (isDev) {
    await mainWindow.loadURL("http://localhost:5173");
    // Open DevTools in development mode
    mainWindow.webContents.openDevTools();
  } else {
    await mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }

  // Show window when content is loaded to prevent flashing
  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });

  // Emitted when the window is closed
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// Create window when Electron is ready
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS re-create window when the dock icon is clicked
  if (mainWindow === null) {
    createWindow();
  }
});

// Handle IPC messages from renderer
ipcMain.handle("app:getVersion", () => {
  return app.getVersion();
});

// Example of secure data storage
ipcMain.handle("store:getData", (event, key) => {
  // In a real app, you would implement secure data retrieval here
  return { success: true, data: `Data for ${key}` };
});

// Example of authentication check
ipcMain.handle("auth:check", (event, token) => {
  // In a real app, you would verify the authentication token
  return { authenticated: true, username: "Store Manager" };
});
