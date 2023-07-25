import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IsmobileRoutingModule } from './ismobile-routing.module';
import { IsmobileComponent } from './ismobile.component';
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [IsmobileComponent],
  imports: [
    CommonModule,
    IsmobileRoutingModule,
    TranslateModule
  ]
})
export class IsmobileModule { }
