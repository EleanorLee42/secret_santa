import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GroupViewPageRoutingModule } from './group-view-routing.module';

import { GroupViewPage } from './group-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GroupViewPageRoutingModule
  ],
  declarations: [GroupViewPage]
})
export class GroupViewPageModule {}
