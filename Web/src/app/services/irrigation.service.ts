//@Packages
import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { map, catchError } from 'rxjs/operators';

//@Constant
import { CONFIG } from '../constant/config';

//@Model
import { IrrigationVM } from '../models/IrrigationVM';

//@Services
import { HttpService } from './http.service';
import { SecureService } from './secure.service';

@Injectable({
  providedIn: 'root'
})
export class IrrigationService {

  private apiUrl: string;

  constructor(private _api: CONFIG,
    private _httpService: HttpService,
    private _secureService: SecureService) {
    this.apiUrl = _api.ServerWithApiUrl;
  }

  public irrigationFormData: any;
  public irrigationLocationFormData: any;
  public pageSource: any;

  searchIrrigations(company: number, pageno: number, pagesize: number) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this._api.setAuthHeader(headers);

    return this._httpService.get(`${this.apiUrl}irrigation?company=${company}&pageno=${pageno}&pagesize=${pagesize}`, { headers: headers })
      .pipe(
        map((response: any) => {
          return response.json();
        }), catchError((errorRes: any) => {
          return this._secureService.handleError(errorRes, `${this.apiUrl}irrigation?company=${company}&pageno=${pageno}&pagesize=${pagesize}`);
        })
      );
  }

  getIrrigations() {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this._api.setAuthHeader(headers);

    return this._httpService.get(`${this.apiUrl}irrigation/GetIrrigations`, { headers: headers })
      .pipe(
        map((response: any) => {
          return response.json();
        }), catchError((errorRes: any) => {
          return this._secureService.handleError(errorRes, `${this.apiUrl}irrigation/GetIrrigations`);
        })
      );
  }

  getIrrigationById(id: number) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this._api.setAuthHeader(headers);

    return this._httpService.get(`${this.apiUrl}irrigation/${id}`, { headers: headers })
      .pipe(
        map((response: any) => {
          return response.json();
        }), catchError((errorRes: any) => {
          return this._secureService.handleError(errorRes, `${this.apiUrl}irrigation/${id}`);
        })
      );
  }

  createIrrigation(irrigation: IrrigationVM) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this._api.setAuthHeader(headers);

    const postBody = JSON.stringify(irrigation);

    return this._httpService.post(`${this.apiUrl}irrigation`, postBody, { headers: headers })
      .pipe(
        map((response: any) => {
          return response.json();
        }), catchError((errorRes: any) => {
          return this._secureService.handleError(errorRes, `${this.apiUrl}irrigation`);
        })
      );
  }

  updateIrrigation(irrigation: IrrigationVM) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this._api.setAuthHeader(headers);

    const postBody = JSON.stringify(irrigation);

    return this._httpService.put(`${this.apiUrl}irrigation/${irrigation.ID_irrigation}`, postBody, { headers: headers })
      .pipe(
        map((response: any) => {
          return response.json();
        }), catchError((errorRes: any) => {
          return this._secureService.handleError(errorRes, `${this.apiUrl}irrigation/${irrigation.ID_irrigation}`);
        })
      );
  }

  deleteIrrigation(id: number) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this._api.setAuthHeader(headers);

    return this._httpService.delete(`${this.apiUrl}irrigation/${id}`, { headers: headers })
      .pipe(
        map((response: any) => {
          return response.json();
        }), catchError((errorRes: any) => {
          return this._secureService.handleError(errorRes, `${this.apiUrl}irrigation/${id}`);
        })
      );
  }

  trackUserAction(action, appname, user, id, oldIrrigation: any, newIrrigation: any) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this._api.setAuthHeader(headers);

    let obj = {
      old: oldIrrigation,
      new: newIrrigation
    }

    const postBody = JSON.stringify(obj);

    return this._httpService.post(`${this.apiUrl}irrigation/TrackUserAction?action=${action}&appname=${appname}&user=${user}&id=${id}`, postBody, { headers: headers })
      .pipe(
        map((response: any) => {
          return response.json();
        }), catchError((errorRes: any) => {
          return this._secureService.handleError(errorRes, `${this.apiUrl}irrigation/TrackUserAction?action=${action}&appname=${appname}&user=${user}&id=${id}`);
        })
      );
  }
 
  irrigationlocation_CRUD(body: any) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this._api.setAuthHeader(headers);

    const postBody = JSON.stringify(body);

    return this._httpService.post(`${this.apiUrl}irrigationlocation/IrrigationlocationCRUD`, postBody, { headers: headers })
      .pipe(
        map((response: any) => {
          return response.json();
        }), catchError((errorRes: any) => {
          return this._secureService.handleError(errorRes, `${this.apiUrl}irrigationlocation/IrrigationlocationCRUD`);
        })
      );
  }

  getIrrigationLocationByIrrigationId(irrigationid: number) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this._api.setAuthHeader(headers);

    return this._httpService.get(`${this.apiUrl}irrigationlocation/GetIrrigationLocationByIrrigationId?irrigationid=${irrigationid}`, { headers: headers })
      .pipe(
        map((response: any) => {
          return response.json();
        }), catchError((errorRes: any) => {
          return this._secureService.handleError(errorRes, `${this.apiUrl}irrigationlocation/GetIrrigationLocationByIrrigationId?irrigationid=${irrigationid}`);
        })
      );
  }

}
