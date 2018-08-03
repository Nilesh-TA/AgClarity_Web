import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Router } from "@angular/router";
import { error } from 'util';
import { CONFIG } from '../../constant/config';
import { HttpService } from '../http.service';
import { SecureService } from '../secure.service';
import { StorageService } from '../storage.service';
import { CommonService } from '../common.service';
import { CompanyService } from '../company.service';
import { DictionaryService } from '../dictionary.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, filter, catchError, mergeMap } from 'rxjs/operators';
import { pipe } from '@angular/core/src/render3/pipe';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Create a stream of logged in status to communicate throughout app
  loggedIn: boolean;
  loggedIn$ = new BehaviorSubject<boolean>(this.loggedIn);

  private apiUrl: string;

  constructor(public router: Router,
    private _api: CONFIG,
    private _httpService: HttpService,
    private _storageService: StorageService,
    private _commonService: CommonService,
    private _companyService: CompanyService,
    private _dictionaryService: DictionaryService,
    private _secureService: SecureService) {

    if (this.tokenValid) {
      this.setLoggedIn(true);
    } else {
      //this.logout();
      this.setDefaultLogin();
    }

    this.apiUrl = _api.ServerWithApiUrl;
  }

  login(credentials) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this._api.setAuthHeader(headers);

    const self = this;
    return this._httpService.post(`${this.apiUrl}authenticate`, credentials, { headers: headers })
      .pipe(
        map((response: any) => {
          return response;
        }), catchError((errorRes: any) => {
          return this._secureService.handleError(errorRes, `${this.apiUrl}authenticate`);
        })
      );
  }

  setLoggedIn(value: boolean) {
    // Update login status subject
    this.loggedIn$.next(value);
    this.loggedIn = value;
  }

  setSession(authResult) {
    // Set tokens and expiration in localStorage and props
    this._storageService.setCredentials(authResult);

    // Update login status in loggedIn$ stream
    this.setLoggedIn(true);
  }


  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // access token's expiry time
    const expiresAt = JSON.parse(this._storageService.getTokenExpireAt());
    return new Date().getTime() < expiresAt;
  }

  get tokenValid(): boolean {
    // Check if current time is past access token's expiration
    const expiresAt = JSON.parse(this._storageService.getTokenExpireAt());
    return Date.now() < expiresAt;
  }

  logout() {
    // Ensure all auth items removed from localStorage
    this._storageService.clearCredentials();

    // Reset local properties, update loggedIn$ stream    
    this.setLoggedIn(false);

    // Return to homepage
    this.router.navigate(['/']);
  }

  setDefaultLogin() {

    //AgrisourceData Admin
    let profile = {
      data: {
        ID_profile: 5,
        first_name: "John",
        last_name: "Doe",
        title: "Admin",
        responsibility_level: "executive",
        preferred_contact_method: "email",
        secondary_contact_method: "text",
        address_1: "1000 Northfield Ct",
        address_2: "Suite 110",
        city: "Atlanta",
        state: "GA",
        postal_code: "30072",
        country: "USA",
        company: "5",
        type: "",
        access_role: "AgrisourceData Admin",  //AgrisourceData Admin
        language: "English"
      },
      access_token: "eyJ0eXAiOiJKV1QiLCJhb",
      expiresIn: 86400 // expires in 24 hours
    };


    //Bind dropdown values    
    Promise.all(
      [
        this.getMasterData(this._commonService.getMasterDataCode(profile.data.access_role)),
        this.getCompanies(profile.data.ID_profile)
      ]).then((data: any) => {

        if (data != null) {          
          let masterDataResult = data[0];
          let companyResult = data[1];

          //Master Data 
          if (masterDataResult != null && masterDataResult.success) {
            let masterDataItems = masterDataResult.data;
            if (masterDataItems.success) {
              profile["masterdata"] = masterDataItems.data;
            }
          }

          //Company Detail
          if (companyResult != null && companyResult.success) {
            let companyInfo = companyResult.data;
            if (companyInfo.success) {
              const companyList = companyInfo.data;
              profile["companies"] = companyList;              

              if (companyList != null) {

                if (companyList.length == 1) {
                  const companyName = companyList[0].name;
                  const companyId = companyList[0].ID_company;
                  const parentCompanyId = companyList[0].related_to;

                  this._storageService.setParentCompanyId(parentCompanyId);
                  this._storageService.setCompanyId(companyId);
                  this._storageService.setCompanyName(companyName);
                }

                this._storageService.setCredentials(profile);
              }
            }
          }
          this._commonService.hideLoader();
          //this.router.navigate(['list-company']);
        }
      }).catch((error) => {
        this._commonService.hideLoader();
        console.error(error);
      });
  }

  setAdministratorLogin() {

    //Administrator
    let profile = {
      data: {
        ID_profile: 2,
        first_name: "John",
        last_name: "Tulsa",
        title: "Agronomist",
        responsibility_level: "agronomist",
        preferred_contact_method: "text",
        secondary_contact_method: "email",
        address_1: "",
        address_2: "",
        city: "Henderson",
        state: "MN",
        postal_code: "56044",
        country: "US",
        company: "1",
        type: "",
        access_role: "Administrator",  //Administrator
        language: "English"
      },
      access_token: "eyJ0eXAiOiJKV1QiLCJhb",
      expiresIn: 86400 // expires in 24 hours
    };

    //Bind dropdown values    
    Promise.all(
      [
        this.getMasterData(this._commonService.getMasterDataCode(profile.data.access_role)),
        this.getCompanies(profile.data.ID_profile)
      ]).then((data: any) => {

        if (data != null) {          
          let masterDataResult = data[0];
          let companyResult = data[1];

          //Master Data 
          if (masterDataResult != null && masterDataResult.success) {
            let masterDataItems = masterDataResult.data;
            if (masterDataItems.success) {
              profile["masterdata"] = masterDataItems.data;
            }
          }

          //Company Detail
          if (companyResult != null && companyResult.success) {
            let companyInfo = companyResult.data;
            if (companyInfo.success) {
              const companyList = companyInfo.data;
              profile["companies"] = companyList;              

              if (companyList != null) {

                if (companyList.length == 1) {
                  const companyName = companyList[0].name;
                  const companyId = companyList[0].ID_company;
                  const parentCompanyId = companyList[0].related_to;
                  
                  this._storageService.setParentCompanyId(parentCompanyId);
                  this._storageService.setCompanyId(companyId);
                  this._storageService.setCompanyName(companyName);
                }

                this._storageService.setCredentials(profile);
              }
            }
          }
          this._commonService.hideLoader();
          //this.router.navigate(['list-company']);
        }
      }).catch((error) => {
        this._commonService.hideLoader();
        console.error(error);
      });
  }

  getMasterData(code: string) {
    return new Promise((resolve, reject) => {
      this._dictionaryService.getDictionaryByCode(code).subscribe(res => {
        resolve({ success: true, data: res });
      }, error => {
        resolve({ success: false, data: error });
      });
    });
  }

  getCompanies(profileId: number) {
    return new Promise((resolve, reject) => {
      this._companyService.getCompanyByContactProfileId(profileId).subscribe(res => {
        resolve({ success: true, data: res });
      }, error => {
        resolve({ success: false, data: error });
      });
    });
  }
}
