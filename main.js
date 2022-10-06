const path = require('path');
const { app, BrowserWindow, Menu } = require('electron');

const isDev = process.env.NODE_ENV !== 'production';
const isMac = process.platform === 'darwin';

// Menu template
const menu = [
    ...(isMac ? [
        {
            label: app.name,
            submenu: [
                {
                    label: 'About',
                }
            ]
        }
    ] : []),
    // {
    //     label: 'File',
    //     submenu: [
    //         {
    //             label: 'Quit',
    //             click: () => app.quit(),
    //             accelerator: 'CmdOrCtrl+W'
    //         }
    //     ]
    // }
    {
        role: 'fileMenu'    // shortcut to above menu template for File
    },
    ...(!isMac ? [
        {
            label: 'Help',
            submenu: [
                {
                    label: 'About',
                }
            ]
        }
    ] : [])
];

// Create main window
function createMainWindow() {
    const mainWindow = new BrowserWindow({
        title: 'Image Resizer',
        width: isDev ? 1000 : 500,
        height: 600
    });

    // Open dev tools if in dev environment
    if (isDev) {
        mainWindow.webContents.openDevTools();
    }

    // mainWindow.loadURL('https://www.twitter.com'); //Can also load url in the browser window
    mainWindow.loadFile(path.join(__dirname, './renderer/index.html'));
}

app.whenReady().then((resolve) => {
    createMainWindow();

    // Implement menu
    const mainMenu = Menu.buildFromTemplate(menu);
    Menu.setApplicationMenu(mainMenu);

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow()
        }
    })
}, (reject) => {
    alert('Oops..something went wrong.');
});

app.on('window-all-closed', () => {
    if (!isMac) {
        app.quit()
    }
})