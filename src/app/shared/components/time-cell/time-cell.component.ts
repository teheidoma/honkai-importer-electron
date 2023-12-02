import {Component, Input, OnInit} from '@angular/core';
import {TimeCell, TimeCellType} from '../../../core/model/timeCell';


@Component({
  selector: 'app-time-cell',
  templateUrl: './time-cell.component.html',
  styleUrls: ['./time-cell.component.scss']
})
export class TimeCellComponent implements OnInit {
  @Input()
  public timeCell: TimeCell | undefined;

  ngOnInit(): void {

  }

  protected readonly TimeCellType = TimeCellType;
}
