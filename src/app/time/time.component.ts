import {Component, Input, OnInit} from '@angular/core';
import {TimeRange} from '../core/model/timeRange';
import {HonkaiService} from '../core/services/honkai.service';
import {chain} from 'lodash';
import {formatDate} from '@angular/common';
import 'chartjs-adapter-moment';
import {TimeCell, TimeCellType} from '../core/model/timeCell';


@Component({
  selector: 'app-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.css']
})
export class TimeComponent implements OnInit {
  @Input()
  ranges: TimeRange[] = [];
  gameStarted = false;
  today = '';
  week = '';
  rows: TimeCell[][] = [];

  private days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sun', 'Sat'];

  constructor(private honkaiService: HonkaiService) {
  }

  getAllPulls() {
    console.log('all pulls');
    this.honkaiService.getTime().subscribe(ranges => {
      this.ranges = ranges;
      console.log('ranges', ranges);
      // this.ranges.sort((a, b) => a.)
      this.getToday();
      this.getWeek();
    });
  }

  ngOnInit(): void {
    this.getAllPulls();
    this.rows = this.genData();
    this.honkaiService.statusEvent.subscribe(event => {
      this.gameStarted = event.event === 'started';
    });
  }

  getWeek() {
    const dates = Array.from(Array(7).keys())
      .map((idx) => {
        const d = new Date();
        d.setDate(d.getDate() - d.getDay() + idx);
        return d;
      })
      .map(date => formatDate(date, 'yyyy-MM-dd', 'en'));

    this.week =
      new Date(1000 *
        this.ranges.filter(range => range.day in dates).reduce((a, range: TimeRange) => {
          a.duration += range.duration;
          return a;
        }).duration).toISOString();
  }

  getToday() {
    const find = this.ranges.find(range => range.day == formatDate(Date.now(), 'yyyy-MM-dd', 'en'));
    console.log('find', find);
    console.log('find', this.ranges);
    this.today = find!.tooltip;
  }


  protected readonly chain = chain;

  genData(): TimeCell[][] {
    const res: TimeCell[][] = [
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ];
    const startOfTheYear = new Date(new Date().getFullYear(), 0, 0, 0, 0, 0, 0);

    for (let i = startOfTheYear.getDay(); i < 365; i++) {
      const date = startOfTheYear;
      date.setDate(date.getDate() + i);
      res[i % 7].push({
        value: date,
        type: TimeCellType.DAY
      });
    }
    for (let i = 0; i < 7; i++) {
      res[i].push({
        value: this.days[i],
        type: TimeCellType.LABEL
      });
    }

    return res;
  }

  getStartOfYear() {
    return new Date(new Date().getFullYear(), 0, 1); // Місяці у JavaScript нумеруються з 0 (січень) до 11 (грудень)
  }
}
