import {Component, Input} from '@angular/core';
import {Pull} from '../../../../core/model/pull';
import {Banner} from '../../../../core/model/banner';
import {Utils} from '../../../../shared/utils';
import {HonkaiService} from '../../../../core/services/honkai.service';

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
  @Input()
  banners: Banner[] = [];

  constructor(private honkaiService: HonkaiService) {
  }

  filteredPulls() {
    let pulls = [];
    if (this.banner) {
      pulls = this.pulls.filter(pull => pull.gacha_id === this.banner?.id);
    } else {
      if (this.banners.length > 0) {
        pulls = this.pulls.filter(pull => pull.gachaType === this.banners[0].type);
      } else {
        pulls = this.pulls;
      }
    }
    return pulls.filter(p => p.rank_type == 5);
  }

  getPityFrom(pull: Pull) {
    return Utils.lastPityFrom(this.pulls, pull);
  }

  redGradiate(pityFrom: number) {
    return Utils.redGradiate(pityFrom);
  }

  getImg(pull: Pull) {
    return this.honkaiService.getAssetById(pull.item_id, true);
  }
}
