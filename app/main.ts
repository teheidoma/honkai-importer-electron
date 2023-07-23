import {app, BrowserWindow, ipcMain, screen, dialog, Tray, Menu, globalShortcut} from 'electron';

import * as path from 'path';
import * as fs from 'fs';
import axios from "axios";
import {exec} from 'child_process';
import * as regedit from 'regedit';
import {HonkaiDetector} from "./honkai-detector";
import {autoUpdater} from "electron-updater"
import store from "./store";


const registryKey = 'HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\Star Rail';
const baseUrl = 'http://teheidoma.com:8085';

let win: BrowserWindow = null;
let isQuiting: boolean;
let tray;
let honkaiDetector = new HonkaiDetector();

const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');

function get_file_by_registry(callback: (result: string | undefined) => void) {
  // callback(undefined)//TODO
  // return;
  regedit.setExternalVBSLocation('resources/regedit/vbs')
  regedit.list([registryKey], (err, keys) => {
    if (err == null) {
      let baseDir = keys[registryKey].values['InstallPath'].value;
      // let path = baseDir + '\\Games\\StarRail_Data\\webCaches\\Cache\\Cache_Data\\data_2'
      if (fs.existsSync(baseDir as string)) {
        callback(baseDir as string)
      } else {
        callback(undefined);
      }
    } else {
      callback(undefined)
    }
  });
}

function get_file_by_dialog(): string | undefined {
  let result = dialog.showOpenDialogSync({
    properties: ['openFile', 'showHiddenFiles'],
    filters: [{
      name: 'launcher',
      extensions: ['exe']
    }]
  });
  if (result != null && result.length == 1) {
    return result[0]!.replace('\\launcher.exe', '')
  }
}

function start_upload(event: Electron.IpcMainInvokeEvent, path: string) {
  console.log("importing data")
  console.log("path is " + path)
  upload(event, path)
  console.log('upload done')
}

function upload(event: Electron.IpcMainInvokeEvent, path: string) {
  path = path + '\\Games\\StarRail_Data\\webCaches\\2.14.0.0\\Cache\\Cache_Data\\data_2'
  fs.createReadStream(path).pipe(fs.createWriteStream("data.temp", {flags: 'w'}));
  return axios.post(baseUrl + '/parse', {
    file: fs.createReadStream(path, {flags: 'r'})
  }, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then((response) => {
    if (response.data.success) {
      return {success: true, data: response.data}
    } else {
      return {success: false, data: response.data}
    }
  });
}


function autorun() {
  regedit.putValue({
    'HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run': {
      HonkaiImporter: {
        value: app.getPath("exe"),
        type: 'REG_SZ'
      }
    }
  }, e => {
    console.log(e)
  })
}

function createWindow(): BrowserWindow {
  autoUpdater.checkForUpdatesAndNotify();
  const size = screen.getPrimaryDisplay().workAreaSize;

  let icoPath = path.join(__dirname, '/img/icon.png');
  console.log(icoPath)
  tray = new Tray(icoPath)
  tray.setContextMenu(Menu.buildFromTemplate(
    [
      {
        label: "restore",
        click: function () {
          win.show();
        }
      },
      {
        label: "quit",
        click: function () {
          isQuiting = true;
          app.quit();
        }
      }
    ]
  ))

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
  win.removeMenu();

  const ret = globalShortcut.register('F11', () => {
    win.webContents.openDevTools()
  })
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
  win.on('close', (event) => {
    console.log("close", isQuiting)
    if (!isQuiting) {
      event.preventDefault();
      win.hide();
      event.returnValue = false;
    }
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
  });
  process.on('exit', () => {
    console.log("exit")
    honkaiDetector.stop()
    app.quit();
  });


  app.on('before-quit', function () {
    console.log("before quit")
    isQuiting = true;
  });


  // win.once('ready-to-show', () => {
  //   autoUpdater.checkForUpdatesAndNotify();
  // });
  ipcMain.on('store:get', (event, key) => {
    let value = store.get(key);
    console.log('get', key, value)
    event.returnValue = value
  })
  ipcMain.on('store:set', (event, data) => {
    console.log('set', data)
    store.set(data.key, data.value)
  })
  ipcMain.on('store:clear', (event, data) => {
    store.clear()
  })
  ipcMain.on('autorun', event => {
    autorun()
  })
  ipcMain.on('issues', event => {
    exec('start https://github.com/teheidoma/honkai-importer-electron/issues/new/choose');
  });
  ipcMain.handle('upload', (event, args) => {
    return upload(event, args)
  })
  ipcMain.on('onboard', (event, args) => {
    console.log('got event electron', event, args)
    switch (args) {
      case 'registry':
        get_file_by_registry((result) => {
          if (result) {
            event.returnValue = {success: true, path: result, type: 'registry'}
          } else {
            event.returnValue = {success: false, type: 'registry'}
          }
        })
        break
      case 'dialog':
        let path = get_file_by_dialog();
        event.returnValue = {success: path != null, path: path, type: 'dialog'}
    }
  })

  honkaiDetector = new HonkaiDetector();
  honkaiDetector.start(win);
  ipcMain.on('honkai-status', (event) => {
    honkaiDetector.getCurrent().subscribe(num => {
      win.webContents.send('honkai-status', {
        'event': num > 0 ? 'started' : 'stopped'
      })
    })
  });

  return win;
}

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.on('ready', () => setTimeout(createWindow, 400));
  app.commandLine.appendSwitch('remote-debugging-port', '9229')

  // Quit when all windows are closed.
  // app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  // if (process.platform !== 'darwin') {
  //   app.quit();
  // }
  // });

  // app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  // if (win === null) {
  //   createWindow();
  // }
  // });

} catch (e) {
  // Catch Error
  // throw e;
}
