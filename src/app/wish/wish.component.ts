import {ChangeDetectorRef, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {Pull} from "../core/model/pull";
import {ActivatedRoute} from "@angular/router";
import {HonkaiService} from "../core/services/honkai.service";
import {Banner} from "../core/model/banner";
import bar = anychart.bar;
import {Banners} from "../shared/banners";
import {constants} from "os";
import Pie = anychart.charts.Pie;
import {groupBy} from "lodash";


@Component({
  selector: 'app-wish',
  templateUrl: './wish.component.html',
  styleUrls: ['./wish.component.css']
})
export class WishComponent implements OnDestroy {
  pulls: Pull[] = [];
  banners: Banner[] = [];
  selectedBanner: Banner | undefined;
  @ViewChild('chartContainer') chartContainer: ElementRef | undefined;
  chart: Pie | undefined;

  constructor(private activatedRoute: ActivatedRoute,
              private honkaiService: HonkaiService,
              private changeDetectionRef: ChangeDetectorRef) {
  }

  ngOnDestroy(): void {
    this.chart?.data([])
  }

  ngOnInit(): void {
    this.honkaiService.getPulls()
      .subscribe(pulls => {
        this.showPulls(pulls);
      })
  }

  private showPulls(pulls: Pull[]) {
    this.activatedRoute.data
      .subscribe(data => {
        this.pulls = pulls.filter(p => p.gacha_type == data['gacha_type']).sort((a: Pull, b: Pull) => b.id - a.id)
        this.banners = Banners.banners.filter(b => b.type == data['gacha_type'])
        this.selectedBanner = this.banners[0]
      })
  }

  redGradiate(pity: number) {
    pity = pity / 100
    return this.getColor(pity)
    // return this.getColor(this.scale(pity, 0, 1, 0, 100))
  }

  getColor(value: number) {
    //value from 0 to 1
    var hue = ((1 - value) * 120).toString(10);
    return ["hsl(", hue, ",100%,50%)"].join("");
  }

  //
  // draw() {
  //
  //   // chart type
  //   var chart = anychart.line();
  //
  //   // chart title
  //   chart.title("Line Chart DateTime Scale");
  //
  //   // create custom logarithmic scale
  //   var logScale = anychart.scales.linear();
  //   logScale.minimum(1);
  //
  //   // apply custom scale to y scale
  //   chart.yScale(logScale);
  //
  //   // create custom Date Time scale
  //   var dateTimeScale = anychart.scales.dateTime();
  //   var dateTimeTicks = dateTimeScale.ticks();
  //   dateTimeTicks.interval(0, 2);
  //
  //   // apply Date Time scale
  //   chart.xScale(dateTimeScale);
  //
  //   console.log(123)
  //   let data = Object.entries(_.groupBy(this.pulls, pull => pull.time.substring(0, 10))).map(pulls => {
  //     return {'day': pulls[0], 'pulls': pulls[1].length}
  //   });
  //   console.log(data)
  //   var dataset = anychart.data.set(data).mapAs({
  //     x: 'day',
  //     value: 'pulls'
  //   });
  //
  //   var series = chart.line(dataset);
  //
  //
  //   // adjust tooltips
  //   var tooltip = series.tooltip();
  //
  //
  //   // adjust axis labels
  //   var labels = chart.xAxis().labels();
  //   labels.hAlign("center");
  //   labels.width(60);
  //   // labels.format();
  //
  //   // set container and draw chart
  //   chart.container("chart");
  //   chart.draw();
  // }
  selectBanner(id: number) {
    this.selectedBanner = this.banners.filter(b => b.id == id)[0];
  }

  countPullsForBanner(banner: Banner) {
    return this.pulls.filter(pull => pull.gacha_id == banner.id).length
  }
}
