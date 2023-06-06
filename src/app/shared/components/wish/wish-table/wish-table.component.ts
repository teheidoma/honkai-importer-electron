import {Component, Input} from '@angular/core';
import {Pull} from "../../../../core/model/pull";

@Component({
  selector: 'app-wish-table',
  templateUrl: './wish-table.component.html',
  styleUrls: ['./wish-table.component.css']
})
export class WishTableComponent {
  @Input()
  public pulls: Pull[] = [];

  public lastPity(rank: number): number {
    let pity = this.pulls.findIndex(p => p.rank_type == rank) + 1;
    if (pity < 0) {
      return this.pulls.length
    }
    return pity
  }

  public lastPityFrom(rank: number, index: number): number {
    let pity = this.pulls.slice(index + 1).findIndex(p => p.rank_type == rank);
    if (pity < 0) {
      return this.pulls.slice(index + 1).length
    }
    return pity + 1
  }
}
