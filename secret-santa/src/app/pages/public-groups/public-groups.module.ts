import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PublicGroupsPageRoutingModule } from './public-groups-routing.module';

import { PublicGroupsPage } from './public-groups.page';
import { GroupBannerComponent } from 'src/app/components/group-banner/group-banner.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PublicGroupsPageRoutingModule,
    GroupBannerComponent
  ],
  declarations: [PublicGroupsPage]
})
export class PublicGroupsPageModule { }
