import {Injectable, NgZone} from '@angular/core';
import {ElectronService} from "./electron/electron.service";
import {HonkaiService} from "./honkai.service";
import {Router} from "@angular/router";
import {catchError, Observable, throwError} from "rxjs";
import {OnboardComponent} from "../../onboard/onboard.component";
import {on} from "form-data";

@Injectable({
  providedIn: 'root'
})
export class OnboardService {

  constructor(private electronService: ElectronService,
              private honkaiService: HonkaiService,
              private router: Router,
              private ngZone: NgZone) {
  }

  startOnboard(onboardComponent: OnboardComponent) {
    this.electronService.ipcRenderer.send('onboard', 'registry')
    this.electronService.ipcRenderer.on('onboard', (event, args) => {
      console.log(event, args);
      if (args.type == 'registry') {
        if (args.success) {
          localStorage.setItem('path', args.path)
          this.startUpload(onboardComponent, args.path)
        } else {
          this.electronService.ipcRenderer.send('onboard', 'dialog')
        }
      } else if (args.type == 'dialog')
        if (args.success) {
          localStorage.setItem('path', args.path)
          this.startUpload(onboardComponent, args.path)
        } else {
          console.log("erorr")
        }
    });
  }

  startUpload(onboardComponent: OnboardComponent, args: string) {
    this.honkaiService.uploadFile(args)
      .subscribe(response => {
        if (response.success) {
          this.router.navigate(['/'])
        } else {
          this.ngZone.run(() => {
            onboardComponent.title = 'виникла помилка'
            onboardComponent.description = 'будь-ласка ввімкніть історію ролів та спробуйте ще раз'
          })
          // this.startUpload(onboardComponent, args)
        }
      })

  }
}
