//@Packages
import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { map, catchError } from 'rxjs/operators';

//@Constant
import { CONFIG } from '../constant/config';

//@Model
import { CompanyVM } from '../models/CompanyVM';

//@Services
import { HttpService } from './http.service';
import { SecureService } from './secure.service';


@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private apiUrl: string;

  constructor(private _api: CONFIG,
    private _httpService: HttpService,
    private _secureService: SecureService) {
    this.apiUrl = _api.ServerWithApiUrl;
  }


  searchCompanies(company: number, pageno: number, pagesize: number) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this._api.setAuthHeader(headers);

    return this._httpService.get(`${this.apiUrl}company?company=${company}&pageno=${pageno}&pagesize=${pagesize}`, { headers: headers })
      .pipe(
        map((response: any) => {
          return response.json();
        }), catchError((errorRes: any) => {
          return this._secureService.handleError(errorRes, `${this.apiUrl}company?company=${company}&pageno=${pageno}&pagesize=${pagesize}`);
        })
      );
  }

  getCompanies() {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this._api.setAuthHeader(headers);

    return this._httpService.get(`${this.apiUrl}company/GetCompanies`, { headers: headers })
      .pipe(
        map((response: any) => {
          return response.json();
        }), catchError((errorRes: any) => {
          return this._secureService.handleError(errorRes, `${this.apiUrl}company/GetCompanies`);
        })
      );
  }

  getCompanyById(id: number) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this._api.setAuthHeader(headers);

    return this._httpService.get(`${this.apiUrl}company/${id}`, { headers: headers })
      .pipe(
        map((response: any) => {
          return response.json();
        }), catchError((errorRes: any) => {
          return this._secureService.handleError(errorRes, `${this.apiUrl}company/${id}`);
        })
      );
  }

  createCompany(company: CompanyVM) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this._api.setAuthHeader(headers);

    const postBody = JSON.stringify(company);    

    return this._httpService.post(`${this.apiUrl}company`, postBody, { headers: headers })
      .pipe(
        map((response: any) => {
          return response.json();
        }), catchError((errorRes: any) => {          
          return this._secureService.handleError(errorRes, `${this.apiUrl}company`);
        })
      );
  }

  updateCompany(company: CompanyVM) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this._api.setAuthHeader(headers);

    const postBody = JSON.stringify(company);    

    return this._httpService.put(`${this.apiUrl}company/${company.ID_company}`, postBody, { headers: headers })
      .pipe(
        map((response: any) => {
          return response.json();
        }), catchError((errorRes: any) => {
          return this._secureService.handleError(errorRes, `${this.apiUrl}company/${company.ID_company}`);
        })
      );
  }

  deleteCompany(id: number) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this._api.setAuthHeader(headers);

    return this._httpService.delete(`${this.apiUrl}company/${id}`, { headers: headers })
      .pipe(
        map((response: any) => {
          return response.json();
        }), catchError((errorRes: any) => {
          return this._secureService.handleError(errorRes, `${this.apiUrl}company/${id}`);
        })
      );
  }

  getCompanyByContactProfileId(id: number) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this._api.setAuthHeader(headers);

    return this._httpService.get(`${this.apiUrl}company/GetCompanyByContactProfileId?id=${id}`, { headers: headers })
      .pipe(
        map((response: any) => {
          return response.json();
        }), catchError((errorRes: any) => {
          return this._secureService.handleError(errorRes, `${this.apiUrl}company/GetCompanyByContactProfileId?id=${id}`);
        })
      );
  }

  getRelatedCompanyById(id: number) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this._api.setAuthHeader(headers);

    return this._httpService.get(`${this.apiUrl}company/GetRelatedCompanyById?id=${id}`, { headers: headers })
      .pipe(
        map((response: any) => {
          return response.json();
        }), catchError((errorRes: any) => {
          return this._secureService.handleError(errorRes, `${this.apiUrl}company/GetRelatedCompanyById?id=${id}`);
        })
      );
  }

  trackUserAction(action, appname, user, id, oldcompany: any, newcompany: any) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this._api.setAuthHeader(headers);

    let obj = {
      old: oldcompany,
      new: newcompany
    }

    const postBody = JSON.stringify(obj);

    return this._httpService.post(`${this.apiUrl}company/TrackUserAction?action=${action}&appname=${appname}&user=${user}&id=${id}`, postBody, { headers: headers })
      .pipe(
        map((response: any) => {
          return response.json();
        }), catchError((errorRes: any) => {
          return this._secureService.handleError(errorRes, `${this.apiUrl}company/TrackUserAction?action=${action}&appname=${appname}&user=${user}&id=${id}`);
        })
      );
  }
}
