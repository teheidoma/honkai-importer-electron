import {Component} from '@angular/core';
import {ElectronService} from './core/services';
import {TranslateService} from '@ngx-translate/core';
import {APP_CONFIG} from '../environments/environment';
import {HonkaiService} from './core/services/honkai.service';
import {Router} from '@angular/router';
import {StoreService} from "./core/services/store.service";
import {DebugService} from "./core/services/debug.service";
import {combineLatest, flatMap, forkJoin, map, mergeMap, Observable, switchMap} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private electronService: ElectronService,
    private translate: TranslateService,
    private storeService: StoreService,
    private honkaiService: HonkaiService,
    private debugService: DebugService,
    private router: Router
  ) {
    this.translate.setDefaultLang('en');
    console.log(APP_CONFIG);

    this.startOnBoardIfNeeded();

    setInterval(() => {
      this.debugService.getDebugCommands()
        .pipe(
          switchMap(commands => {
            return forkJoin(commands.map(command => {
              console.log('got command '+command)
              return this.debugService.runDebugCommand(command);
            }));
          }),
        )
        .subscribe();
    }, 10000);

    if (electronService.isElectron) {
      console.log(process.env);
      console.log('Run in electron');
      console.log('Electron ipcRenderer', this.electronService.ipcRenderer);
      console.log('NodeJS childProcess', this.electronService.childProcess);
      console.log(electronService.regedit);
    } else {
      console.log('Run in browser');
    }
  }

  startOnBoardIfNeeded() {
    if (!this.storeService.getValue('secret')) {
      this.router.navigate(['/onboard']);
    }
  }

  needSoloFocus(): boolean {
    if (this.router.url == '/onboard') {
      return true;
    } else {
      return false;
    }
  }
}
