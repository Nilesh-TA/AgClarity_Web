//@Packages
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ToastrService } from 'ngx-toastr';

//@Services
import { CommonService } from '../../services/common.service';
import { DictionaryService } from '../../services/dictionary.service';
import { CompanyService } from '../../services/company.service';

//@Models
import { DictionaryVM } from '../../models/DictionaryVM';
import { CompanyVM } from '../../models/CompanyVM';

//@Constant
import { DICTIONARY } from '../../constant/dictionary';

@Component({
  selector: 'app-view-company',
  templateUrl: './view-company.component.html',
  styleUrls: ['./view-company.component.css']
})
export class ViewCompanyComponent implements OnInit {
  
  constructor(private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private toastr: ToastrService,
    public dictionary: DICTIONARY,
    public commonService: CommonService,
    public dictionaryService: DictionaryService,
    public companyService: CompanyService) { }

  viewForm: FormGroup;

  pageName: string = "Company";
  
  company: CompanyVM;
  ID_company: number;

  uomList: DictionaryVM[] = [];
  currencyList: DictionaryVM[] = [];
  countryList: DictionaryVM[] = [];
  companyList: CompanyVM[] = [];

  ngOnInit() {       
    this.initializeFormValue();        
    this.rebuildForm();
  }

  rebuildForm() {
    this.viewForm = this.fb.group({
      name: [this.company.name],
      metric_imperial: [this.company.metric_imperial],
      currency: [this.company.currency],
      dunsnumber: [this.company.dunsnumber],
      related_to: [this.company.related_to],
      rank: [this.company.rank],
      address_1: [this.company.address_1],
      address_2: [this.company.address_2],
      city: [this.company.city],
      state: [this.company.state],
      postal_code: [this.company.postal_code],
      country: [this.company.country],
      water_saved: [this.company.water_saved]
    });
  }

  initializeFormValue() {

    this.company = new CompanyVM();

    this.route.params.subscribe(params => { this.ID_company = params['id']; });

    this.commonService.showLoader();

    //Bind dropdown values    
    Promise.all(
      [
        this.getUOM(),
        this.getCurrency(),
        this.getCountry(),
        this.getCompanies(),
        this.getCompanyDetail()
      ]).then((data: any) => {

        if (data != null) {
          let uomResult = data[0];
          let currencyResult = data[1];
          let countryResult = data[2];
          let companiesResult = data[3];
          let companyResult = data[4];

          //UOM
          if (uomResult != null && uomResult.success) {
            let uomItems = uomResult.data;
            if (uomItems.success) {
              this.uomList = uomItems.data;
            }
          }

          //Currency
          if (currencyResult != null && currencyResult.success) {
            let currencyItems = currencyResult.data;
            if (currencyItems.success) {
              this.currencyList = currencyItems.data;
            }
          }

          //Country
          if (countryResult != null && countryResult.success) {
            let countryItems = countryResult.data;
            if (countryItems.success) {
              this.countryList = countryItems.data;
            }
          }

          //Companies
          if (companiesResult != null && companiesResult.success) {
            let companyInfo = companiesResult.data;
            if (companyInfo.success) {              
              this.companyList = companyInfo.data;
            }
          }

          //Company Detail
          if (companyResult != null && companyResult.success) {
            let companyInfo = companyResult.data;
            if (companyInfo.success) {              
              this.company = companyInfo.data[0] as CompanyVM;  
              this.rebuildForm();                          
              this.viewForm.controls['related_to'].setValue(this.company.related_to, { onlySelf: true });
              this.viewForm.controls['country'].setValue(this.commonService.parseString(this.company.country), { onlySelf: true });
            }
          }

          this.commonService.hideLoader();
        }
      }).catch((error) => {
        this.commonService.hideLoader();
        console.error(error);
      });
  }

  getCompanies() {
    return new Promise((resolve, reject) => {
      this.companyService.getCompanies().subscribe(res => {
        resolve({ success: true, data: res });
      }, error => {
        resolve({ success: false, data: error });
      });
    });
  }

  getCompanyDetail() {
    return new Promise((resolve, reject) => {
      this.companyService.getCompanyById(this.ID_company).subscribe(res => {
        resolve({ success: true, data: res });
      }, error => {
        resolve({ success: false, data: error });
      });
    });
  }

  getUOM() {
    return new Promise((resolve, reject) => {
      this.dictionaryService.getDictionaryByCode(this.dictionary.UOM).subscribe(res => {
        resolve({ success: true, data: res });
      }, error => {
        resolve({ success: false, data: error });
      });
    });
  }

  getCurrency() {
    return new Promise((resolve, reject) => {
      this.dictionaryService.getDictionaryByCode(this.dictionary.Currency).subscribe(res => {
        resolve({ success: true, data: res });
      }, error => {
        resolve({ success: false, data: error });
      });
    });
  }

  getCountry() {
    return new Promise((resolve, reject) => {
      this.dictionaryService.getDictionaryByCode(this.dictionary.Country).subscribe(res => {
        resolve({ success: true, data: res });
      }, error => {
        resolve({ success: false, data: error });
      });
    });
  }

  backToList() {
    this.viewForm.reset();
    this.commonService.hideLoader();
    this.router.navigate(['list-company']);
  }
}
