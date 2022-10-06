const path = require('path');
const { app, BrowserWindow } = require('electron');

function createMainWindow() {
    const mainWindow = new BrowserWindow({
        title: 'Image Resizer',
        width: 500,
        height: 600
    });

    // mainWindow.loadURL('https://www.twitter.com'); //Can also load url in the browser window
    mainWindow.loadFile(path.join(__dirname, './renderer/index.html'));
}

app.whenReady().then((resolve) => {
    createMainWindow();
}, (reject) => {
    alert('Oops..something went wrong.');
});