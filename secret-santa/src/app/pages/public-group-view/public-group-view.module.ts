import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PublicGroupViewPageRoutingModule } from './public-group-view-routing.module';

import { PublicGroupViewPage } from './public-group-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PublicGroupViewPageRoutingModule
  ],
  declarations: [PublicGroupViewPage]
})
export class PublicGroupViewPageModule {}
