//@Packages
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ToastrService } from 'ngx-toastr';

//@Services
import { CommonService } from '../../services/common.service';
import { ErrorService } from '../../services/error.service';
import { DictionaryService } from '../../services/dictionary.service';
import { AddressService } from '../../services/address.service';
import { StorageService } from '../../services/storage.service';
import { ProviderService } from '../../services/provider.service';

//@Models
import { DictionaryVM } from '../../models/DictionaryVM';
import { AddressVM } from '../../models/AddressVM';

//@Constant
import { DICTIONARY } from '../../constant/dictionary';
import { MICROAPP } from '../../constant/microapp';

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html',
  styleUrls: ['./add-address.component.css']
})
export class AddAddressComponent implements OnInit {

  ID_params?: number;
  action_params: string;
  source_params: string;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private toastr: ToastrService,
    public dictionary: DICTIONARY,
    public microapp: MICROAPP,    
    public commonService: CommonService,
    public storageService: StorageService,
    public errorService: ErrorService,
    public dictionaryService: DictionaryService,
    public providerService: ProviderService,
    public addressService: AddressService) { }

  addForm: FormGroup;
  address: AddressVM;

  companyId: number = 0;

  pageName: string = "Address";

  countryList: DictionaryVM[] = [];

  public addressFormErrors = {
    address_1: '',
    address_2: '',
    city: '',
    state: '',
    postal_code: '',
    country: ''
  };

  private addressValidationMessages = {
    address_1: { 'required': 'Please enter mailing address.' },
    postal_code: { 'required': 'Please enter postal code.' },
    country: { 'required': 'Please select country.' },
  }

  ngOnInit() {
    this.address = new AddressVM();
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
    this.address.country = "";

    this.addForm = this.fb.group({
      address_1: [this.address.address_1, Validators.required],
      address_2: [this.address.address_2],
      city: [this.address.city],
      state: [this.address.state],
      postal_code: [this.address.postal_code, Validators.required],
      country: [this.address.country, Validators.required],
      company: [this.address.company],
    });
    this.addForm.valueChanges.subscribe(data => this.onValueChanged(data));
  }

  onValueChanged(data?: any) {
    //Address Form Errors.    
    this.addressFormErrors = this.errorService.displayValidationErrors(this.addressValidationMessages, this.addForm, this.addressFormErrors, false);
  }

  initializeFormValue() {

    this.commonService.showLoader();
    this.companyId = this.storageService.getCompanyId();

    this.route.queryParams.subscribe(params => {
      this.ID_params = !this.commonService.isNullOrEmpty(params["id"]) ? +params["id"] : 0;
      this.companyId = !this.commonService.isNullOrEmpty(params["company"]) ? +params["company"] : 0;
      this.action_params = params["action"];
      this.source_params = params["source"];
    });

    //Bind dropdown values    
    Promise.all(
      [
        this.getCountry()
      ]).then((data: any) => {

        if (data != null) {
          let countryResult = data[0];

          //Country
          if (countryResult != null && countryResult.success) {
            let countryItems = countryResult.data;
            if (countryItems.success) {
              this.countryList = countryItems.data;
            }
          }

          this.commonService.hideLoader();
        }
      }).catch((error) => {
        this.commonService.hideLoader();
        console.error(error);
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
      this.addressFormErrors = this.errorService.displayValidationErrors(this.addressValidationMessages, this.addForm, this.addressFormErrors, true);
      this.toastr.error("Please fill all the required field first", "Error!", { timeOut: 3000, closeButton: true });
      this.commonService.scrollToTop();
      return false;
    }

    let body = this.getBodyToPost(this.addForm.value);

    this.addressService.createAddress(body).subscribe(data => {
      if (data != null) {
        if (data.success) {
          const insertedId = data.data.insertId;

          this.providerService.newAddressId = insertedId;

          //Track User Action.
          this.addressService.trackUserAction("add", this.microapp.Master_Data, this.storageService.getUserProfileId(), insertedId, body, body)
            .subscribe(res => {
              this.toastr.success("Address created successfully.", "Success!", { timeOut: 3000, closeButton: true });
              this.backToList();
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

  getBodyToPost(address) {
    let body: any = {
      address_1: address.address_1,
      address_2: address.address_2,
      city: address.city,
      state: address.state,
      postal_code: address.postal_code,
      country: address.country,
      company: this.companyId
    }
    return body;
  }

  backToList() {
    this.addForm.reset();
    this.commonService.hideLoader();

    if (!this.commonService.isNullOrEmpty(this.source_params)) {
      if (this.source_params == "provider") {
        if (this.providerService.pageSource == "add") {          
          this.router.navigate(['add-provider']);          
        }
        else if (this.providerService.pageSource == "edit") {
          this.router.navigate(['/edit-provider', this.ID_params]);
        }
      }
    }else{
      this.router.navigate(['list-address']);
    }
  }

}
