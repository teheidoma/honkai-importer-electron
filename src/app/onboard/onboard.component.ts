import {Component, OnInit} from '@angular/core';
import {OnboardService} from "../core/services/onboard.service";

@Component({
  selector: 'app-onboard',
  templateUrl: './onboard.component.html',
  styleUrls: ['./onboard.component.css']
})
export class OnboardComponent implements OnInit {
  title = 'Вітаю';
  description = 'триває налаштування';

  constructor(private onboardService: OnboardService) {
  }


  ngOnInit(): void {
    setTimeout(() => {
      this.title = 'eee';
      this.onboardService.startOnboard(this)
    }, 2000)
  }

  tryAgain() {
    this.onboardService.startUpload(this, localStorage.getItem('path')!)
  }
}
