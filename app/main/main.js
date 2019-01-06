const path = require('path')
const { app, BrowserWindow } = require('electron');

const watch = '/Users/alex/projects/docker-logui/app/window/dist'
const electronPath = __dirname + '/../../node_modules/.bin/electron'

require('electron-reload')(watch, {
  electron: electronPath
})

let window;
function createWindow() {
  const windowOptions = {
    title: 'Docker Log Viewer',
    width: 800,
    height: 600,
    x: 10,
    y: 10,

    webPreferences: {
      nodeIntegration: true
    },
    // frame: false,
    titleBarStyle: 'hiddenInset',
    icon: 'assets/icon.icns'
  };
  window = new BrowserWindow(windowOptions);
  window.loadFile('app/window/dist/index.html');
  window.webContents.openDevTools({ mode: 'bottom' });

  window.on('closed', () => {
    window = null;
  });
}

app.on('ready', createWindow);

// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') {
//     app.quit()
//   }
// })

// app.on('activate', () => {
//   if (window === null) {
//     createWindow()
//   }
// })
