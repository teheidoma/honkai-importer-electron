import {Component, OnInit} from '@angular/core';
import {OnboardService} from '../core/services/onboard.service';

@Component({
  selector: 'app-onboard',
  templateUrl: './onboard.component.html',
  styleUrls: ['./onboard.component.css']
})
export class OnboardComponent implements OnInit {
  title = 'Hewwo everynyan';
  description = 'd';

  constructor(private onboardService: OnboardService) {
  }


  ngOnInit(): void {
    setTimeout(() => {
      this.title = 'Uploading';
      this.description = '👍❤️🍉';
      this.onboardService.startOnboard(this).subscribe();
    }, 2000);
  }

  tryAgain() {
    localStorage.clear();
    this.ngOnInit();
    // this.onboardService.startUpload(this, localStorage.getItem('path')!)
  }
}
