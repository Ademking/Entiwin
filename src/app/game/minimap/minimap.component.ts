import { Component, OnInit, Input } from '@angular/core';
import { icon, latLng, Layer, marker, tileLayer, DomUtil, Map, latLngBounds, LatLngTuple, circle, polygon, polyline, LatLng } from 'leaflet';

@Component({
  selector: 'app-minimap',
  templateUrl: './minimap.component.html',
  styleUrls: ['./minimap.component.css']
})
export class MinimapComponent implements OnInit {

  @Input() coordinates: any[] = [];

  options: any;
  fitBounds: any;
  layers = [];
  ngOnInit() {
    this.layers = [
      marker([this.coordinates[0], this.coordinates[1]], {
        icon: icon({
          iconSize: [50, 50],
          iconAnchor: [22, 45],
          iconUrl: 'assets/pin.svg',
          shadowUrl: 'assets/shadow.png',
          shadowSize: [50, 50],
          shadowAnchor: [22, 25],

        })
      }),
      marker([this.coordinates[2], this.coordinates[3]], {
        icon: icon({
          iconSize: [50, 50],
          iconAnchor: [10, 45],
          iconUrl: 'assets/flag.svg',
          shadowUrl: 'assets/shadow.png',
          shadowSize: [50, 50],
          shadowAnchor: [22, 25],

        })
      }),
      polyline([[this.coordinates[0], this.coordinates[1]], [this.coordinates[2], this.coordinates[3]]], {
        color: 'red',
        weight: 3,
        opacity: 0.5,
        smoothFactor: 1
      }),
    ]
    let lang = localStorage.getItem('locale');
    this.options = {
      attributionControl: false,
      layers: [
        tileLayer(`https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&hl=${lang}`, {
          attribution: '',
          subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        })
      ],
      zoom: 7,
      center: latLng([this.coordinates[2], this.coordinates[3]])
    };

    this.fitBounds = latLngBounds([this.coordinates[0], this.coordinates[1]], [this.coordinates[2], this.coordinates[3]]);
  }


  mapFitToBoundsOptions = { maxZoom: 12, animate: false, padding: [10, 10] };
}
