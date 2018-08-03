//@Packages
import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { map, catchError } from 'rxjs/operators';

//@Constant
import { CONFIG } from '../constant/config';

//@Model
import { DiseaseVM } from '../models/DiseaseVM';

//@Services
import { HttpService } from './http.service';
import { SecureService } from './secure.service';

@Injectable({
  providedIn: 'root'
})
export class DiseaseService {

  private apiUrl: string;

  constructor(private _api: CONFIG,
    private _httpService: HttpService,
    private _secureService: SecureService) {
    this.apiUrl = _api.ServerWithApiUrl;
  }

  searchDiseases(company: number, pageno: number, pagesize: number) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this._api.setAuthHeader(headers);

    return this._httpService.get(`${this.apiUrl}disease?company=${company}&pageno=${pageno}&pagesize=${pagesize}`, { headers: headers })
      .pipe(
        map((response: any) => {
          return response.json();
        }), catchError((errorRes: any) => {
          return this._secureService.handleError(errorRes, `${this.apiUrl}disease?company=${company}&pageno=${pageno}&pagesize=${pagesize}`);
        })
      );
  }

  getDiseases() {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this._api.setAuthHeader(headers);

    return this._httpService.get(`${this.apiUrl}disease/GetDiseases`, { headers: headers })
      .pipe(
        map((response: any) => {
          return response.json();
        }), catchError((errorRes: any) => {
          return this._secureService.handleError(errorRes, `${this.apiUrl}disease/GetDiseases`);
        })
      );
  }

  getDiseaseById(id: number) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this._api.setAuthHeader(headers);

    return this._httpService.get(`${this.apiUrl}disease/${id}`, { headers: headers })
      .pipe(
        map((response: any) => {
          return response.json();
        }), catchError((errorRes: any) => {
          return this._secureService.handleError(errorRes, `${this.apiUrl}disease/${id}`);
        })
      );
  }

  createDisease(Disease: DiseaseVM) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this._api.setAuthHeader(headers);

    const postBody = JSON.stringify(Disease);

    return this._httpService.post(`${this.apiUrl}disease`, postBody, { headers: headers })
      .pipe(
        map((response: any) => {
          return response.json();
        }), catchError((errorRes: any) => {
          return this._secureService.handleError(errorRes, `${this.apiUrl}disease`);
        })
      );
  }

  updateDisease(Disease: DiseaseVM) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this._api.setAuthHeader(headers);

    const postBody = JSON.stringify(Disease);

    return this._httpService.put(`${this.apiUrl}disease/${Disease.ID_disease}`, postBody, { headers: headers })
      .pipe(
        map((response: any) => {
          return response.json();
        }), catchError((errorRes: any) => {
          return this._secureService.handleError(errorRes, `${this.apiUrl}disease/${Disease.ID_disease}`);
        })
      );
  }

  deleteDisease(id: number) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this._api.setAuthHeader(headers);

    return this._httpService.delete(`${this.apiUrl}disease/${id}`, { headers: headers })
      .pipe(
        map((response: any) => {
          return response.json();
        }), catchError((errorRes: any) => {
          return this._secureService.handleError(errorRes, `${this.apiUrl}disease/${id}`);
        })
      );
  }

  trackUserAction(action, appname, user, id, olddisease: any, newdisease: any) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this._api.setAuthHeader(headers);

    let obj = {
      old: olddisease,
      new: newdisease
    }

    const postBody = JSON.stringify(obj);

    return this._httpService.post(`${this.apiUrl}disease/TrackUserAction?action=${action}&appname=${appname}&user=${user}&id=${id}`, postBody, { headers: headers })
      .pipe(
        map((response: any) => {
          return response.json();
        }), catchError((errorRes: any) => {
          return this._secureService.handleError(errorRes, `${this.apiUrl}disease/TrackUserAction?action=${action}&appname=${appname}&user=${user}&id=${id}`);
        })
      );
  }
}
