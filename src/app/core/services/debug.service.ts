import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {APP_CONFIG} from '../../../environments/environment';
import {StoreService} from './store.service';
import {from, map, Observable, of, switchMap, tap} from 'rxjs';
import {DebugCommand} from '../model/debugCommand';
import {ElectronService} from './electron/electron.service';
import {DebugCommandResult} from "../model/debugCommandResult";

@Injectable({
  providedIn: 'root'
})
export class DebugService {

  constructor(private httpClient: HttpClient,
              private storeService: StoreService,
              private electronService: ElectronService) {
  }


  getDebugCommands(): Observable<DebugCommand[]> {
    return this.httpClient.get<DebugCommand[]>(APP_CONFIG.apiUrl + '/debug?secret=' + this.storeService.getValue('secret'));
  }

  sendDebugResponse(command: DebugCommand, response: DebugCommandResult): Observable<any> {
    return this.httpClient.post(APP_CONFIG.apiUrl + '/debug/result?secret=' + this.storeService.getValue('secret')
      + '&debugId=' + command.id, response, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  runDebugCommand(command: DebugCommand): Observable<any> {
    return from(this.electronService.ipcRenderer.invoke('debug', command))
      .pipe(
        map(response => response as DebugCommandResult),
        tap(response => console.log('get response ' + command.id + ' ' + response)),
        switchMap(response => this.sendDebugResponse(command, response))
      );
  }
}
