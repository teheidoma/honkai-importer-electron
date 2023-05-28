import {EventEmitter, Injectable} from '@angular/core';
import {ElectronService} from "./electron/electron.service";
import {EMPTY, Observable, tap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {APP_CONFIG} from "../../../environments/environment";
import axios from "axios";
import * as FormData2 from "form-data";
import {Pull} from "../model/Pull";
import {TimeRange} from "../model/TimeRange";


@Injectable({
  providedIn: 'root'
})
export class HonkaiService {
  public statusEvent: EventEmitter<any> = new EventEmitter()

  constructor(private electronService: ElectronService,
              private httpClient: HttpClient) {
    if (this.electronService.isElectron) {
      this.electronService.ipcRenderer.on('honkai-status', (event, data) => {
        this.statusEvent.next(data)
      })
    }
  }

  uploadFile(): Observable<string> {
    return new Observable<string>((subscriber) => {
      this.electronService.ipcRenderer.send('upload')
      this.electronService.ipcRenderer.on('upload-reply', (response, data) => {
        subscriber.next(data)
        if (data.success) {
          localStorage.setItem('secret', data.secret)
          localStorage.setItem('uid', data.uid)
        }
        subscriber.complete()
      })
    });
  }

  getPulls(): Observable<Pull[]> {
    let secret = localStorage.getItem('secret');
    if (secret != null) {
      return this.httpClient.get<Pull[]>(APP_CONFIG.apiUrl + '/pulls/all?secret=' + secret)
        .pipe(tap(pulls => {
          localStorage.setItem('pulls', JSON.stringify(pulls))
        }))
    } else {
      return EMPTY;
    }
  }

  getTime(): Observable<TimeRange[]> {
    let secret = localStorage.getItem('secret');
    return this.httpClient.get<TimeRange[]>(APP_CONFIG.apiUrl + "/time?secret=" + secret)
      .pipe(tap(ranges => {
        localStorage.setItem('ranges', JSON.stringify(ranges));
      }))
  }
}
