import {EventEmitter, Injectable} from '@angular/core';
import {ElectronService} from "./electron/electron.service";
import {EMPTY, Observable, of, tap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {APP_CONFIG} from "../../../environments/environment";
import axios from "axios";
import * as FormData2 from "form-data";
import {Pull} from "../model/pull";
import {TimeRange} from "../model/timeRange";
import {Banner} from "../model/banner";
import {Banners} from "../../shared/banners";
import {Assets} from "../../shared/assets";
import {Asset} from "../model/asset";


@Injectable({
  providedIn: 'root'
})
export class HonkaiService {
  public statusEvent: EventEmitter<any> = new EventEmitter()
  public updatedEvent: EventEmitter<any> = new EventEmitter()

  constructor(private electronService: ElectronService,
              private httpClient: HttpClient) {
    if (this.electronService.isElectron) {
      this.electronService.ipcRenderer.on('honkai-status', (event, data) => {
        this.statusEvent.next(data)
      })
    }
  }

  uploadFile(path: string): Observable<any> {
    return new Observable<string>((subscriber) => {
      this.electronService.ipcRenderer.send('upload', path)
      this.electronService.ipcRenderer.on('upload', (response, result) => {
        subscriber.next(result.data)
        if (result.success && result.data.success) {
          localStorage.setItem('secret', result.data.secret)
          localStorage.setItem('uid', result.data.uid)
          localStorage.setItem('updated_at', new Date().getTime().toString())
        } else {
          subscriber.error(result)
        }
        subscriber.complete()
        this.updatedEvent.next('')
      })
    });
  }

  getPulls(forceUpdate: boolean = false): Observable<Pull[]> {
    let cached = localStorage.getItem('pulls');
    if (cached) {
      return of(JSON.parse(localStorage.getItem('pulls')!))
    }
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

  getAssetById(id: number): Asset | undefined {
    return Assets.assets.find(asset => asset.id == id)
    // return 'https://pbs.twimg.com/media/Fxy5EFWWYAEF5gn?format=jpg&name=small'
  }

  getBannersByType(type: number): Banner[] {
    return Banners.banners.filter(banner => banner.type == type)
  }
}
