import {Component, Input} from '@angular/core';
import {Pull} from '../../../../core/model/pull';
import {Banner} from '../../../../core/model/banner';
import {Utils} from '../../../../shared/utils';
import {HonkaiService} from '../../../../core/services/honkai.service';
import {faStar} from "@fortawesome/free-solid-svg-icons";
import {Banners} from "../../../banners";

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
  faStar = faStar;

  constructor(private honkaiService: HonkaiService) {
  }

  filteredPulls() {
    let pulls = [];
    if (this.banner) {
      pulls = this.pulls.filter(pull => pull.gacha_id === this.banner?.id);
    } else {
      if (this.banners.length > 0) {
        pulls = this.pulls.filter(pull => pull.gacha_type === this.banners[0].type);
      } else {
        pulls = this.pulls;
      }
    }
    return pulls.filter(p => p.rank_type === 5);
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

  isGuaranteed(pull: Pull): boolean|null {
    let filtered = this.pulls
      .filter(fpull => fpull.rank_type === 5)
      .filter(fpull => {
        if (this.banner) {
          return fpull.gacha_type === this.banner.type;
        } else {
          if (this.banners.length > 0) {
            return fpull.gacha_type === this.banners[0].type;
          } else {
            return true;
          }
        }
      });

    let index = filtered.indexOf(pull);
    // console.log('pity', filtered);
    // console.log('pity', pull, filtered[index - 1]);
    //TODO
    // console.log('pity', Banners.banners.find(b => b.id === pull.gacha_id)?.legendaryId);

    // return Banners.banners.find(b => b.id === pull.gacha_id)?.legendaryId! === pull.id;
    if (this.banner) {
      return this.banner.id == pull.gacha_id && this.banner.legendaryId == pull.item_id;
    } else if (this.banners.length > 0){
      return this.banners[0].id == pull.gacha_id && this.banners[0].legendaryId == pull.item_id;
    } else {
      return null;
    }
  }
}
