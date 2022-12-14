import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PublicGroupViewPage } from './public-group-view.page';

const routes: Routes = [
  {
    path: '',
    component: PublicGroupViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublicGroupViewPageRoutingModule {}
