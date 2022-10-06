require('dotenv').config();
const path = require('path');
const os = require('os');
const fs = require('fs');
const resizeImg = require('resize-img');
const { app, BrowserWindow, Menu, ipcMain, shell } = require('electron');

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
                    click: createAboutWindow
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
                    click: createAboutWindow
                }
            ]
        }
    ] : [])
];

let mainWindow;

// Create main window
function createMainWindow() {
    mainWindow = new BrowserWindow({
        title: 'Image Resizer',
        width: isDev ? 1000 : 500,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    // Open dev tools if in dev environment
    if (isDev) {
        mainWindow.webContents.openDevTools();
    }

    // mainWindow.loadURL('https://www.twitter.com'); //Can also load url in the browser window
    mainWindow.loadFile(path.join(__dirname, './renderer/index.html'));
}


// Create About window
function createAboutWindow() {
    const aboutWindow = new BrowserWindow({
        title: 'About Image Resizer',
        width: 300,
        height: 300,
        autoHideMenuBar: true
    });

    // aboutWindow.loadURL('https://www.twitter.com'); //Can also load url in the browser window
    aboutWindow.loadFile(path.join(__dirname, './renderer/about.html'));
}

app.whenReady().then((resolve) => {
    createMainWindow();

    // Implement menu
    const mainMenu = Menu.buildFromTemplate(menu);
    Menu.setApplicationMenu(mainMenu);

    // Remove mainWindow from memory on closed
    mainWindow.on('closed', () => { mainWindow = null });

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow()
        }
    })
}, (reject) => {
    alert('Oops..something went wrong.');
});

// Respond to ipcRenderer event resize
ipcMain.on('image:resize', (event, options) => {
    options.destination = path.join(os.homedir(), 'image-resizer');
    resizeImage(options);
});

// Resize the image passed from ipcRenderer
async function resizeImage({ imgPath, width, height, destination }) {
    try {
        const newPath = await resizeImg(fs.readFileSync(imgPath), {
            width: +width,
            height: +height
        });

        // Specify filename
        const filename = path.basename(imgPath);

        // Create destination folder
        if (!fs.existsSync(destination)) {
            fs.mkdirSync(destination);
        }

        // Write file to destination
        fs.writeFileSync(path.join(destination, filename), newPath);

        // Send success message to renderer
        mainWindow.webContents.send('image:done');

        // Open destination folder
        shell.openPath(destination);
    } catch (error) {
        console.error(error);
    }
}

app.on('window-all-closed', () => {
    if (!isMac) {
        app.quit();
    }
});