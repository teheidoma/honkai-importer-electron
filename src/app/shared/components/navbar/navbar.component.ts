import { Component } from '@angular/core';
import { Pull } from '../../../core/model/pull';
import {HonkaiService} from "../../../core/services/honkai.service";
import {Banner} from "../../../core/model/banner";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  constructor(private honkaiService: HonkaiService) {
  }
  getPullForGachaType(number: number) {
    let pulls = JSON.parse(localStorage.getItem("pulls")!);
    return pulls.filter((pull: Pull) => pull.gacha_type == number);
  }

  getBannerForGachaType(type: number) : Banner[] {
    console.log(this.honkaiService.getBannersByType(type))
    return this.honkaiService.getBannersByType(type)
  }
}
