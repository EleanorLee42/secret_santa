import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserHomePageRoutingModule } from './user-home-routing.module';

import { UserHomePage } from './user-home.page';
import { GroupBannerComponent } from 'src/app/components/group-banner/group-banner.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserHomePageRoutingModule,
    GroupBannerComponent,
  ],
  declarations: [UserHomePage]
})
export class UserHomePageModule { }
