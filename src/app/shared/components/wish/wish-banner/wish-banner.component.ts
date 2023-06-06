import {Component, Input} from '@angular/core';
import {Pull} from "../../../../core/model/pull";

@Component({
  selector: 'app-wish-banner',
  templateUrl: './wish-banner.component.html',
  styleUrls: ['./wish-banner.component.scss']
})
export class WishBannerComponent {
  @Input()
  title: string = "no";


  ngAfterViewInit() {
  }

  pulls: Pull[] = [];

  identify(index: number, item: Pull) {
    return item.id
  }

  toggleContent(content: HTMLDivElement) {
    if (content.classList.contains('hidden')) {
      content.classList.remove('hidden')
    } else {
      content.classList.add('hidden')
    }
  }

  public updatePulls(pulls: Pull[]) {
    console.log('q')
    console.log(pulls)
    this.pulls.splice(0, this.pulls.length)
    this.pulls.push(...pulls.sort((a:Pull, b:Pull) => b.id - a.id ))
  }

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
