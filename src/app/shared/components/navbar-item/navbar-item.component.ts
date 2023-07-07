import {Component, Input} from '@angular/core';
import {Pull} from "../../../core/model/pull";
import {Banner} from "../../../core/model/banner";

@Component({
  selector: 'app-navbar-item',
  templateUrl: './navbar-item.component.html',
  styleUrls: ['./navbar-item.component.scss']
})
export class NavbarItemComponent {
  @Input()
  pulls: Pull[] = [];
  @Input()
  banners: Banner[] = [];


  countPullsByRank(rank: number) {
    return this.pulls.filter(pull => pull.rank_type == rank).length
  }

  getRankRatio(rank: number) {
    return (this.pulls.filter(pull => pull.rank_type == rank).length / this.pulls.length * 100).toFixed(1);
  }

  getLastBannerName(banners: Banner[]) {
    return banners.sort((a, b) => b.id - a.id)[0].name;
  }
}
