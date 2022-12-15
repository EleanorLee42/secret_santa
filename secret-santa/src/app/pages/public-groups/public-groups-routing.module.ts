import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PublicGroupsPage } from './public-groups.page';

const routes: Routes = [
  {
    path: '',
    component: PublicGroupsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublicGroupsPageRoutingModule {}
