import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { faRefresh } from '@fortawesome/free-solid-svg-icons';
import {HonkaiService} from '../../../core/services/honkai.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  lastEvent: any | undefined;
  updating = false;
  faRefresh = faRefresh;

  constructor(private honkaiService: HonkaiService,
              private changesDetector: ChangeDetectorRef) {
  }

  getStatus() {
    if (this.lastEvent) {
      return this.lastEvent.event;
    } else {
      return 'stoped';
    }
  }

  ngOnInit(): void {
    //TODO force status if launched in onboarding
    this.honkaiService.statusEvent.subscribe(event => {
      console.log(event);
      this.lastEvent = event;
      this.changesDetector.detectChanges();
    });
    this.honkaiService.updatedEvent.subscribe(event => {
      this.updating = false;
      console.log('updated');
    });
  }

  getLastUpdated() {
    const lastUpdate = localStorage.getItem('updated_at');
    if (lastUpdate) {
      const date = new Date(parseInt(lastUpdate!));
      return date.toDateString();
    } else {
      return '';
    }
  }

  update() {
    console.log('update');
    this.updating = true;
    // this.honkaiService.uploadFile().subscribe()
  }
}
