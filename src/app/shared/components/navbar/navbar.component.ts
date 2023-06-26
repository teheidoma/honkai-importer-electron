import {Component} from '@angular/core';
import {Pull} from '../../../core/model/pull';
import {HonkaiService} from '../../../core/services/honkai.service';
import {Banner} from '../../../core/model/banner';
import {Observable, map} from "rxjs";
import {faEarthEurope} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  faEarthEurope = faEarthEurope;

  constructor(private honkaiService: HonkaiService) {
  }

  getPullForGachaType(number: number): Observable<Pull[]> {
    return this.honkaiService.getPulls()
      .pipe(map(pulls => pulls.filter((pull: Pull) => pull.gacha_type === number)));
  }

  getBannerForGachaType(type: number): Banner[] {
    return this.honkaiService.getBannersByType(type);
  }
}
