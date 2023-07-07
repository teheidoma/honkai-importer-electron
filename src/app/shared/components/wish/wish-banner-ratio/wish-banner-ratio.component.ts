import {Component, NgZone, OnInit} from '@angular/core';
import {Chart} from 'chart.js/auto';
import {HonkaiService} from '../../../../core/services/honkai.service';
import {map} from 'rxjs';
import * as _ from 'lodash';
import {Pull} from '../../../../core/model/pull';
import {Banners} from '../../../banners';


@Component({
  selector: 'app-wish-banner-ratio',
  templateUrl: './wish-banner-ratio.component.html',
  styleUrls: ['./wish-banner-ratio.component.scss']
})
export class WishBannerRatioComponent implements OnInit {
  public chart: any;


  constructor(private honkaiService: HonkaiService,
              private ngZone: NgZone) {
  }

  ngOnInit(): void {
    this.createChart();
    console.log('333init');
  }

  public createChart() {
    this.honkaiService.getPulls()
      .subscribe(pulls => {
        this.ngZone.run(() => {
          const grouped = _.groupBy(pulls, (pull: Pull) => pull.gacha_id);
          const sorted = Object.entries(grouped).map(g => ({id: g[0], len: g[1].length})).sort((a, b) => b.len - a.len);
          console.log('333', sorted);
          const labels = sorted.map(g => g.id)
            .map(g => {
              const found = Banners.banners.find(b => b.id.toString() === g);
              if (found?.name) {
                return found.name;
              } else {
                return found?.typeName!;
              }
            });
          console.log('labels', labels);
          this.chart = new Chart('MyChart', {
            type: 'pie',
            options: {
              responsive: true,
              plugins: {
                legend: {
                  display: true,
                  position: 'right'
                }
              }
            },
            data: {
              labels,
              datasets: [
                {
                  data: sorted.map(g => g.len)
                }
              ]
            }
          });
        });
      });

  }
}
