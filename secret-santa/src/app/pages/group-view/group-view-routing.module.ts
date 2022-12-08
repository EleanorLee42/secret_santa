import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GroupViewPage } from './group-view.page';

const routes: Routes = [
  {
    path: '',
    component: GroupViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupViewPageRoutingModule {}
