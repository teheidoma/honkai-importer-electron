import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-wish-label',
  templateUrl: './wish-label.component.html',
  styleUrls: ['./wish-label.component.scss']
})
export class WishLabelComponent {
  @Input()
  title: string | undefined;
  @Input()
  subtitle: string | undefined;
  @Input()
  number: string | undefined;
}
