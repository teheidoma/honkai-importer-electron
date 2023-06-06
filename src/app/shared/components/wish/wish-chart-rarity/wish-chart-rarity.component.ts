import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Pull} from "../../../../core/model/pull";
import {groupBy} from "lodash";

@Component({
  selector: 'app-wish-chart-rarity',
  templateUrl: './wish-chart-rarity.component.html',
  styleUrls: ['./wish-chart-rarity.component.scss']
})
export class WishChartRarityComponent implements OnInit, OnDestroy {
  @Input()
  pulls: Pull[] = [];
  private chart: anychart.charts.Pie | undefined;

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.data([])
    }
  }

  ngOnInit(): void {
    let data = Object.entries(groupBy(this.pulls, pull => pull.rank_type))
      .map(pulls => [pulls[0], pulls[1].length]);
    this.chart = anychart.pie(data)
    console.log(data)
    this.chart.container('chartContainer');
    this.chart.background()
      .fill('#38393D')
      .cornerType('round')
      .corners(10)
    this.chart.draw();
  }


}
