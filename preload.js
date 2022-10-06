const os = require('os');
const path = require('path');
const { contextBridge } = require('electron')

// Expose which items we want to be available in renderer process (a.k.a. in frontend side)

contextBridge.exposeInMainWorld('os', {
    homeDir: () => os.homedir()
})

contextBridge.exposeInMainWorld('path', {
    join: (...args) => path.join(...args)
})