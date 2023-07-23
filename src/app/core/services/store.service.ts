import {Injectable} from '@angular/core';
import {ElectronService} from "./electron/electron.service";

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor(private electronService: ElectronService) {
  }


  getValue(key: string) {
    var start = new Date().getTime();

    let value = this.electronService.ipcRenderer.sendSync('store:get', key);
    var end = new Date().getTime();
    var time = end - start;
    console.log('get', time)
    return value;
  }

  setValue(key: string, value: string|null) {
    console.log('store')
    this.electronService.ipcRenderer.send('store:set', {key, value});
    console.log('storedone')
  }

  clear() {
    this.electronService.ipcRenderer.send('store:clear');
  }
}
