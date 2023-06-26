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
  private chart: anychart.charts.Cartesian | undefined;
  private level = 'month';

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.data([]);
      this.chart.removeAllSeries();
    }
  }

  ngOnInit(): void {
    const data = this.formattedPulls();
    this.chart = anychart.area();
    let i = 0;
    data.forEach(d => {
      const series = this.chart?.area(anychart.data.set(d));
      series?.id(i++);
    });
    this.chart.palette(['#60a5fa', '#c084fc', '#fbbf24']);
    this.chart.container('freq-chart');
    this.chart.tooltip().useHtml(true);
    this.chart.tooltip()
      .format(function () {
        // @ts-ignore
        const id = this.series.id();
        switch (id) {
          case '0':
            // @ts-ignore
            return '<span style=\'color: #60a5fa\'>4 stars ' + this.getData('value') + '</span>';
          case '1':
            // @ts-ignore
            return '<span class=\'text-purple-400\'>4 stars ' + this.getData('value') + '</span>';
          case '2':
            // @ts-ignore
            return '<span class=\'text-amber-400\'>5 stars ' + this.getData('value') + '</span>';
        }
      });
    const log = anychart.scales.log();
    log.minimum(1);
    // this.chart.yScale(log)

    // create custom Date Time scale
    const dateTimeScale = anychart.scales.dateTime();
    const dateTimeTicks = dateTimeScale.ticks();
    // switch (this.level) {
    //   case 'year':
    //     dateTimeTicks.interval(1, 0, 0);
    //     break;
    //   case 'total':
    //     this.makeMinMaxTicks(this.pulls, dateTimeTicks);
    //     break;
    //   default:
    //   case 'month':
    //     dateTimeTicks.interval(0, 1, 0);
    //     break;
    // }

    // apply Date Time scale
    this.chart.xScale(dateTimeScale);
    this.chart.background()
      .fill('#1D1E22')
      .cornerType('round')
      .stroke('#38393D', 2)
      .corners(10);
    this.chart.draw();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if (this.chart) {
      const data = this.formattedPulls();
      this.chart?.removeAllSeries();
      data.forEach(d => {
        console.log('changes');
        this.chart?.area(anychart.data.set(d));
      });
    }
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

  private makeMinMaxTicks(pulls: Pull[], dateTimeTicks: anychart.scales.DateTimeTicks) {
    dateTimeTicks.interval(0, 0, 1);
  }
}
