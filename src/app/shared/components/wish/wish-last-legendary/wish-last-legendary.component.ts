import {Component, Input} from '@angular/core';
import {Pull} from "../../../../core/model/pull";
import {Banner} from "../../../../core/model/banner";
import {Utils} from "../../../../shared/utils";

@Component({
  selector: 'app-wish-last-legendary',
  templateUrl: './wish-last-legendary.component.html',
  styleUrls: ['./wish-last-legendary.component.scss']
})
export class WishLastLegendaryComponent {
  @Input()
  pulls: Pull[] = [];
  @Input()
  banner: Banner | undefined;


  filteredPulls() {
    let bannerPulls = this.pulls.filter(pull => pull.gacha_id == this.banner?.id);
    return bannerPulls
      // .filter(pull => pull.pull.rank_type == 5)
  }

  getPityFrom(i: number) {
    return Utils.lastPityFrom(this.filteredPulls(), 5, i)
  }

  redGradiate(pityFrom: number) {
    return Utils.redGradiate(pityFrom)
  }
}
