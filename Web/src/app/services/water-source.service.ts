//@Packages
import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { map, catchError } from 'rxjs/operators';

//@Constant
import { CONFIG } from '../constant/config';

//@Model
import { WaterSourceVM } from '../models/WaterSourceVM';

//@Services
import { HttpService } from './http.service';
import { SecureService } from './secure.service';

@Injectable({
  providedIn: 'root'
})
export class WaterSourceService {

  private apiUrl: string;

  constructor(private _api: CONFIG,
    private _httpService: HttpService,
    private _secureService: SecureService) {
    this.apiUrl = _api.ServerWithApiUrl;
  }

  public watersourceFormData: any;
  public watersourceLocationFormData: any;
  public pageSource: any;

  searchWaterSources(company: number, pageno: number, pagesize: number) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this._api.setAuthHeader(headers);

    return this._httpService.get(`${this.apiUrl}watersource?company=${company}&pageno=${pageno}&pagesize=${pagesize}`, { headers: headers })
      .pipe(
        map((response: any) => {
          return response.json();
        }), catchError((errorRes: any) => {
          return this._secureService.handleError(errorRes, `${this.apiUrl}watersource?company=${company}&pageno=${pageno}&pagesize=${pagesize}`);
        })
      );
  }

  getWaterSources() {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this._api.setAuthHeader(headers);

    return this._httpService.get(`${this.apiUrl}watersource/GetWaterSources`, { headers: headers })
      .pipe(
        map((response: any) => {
          return response.json();
        }), catchError((errorRes: any) => {
          return this._secureService.handleError(errorRes, `${this.apiUrl}watersource/GetWaterSources`);
        })
      );
  }

  getWaterSourceById(id: number) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this._api.setAuthHeader(headers);

    return this._httpService.get(`${this.apiUrl}watersource/${id}`, { headers: headers })
      .pipe(
        map((response: any) => {
          return response.json();
        }), catchError((errorRes: any) => {
          return this._secureService.handleError(errorRes, `${this.apiUrl}watersource/${id}`);
        })
      );
  }

  createWaterSource(watersource: WaterSourceVM) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this._api.setAuthHeader(headers);

    const postBody = JSON.stringify(watersource);

    return this._httpService.post(`${this.apiUrl}watersource`, postBody, { headers: headers })
      .pipe(
        map((response: any) => {
          return response.json();
        }), catchError((errorRes: any) => {
          return this._secureService.handleError(errorRes, `${this.apiUrl}watersource`);
        })
      );
  }

  updateWaterSource(watersource: WaterSourceVM) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this._api.setAuthHeader(headers);

    const postBody = JSON.stringify(watersource);

    return this._httpService.put(`${this.apiUrl}watersource/${watersource.ID_watersource}`, postBody, { headers: headers })
      .pipe(
        map((response: any) => {
          return response.json();
        }), catchError((errorRes: any) => {
          return this._secureService.handleError(errorRes, `${this.apiUrl}watersource/${watersource.ID_watersource}`);
        })
      );
  }

  deleteWaterSource(id: number) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this._api.setAuthHeader(headers);

    return this._httpService.delete(`${this.apiUrl}watersource/${id}`, { headers: headers })
      .pipe(
        map((response: any) => {
          return response.json();
        }), catchError((errorRes: any) => {
          return this._secureService.handleError(errorRes, `${this.apiUrl}watersource/${id}`);
        })
      );
  }

  trackUserAction(action, appname, user, id, oldWaterSource: any, newWaterSource: any) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this._api.setAuthHeader(headers);

    let obj = {
      old: oldWaterSource,
      new: newWaterSource
    }

    const postBody = JSON.stringify(obj);

    return this._httpService.post(`${this.apiUrl}watersource/TrackUserAction?action=${action}&appname=${appname}&user=${user}&id=${id}`, postBody, { headers: headers })
      .pipe(
        map((response: any) => {
          return response.json();
        }), catchError((errorRes: any) => {
          return this._secureService.handleError(errorRes, `${this.apiUrl}watersource/TrackUserAction?action=${action}&appname=${appname}&user=${user}&id=${id}`);
        })
      );
  }
 
  watersourcelocation_CRUD(body: any) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this._api.setAuthHeader(headers);

    const postBody = JSON.stringify(body);

    return this._httpService.post(`${this.apiUrl}watersourcelocation/WatersourcelocationCRUD`, postBody, { headers: headers })
      .pipe(
        map((response: any) => {
          return response.json();
        }), catchError((errorRes: any) => {
          return this._secureService.handleError(errorRes, `${this.apiUrl}watersourcelocation/WatersourcelocationCRUD`);
        })
      );
  }

  getWatersourceLocationByWaterSourceId(watersourceid: number) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this._api.setAuthHeader(headers);

    return this._httpService.get(`${this.apiUrl}watersourcelocation/GetWatersourceLocationByWaterSourceId?watersourceid=${watersourceid}`, { headers: headers })
      .pipe(
        map((response: any) => {
          return response.json();
        }), catchError((errorRes: any) => {
          return this._secureService.handleError(errorRes, `${this.apiUrl}watersourcelocation/GetWatersourceLocationByWaterSourceId?watersourceid=${watersourceid}`);
        })
      );
  }

}
