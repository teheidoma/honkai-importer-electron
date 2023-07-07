import {Component, OnInit} from '@angular/core';
import {Pull} from '../../../core/model/pull';
import {HonkaiService} from '../../../core/services/honkai.service';
import {Banner} from '../../../core/model/banner';
import {Observable, map} from 'rxjs';
import {faEarthEurope, faClock} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  faEarthEurope = faEarthEurope;
  faClock = faClock;
  pulls: Pull[] = [];

  constructor(private honkaiService: HonkaiService) {
  }

  ngOnInit(): void {
    this.honkaiService.getPulls(false, 'navbar').subscribe(pulls => this.pulls = pulls);
  }


  getPullForGachaType(number: number): Pull[] {
    return this.pulls.filter((pull: Pull) => pull.gachaType === number);
    // return this.honkaiService.getPulls(false, 'navbar')
    //   .pipe(map(pulls => pulls.filter((pull: Pull) => pull.gachaType === number)));
  }

  getBannerForGachaType(type: number): Banner[] {
    return this.honkaiService.getBannersByType(type);
  }
}
