import { Component, OnInit, ViewChild, ElementRef, Inject, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HostListener } from '@angular/core';
import { Place } from "./Place";
import confetti, { create } from 'canvas-confetti';
import { icon, latLng, Layer, marker, tileLayer, DomUtil, Map, latLngBounds, LatLngTuple } from 'leaflet';
import { DOCUMENT } from '@angular/common'; // For fullscreen
import { ActivatedRoute, Router } from "@angular/router";
import { trigger, transition, style, animate, state } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment'
import { TooltipOptions } from 'ng2-tooltip-directive';
import { TranslateService } from "@ngx-translate/core";
import { GameSettings } from './GameSettings';
import { JoyrideService } from 'ngx-joyride';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
  animations: [
    trigger(
      'enterAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(50%)', opacity: 0 }),
        animate('280ms', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ transform: 'translateX(0)', opacity: 1 }),
        animate('280ms', style({ transform: 'translateX(50%)', opacity: 0 }))
      ])
    ]
    ),
    trigger('Fading', [
      state('void', style({ opacity: 0 })),
      state('*', style({ opacity: 1 })),
      transition(':enter', animate('800ms ease-out')),
      transition(':leave', animate('800ms ease-in')),
    ])
  ]
})
export class GameComponent implements OnInit {


  // Prevent Right Click
  @HostListener('contextmenu', ['$event'])
  onRightClick(event) {
    event.preventDefault();
  }

  gamerounds: number = 0; // total rounds
  round: number = 0; // actual round
  score: number = 0; // score
  options: any;

  tooltipOptions: TooltipOptions = {
    "placement": 'bottom',
    "hide-delay": 0,
    "animation-duration": 300
  }
  markers: Layer[] = []; // list of markers (for left map)
  isAudioOn = true; // audio status
  innerWidth: any; // browser width
  innerHeight: any; // browser height
  lang: string = 'ar'; // app language
  isGameStarted: boolean = false; // game status
  isModalOpen: boolean = false; // confirm modal status
  url: string; // streetview url string
  urlSafe: SafeResourceUrl; // urlsafe streetview
  actualViewPlace: any; // current streetview place (lat & long)
  // https://maps.google.com/maps?layer=c&cbll=36.8036105,10.09802018&cbp=12,20.09,,0,5&source=embed&output=svembed
  list_places: any[] = []; // list of lat & long  
  guesslat: number = 0; // left map guessed lat
  guesslong: number = 0; // left map guessed long
  isRoundWon: boolean; // roundStatus
  elem; // used for fullscreen https://stackoverflow.com/a/51998854/10388753
  isFullScreen = false; // browser status
  showRoundResult = false; // confirm modal status
  distance = 0; // distance between 2 guessed and place
  maxDistance: number = 100; // used to test guess (by level of game)
  difficulty = 'easy';
  currentLang: string; // current langage
  audio: HTMLAudioElement; // Audio Obj
  maxGamePoints: number;
  winProgressPercentage: number = 0;
  roundPoints: number = 0;
  showGameOverModal = false;
  isGameWon: boolean = false;
  constructor(
    @Inject(DOCUMENT) private document: any,
    public sanitizer: DomSanitizer,
    public http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private readonly joyrideService: JoyrideService
  ) {
    this.getSreenResolution(); // get screen width & height
    if (this.innerWidth < 745) {
      this.goTo('/ismobile')
    }
    let lang = localStorage.getItem('locale');
    this.currentLang = lang;
    this.options = { // left map options
      attributionControl: false,
      layers: [
        tileLayer(`https://{s}.google.com/vt/lyrs=m&hl=ar&x={x}&y={y}&z={z}&hl=${lang}`, {
          attribution: '',
          subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        })
      ],
      zoom: 7,
      center: latLng([35.0, 9.503173828125])
    }
    // get params
    this.activatedRoute.params.subscribe(params => {
      if (params.level) this.setGameLevel(params.level)
    });
    this.sanitizer = sanitizer;

  }

  ngOnInit() {
    this.elem = document.documentElement;
    this.gamerounds = GameSettings.ROUNDS
    this.startGame(); // start new game
    if (localStorage.getItem("welcomeHelp") !== "true") { // show help if user is playing the first time
      this.showHelp();
    }

  }


  ngOnDestroy() {
    this.joyrideService.closeTour();
  }


  /**
   * Toggle fullscreen
   */
  toggleFullScreen(): void {
    if (this.isFullScreen) {
      this.isFullScreen = false;
      this.closeFullscreen();
    }
    else {
      this.openFullscreen();
      this.isFullScreen = true
    }
  }

  /**
   * Make browser fullscreen
   */
  openFullscreen(): void {
    if (this.elem.requestFullscreen) {
      this.elem.requestFullscreen();
    } else if (this.elem.mozRequestFullScreen) {
      /* Firefox */
      this.elem.mozRequestFullScreen();
    } else if (this.elem.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      this.elem.webkitRequestFullscreen();
    } else if (this.elem.msRequestFullscreen) {
      /* IE/Edge */
      this.elem.msRequestFullscreen();
    }
  }

  /**
   * Close fullscreen
   */
  closeFullscreen() {
    if (this.document.exitFullscreen) {
      this.document.exitFullscreen();
    } else if (this.document.mozCancelFullScreen) {
      /* Firefox */
      this.document.mozCancelFullScreen();
    } else if (this.document.webkitExitFullscreen) {
      /* Chrome, Safari and Opera */
      this.document.webkitExitFullscreen();
    } else if (this.document.msExitFullscreen) {
      /* IE/Edge */
      this.document.msExitFullscreen();
    }
  }


  /**
   * Listen to window resize
   */
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.getSreenResolution()
    //console.log(`x = ${this.innerWidth} - y = ${this.innerHeight}`);
  }


  /**
   * When map clicked
   */
  onMapClick(event) {
    this.guesslat = event.latlng.lat;
    this.guesslong = event.latlng.lng;
    //console.log(this.guesslat, this.guesslong);
    this.removeMarker()
    this.addMarker(event.latlng.lat, event.latlng.lng);

  }


  /**
   * Get Screen Resolution
   */
  getSreenResolution() {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
    //console.log(`x = ${this.innerWidth} - y = ${this.innerHeight}`);
  }


  /**
   * Add marker to map
   * @param lat 
   * @param long 
   */
  addMarker(lat, long) {
    const newMarker = marker(
      [lat, long],
      {
        icon: icon({
          iconSize: [100, 100],
          iconAnchor: [44, 90],
          iconUrl: 'assets/pin.svg',
          shadowUrl: 'assets/shadow.png',
          shadowSize: [100, 100],
          shadowAnchor: [45, 50],

        })
      }
    );
    this.markers.push(newMarker);
  }


  /**
   * Remove marker from map
   */
  removeMarker() {
    this.markers.pop();
  }


  /**
   * When map is ready
   */
  onMapReady(map) {
    DomUtil.addClass(map._container, 'crosshair-cursor-enabled');
  }


  /**
   * Toggle welcome modal
   */
  toggleModal() {
    this.isModalOpen = !this.isModalOpen;
  }

  /**
   * Change language
   * @param lang language
   */
  setLang(lang) {
    this.lang = lang;
  }

  /**
   * Start game
   */
  startGame(): void {
    let randN = Math.floor(Math.random() * 5) + 1;
    this.http.get(`./assets/data.json`).subscribe((res: any) => {
      this.list_places = this.uniq(res);
      //console.log("before filter : ", res);
      //console.log("after filter", this.uniq(res));

      this.isModalOpen = !this.isModalOpen;
      setTimeout(() => {
        this.actualViewPlace = this.place
        this.urlSafe = this.sanitizeStreetUrl(this.actualViewPlace[0], this.actualViewPlace[1])
        this.isGameStarted = true;
      }, 0)
    });
  }

  /**
   * Return random place from list
   */
  get place(): Place {
    return this.list_places[Math.floor(Math.random() * this.list_places.length)];
  }

  /**
   * When iframe is loaded
   */
  iframeLoaded(): void {
    //console.log('iframe loaded...')
  }


  /**
   * Show Random Place
   */
  showRandomPlace() {
    this.actualViewPlace = this.place;

    this.urlSafe = this.sanitizeStreetUrl(this.actualViewPlace[0], this.actualViewPlace[1])

    //console.log(this.actualViewPlace);
  }


  /**
   * Play Confetti 
   */
  celebrate() {

    var count = 200;
    var defaults = {
      origin: { y: 0.7 },
      zIndex: 9999
    };

    function fire(particleRatio, opts) {
      confetti(Object.assign({}, defaults, opts, {
        particleCount: Math.floor(count * particleRatio)
      }));
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }

  /**
   * return sanitized streetview url
   * @param lat 
   * @param long 
   */
  sanitizeStreetUrl(lat, long) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://maps.google.com/maps?layer=c&cbll=${lat},${long}&cbp=12,20.09,,0,5&source=embed&output=svembed`);
  }

  /**
   * Calculate distance between 2 points in map (lat, long)
   */
  calculateDistance(lat1, lon1, lat2, lon2) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
      return 0;
    }
    else {
      var radlat1 = Math.PI * lat1 / 180;
      var radlat2 = Math.PI * lat2 / 180;
      var theta = lon1 - lon2;
      var radtheta = Math.PI * theta / 180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180 / Math.PI;
      dist = dist * 60 * 1.1515;
      dist = dist * 1.609344
      return dist;
    }
  }

  /**
   * when player guess
   */
  confirm() {

    if (this.guesslat === 0 && this.guesslong === 0) {
      return;
    }
    this.showRoundResult = true;
    this.distance = Math.round(this.calculateDistance(this.guesslat, this.guesslong, this.actualViewPlace[0], this.actualViewPlace[1]) * 100) / 100
    //console.log("distance", this.distance);

    // wrong answer
    if (this.distance > this.maxDistance) {
      this.roundPoints = Math.floor(this.calculateScore(this.distance) / 10);
      this.score += this.roundPoints;
      this.winProgressPercentage = this.calculateWinPercentage();
      this.playAudio('../../assets/wrong.mp3');
      this.isRoundWon = false;
      this.round++;
    }
    // correct answer
    else {
      this.roundPoints = this.calculateScore(this.distance);
      this.score += this.roundPoints;
      this.winProgressPercentage = this.calculateWinPercentage();
      //console.log(this.winProgressPercentage);

      this.celebrate();
      this.playAudio('../../assets/correct.mp3');
      this.isRoundWon = true;
      this.round++;
    }
  }

  /**
   * Close confirm modal
   */
  handlePlayNextRound() {
    this.showRoundResult = false;

    if (this.round < GameSettings.ROUNDS) {
      this.reset()
    }
    else { // 10 rounds completed
      this.showGameResult();
    }

  }

  /**
   * Reset Game
   */
  reset() {
    this.guesslat = 0; // reset guessed lat
    this.guesslong = 0; // reset guessed long
    this.actualViewPlace = this.place // get new random place (lat & long) 
    this.urlSafe = this.sanitizeStreetUrl(this.actualViewPlace[0], this.actualViewPlace[1]) // get new streetview place
    this.removeMarker(); // remove marker from left map
  }

  /**
   * Play Audio
   * @param src path
   */
  playAudio(src) {
    if (this.isAudioOn) {
      this.audio = new Audio();
      this.audio.src = src;
      this.audio.volume = 0.7;
      this.audio.load();
      this.audio.play();
    }

  }

  // reset map + streetviewer
  resetStreetView() {
    this.urlSafe = this.sanitizeStreetUrl(this.actualViewPlace[0], this.actualViewPlace[1])
  }

  // set Game level
  setGameLevel(level) {
    if (level == 'easy' || level == 'medium' || level == 'hard') {
      this.difficulty = level;

      if (level === 'easy') { //easy
        this.maxGamePoints = GameSettings.EASY_MAXGAMEPOINTS;
        this.maxDistance = GameSettings.EASY_MAXDISTANCE;
      }
      else if (level == 'medium') { //medium
        this.maxGamePoints = GameSettings.MEDIUM_MAXGAMEPOINTS;
        this.maxDistance = GameSettings.MEDIUM_MAXDISTANCE
      }
      else if (level == 'hard') { //hard
        this.maxGamePoints = GameSettings.HARD_MAXGAMEPOINTS;
        this.maxDistance = GameSettings.HARD_MAXDISTANCE;
      }
      else { // default level == easy
        this.maxGamePoints = GameSettings.EASY_MAXGAMEPOINTS;
        this.maxDistance = GameSettings.EASY_MAXDISTANCE;
      }
    }
    // wrong param
    else {
      this.difficulty = 'easy';
      this.maxDistance = GameSettings.EASY_MAXGAMEPOINTS;
      this.maxGamePoints = GameSettings.EASY_MAXDISTANCE;
    }

  }

  // Helper function - remove duplicates from Array
  uniq(a) {
    var seen = {};
    return a.filter(function (item) {
      return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
  }

  // DEBUG: open streetview in new page
  debug__openStreetView() {
    window.open(`https://maps.google.com/maps?layer=c&cbll=${this.actualViewPlace[0]},${this.actualViewPlace[1]}&cbp=12,20.09,,0,5`, "_blank");
  }



  /**
   * Copy string to clipboard
   * @param str string
   */
  copyToClipboard(str) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = str;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  /**
   * Toggle Audio
   */
  toggleAudio() {
    this.isAudioOn = !this.isAudioOn;
    if (!this.isAudioOn) {
      this.audio.volume = 0;
    }
    else {
      this.audio.volume = 0.7;
    }
  }

  convertInt2b64(num) {
    return btoa(num);
  }


  calculateScore(distance) {
    let MAX_SCORE_IN_ROUND = 500;
    // formula: MAX_SCORE_IN_GAME * e^(- distance / 2000)
    // https://www.reddit.com/r/geoguessr/comments/7fon8u/geomath_deriving_the_geoguessr_point_formula/

    let score = Math.round((MAX_SCORE_IN_ROUND * Math.pow(Math.E, (- distance / 2000))));
    //console.log('score', score);
    return score;
  }

  // return calculate percentage
  calculateWinPercentage() {
    let result = Math.floor((this.score / this.maxGamePoints) * 100);
    if (result < 100) {
      return result
    }
    else {
      return 100;
    }
  }

  /**
   * Go to Home Page
   */
  goTo(path) {
    if (path.includes('https://')) {
      window.open(path, "_blank");
    }
    else {
      this.router.navigate([path]);
    }

  }

  /**
   * Show Game Result Modal
   */
  showGameResult() {

    if (this.score < this.maxGamePoints) {
      // game lost
      this.isGameWon = false;
      this.playAudio('../../assets/losegame.mp3');
      this.showGameOverModal = true;
    }
    else {
      // game won
      this.isGameWon = true;
      this.celebrate()
      this.playAudio('../../assets/wingame.mp3');
      this.showGameOverModal = true;
    }

  }

  /**
   * Repeat game
   * Refresh Page
   */
  handleReplay() {
    this.router.navigate(['/']);
  }

  /**
   * Show help
   */
  showHelp() {

    this.translate.get([
      'home.next',
      'home.back',
      'home.start',
    ]).subscribe((res: any) => {
      this.joyrideService.startTour(
        {
          steps: ['firstStep', 'secondStep', 'roundsStep', 'yourscoreStep', 'thirdStep'],
          showPrevButton: false,
          customTexts: {
            next: res['home.next'],
            prev: res['home.back'],
            done: res['home.start'],
          },
          stepDefaultPosition: 'top',
          showCounter: true,



        } // Your steps order
      );
    });

  }

  /**
   * When help is done
   */
  helpOnDone() {
    localStorage.setItem("welcomeHelp", JSON.stringify(true));
  }
}
