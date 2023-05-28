import {app, BrowserWindow, ipcMain, screen} from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import axios from "axios";
import * as regedit from 'regedit';
// import {APP_CONFIG} from "../src/environments/environment";
import {exec} from "child_process";
const registryKey = 'HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\Star Rail';

let win: BrowserWindow = null;
const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');

function upload(event: Electron.IpcMainEvent) {
  console.log("importing data")
  regedit.setExternalVBSLocation('resources/regedit/vbs')
  regedit.list([registryKey], (err, keys) => {
    if (err == null) {
      let baseDir = keys[registryKey].values['InstallPath'].value;
      let path = baseDir + '\\Games\\StarRail_Data\\webCaches\\Cache\\Cache_Data\\data_2'
      fs.createReadStream(path).pipe(fs.createWriteStream("data.temp", {flags: 'a'}));
      axios.post('http://teheidoma.com:8085' + '/parse', {
        file: fs.createReadStream(path, {flags: 'r'})
      }, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then((response) => {
        event.reply('upload-reply', response.data)
      });
    } else {
      console.log(err)
    }
  });
}

function countOccurrences(str: string, value: string) {
  const regExp = new RegExp(value, "gi");
  return (str.match(regExp) || []).length;
}

function createWindow(): BrowserWindow {

  const size = screen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: (serve),
      contextIsolation: false,  // false if you want to run e2e test with Spectron
    },
  });

  if (serve) {
    const debug = require('electron-debug');
    debug();

    require('electron-reloader')(module);
    win.loadURL('http://localhost:4200');
  } else {
    // Path when running electron executable
    let pathIndex = './index.html';

    if (fs.existsSync(path.join(__dirname, '../dist/index.html'))) {
      // Path when running electron in local folder
      pathIndex = '../dist/index.html';
    }

    const url = new URL(path.join('file:', __dirname, pathIndex));
    win.loadURL(url.href);
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  ipcMain.on('upload', (event) => {
    upload(event)
  })
  let count = 0, lastCount = 0, startedAt = new Date(0)
  setInterval(() => {
    exec('tasklist', (error, stdout, stderr) => {

      count = countOccurrences(stdout, 'StarRail.exe')
      if (count > lastCount) {
        win.webContents.send('honkai-status', {
          'event': 'started',
        })
        console.log(`started`)
        startedAt = new Date()
      } else if (count < lastCount) {
        win.webContents.send('honkai-status', {
          'event': 'stopped',
          'from': startedAt.getTime(),
          'to': new Date().getTime()
        })
        console.log(`stopped`)
        startedAt = new Date(0)
      }
      lastCount = count
    });
  }, 5000)

  return win;
}

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.on('ready', () => setTimeout(createWindow, 400));

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}
