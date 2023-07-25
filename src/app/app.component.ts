import { Component } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})



export class AppComponent {
  constructor(private deviceService: DeviceDetectorService, private router: Router, private translate: TranslateService) {
    let lang = localStorage.getItem('locale'); // get langauge from localStorage
    // if localStorage is not empty
    if (lang) {
      translate.setDefaultLang(lang);
    }
    else { 
      translate.setDefaultLang('ar');
    }
    // if user is using mobile device, redirect to 'IsMobile' page
    if (this.deviceService.isMobile()) {
      this.router.navigate(['ismobile']);
    }
  }


  switchLanguage(language: string) {
    this.translate.use(language);
  }

}
