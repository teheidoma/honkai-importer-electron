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
import { NavbarItemComponent } from './components/navbar-item/navbar-item.component';
import { WishFeaturedComponent } from './components/wish/wish-featured/wish-featured.component';
import { WishLastLegendaryComponent } from './components/wish/wish-last-legendary/wish-last-legendary.component';
import { WishChartRarityComponent } from './components/wish/wish-chart-rarity/wish-chart-rarity.component';
import { WishChartFreqComponent } from './components/wish/wish-chart-freq/wish-chart-freq.component';
import { HeaderComponent } from './components/header/header.component';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";

@NgModule({
  declarations: [PageNotFoundComponent, WebviewDirective, NavbarComponent, WishBannerComponent, WishLabelComponent, WishTableComponent, NavbarItemComponent, WishFeaturedComponent, WishLastLegendaryComponent, WishChartRarityComponent, WishChartFreqComponent, HeaderComponent],
    imports: [CommonModule, TranslateModule, FormsModule, RouterLink, FontAwesomeModule],
    exports: [TranslateModule, WebviewDirective, FormsModule, NavbarComponent, WishTableComponent, WishFeaturedComponent, WishLastLegendaryComponent, WishChartRarityComponent, WishChartFreqComponent, HeaderComponent]
})
export class SharedModule {}
