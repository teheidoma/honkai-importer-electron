import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {PageNotFoundComponent} from './shared/components';

import {HomeRoutingModule} from './home/home-routing.module';
import {DetailRoutingModule} from './detail/detail-routing.module';
import {WishComponent} from './wish/wish.component';
import {TimeComponent} from './time/time.component';
import {OnboardComponent} from './onboard/onboard.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'wish/total',
    pathMatch: 'full'
  },
  {path: 'onboard', component: OnboardComponent},
  {path: 'wish/standard', component: WishComponent, data: {gachaType: 1}},
  {path: 'wish/event', component: WishComponent, data: {gachaType: 11}},
  {path: 'wish/weapon', component: WishComponent, data: {gachaType: 12}},
  {path: 'wish/new', component: WishComponent, data: {gachaType: 2}},
  {path: 'wish/total', component: WishComponent, data: {gachaType: -1}},
  {path: 'time', component: TimeComponent},
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {}),
    HomeRoutingModule,
    DetailRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
