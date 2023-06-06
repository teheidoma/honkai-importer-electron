import {Component, Input} from '@angular/core';
import {HonkaiService} from "../../../../core/services/honkai.service";
import {Banner} from "../../../../core/model/banner";

@Component({
  selector: 'app-wish-featured',
  templateUrl: './wish-featured.component.html',
  styleUrls: ['./wish-featured.component.scss']
})
export class WishFeaturedComponent {
  @Input()
  banner: Banner | undefined;

  constructor(private honkaiService: HonkaiService) {
  }

  getSrc(assetId:string) {
    return this.honkaiService.getImageUrlById(assetId)
  }
}
