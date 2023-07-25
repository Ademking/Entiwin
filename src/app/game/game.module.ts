import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameComponent } from './game/game.component';
import { MinimapComponent } from './minimap/minimap.component';
import { GameRoutingModule } from "./game-routing.module";
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { AngularResizedEventModule } from 'angular-resize-event';
import { ResizableModule } from 'angular-resizable-element';
import { TooltipModule } from 'ng2-tooltip-directive';
import { TranslateModule } from "@ngx-translate/core";
import { ShareButtonsModule } from '@ngx-share/buttons';
import { JoyrideModule } from "ngx-joyride";

@NgModule({
  imports: [
    CommonModule,
    GameRoutingModule,
    LeafletModule,
    AngularResizedEventModule,
    ResizableModule,
    TooltipModule,
    TranslateModule,
    ShareButtonsModule,
    JoyrideModule
  ],
  declarations: [GameComponent, MinimapComponent]
})

export class GameModule { }
