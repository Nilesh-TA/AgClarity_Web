//@Packages
import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { map, catchError } from 'rxjs/operators';

//@Constant
import { CONFIG } from '../constant/config';

//@Model
import { ChemicalVM } from '../models/ChemicalVM';

//@Services
import { HttpService } from './http.service';
import { SecureService } from './secure.service';


@Injectable({
  providedIn: 'root'
})

export class ChemicalService {

  private apiUrl: string;

  constructor(private _api: CONFIG,
    private _httpService: HttpService,
    private _secureService: SecureService) {
    this.apiUrl = _api.ServerWithApiUrl;
  }

  searchChemicals(company: number, pageno: number, pagesize: number) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this._api.setAuthHeader(headers);

    return this._httpService.get(`${this.apiUrl}chemical?company=${company}&pageno=${pageno}&pagesize=${pagesize}`, { headers: headers })
      .pipe(
        map((response: any) => {
          return response.json();
        }), catchError((errorRes: any) => {
          return this._secureService.handleError(errorRes, `${this.apiUrl}chemical?company=${company}&pageno=${pageno}&pagesize=${pagesize}`);
        })
      );
  }

  getChemicals() {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this._api.setAuthHeader(headers);

    return this._httpService.get(`${this.apiUrl}chemical/GetChemicals`, { headers: headers })
      .pipe(
        map((response: any) => {
          return response.json();
        }), catchError((errorRes: any) => {
          return this._secureService.handleError(errorRes, `${this.apiUrl}chemical/GetChemicals`);
        })
      );
  }

  getChemicalById(id: number) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this._api.setAuthHeader(headers);

    return this._httpService.get(`${this.apiUrl}chemical/${id}`, { headers: headers })
      .pipe(
        map((response: any) => {
          return response.json();
        }), catchError((errorRes: any) => {
          return this._secureService.handleError(errorRes, `${this.apiUrl}chemical/${id}`);
        })
      );
  }

  createChemical(chemical: ChemicalVM) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this._api.setAuthHeader(headers);

    const postBody = JSON.stringify(chemical);    

    return this._httpService.post(`${this.apiUrl}chemical`, postBody, { headers: headers })
      .pipe(
        map((response: any) => {
          return response.json();
        }), catchError((errorRes: any) => {          
          return this._secureService.handleError(errorRes, `${this.apiUrl}chemical`);
        })
      );
  }

  updateChemical(chemical: ChemicalVM) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this._api.setAuthHeader(headers);

    const postBody = JSON.stringify(chemical);    

    return this._httpService.put(`${this.apiUrl}chemical/${chemical.ID_chemical}`, postBody, { headers: headers })
      .pipe(
        map((response: any) => {
          return response.json();
        }), catchError((errorRes: any) => {
          return this._secureService.handleError(errorRes, `${this.apiUrl}chemical/${chemical.ID_chemical}`);
        })
      );
  }

  deleteChemical(id: number) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this._api.setAuthHeader(headers);

    return this._httpService.delete(`${this.apiUrl}chemical/${id}`, { headers: headers })
      .pipe(
        map((response: any) => {
          return response.json();
        }), catchError((errorRes: any) => {
          return this._secureService.handleError(errorRes, `${this.apiUrl}chemical/${id}`);
        })
      );
  }

  trackUserAction(action, appname, user, id, oldchemical: any, newchemical: any) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this._api.setAuthHeader(headers);

    let obj = {
      old: oldchemical,
      new: newchemical
    }

    const postBody = JSON.stringify(obj);

    return this._httpService.post(`${this.apiUrl}chemical/TrackUserAction?action=${action}&appname=${appname}&user=${user}&id=${id}`, postBody, { headers: headers })
      .pipe(
        map((response: any) => {
          return response.json();
        }), catchError((errorRes: any) => {
          return this._secureService.handleError(errorRes, `${this.apiUrl}chemical/TrackUserAction?action=${action}&appname=${appname}&user=${user}&id=${id}`);
        })
      );
  }

}
