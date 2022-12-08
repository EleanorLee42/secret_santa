import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PersonViewPageRoutingModule } from './person-view-routing.module';

import { PersonViewPage } from './person-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PersonViewPageRoutingModule
  ],
  declarations: [PersonViewPage]
})
export class PersonViewPageModule {}
