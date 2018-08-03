import { Injectable } from '@angular/core';
import { Http, RequestOptionsArgs, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { map, filter, catchError, mergeMap } from 'rxjs/operators';

@Injectable()
export class HttpService {

    constructor(private _http: Http) { }

    get(url: string, options?: RequestOptionsArgs): Observable<any> {
        return this._http.get(url, options);
    }

    post(url: string, body: string, options?: RequestOptionsArgs): Observable<any> {
        return this._http.post(url, body, options);
    }

    put(url: string, body: string, options?: RequestOptionsArgs): Observable<any> {
        return this._http.put(url, body, options);
    }

    delete(url: string, options?: RequestOptionsArgs): Observable<any> {
        return this._http.delete(url, options);
    }

    request(url: string, options?: RequestOptionsArgs): Observable<any> {
        return this._http.request(url, options);
    }

    handleError(error: Response | any) {
        let errorMessage: any;
        if (error instanceof Response) {
           if (error.status !== 0) {
               try {
                   const response = error.json().ResponseStatus || '';
                   if (response.Errors.length>0){
                       errorMessage = response.Errors.map(function (obj) { return { field: obj.FieldName, message: obj.Message }; });
                   } else{
                       errorMessage = [{ field: 'custom', message: response.Message }];
                   }
                }catch (exception) {
                   errorMessage = [{ field: 'custom', message: 'Oops! Something went wrong, please try again!' }];
               }
           }else {
               errorMessage = [{ field: 'custom', message: 'Oops! Something went wrong, please try again!' }];
           }
        } else {
            errorMessage = [{ field: 'custom', message:'Oops! Something went wrong, please try again!'}];
        }
        return Observable.throw(errorMessage);
    }
}
