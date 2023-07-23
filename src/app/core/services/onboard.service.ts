import {Injectable, NgZone} from '@angular/core';
import {ElectronService} from './electron/electron.service';
import {HonkaiService} from './honkai.service';
import {Router} from '@angular/router';
import {catchError, Observable, switchMap, throwError, map} from 'rxjs';
import {OnboardComponent} from '../../onboard/onboard.component';
import {OnboardStatus} from '../../shared/status';
import {StoreService} from "./store.service";

@Injectable({
  providedIn: 'root'
})
export class OnboardService {

  constructor(private electronService: ElectronService,
              private honkaiService: HonkaiService,
              private storeService: StoreService,
              private ngZone: NgZone) {
  }

  startOnboard(onboardComponent: OnboardComponent): Observable<any> {
    return this.getPath()
      .pipe(
        switchMap(path => this.startUpload(onboardComponent, path))
      );
  }

  private getPath(): Observable<string> {
    return new Observable<string>(subscriber => {
      const args = this.electronService.ipcRenderer.sendSync('onboard', 'registry');
      console.log(args);
      if (args.type === 'registry') {
        if (!args.success) {
          console.log('getPath error', args);
          //TODO
          // this.electronService.ipcRenderer.send('onboard', 'dialog');
        }
      } else if (args.type === 'dialog') {
        if (!args.success) {
          console.log('getPath error', args);
        }
      }
      this.storeService.setValue('path', args.path);
      subscriber.next(args.path);
      subscriber.complete();
    });
  }

  startUpload(onboardComponent: OnboardComponent, args: string): Observable<any> {
    console.log('upload');
    return this.honkaiService.uploadFile(args);
  }
}
