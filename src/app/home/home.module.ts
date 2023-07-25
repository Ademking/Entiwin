import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { HomeRoutingModule } from './home-routing.module';
import { TranslateModule } from "@ngx-translate/core";
import { TooltipModule } from "ng2-tooltip-directive";
@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    TranslateModule,
    TooltipModule,
  ],
  declarations: [HomeComponent, ]
})
export class HomeModule { }
