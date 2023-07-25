import { Component, OnInit } from '@angular/core';
import { HostListener } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TooltipOptions } from 'ng2-tooltip-directive';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  // https://maps.google.com/maps?layer=c&amp;cbll={latitude},{longitude}&amp;cbp=,{bearing},{tilt},{zoom},{pitch}&amp;source=embed&amp;output=svembed
  // https://maps.google.com/maps?layer=c&amp;cbll=40.714103,-74.006206&amp;cbp=12,20.09,,0,5&amp;source=embed&amp;output=svembed

  // Prevent Right Click
  @HostListener('contextmenu', ['$event'])
  onRightClick(event) {
    event.preventDefault();
  }
  isModalOpen = false;
  lang: string;
  loadingTime: number = 2000;
  showModal = false;
  difficultyModal = false;
  level: string = 'easy';
  tooltipOptions: TooltipOptions = {
    "placement": 'top',
    "hide-delay": 0,
    "animation-duration": 300
  }
  // @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event:
  //   KeyboardEvent) {
  //   this.showModal = false;
  // }
  constructor(private translate: TranslateService) {    
  }


  ngOnInit() {
    let l = localStorage.getItem('locale');
    if (l){
      this.lang = l
    }
    else {
      this.lang = 'ar'
    }
    setTimeout(() => {
      this.showModal = true;
    }, this.loadingTime);
  }

  toggleModal() {
    this.showModal = !this.showModal;
  }


  /**
   * Change language
   * @param lang language
   */
  public setLang(code: string) {
    this.lang = code;
    this.translate.use(code);
    localStorage.setItem('locale', code);

  }

  setLevel(level) {
    this.level = level;
  }


}
