//@Packages
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';

//@Services
import { AuthService } from './auth.service';
import { StorageService } from '../storage.service';
import { CommonService } from '../common.service';


@Injectable()
export class AuthGuard implements CanActivate {

  constructor(public auth: AuthService,
    public router: Router,
    public commonService: CommonService,
    public storageService: StorageService) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    // if (!this.auth.isAuthenticated()) {
    //   this.router.navigate(['']);
    //   return false;
    // }

    const url = route.routeConfig.path;
    const userAccessRole = this.storageService.getUserAccessRole();

    let isPageAccessible = true;    
    //Check Access by CRUD Operation.
    switch (url) {
      case "user-profile": //Default pages
        isPageAccessible = true;
      case "add-company":
      case "add-chemical":
      case "add-crop":
      case "add-disease":
      case "add-pest":
      case "add-sensor":
      case "subscription":
      case "add-contact-profile":
      case "company-access":
      case "contact-access":
      case "add-location":
      case "add-irrigation":
      case "irrigation-location":
      case "add-watersource":
      case "watersource-location":
        isPageAccessible = this.commonService.hasCreateAccess(userAccessRole);
        break;
      case "list-company":
      case "list-chemical":
      case "list-crop":
      case "list-disease":
      case "list-pest":
      case "list-sensor":
      case "subscription":
      case "list-contact-profile":
      case "company-access":
      case "contact-access":
      case "list-location":
      case "list-irrigation":
      case "irrigation-location":
      case "list-watersource":
      case "watersource-location":
        isPageAccessible = this.commonService.hasReadAccess(userAccessRole);
        break;
      case "edit-company/:id":
      case "edit-chemical/:id":
      case "edit-crop/:id":
      case "edit-disease/:id":
      case "edit-pest/:id":
      case "edit-sensor/:id":
      case "subscription":
      case "edit-contact-profile/:id":
      case "company-access":
      case "contact-access":
      case "edit-location/:id":
      case "edit-irrigation/:id":
      case "irrigation-location":
      case "edit-watersource/:id":
      case "watersource-location":
        isPageAccessible = this.commonService.hasUpdateAccess(userAccessRole);
        break;
      case "view-company/:id":
      case "view-chemical/:id":
      case "view-crop/:id":
      case "view-disease/:id":
      case "view-pest/:id":
      case "view-sensor/:id":
      case "subscription":
      case "view-contact-profile/:id":
      case "company-access":
      case "contact-access":
      case "view-location/:id":
      case "view-irrigation/:id":
      case "irrigation-location":
      case "view-watersource/:id":
      case "watersource-location":
        isPageAccessible = this.commonService.hasReadAccess(userAccessRole);
        break;
      default:
        isPageAccessible = false;
        break;
    }

    //Check Access by Master Data Page 
    const entity = (route.data as any).Entity;
    if (!this.commonService.isNullOrEmpty(entity)) {
      switch (entity) {
        case "Company":
        case "Subscription":
          if (userAccessRole != "AgrisourceData Admin") {
            isPageAccessible = false;
          }
          break;
        case "Chemical":
        case "Crop":
        case "Disease":
        case "Pest":
        case "Sensor":
          if (!(userAccessRole == "AgrisourceData Admin" || userAccessRole == "AgrisourceData Expert")) {
            isPageAccessible = false;
          }
          break;
        case "ContactProfile":
        case "CompanyAccess":
        case "ContactAccess":
        case "Irrigation":
        case "Location":
        case "WaterSource":        
          if (!(userAccessRole == "Administrator" || userAccessRole == "Management"
                || userAccessRole == "Expert - Internal" || userAccessRole == "Expert - External")) {
            isPageAccessible = false;
          }
          break;
      }
    }

    if (isPageAccessible) {
      const isSelectCompany = (route.data as any).IsSelectCompany;
      if (isSelectCompany == true) {

        if (this.commonService.isNullOrEmpty(this.storageService.getCompanyId())) {
          this.storageService.removeParentCompanyId();
          this.storageService.removeCompanyId();
          this.storageService.removeCompanyName();
          this.router.navigate(['/select-company']);
          return true;
        }
      }
    } else {
      this.router.navigate(['/unauthorize']);
      return false;
    }

    return true;
  }
}
