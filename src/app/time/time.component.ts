import {Component, Input} from '@angular/core';
import {TimeRange} from '../core/model/timeRange';
import {HonkaiService} from '../core/services/honkai.service';
import 'anychart';
import * as _ from 'lodash';

@Component({
  selector: 'app-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.css']
})
export class TimeComponent {
  @Input()
  ranges: TimeRange[] = [];
  gameStarted = false;

  constructor(private honkaiService: HonkaiService) {
  }

  getAllPulls() {
    this.honkaiService.getTime().subscribe(ranges => {
      this.ranges = ranges;
      this.draw();
    });
  }

  ngOnInit(): void {
    this.getAllPulls();
    this.honkaiService.statusEvent.subscribe(event => {
      this.gameStarted = event.event == 'started';
    });
  }

  private draw() {
    this.ranges.map(range => {
      const date = new Date(0);
      date.setSeconds(range.duration); // specify value for SECONDS here

      range.tooltip = date.toISOString().substring(11, 19);
    });
    const dataset = anychart.data.set(this.ranges);
    const mapping = dataset.mapAs({
      x: 'day',
      value: 'duration'
    });
    console.log(this.ranges);

    // pass the mapped data to the calendar function
    const chart = anychart.calendar(mapping);

    // specify the color of the background
    chart.background('#0d1117');

    // configure a custom color scale
    const customColorScale = anychart.scales.linearColor();
    customColorScale.colors(['green', 'red']);

    // set the custom color scale
    chart.colorScale(customColorScale);

    // hide the color legend
    chart.colorRange(false);

    // remove the stroke
    chart.months()
      .stroke(false)
      .noDataStroke(false);

    // set the spacing and other options
    chart.days()
      .spacing(4)
      .stroke(false)
      .noDataStroke(false)
      .noDataFill('#161b22')
      .noDataHatchFill(false);

    // set the height of the chart
    chart.listen('chartDraw', function() {
      const elementById = document.getElementById('chartContainer');
      if (elementById != null) {
        // elementById.style.height = '500px';
      }
    });

    // set and customize the chart title
    const title = chart.title();
    title.enabled(true);
    title
      .text('Timetable')
      .fontSize(22)
      .fontWeight(500)
      .fontColor('#dfdfdf')
      .padding(10);

    // configure the chart tooltip
    chart.tooltip()
      .format('{%tooltip} contributions');

    // configure the inverted order of years
    chart.years().inverted(true);

    // set the container reference
    chart.container('chartContainer');

    // draw the resulting chart
    chart.draw();
  }

}
