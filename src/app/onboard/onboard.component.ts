import {Component, NgZone, OnInit} from '@angular/core';
import {OnboardService} from '../core/services/onboard.service';
import {StoreService} from "../core/services/store.service";
import {Router} from "@angular/router";
import {HonkaiService} from "../core/services/honkai.service";
import {catchError, interval, map, Observable, of, switchMap, takeUntil, takeWhile, tap, timer} from "rxjs";
import {PullStatus} from "../core/model/pullStatus";

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
              console.log('error onb', err);
              return of({response: false, error: err});
            }
          ),
          map(value => this.saveInfo(value)),
          tap(v => console.log('saved')),
          switchMap(v => this.checkPulls()),
          switchMap(v => this.honkaiService.getPulls())
        )
        .subscribe(r => {
          this.router.navigate(['/']);
        });
    }, 2000);
  }

  tryAgain() {
    this.storeService.clear();
    // localStorage.clear();
    this.ngOnInit();

  }

  private saveInfo(response: any) {
    console.log('saving info', response);
    if (response.success) {
      this.honkaiService.refreshTime();
      this.storeService.setValue('secret', response.data.secret);
      this.storeService.setValue('uid', response.data.uid);
      this.storeService.setValue('updated_at', new Date().getTime().toString());
    } else {
      this.title = 'Something has failed';
      this.description = 'please make sure that you launched a game first and then open pull history';
      console.log("errrrrror ", response.error);
    }
    return response;
  }

  private checkPulls(): Observable<any> {
    console.log('chekc');

    let checkPullsLoop = (done: () => void) => {
      setTimeout(() => {
        this.honkaiService.getPullsStatus().subscribe(status => {
          console.log(status)
          if (status.banners.filter(b => b.done).length < 4) {
            this.ngZone.run(() => {
              this.title = 'importing your pulls';
              const currentBanner = status.banners
                .find(banner => !banner.done);
              if (currentBanner) {
                this.description = currentBanner.gachaType + ' ' + currentBanner.count;
              }
            });
            checkPullsLoop(done);
          } else {
            done();
          }
        });
      }, 300);
    };
    return new Observable(subscriber => {
      checkPullsLoop(() => {
        console.log('pulling', 'done');
        subscriber.next();
        subscriber.complete();
      });
    });
  }
}
