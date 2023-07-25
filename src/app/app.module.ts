import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { AngularResizedEventModule } from 'angular-resize-event';
import { ResizableModule } from 'angular-resizable-element';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { DeviceDetectorModule } from 'ngx-device-detector';

import { of, forkJoin } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { ShareButtonsModule } from '@ngx-share/buttons';


// icons 
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faFacebookF } from '@fortawesome/free-brands-svg-icons/faFacebookF';
import { faTwitter } from '@fortawesome/free-brands-svg-icons/faTwitter';
import { faRedditAlien } from '@fortawesome/free-brands-svg-icons/faRedditAlien';
import { faLinkedinIn } from '@fortawesome/free-brands-svg-icons/faLinkedinIn';
import { faGooglePlusG } from '@fortawesome/free-brands-svg-icons/faGooglePlusG';
import { faTumblr } from '@fortawesome/free-brands-svg-icons/faTumblr';
import { faPinterestP } from '@fortawesome/free-brands-svg-icons/faPinterestP';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons/faWhatsapp';
import { faVk } from '@fortawesome/free-brands-svg-icons/faVk';
import { faFacebookMessenger } from '@fortawesome/free-brands-svg-icons/faFacebookMessenger';
import { faTelegramPlane } from '@fortawesome/free-brands-svg-icons/faTelegramPlane';
import { faMix } from '@fortawesome/free-brands-svg-icons/faMix';
import { faXing } from '@fortawesome/free-brands-svg-icons/faXing';
import { faLine } from '@fortawesome/free-brands-svg-icons/faLine';

import { faCommentAlt } from '@fortawesome/free-solid-svg-icons/faCommentAlt';
import { faMinus } from '@fortawesome/free-solid-svg-icons/faMinus';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons/faEllipsisH';
import { faLink } from '@fortawesome/free-solid-svg-icons/faLink';
import { faExclamation } from '@fortawesome/free-solid-svg-icons/faExclamation';
import { faPrint } from '@fortawesome/free-solid-svg-icons/faPrint';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons/faEnvelope';
import {faBook, faCoffee, faInfo, faLightbulb} from '@fortawesome/free-solid-svg-icons';
import { JoyrideModule } from "ngx-joyride";

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}


@NgModule({
  declarations: [
    AppComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    LeafletModule,
    AngularResizedEventModule,
    ResizableModule,
    DeviceDetectorModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    ShareButtonsModule,
    JoyrideModule.forRoot(),
  ],
  providers: [Platform],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(fa_library: FaIconLibrary) { 
    
const icons = [
  faFacebookF, faTwitter, faLinkedinIn, faGooglePlusG, faPinterestP, faRedditAlien, faTumblr,
  faWhatsapp, faVk, faFacebookMessenger, faTelegramPlane, faMix, faXing, faCommentAlt, faBook, faLine,
  faEnvelope, faCheck, faPrint, faExclamation, faLink, faEllipsisH, faMinus, faLightbulb, faCoffee, faInfo
];
 fa_library.addIcons(...icons);
  }
 }
