//@Packages
import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { map, catchError } from 'rxjs/operators';

//@Constant
import { CONFIG } from '../constant/config';

//@Model
import { ContactProfileVM } from '../models/ContactProfileVM';

//@Services
import { HttpService } from './http.service';
import { SecureService } from './secure.service';


@Injectable({
  providedIn: 'root'
})
export class ContactProfileService {

  private apiUrl: string;

  constructor(private _api: CONFIG,
    private _httpService: HttpService,
    private _secureService: SecureService) {
    this.apiUrl = _api.ServerWithApiUrl;
  }

  public contactProfileFormData: any;
  public companyAccessFormData: any;
  public contactAccessFormData: any;
  public contactAccessSelectedMicroAppData: any;
  public pageSource: any;

  searchContactProfiles(company: number, pageno: number, pagesize: number) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this._api.setAuthHeader(headers);

    return this._httpService.get(`${this.apiUrl}contactprofile?company=${company}&pageno=${pageno}&pagesize=${pagesize}`, { headers: headers })
      .pipe(
        map((response: any) => {
          return response.json();
        }), catchError((errorRes: any) => {
          return this._secureService.handleError(errorRes, `${this.apiUrl}contactprofile?company=${company}&pageno=${pageno}&pagesize=${pagesize}`);
        })
      );
  }

  getContactProfiles() {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this._api.setAuthHeader(headers);

    return this._httpService.get(`${this.apiUrl}contactprofile/GetContactProfiles`, { headers: headers })
      .pipe(
        map((response: any) => {
          return response.json();
        }), catchError((errorRes: any) => {
          return this._secureService.handleError(errorRes, `${this.apiUrl}contactprofile/GetContactProfiles`);
        })
      );
  }

  getContactProfileById(id: number) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this._api.setAuthHeader(headers);

    return this._httpService.get(`${this.apiUrl}contactprofile/${id}`, { headers: headers })
      .pipe(
        map((response: any) => {
          return response.json();
        }), catchError((errorRes: any) => {
          return this._secureService.handleError(errorRes, `${this.apiUrl}contactprofile/${id}`);
        })
      );
  }

  createContactProfile(ContactProfile: ContactProfileVM) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this._api.setAuthHeader(headers);

    const postBody = JSON.stringify(ContactProfile);

    return this._httpService.post(`${this.apiUrl}contactprofile`, postBody, { headers: headers })
      .pipe(
        map((response: any) => {
          return response.json();
        }), catchError((errorRes: any) => {
          return this._secureService.handleError(errorRes, `${this.apiUrl}contactprofile`);
        })
      );
  }

  updateContactProfile(ContactProfile: ContactProfileVM) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this._api.setAuthHeader(headers);

    const postBody = JSON.stringify(ContactProfile);

    return this._httpService.put(`${this.apiUrl}contactprofile/${ContactProfile.ID_profile}`, postBody, { headers: headers })
      .pipe(
        map((response: any) => {
          return response.json();
        }), catchError((errorRes: any) => {
          return this._secureService.handleError(errorRes, `${this.apiUrl}contactprofile/${ContactProfile.ID_profile}`);
        })
      );
  }

  updateUserProfile(ContactProfile: ContactProfileVM) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this._api.setAuthHeader(headers);

    const postBody = JSON.stringify(ContactProfile);

    return this._httpService.put(`${this.apiUrl}contactprofile/UpdateUserProfile?id=${ContactProfile.ID_profile}`, postBody, { headers: headers })
      .pipe(
        map((response: any) => {
          return response.json();
        }), catchError((errorRes: any) => {
          return this._secureService.handleError(errorRes, `${this.apiUrl}contactprofile/UpdateUserProfile?id=${ContactProfile.ID_profile}`);
        })
      );
  }

  deleteContactProfile(id: number) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this._api.setAuthHeader(headers);

    return this._httpService.delete(`${this.apiUrl}contactprofile/${id}`, { headers: headers })
      .pipe(
        map((response: any) => {
          return response.json();
        }), catchError((errorRes: any) => {
          return this._secureService.handleError(errorRes, `${this.apiUrl}contactprofile/${id}`);
        })
      );
  }

  trackUserAction(action, appname, user, id, oldContactProfile: any, newContactProfile: any) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this._api.setAuthHeader(headers);

    let obj = {
      old: oldContactProfile,
      new: newContactProfile
    }

    const postBody = JSON.stringify(obj);

    return this._httpService.post(`${this.apiUrl}contactprofile/TrackUserAction?action=${action}&appname=${appname}&user=${user}&id=${id}`, postBody, { headers: headers })
      .pipe(
        map((response: any) => {
          return response.json();
        }), catchError((errorRes: any) => {
          return this._secureService.handleError(errorRes, `${this.apiUrl}contactprofile/TrackUserAction?action=${action}&appname=${appname}&user=${user}&id=${id}`);
        })
      );
  }

  phoneCRUD(body: any) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this._api.setAuthHeader(headers);

    const postBody = JSON.stringify(body);

    return this._httpService.post(`${this.apiUrl}phone/PhoneCRUD`, postBody, { headers: headers })
      .pipe(
        map((response: any) => {
          return response.json();
        }), catchError((errorRes: any) => {
          return this._secureService.handleError(errorRes, `${this.apiUrl}phone/PhoneCRUD`);
        })
      );
  }

  emailCRUD(body: any) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this._api.setAuthHeader(headers);

    const postBody = JSON.stringify(body);

    return this._httpService.post(`${this.apiUrl}email/EmailCRUD`, postBody, { headers: headers })
      .pipe(
        map((response: any) => {
          return response.json();
        }), catchError((errorRes: any) => {
          return this._secureService.handleError(errorRes, `${this.apiUrl}email/EmailCRUD`);
        })
      );
  }

  contactaccessCRUD(body: any) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this._api.setAuthHeader(headers);

    const postBody = JSON.stringify(body);

    return this._httpService.post(`${this.apiUrl}contactaccess/ContactaccessCRUD`, postBody, { headers: headers })
      .pipe(
        map((response: any) => {
          return response.json();
        }), catchError((errorRes: any) => {
          return this._secureService.handleError(errorRes, `${this.apiUrl}contactaccess/ContactaccessCRUD`);
        })
      );
  }

  companyaccessCRUD(body: any) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this._api.setAuthHeader(headers);

    const postBody = JSON.stringify(body);

    return this._httpService.post(`${this.apiUrl}companyaccess/CompanyaccessCRUD`, postBody, { headers: headers })
      .pipe(
        map((response: any) => {
          return response.json();
        }), catchError((errorRes: any) => {
          return this._secureService.handleError(errorRes, `${this.apiUrl}companyaccess/CompanyaccessCRUD`);
        })
      );
  }

  getPhoneByContactProfileId(id: number) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this._api.setAuthHeader(headers);

    return this._httpService.get(`${this.apiUrl}phone/GetPhoneByContactProfileId?id=${id}`, { headers: headers })
      .pipe(
        map((response: any) => {
          return response.json();
        }), catchError((errorRes: any) => {
          return this._secureService.handleError(errorRes, `${this.apiUrl}phone/GetPhoneByContactProfileId?id=${id}`);
        })
      );
  }

  getEmailByContactProfileId(id: number) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this._api.setAuthHeader(headers);

    return this._httpService.get(`${this.apiUrl}email/GetEmailByContactProfileId?id=${id}`, { headers: headers })
      .pipe(
        map((response: any) => {
          return response.json();
        }), catchError((errorRes: any) => {
          return this._secureService.handleError(errorRes, `${this.apiUrl}email/GetEmailByContactProfileId?id=${id}`);
        })
      );
  }

  getSelectedMicroApps(profileId: number, companyId: number) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this._api.setAuthHeader(headers);

    return this._httpService.get(`${this.apiUrl}contactaccess/GetSelectedMicroApps?profileid=${profileId}&companyid=${companyId}`, { headers: headers })
      .pipe(
        map((response: any) => {
          return response.json();
        }), catchError((errorRes: any) => {
          return this._secureService.handleError(errorRes, `${this.apiUrl}contactaccess/GetSelectedMicroApps?profileid=${profileId}&companyid=${companyId}`);
        })
      );
  }

  getContactAccessByProfileId(profileId: number) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this._api.setAuthHeader(headers);

    return this._httpService.get(`${this.apiUrl}contactaccess/GetContactAccessByProfileId?profileid=${profileId}`, { headers: headers })
      .pipe(
        map((response: any) => {
          return response.json();
        }), catchError((errorRes: any) => {
          return this._secureService.handleError(errorRes, `${this.apiUrl}contactaccess/GetContactAccessByProfileId?profileid=${profileId}`);
        })
      );
  }

  getCompanyAccessByProfileId(profileId: number) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this._api.setAuthHeader(headers);

    return this._httpService.get(`${this.apiUrl}companyaccess/GetCompanyAccessByProfileId?profileid=${profileId}`, { headers: headers })
      .pipe(
        map((response: any) => {
          return response.json();
        }), catchError((errorRes: any) => {
          return this._secureService.handleError(errorRes, `${this.apiUrl}companyaccess/GetCompanyAccessByProfileId?profileid=${profileId}`);
        })
      );
  }
}
