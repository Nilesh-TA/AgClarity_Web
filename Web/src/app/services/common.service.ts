import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import * as $ from 'jquery';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private router: Router) { }

  isNullOrEmpty(item) {
    if (item == null || item == '' || item == undefined) {
      return true;
    } else {
      return false;
    }

  }

  isNumeric(item) {
    if (!this.isNullOrEmpty(item)) {
      return !isNaN(item);
    }
    return false;
  }

  convertToNumber(value): number {
    if (!this.isNullOrEmpty(value)) {
      return Number(value);
    } else {
      return Number(0);
    }
  }

  parseString(value): string {
    if (!this.isNullOrEmpty(value)) {
      return value.toString();
    } else {
      return "";
    }
  }

  parseBoolean(value): boolean {
    if (!this.isNullOrEmpty(value) && (value == 1 || value == "1" || value == "true")) {
      return true;
    } else {
      return false
    }
  }

  startsWith(text, prefixText): boolean {
    if (!this.isNullOrEmpty(text)) {
      if (text.startsWith(prefixText)) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }

  endsWith(text, postfixText): boolean {
    if (!this.isNullOrEmpty(text)) {
      if (text.endsWith(postfixText)) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }

  formatModelsProperty(obj: any) {
    if (!obj) { return; }

    const form = obj;
    for (const field in form) {
      if (this.isNullOrEmpty(form[field])) {
        form[field] = "";
      }
    }
    return obj;
  }

  onlyNumberKey(event) {
    return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57;
  }

  onlyNumeric(event) {
    //46    -   Period(.)            
    if ((event.which != 46 || event.key.indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
      //event.preventDefault();
      return true;
    }
  }

  isNumericKey(event) {

    var charCode = (event.which) ? event.which : event.keyCode
    var value = event.key;
    var dotcontains = value.indexOf(".") != -1;
    var minuscontains = value.indexOf("-") != -1;
    if (dotcontains) {
      if (charCode == 46) return true;
      else return false;
    }

    if (minuscontains) {
      if (charCode == 45) return true;
      else return false;
    }

    if (charCode == 46) return true;
    if (charCode > 31 && (charCode < 48 || charCode > 57))
      return false;
    return true;
  }

  formatNumberWithDecimal(number, decimalPlaces) {
    if (number != null && number != '' && number != undefined) {
      return Number(number).toFixed(decimalPlaces);
    }
    return "0.00";
  }

  Lower(item) {
    if (!this.isNullOrEmpty(item)) {
      return item.toLowerCase();
    }
    return "";
  }

  Upper(item) {
    if (!this.isNullOrEmpty(item)) {
      return item.toUpperCase();
    }
    return "";
  }

  showLoader() {
    $('#divLoader').show();
  }

  hideLoader() {
    $('#divLoader').hide();
  }

  scrollToTop() {
    window.scroll(0, 0);
  }

  getMasterDataCode(access_role) {
    let masterDataCode = "";
    switch (access_role) {
      case "Management":
        masterDataCode = "Master_Data";
        break;
      case "Administrator":
        masterDataCode = "Master_Data";
        break;
      case "Expert - External":
        masterDataCode = "Master_Data";
        break;
      case "AgrisourceData Admin":
        masterDataCode = "ASD_Master_Data";
        break;
      case "AgrisourceData Expert":
        masterDataCode = "ASD_Master_Data";
        break;
      case "Expert - Internal":
        masterDataCode = "Master_Data";
        break;
      default:
        masterDataCode = "Master_Data";
        break;
    }
    return masterDataCode;
  }

  redirectByMasterData(event, isRemoveCurrentCompanySelection) {
    const masterData = event.target.value;    

    if (!this.isNullOrEmpty(masterData)) {

      const hasAccessToMultipleCompanies = localStorage.getItem('hasaccess_to_multiple_companies');

      if (isRemoveCurrentCompanySelection && hasAccessToMultipleCompanies == "true") {
        localStorage.removeItem('current_company_id');
        localStorage.removeItem('current_company_name');
      }

      //Redirect page.
      switch (this.Lower(masterData)) {
        case "chemical":
          this.router.navigate(['list-chemical']);
          break;
        case "company":
          this.router.navigate(['list-company']);
          break;
        case "crop":
          this.router.navigate(['list-crop']);
          break;
        case "disease":
          this.router.navigate(['list-disease']);
          break;
        case "pest":
          this.router.navigate(['list-pest']);
          break;
        case "sensor":
          this.router.navigate(['list-sensor']);
          break;
        case "subscription":
          this.router.navigate(['subscription']);
          break;
        case "contact profile":
          this.router.navigate(['list-contact-profile']);
          break;
        case "irrigation":
          this.router.navigate(['list-irrigation']);
          break;
        case "location":
          this.router.navigate(['list-location']);
          break;
        case "water source":
          this.router.navigate(['list-watersource']);
          break;
      }
    }

  }

  redirectSelectCompaniesPage(companyId: number) {
    if (companyId != null && companyId == 0) {
      this.router.navigate(['select-company']);
    }
  }

  hasUpdateAccess(masterDataCode): boolean {
    let isAccess: boolean;

    switch (masterDataCode) {
      case "Management":
      case "Administrator":
      case "AgrisourceData Admin":
      case "AgrisourceData Expert":
      case "Expert - Internal":
        isAccess = true;
        break;
      case "Expert - External":
        isAccess = false;
        break;
      default:
        isAccess = false;
        break;
    }
    return isAccess;
  }

  hasReadAccess(masterDataCode): boolean {
    let isAccess: boolean;

    switch (masterDataCode) {
      case "Management":
      case "Administrator":
      case "Expert - External":
      case "AgrisourceData Admin":
      case "AgrisourceData Expert":
      case "Expert - Internal":
        isAccess = true;
        break;
      default:
        isAccess = false;
        break;
    }
    return isAccess;
  }

  hasCreateAccess(masterDataCode): boolean {
    let isAccess: boolean;

    switch (masterDataCode) {
      case "Administrator":
      case "AgrisourceData Expert":
      case "AgrisourceData Admin":
        isAccess = true;
        break;
      case "Management":
      case "Expert - External":
      case "Expert - Internal":
        isAccess = false;
        break;
      default:
        isAccess = false;
        break;
    }
    return isAccess;
  }

  hasDeleteAccess(masterDataCode): boolean {
    let isAccess: boolean;

    switch (masterDataCode) {
      case "Administrator":
      case "AgrisourceData Admin":
      case "AgrisourceData Expert":
        isAccess = true;
        break;
      case "Management":
      case "Expert - External":
      case "Expert - Internal":
        isAccess = false;
        break;
      default:
        isAccess = false;
        break;
    }
    return isAccess;
  }

  parseDateToValidFormat(year, month, date) {
    let fullDate = "";
    let dd = "", mm = "", yyyy = "";

    //set initial value.
    yyyy = year;
    mm = month;
    dd = date;

    //Append '0' prefix in date.
    if (date >= 1 && date <= 9) {
      dd = ("0" + date);
    }

    //Append '0' prefix in month.
    if (month >= 1 && month <= 9) {
      mm = ("0" + month);
    }

    fullDate = yyyy + "/" + mm + "/" + dd;

    return fullDate;
  }

  parseToIMyDate(s) {
    let date = new Date(s);
    return {
      date: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      }
    }
  }

  hasDuplicateValue(arrayItems: any) {
    let isDuplicateExist: boolean = false;
    
    for (let i = 0; i < arrayItems.length; i++) {
      for (let j = i + 1; j < arrayItems.length; j++) {
        if (arrayItems[i].equals(arrayItems[j])) {
          // got the duplicate element 
          isDuplicateExist = true;
        }
      }
    }

    return isDuplicateExist;
  }
}