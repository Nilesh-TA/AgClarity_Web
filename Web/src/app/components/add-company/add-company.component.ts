//@Packages
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';

//@Services
import { CommonService } from '../../services/common.service';
import { ErrorService } from '../../services/error.service';
import { DictionaryService } from '../../services/dictionary.service';
import { CompanyService } from '../../services/company.service';
import { StorageService } from '../../services/storage.service';

//@Models
import { DictionaryVM } from '../../models/DictionaryVM';
import { CompanyVM } from '../../models/CompanyVM';

//@Constant
import { REGEXP } from '../../constant/regexp';
import { DICTIONARY } from '../../constant/dictionary';
import { MICROAPP } from '../../constant/microapp';

@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.css']
})
export class AddCompanyComponent implements OnInit {

  constructor(private router: Router,
    private cdRef: ChangeDetectorRef,
    private fb: FormBuilder,
    public regexp: REGEXP,
    public dictionary: DICTIONARY,
    public microapp: MICROAPP,
    public toastr: ToastrService,
    public commonService: CommonService,
    public errorService: ErrorService,
    public storageService: StorageService,
    public dictionaryService: DictionaryService,
    public companyService: CompanyService) { }

  addForm: FormGroup;
  company: CompanyVM;

  companyId: number = 0;

  pageName: string = "Company";

  uomList: DictionaryVM[] = [];
  currencyList: DictionaryVM[] = [];
  countryList: DictionaryVM[] = [];
  companyList: CompanyVM[] = [];

  public companyFormErrors = {
    name: '',
    metric_imperial: '',
    currency: '',
    dunsnumber: '',
    related_to: '',
    rank: '',
    address_1: '',
    address_2: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    water_saved: ''
  };

  private companyValidationMessages = {
    name: { 'required': 'Please enter name.' },
    metric_imperial: { 'required': 'Please select metric or imperial.' },
    currency: { 'required': 'Please select curency.' },
    rank: { 'pattern': 'Please enter valid rank. It must be valid numeric value.' },
    address_1: { 'required': 'Please enter mailing address.' },
    city: { 'required': 'Please enter city.' },
    postal_code: { 'required': 'Please enter postal code.' }
  };

  ngOnInit() {
    this.company = new CompanyVM();
    this.companyId = this.storageService.getCompanyId();

    this.buildForm();
    this.initializeFormValue();
  }

  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }
  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }
  ngAfterContentChecked() {
    this.cdRef.detectChanges();
  }

  buildForm() {
    this.company.metric_imperial = "";
    this.company.currency = "";
    this.company.related_to = this.companyId;
    this.company.country = "";

    this.addForm = this.fb.group({
      name: [this.company.name, Validators.required],
      metric_imperial: [this.company.metric_imperial, Validators.required],
      currency: [this.company.currency, Validators.required],
      dunsnumber: [this.company.dunsnumber],
      related_to: [this.company.related_to],
      rank: [this.company.rank, [Validators.pattern(this.regexp.NUMBER_REGEXP)]],
      address_1: [this.company.address_1, Validators.required],
      address_2: [this.company.address_2],
      city: [this.company.city, Validators.required],
      state: [this.company.state],
      postal_code: [this.company.postal_code, Validators.required],
      country: [this.company.country],
      water_saved: [this.company.water_saved]
    });

    this.addForm.valueChanges.subscribe(data => this.onValueChanged(data));
  }

  onValueChanged(data?: any) {
    //Company Form Errors.    
    this.companyFormErrors = this.errorService.displayValidationErrors(this.companyValidationMessages, this.addForm, this.companyFormErrors, false);
  }

  initializeFormValue() {

    this.commonService.showLoader();

    //Bind dropdown values    
    Promise.all(
      [
        this.getUOM(),
        this.getCurrency(),
        this.getCountry(),
        this.getCompanies()
      ]).then((data: any) => {

        if (data != null) {
          let uomResult = data[0];
          let currencyResult = data[1];
          let countryResult = data[2];
          let companyResult = data[3];

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

          //Company Detail
          if (companyResult != null && companyResult.success) {
            let companyInfo = companyResult.data;
            if (companyInfo.success) {
              this.companyList = companyInfo.data;
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

  onSubmit() {

    if (!this.addForm.valid) {
      this.companyFormErrors = this.errorService.displayValidationErrors(this.companyValidationMessages, this.addForm, this.companyFormErrors, true);
      this.toastr.error("Please fill all the required field first", "Error!", { timeOut: 3000, closeButton: true });
      this.commonService.scrollToTop();
      return false;
    }

    let body = this.getBodyToPost(this.addForm.value);
    this.companyService.createCompany(body).subscribe(data => {
      if (data != null) {
        if (data.success) {
          const insertedId = data.data.insertId;

          //Track User Action.
          this.companyService.trackUserAction("add", this.microapp.ASD_Admin, this.storageService.getUserProfileId(), insertedId, body, body)
            .subscribe(res => {
              this.toastr.success("Company created successfully.", "Success!", { timeOut: 3000, closeButton: true });
              this.router.navigate(['list-company']);
            }, error => {
              this.toastr.error(error.message, "Error!", { timeOut: 3000, closeButton: true });
            });
        } else {
          if (typeof data.message === 'object') {
            this.toastr.error(JSON.stringify(data.message), "Error!", { timeOut: 3000, closeButton: true });
          } else {
            this.toastr.error(data.message, "Error!", { timeOut: 3000, closeButton: true });
          }
        }
      }
    }, error => {
      this.toastr.error(error.message, "Error!", { timeOut: 3000, closeButton: true });
    });
  }

  getBodyToPost(company) {

    let body: any = {
      name: company.name,
      metric_imperial: company.metric_imperial,
      currency: company.currency,
      dunsnumber: company.dunsnumber,
      related_to: (company.related_to && +company.related_to > 0) ? +company.related_to : null,
      rank: company.rank ? +company.rank : null,
      address_1: company.address_1,
      address_2: company.address_2,
      city: company.city,
      state: company.state,
      postal_code: company.postal_code,
      country: company.country,
      water_saved: company.water_saved ? +company.water_saved : null
    }
    return body;
  }

  backToList() {
    this.addForm.reset();
    this.commonService.hideLoader();
    this.router.navigate(['list-company']);
  }

}

