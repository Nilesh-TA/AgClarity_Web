//@Packages
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

//@Services
import { CommonService } from '../../../services/common.service';
import { StorageService } from '../../../services/storage.service';


@Component({
  selector: 'app-left-menu',
  templateUrl: './app-left-menu.component.html',
  styleUrls: ['./app-left-menu.component.css']
})
export class AppLeftMenuComponent implements OnInit {
  constructor(private router: Router,
    public commonService: CommonService,
    public storageService: StorageService) {
  }

  ngOnInit() {
  }

  redirectTo(pageName) {
    if (!this.commonService.isNullOrEmpty(pageName)) {

      this.storageService.clearCompanySelection();      

      //Redirect page.
      switch (pageName) {
        case "Dictionary":
          this.router.navigate(['list-dictionary']);
          break;
        case "Chemical":
          this.router.navigate(['list-chemical']);
          break;
        case "Company":
          this.router.navigate(['list-company']);
          break;
        case "Crop":
          this.router.navigate(['list-crop']);
          break;
        case "Disease":
          this.router.navigate(['list-disease']);
          break;
        case "Pest":
          this.router.navigate(['list-pest']);
          break;
        case "Sensor":
          this.router.navigate(['list-sensor']);
          break;
        case "Subscription":
          this.router.navigate(['subscription']);
          break;
        case "ContactProfile":
          this.router.navigate(['list-contact-profile']);
          break;
        case "Irrigation":
          this.router.navigate(['list-irrigation']);
          break;
        case "Location":
          this.router.navigate(['list-location']);
          break;
        case "WaterSource":
          this.router.navigate(['list-watersource']);
          break;
      }
    }
  }

}
