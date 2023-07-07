import {ChangeDetectorRef, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {Pull} from '../core/model/pull';
import {ActivatedRoute} from '@angular/router';
import {HonkaiService} from '../core/services/honkai.service';
import {Banner} from '../core/model/banner';
import bar = anychart.bar;
import {Banners} from '../shared/banners';
import {constants} from 'os';
import Pie = anychart.charts.Pie;
import {groupBy} from 'lodash';


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
    this.chart?.data([]);
  }

  ngOnInit(): void {
    this.honkaiService.getPulls()
      .subscribe(pulls => {
        this.showPulls(pulls);
      });
  }

  private showPulls(pulls: Pull[]) {
    this.activatedRoute.data
      .subscribe(data => {
        if (data.gachaType > 0) {
          this.pulls = pulls.filter(p => p.gachaType === data.gachaType).sort((a: Pull, b: Pull) => b.id - a.id);
          this.banners = Banners.banners.filter(b => b.type === data.gachaType);
          this.selectedBanner = this.banners[0];
        } else {
          this.pulls = pulls;
          this.banners = [];
          this.selectedBanner = undefined;
        }
      });
  }

  selectBanner(id: number | null) {
    if (id) {
      this.selectedBanner = this.banners.filter(b => b.id == id)[0];
    } else {
      this.selectedBanner = undefined;
    }
  }

  countPullsForBanner(banner: Banner) {
    return this.pulls.filter(pull => pull.gacha_id == banner.id).length;
  }

  getSelectedBannerName() {
    if (this.selectedBanner) {
      return this.selectedBanner.name;
    } else {
      return 'total';
    }
  }

  protected readonly JSON = JSON;
}
