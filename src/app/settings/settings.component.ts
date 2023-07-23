import {Component} from '@angular/core';
import {faGear} from "@fortawesome/free-solid-svg-icons";
import {HonkaiService} from "../core/services/honkai.service";
import {ElectronService} from "../core/services";
import {StoreService} from "../core/services/store.service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  path: string;

  constructor(private honkaiService: HonkaiService,
              private electionService: ElectronService,
              private storeService: StoreService) {
    this.path = storeService.getValue('path');
  }

  fullReset() {
    // localStorage.clear();
    this.storeService.clear()
  }


  pullUpdate() {
    this.storeService.setValue('pulls', null);
    this.honkaiService.getPulls(true, 'settings')
      .subscribe();
  }

  upload() {
    this.honkaiService.uploadFile(this.storeService.getValue('path'))
      .subscribe();
  }

  update(value: string) {
    this.storeService.setValue('path', value);
  }

  openIssues() {
    this.electionService.ipcRenderer.send('issues');
  }

  addToAutoRun() {
    this.electionService.ipcRenderer.send('autorun');
  }
}
