import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {Pull} from "../../../../core/model/pull";
import {groupBy} from "lodash";
import {Banner} from "../../../../core/model/banner";

@Component({
  selector: 'app-wish-chart-rarity',
  templateUrl: './wish-chart-rarity.component.html',
  styleUrls: ['./wish-chart-rarity.component.scss']
})
export class WishChartRarityComponent implements OnInit, OnDestroy, OnChanges {

  @Input()
  pulls: Pull[] = [];
  @Input()
  banner: Banner | undefined;
  private chart: anychart.charts.Pie | undefined;

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.data([])
    }
  }

  ngOnInit(): void {
    let data = this.formattedPulls()
    this.chart = anychart.pie(data)
    console.log(data)
    this.chart.palette(['#60a5fa', '#c084fc', '#fbbf24'])
    this.chart.container('chartContainer');
    this.chart.background()
      .fill('#1D1E22')
      .cornerType('round')
      .stroke('#38393D', 2)
      .corners(10);
    this.chart.draw();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.chart) {
      let data = this.formattedPulls();
      this.chart.data(data)
    }
  }

  private formattedPulls(): (string | number)[][] {
    let pulls = this.pulls;
    if (this.banner) {
      pulls = pulls.filter(pull => pull.gacha_id == this.banner?.id)
    }
    return Object.entries(groupBy(pulls, pull => pull.rank_type))
      .map(pulls => [pulls[0], pulls[1].length]);
  }

}
