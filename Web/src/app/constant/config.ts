import { Injectable } from '@angular/core';
import { Headers} from '@angular/http';

@Injectable()
export class CONFIG {
    public ServerPath: string = "http://localhost:3000/";        
    //public ServerPath: string = "http://203.192.235.219:3000/";   
    public ApiUrl: string = "api/";
    public ServerWithApiUrl = this.ServerPath + this.ApiUrl;
    public setAuthHeader(headers: Headers) {              
        headers.append('x-access-token', localStorage.getItem('access_token'));
    }
}