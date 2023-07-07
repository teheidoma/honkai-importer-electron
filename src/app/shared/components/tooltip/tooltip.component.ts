import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss']
})
export class TooltipComponent {
  @Input()
  tooltip = '';
  hidden = true;

  public toggle() {
    this.hidden = !this.hidden;
  }

  public setHidden(hidden: boolean) {
    this.hidden = hidden;
  }
}
