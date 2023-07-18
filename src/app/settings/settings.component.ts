import {Component} from '@angular/core';
import {faGear} from "@fortawesome/free-solid-svg-icons";
import {HonkaiService} from "../core/services/honkai.service";
import {ElectronService} from "../core/services";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  path: string;

  constructor(private honkaiService: HonkaiService,
              private electionService: ElectronService) {
    this.path = localStorage.getItem('path')!;
  }

  fullReset() {
    localStorage.clear();
  }


  pullUpdate() {
    localStorage.removeItem('pulls');
    this.honkaiService.getPulls(true, 'settings')
      .subscribe();
  }

  upload() {
    this.honkaiService.uploadFile(localStorage.getItem('path')!)
      .subscribe();
  }

  update(value: string) {
    localStorage.setItem('path', value)
  }

  addToAutoRun() {
    this.electionService.ipcRenderer.send('autorun');
  }
}
