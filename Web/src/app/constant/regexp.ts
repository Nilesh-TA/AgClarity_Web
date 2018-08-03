import { Injectable } from '@angular/core';

@Injectable()
export class REGEXP {
    public NUMBER_REGEXP:  RegExp = /^-?\d+(?:\.\d+)?$/;
    //public PHONE_NUMBER_REGEXP : RegExp = /\+\d \(\d{3}\) \d{3}-\d{4}/;
    public PHONE_NUMBER_REGEXP : RegExp = /\(\d{3}\) \d{3}-\d{4}/;
    public EMAIL_REGEXP: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
    public LATITUDE_EXP: RegExp = /^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/
    public LONGITUDE_EXP: RegExp = /^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$/
    public ZIPREG_EXP: RegExp = /^\d{5}$/i;
}