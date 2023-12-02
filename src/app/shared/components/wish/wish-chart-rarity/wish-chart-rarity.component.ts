import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {Pull} from '../../../../core/model/pull';
import {groupBy} from 'lodash';
import {Banner} from '../../../../core/model/banner';
import {Chart, registerables} from 'chart.js/auto';
import _default from 'chart.js/dist/plugins/plugin.legend';

@Component({
  selector: 'app-wish-chart-rarity',
  templateUrl: './wish-chart-rarity.component.html',
  styleUrls: ['./wish-chart-rarity.component.scss']
})
export class WishChartRarityComponent implements OnInit, OnDestroy, OnChanges {

  @Input()
  pulls: Pull[] = [];
  @Input()
  banner: Banner | undefined;
  public chart: any;

  ngOnDestroy(): void {

  }

  ngOnInit(): void {
    const data = this.formattedPulls();
    Chart.register(...registerables);
    console.log('rarity', data)
    this.chart = new Chart('rarity_chart', {
      type: 'pie',
      data: {
        labels: ['3', '4', '5'],
        datasets: [{
          data: data,
          label: 'pulls',
          backgroundColor: ['#60A5FAFF', 'rgb(192 132 252)', 'rgb(251 191 36)']
        }
        ]
      },
      options: {
        borderColor: '#38393d',
        plugins: {
          legend: {
            position: 'right'
          }
        }
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.chart) {
      const data = this.formattedPulls();
      console.log('rarity', data)

      this.updateDataset()
      this.chart.update()
    }
  }

  private updateDataset() {
    const data = this.formattedPulls();
    this.chart.data.datasets[0] = {
      data: data,
      label: 'pulls',
      backgroundColor: ['#60A5FAFF', 'rgb(192 132 252)', 'rgb(251 191 36)'].slice(0, data.length)
    };
    this.chart.labels = ['3', '4', '5'].splice(0, data.length)
  }

  private formattedPulls(): (string | number)[] {
    let pulls = this.pulls;
    if (this.banner) {
      pulls = pulls.filter(pull => pull.gacha_id == this.banner?.id);
    }
    return Object.entries(groupBy(pulls, pull => pull.rank_type))
      .map(pulls => pulls[1].length);
  }

}
