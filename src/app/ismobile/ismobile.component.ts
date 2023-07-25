import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-ismobile',
  templateUrl: './ismobile.component.html',
  styleUrls: ['./ismobile.component.css']
})
export class IsmobileComponent implements OnInit {
 
  currentLang: any
  constructor(private deviceService: DeviceDetectorService, private router: Router) {
    let lang = localStorage.getItem('locale');
    this.currentLang = lang;
  }


  ngOnInit() {
  }


}
