import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Pull} from '../../../core/model/pull';
import {HonkaiService} from '../../../core/services/honkai.service';
import {Banner} from '../../../core/model/banner';
import {faClock, faEarthEurope, faGear} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  faEarthEurope = faEarthEurope;
  faClock = faClock;
  faGear = faGear;
  pulls: Pull[] = [];

  constructor(private honkaiService: HonkaiService,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.honkaiService.getPulls(true, 'navbar')
      .subscribe(pulls => {
        console.log("navbar init")
        this.pulls = pulls;
        this.changeDetectorRef.detectChanges();
      });
  }


  getPullForgacha_type(gacha_type: number): Pull[] {
    return this.pulls.filter((pull: Pull) => pull.gacha_type === gacha_type);
  }

  getBannerForgacha_type(type: number): Banner[] {
    return this.honkaiService.getBannersByType(type);
  }
}
