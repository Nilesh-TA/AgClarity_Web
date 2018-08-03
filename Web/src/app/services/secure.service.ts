import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot, RouterState } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SecureService {

  returnUrl: string;
  constructor(    
    private _router: Router,    
    private _storageService: StorageService) {

    const state: RouterState = _router.routerState;
    const snapshot: RouterStateSnapshot = state.snapshot;
    this.returnUrl = snapshot.url;
  }
  handleError(error: Response | any, apiPath: string) {
    let errorMessage: any;
    if (error instanceof Response) {  
      if (error.status === 401 || error.status === 403) {
        //TODO: refresh token and replay request                
        this.redirect();
        Observable.throw('token expired, logging out');

      }
      else if (error.status == 400) { //Bad Request                        
        errorMessage = { field: 'custom', message: error.json() };
      }
      else {
        try {
          const response = error.json().ResponseStatus || '';
          if (response != null && response.Errors.length > 0) {
            errorMessage = response.Errors.map(function (obj) { return { field: obj.FieldName, message: obj.Message }; });
          } else {
            errorMessage = { field: 'custom', message: response.Message };
          }
        } catch (exception) {
          errorMessage = { field: 'custom', message: 'Oops! Something went wrong, please try again!' };
        }
      }
    } else {
      errorMessage = { field: 'custom', message: 'Oops! Something went wrong, please try again!' };
    }

    //return Observable.throw(errorMessage);    
    return new Promise((resolve, reject) => {
      return reject(errorMessage);
    });   
  }

  redirect(){
    this._storageService.clearCredentials();
    this._router.navigate(['/login'], { queryParams: { returnUrl: this.returnUrl } });    
  }
}
