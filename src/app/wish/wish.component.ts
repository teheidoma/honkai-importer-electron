import { Component } from '@angular/core';
import {Pull} from "../core/model/Pull";
import {ActivatedRoute} from "@angular/router";
import {HonkaiService} from "../core/services/honkai.service";

@Component({
  selector: 'app-wish',
  templateUrl: './wish.component.html',
  styleUrls: ['./wish.component.css']
})
export class WishComponent {
  pulls: Pull[] = [];

  constructor(private activatedRoute: ActivatedRoute,
              private honkaiService: HonkaiService) {
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
      })

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

  autoImport() {

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

  scale(number: number, inMin: number, inMax: number, outMin: number, outMax: number) {
    return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
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
}
