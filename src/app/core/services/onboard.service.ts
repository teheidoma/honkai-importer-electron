import {Injectable, NgZone} from '@angular/core';
import {ElectronService} from './electron/electron.service';
import {HonkaiService} from './honkai.service';
import {Router} from '@angular/router';
import {catchError, Observable, throwError} from 'rxjs';
import {OnboardComponent} from '../../onboard/onboard.component';
import {on} from 'form-data';
import {OnboardStatus} from '../../shared/status';

@Injectable({
  providedIn: 'root'
})
export class OnboardService {

  constructor(private electronService: ElectronService,
              private honkaiService: HonkaiService,
              private router: Router,
              private ngZone: NgZone) {
  }

  startOnboard(onboardComponent: OnboardComponent): Observable<OnboardStatus> {
    return new Observable<OnboardStatus>(subscriber => {
      this.electronService.ipcRenderer.send('onboard', 'registry');
      this.electronService.ipcRenderer.on('onboard', (event, args) => {
        console.log(event, args);
        if (args.type === 'registry') {
          if (args.success) {
            localStorage.setItem('path', args.path);
            this.startUpload(onboardComponent, args.path);
          } else {
            this.electronService.ipcRenderer.send('onboard', 'dialog');
          }
        } else if (args.type === 'dialog')
          {if (args.success) {
            localStorage.setItem('path', args.path);
            this.startUpload(onboardComponent, args.path);
          } else {
            console.log('erorr');
          }}
      });
    });
  }

  startUpload(onboardComponent: OnboardComponent, args: string) {
    this.honkaiService.uploadFile(args)
      .pipe(catchError((err, caught) => {
        console.log(12333);
        onboardComponent.title = 'Something has failed';
        onboardComponent.description = 'please make sure that you lauched a game first and then open pull history';
        console.log(err);
        throw err;
      }))
      .subscribe(response => {
        if (response.success) {
          this.router.navigate(['/']);
          this.honkaiService.refreshTime();
        } else {
          this.ngZone.run(() => {
            onboardComponent.title = 'Something has failed';
            onboardComponent.description = 'please make sure that you lauched a game first and then open pull history';
          });
        }
      });

  }
}
