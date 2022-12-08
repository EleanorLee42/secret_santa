import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PersonViewPage } from './person-view.page';

const routes: Routes = [
  {
    path: '',
    component: PersonViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PersonViewPageRoutingModule {}
