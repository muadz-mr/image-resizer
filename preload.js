const os = require('os');
const path = require('path');
const Toastify = require('toastify-js');
const { contextBridge, ipcRenderer } = require('electron')

// Expose which items we want to be available in renderer process (a.k.a. in frontend side)

contextBridge.exposeInMainWorld('os', {
    homeDir: () => os.homedir()
});

contextBridge.exposeInMainWorld('path', {
    join: (...args) => path.join(...args)
});

contextBridge.exposeInMainWorld('Toastify', {
    toast: (options) => Toastify(options).showToast()
});

contextBridge.exposeInMainWorld('preloadIpcRenderer', {
    send: (channel, data) => ipcRenderer.send(channel, data),
    on: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args))
});