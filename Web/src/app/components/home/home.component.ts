import { Component, OnInit, ViewChild } from '@angular/core';
import { } from '@types/googlemaps';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;
  constructor() { }

  ngOnInit() {
    var mapProp = {
      center: new google.maps.LatLng(-34.397, 150.644),
      zoom: 10,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
  }

}
