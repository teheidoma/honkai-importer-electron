import {EventEmitter, Injectable} from '@angular/core';
import {ElectronService} from './electron/electron.service';
import {catchError, EMPTY, from, Observable, of, tap, map} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {APP_CONFIG} from '../../../environments/environment';
import {Pull} from '../model/pull';
import {TimeRange} from '../model/timeRange';
import {Banner} from '../model/banner';
import {Banners} from '../../shared/banners';
import {Assets} from '../../shared/assets';
import {StoreService} from "./store.service";


@Injectable({
  providedIn: 'root'
})
export class HonkaiService {
  public statusEvent: EventEmitter<any> = new EventEmitter();
  public updatedEvent: EventEmitter<any> = new EventEmitter();

  constructor(private electronService: ElectronService,
              private storeService: StoreService,
              private httpClient: HttpClient) {
    if (this.electronService.isElectron) {
      this.electronService.ipcRenderer.send('honkai-status');
      this.electronService.ipcRenderer.on('honkai-status', (event, data) => {
        this.statusEvent.next(data);
        if (data.event === 'stopped') {
          this.sendTime(data).subscribe(resp => {
            console.log(resp);
          });
        }
      });
    }
  }

  uploadFile(path: string): Observable<any> {
    return from(this.electronService.ipcRenderer.invoke('upload', path))
      .pipe(tap(e=>{
        console.log('eee', e)
      }));
    // return new Observable<string>((subscriber) => {
    //   console.log('start upload reslt')
    //   const result = this.electronService.ipcRenderer.invoke('upload', path);
    //   console.log('got upload result', result)
    //   if (result.success && result.data.success) {
    //
    //     subscriber.next(result.data);
    //   } else {
    //     subscriber.error(result);
    //   }
    //   subscriber.complete();
    //   this.updatedEvent.next('');
    // });
  }

  sendTime(data: any): Observable<any> {
    return this.httpClient.post(APP_CONFIG.apiUrl + `/time?secret=${this.storeService.getValue('secret')}&from=${data.from}&to=${data.to}`, '');
  }

  getPulls(forceUpdate: boolean = false, source: string = ''): Observable<Pull[]> {
    console.log('pulling', source);
    const cached = this.storeService.getValue('pulls');
    if (!forceUpdate && cached && cached !== '[]') {
      return of(JSON.parse(this.storeService.getValue('pulls')!));
    }
    const secret = this.storeService.getValue('secret');
    console.log(secret + 'ds');
    if (secret != null) {
      return this.httpClient.get<Pull[]>(APP_CONFIG.apiUrl + '/pulls/all?secret=' + secret)
        .pipe(
          tap(pulls => {
            this.storeService.setValue('pulls', JSON.stringify(pulls));
          }),
          catchError((err, o) => {
            console.log(err);
            return EMPTY;
          }));
    } else {
      return EMPTY;
    }
  }

  getTime(): Observable<TimeRange[]> {
    const secret = this.storeService.getValue('secret');
    return this.httpClient.get<TimeRange[]>(APP_CONFIG.apiUrl + '/time?secret=' + secret)
      .pipe(tap(ranges => {
        this.storeService.setValue('ranges', JSON.stringify(ranges));
      }));
  }

  getAssetById(id: number | string, icon = false): string {
    if (typeof id == 'string') {
      return `http://teheidoma.com:9000/assets/${id}-${icon ? 'miniiconpath' : 'splashiconpath'}.png`;
    }
    if (Assets.charAliases.has(id)) {
      return `http://teheidoma.com:9000/assets/${Assets.charAliases.get(id)}-${icon ? 'miniiconpath' : 'splashiconpath'}.png`;
    } else {
      return 'http://teheidoma.com:9000/assets/' + id + '-iconpath.png';
    }

    // return 'https://pbs.twimg.com/media/Fxy5EFWWYAEF5gn?format=jpg&name=small'
  }

  fetchBannerIcon(pull: Pull) {
    return 'http://teheidoma.com:9000/assets/banner/' + pull.gacha_id + '.webp';
  }

  getBannersByType(type: number): Banner[] {
    return Banners.banners.filter(banner => banner.type === type);
  }

  refreshTime() {
    return this.electronService.ipcRenderer.send('honkai-status');
  }
}
