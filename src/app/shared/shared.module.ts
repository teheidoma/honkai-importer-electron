import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { PageNotFoundComponent } from './components/';
import { WebviewDirective } from './directives/';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from './components/navbar/navbar.component';
import {RouterLink} from "@angular/router";
import { WishBannerComponent } from './components/wish/wish-banner/wish-banner.component';
import { WishLabelComponent } from './components/wish/wish-label/wish-label.component';
import { WishTableComponent } from './components/wish/wish-table/wish-table.component';

@NgModule({
  declarations: [PageNotFoundComponent, WebviewDirective, NavbarComponent, WishBannerComponent, WishLabelComponent, WishTableComponent],
  imports: [CommonModule, TranslateModule, FormsModule, RouterLink],
    exports: [TranslateModule, WebviewDirective, FormsModule, NavbarComponent, WishTableComponent]
})
export class SharedModule {}
