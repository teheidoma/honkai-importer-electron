import {Component, Input} from '@angular/core';
import {Pull} from '../../../../core/model/pull';
import {formatDate} from '@angular/common';
import {Banner} from '../../../../core/model/banner';
import {HonkaiService} from "../../../../core/services/honkai.service";
import {Utils} from "../../../utils";
import {faStar} from "@fortawesome/free-solid-svg-icons";


@Component({
  selector: 'app-wish-table',
  templateUrl: './wish-table.component.html',
  styleUrls: ['./wish-table.component.css']
})
export class WishTableComponent {
  @Input()
  public pulls: Pull[] = [];
  @Input()
  public banner: Banner | undefined;
  public selectedRanks = [5, 4, 3];
  faStar = faStar;

  constructor(private honkaiService: HonkaiService) {

  }


  public lastPity(rank: number): number {
    let pity = this.pulls.findIndex(p => p.rank_type == rank) + 1;
    if (pity < 0) {
      return this.pulls.length;
    }
    return pity;
  }

  public lastPityFrom(pull: Pull): number {
    // let pulls = this.pulls.filter(p => p.gacha_type === pull.gacha_type);
    // let index = pulls.indexOf(pull);
    // let rank = pull.rank_type;
    // let pity = pulls.slice(index + 1).findIndex(p => p.rank_type === rank);
    // if (pity < 0) {
    //   return pulls.slice(index + 1).length;
    // }
    // return pity + 1;
    return Utils.lastPityFrom(this.pulls, pull);
  }

  public fetchBannerIcon(pull: Pull) {
    return this.honkaiService.fetchBannerIcon(pull);
  }

  findIconForPull(pull: Pull) {
    return this.honkaiService.getAssetById(pull.item_id, true);
  }

  getFilteredPulls() {
    let pulls: Pull[];
    if (this.banner) {
      pulls = this.pulls.filter(pull => pull.gacha_id === this.banner?.id);
      // pulls = this.pulls;
    } else {
      pulls = this.pulls;
    }
    return pulls.filter(pull => this.selectedRanks.indexOf(pull.rank_type) !== -1);
  }


  protected readonly formatDate = formatDate;

  isSelected(rank: number): boolean {
    return this.selectedRanks.find(selectedRank => selectedRank === rank) !== undefined;
  }

  toggleSelect(rank: number) {
    console.log(this.selectedRanks);
    let index = this.selectedRanks.indexOf(rank);
    console.log(index);
    if (index >= 0) {
      this.selectedRanks.splice(index, 1);
    } else {
      this.selectedRanks.push(rank);
    }
  }

  getPityColor(pull: Pull) {
    if (pull.rank_type > 3) {
      return Utils.redGradiate(this.lastPityFrom(pull), pull.rank_type === 4 ? 10 : 90);
    } else {
      return '';
    }
  }
}
