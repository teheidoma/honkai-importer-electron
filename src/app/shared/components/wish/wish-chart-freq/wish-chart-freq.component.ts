import {Component, Input, SimpleChanges} from '@angular/core';
import {Pull} from '../../../../core/model/pull';
import {Banner} from '../../../../core/model/banner';
import {groupBy} from 'lodash';
import {formatDate} from '@angular/common';

@Component({
  selector: 'app-wish-chart-freq',
  templateUrl: './wish-chart-freq.component.html',
  styleUrls: ['./wish-chart-freq.component.scss']
})
export class WishChartFreqComponent {

  @Input()
  pulls: Pull[] = [];
  @Input()
  banner: Banner | undefined;
  private level = 'month';

  ngOnDestroy(): void {

  }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);

  }

  private formattedPulls() {
    let pulls = this.pulls;
    console.log(this.banner);
    if (this.banner) {
      pulls = pulls.filter(pull => pull.gacha_id == this.banner?.id);
    }
    const minmax = this.findMinMax(pulls);
    const groupedByDate = this.groupByRankType(pulls)
      .map(pulls => this.groupByDate(pulls[1]))
      .map(dicts => {
        const arr = Object.entries(dicts);
        const daysOfYear = [];
        for (var d = new Date(minmax[0].time); d <= new Date(minmax[1].time); d.setDate(d.getDate() + 1)) {
          const findDate = arr.find(e => e[0] === formatDate(d, 'yyyy-MM-dd', 'en'));
          if (findDate) {
            daysOfYear.push({x: new Date(d).getTime(), value: findDate[1].length});
          } else {
            daysOfYear.push({x: new Date(d).getTime(), value: 0});
          }
        }
        return daysOfYear;
      });
    console.log(groupedByDate);
    return groupedByDate;
  }

  // private formatDateByLevel(date: Date) {
  //   let format;
  //   switch (this.level) {
  //     case 'year':
  //       return formatDate(date, 'yyyy', 'en');
  //     default:
  //     case 'month':
  //       return formatDate(date, 'yyyy-mm', 'en');
  //   }
  // }

  private groupByRankType(pulls: Pull[]) {
    return Object.entries(groupBy(pulls, pull => pull.rank_type));
  }

  private groupByDate(pulls: Pull[]) {
    return groupBy(pulls.map(pull => {
      pull.time = formatDate(pull.time, 'yyyy-MM-dd', 'en');
      return pull;
    }), pull => pull.time);
  }

  private findMinMax(pulls: Pull[]) {
    const temp = pulls.map(pull => {
      pull.time = formatDate(pull.time, 'yyyy-MM-dd', 'en');
      return pull;
    }).sort((pull1, pull2) => Date.parse(pull1.time) - Date.parse(pull2.time));
    return [temp[0], temp[temp.length - 1]];
  }

  changeLevel(level: string) {
    this.level = level;
  }
}
