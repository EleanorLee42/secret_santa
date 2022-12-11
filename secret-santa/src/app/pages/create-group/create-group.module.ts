import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateGroupPageRoutingModule } from './create-group-routing.module';

import { CreateGroupPage } from './create-group.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CreateGroupPageRoutingModule
  ],
  declarations: [CreateGroupPage]
})
export class CreateGroupPageModule { }
