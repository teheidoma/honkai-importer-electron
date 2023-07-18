import {EventEmitter, Injectable} from '@angular/core';
import {ElectronService} from './electron/electron.service';
import {catchError, EMPTY, Observable, of, tap} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {APP_CONFIG} from '../../../environments/environment';
import {Pull} from '../model/pull';
import {TimeRange} from '../model/timeRange';
import {Banner} from '../model/banner';
import {Banners} from '../../shared/banners';
import {Assets} from '../../shared/assets';


@Injectable({
  providedIn: 'root'
})
export class HonkaiService {
  public statusEvent: EventEmitter<any> = new EventEmitter();
  public updatedEvent: EventEmitter<any> = new EventEmitter();

  constructor(private electronService: ElectronService,
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
    return new Observable<string>((subscriber) => {
      this.electronService.ipcRenderer.send('upload', path);
      this.electronService.ipcRenderer.on('upload', (response, result) => {
        subscriber.next(result.data);
        if (result.success && result.data.success) {
          localStorage.setItem('secret', result.data.secret);
          localStorage.setItem('uid', result.data.uid);
          localStorage.setItem('updated_at', new Date().getTime().toString());
        } else {
          subscriber.error(result);
        }
        subscriber.complete();
        this.updatedEvent.next('');
      });
    });
  }

  sendTime(data: any): Observable<any> {
    return this.httpClient.post(APP_CONFIG.apiUrl + `/time?secret=${localStorage.getItem('secret')}&from=${data.from}&to=${data.to}`, '');
  }

  getPulls(forceUpdate: boolean = false, source: string = ''): Observable<Pull[]> {
    console.log('pulling', source);
    const cached = localStorage.getItem('pulls');
    if (!forceUpdate && cached && cached !== '[]') {
      return of(JSON.parse(localStorage.getItem('pulls')!));
    }
    const secret = localStorage.getItem('secret');
    console.log(secret + 'ds');
    if (secret != null) {
      return this.httpClient.get<Pull[]>(APP_CONFIG.apiUrl + '/pulls/all?secret=' + secret)
        .pipe(
          tap(pulls => {
            localStorage.setItem('pulls', JSON.stringify(pulls));
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
    const secret = localStorage.getItem('secret');
    return this.httpClient.get<TimeRange[]>(APP_CONFIG.apiUrl + '/time?secret=' + secret)
      .pipe(tap(ranges => {
        localStorage.setItem('ranges', JSON.stringify(ranges));
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
    return 'http://teheidoma.com:9000/assets/banner/'+pull.gacha_id+'.webp';
  }

  getBannersByType(type: number): Banner[] {
    return Banners.banners.filter(banner => banner.type === type);
  }

  refreshTime() {
    return this.electronService.ipcRenderer.send('honkai-status');
  }
}
