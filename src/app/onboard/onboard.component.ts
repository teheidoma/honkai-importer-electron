import {Component, NgZone, OnInit} from '@angular/core';
import {OnboardService} from '../core/services/onboard.service';
import {StoreService} from "../core/services/store.service";
import {Router} from "@angular/router";
import {HonkaiService} from "../core/services/honkai.service";
import {catchError, of} from "rxjs";

@Component({
  selector: 'app-onboard',
  templateUrl: './onboard.component.html',
  styleUrls: ['./onboard.component.css']
})
export class OnboardComponent implements OnInit {
  title = 'Hewwo everynyan';
  description = 'd';

  constructor(private onboardService: OnboardService,
              private storeService: StoreService,
              private honkaiService: HonkaiService,
              private router: Router,
              private ngZone: NgZone) {
  }


  ngOnInit(): void {
    setTimeout(() => {
      // this.ngZone.run(() => {
      //   this.title = 'Uploading';
      //   this.description = '👍❤️🍉';
      // });
      this.onboardService.startOnboard(this)
        .pipe(
          catchError(err => {
              console.log(err);
              return of({response: false, error: err});
            }
          )
        )
        .subscribe(response => {
          this.ngZone.run(() => {
            console.log(response)
            if (response.success) {
              this.router.navigate(['/']);
              this.honkaiService.refreshTime();
              this.storeService.setValue('secret', response.data.secret);
              this.storeService.setValue('uid', response.data.uid);
              this.storeService.setValue('updated_at', new Date().getTime().toString());
            } else {
              this.title = 'Something has failed';
              this.description = 'please make sure that you launched a game first and then open pull history';
              console.log("errrrrror ", response.error)
            }
          })
        });
    }, 2000);
  }

  tryAgain() {
    this.storeService.clear()
    // localStorage.clear();
    this.ngOnInit();
    // this.onboardService.startUpload(this, localStorage.getItem('path')!)
  }
}
