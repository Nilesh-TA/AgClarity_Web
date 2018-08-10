//@Packages
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, NavigationExtras } from "@angular/router";
import { ToastrService } from 'ngx-toastr';

//@Services
import { CommonService } from '../../services/common.service';
import { ErrorService } from '../../services/error.service';
import { StorageService } from '../../services/storage.service';
import { DictionaryService } from '../../services/dictionary.service';
import { LocationService } from '../../services/location.service';
import { AddressService } from '../../services/address.service';
import { ProviderService } from '../../services/provider.service';

//@Models
import { DictionaryVM } from '../../models/DictionaryVM';
import { ProviderVM } from '../../models/ProviderVM';
import { LocationVM } from '../../models/LocationVM';
import { AddressVM } from '../../models/AddressVM';

//@Constant
import { DICTIONARY } from '../../constant/dictionary';
import { MICROAPP } from '../../constant/microapp';

@Component({
  selector: 'app-add-provider',
  templateUrl: './add-provider.component.html',
  styleUrls: ['./add-provider.component.css']
})
export class AddProviderComponent implements OnInit {

  constructor(private router: Router,
    private cdRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private toastr: ToastrService,
    public dictionary: DICTIONARY,
    public microapp: MICROAPP,    
    public commonService: CommonService,
    public storageService: StorageService,
    public errorService: ErrorService,
    public dictionaryService: DictionaryService,
    public locationService: LocationService,
    public addressService: AddressService,
    public providerService: ProviderService) { }

  addForm: FormGroup;
  provider: ProviderVM;

  companyId: number = 0;

  pageName: string = "Provider";

  providerTypeList: DictionaryVM[] = [];
  uomList: DictionaryVM[] = [];
  relatedToList: ProviderVM[] = [];
  locationList: LocationVM[] = [];
  addressList: AddressVM[] = [];

  public providerFormErrors = {
    name: '',
    metric_imperial: '',
    locationID: '',
    addressID: '',
    related_to: '',
    type: ''
  };

  private providerValidationMessages = {
    name: { 'required': 'Please enter name.' },
    metric_imperial: { 'required': 'Please select metric or imperial.' },
    addressID: { 'required': 'Please select address.' },
    type: { 'required': 'Please select type.' }
  }

  ngOnInit() {
    this.provider = new ProviderVM();
    this.buildForm(true);
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

  buildForm(isClearData = false) {
    if (isClearData) {
      this.provider.metric_imperial = "";
      this.provider.locationID = "";
      this.provider.addressID = "";
      this.provider.related_to = "";
      this.provider.type = "";
    }

    this.addForm = this.fb.group({
      name: [this.provider.name, Validators.required],
      metric_imperial: [this.provider.metric_imperial, Validators.required],
      related_to: [this.provider.related_to],
      locationID: [this.provider.locationID],
      type: [this.provider.type, Validators.required],
      addressID: [this.provider.addressID, Validators.required]
    });
    this.addForm.valueChanges.subscribe(data => this.onValueChanged(data));
  }

  onValueChanged(data?: any) {
    //Provider Form Errors.    
    this.providerFormErrors = this.errorService.displayValidationErrors(this.providerValidationMessages, this.addForm, this.providerFormErrors, false);
  }

  initializeFormValue() {

    this.commonService.showLoader();
    this.companyId = this.storageService.getCompanyId();

    //Bind dropdown values    
    Promise.all(
      [
        this.getUOM(),
        this.getProviderType(),
        this.getLocations(),
        this.getRelatedToProviders(),
        this.getAddresses()
      ]).then((data: any) => {

        if (data != null) {
          let uomResult = data[0];
          let providerTypeResult = data[1];
          let locationResult = data[2];
          let providerResult = data[3];
          let addressResult = data[4];

          //UOM
          if (uomResult != null && uomResult.success) {
            let uomItems = uomResult.data;
            if (uomItems.success) {
              this.uomList = uomItems.data;
            }
          }

          //Provider Type
          if (providerTypeResult != null && providerTypeResult.success) {
            let providerTypeItems = providerTypeResult.data;
            if (providerTypeItems.success) {
              this.providerTypeList = providerTypeItems.data;
            }
          }

          //Locations
          if (locationResult != null && locationResult.success) {
            let locationItems = locationResult.data;
            if (locationItems.success) {
              this.locationList = locationItems.data;
            }
          }

          //Providers
          if (providerResult != null && providerResult.success) {
            let providerItems = providerResult.data;
            if (providerItems.success) {
              this.relatedToList = providerItems.data;
            }
          }

          //Address
          if (addressResult != null && addressResult.success) {
            let addressItems = addressResult.data;
            if (addressItems.success) {
              this.addressList = addressItems.data;
            }
          }

          //Set data from service if exist.
          this.SetFormData();

          this.commonService.hideLoader();
        }
      }).catch((error) => {
        this.commonService.hideLoader();
        console.error(error);
      });
  }

  SetFormData() {
    let providerFormData = this.providerService.providerFormData;

    if (providerFormData != null) {
      this.provider.name = providerFormData.name;
      this.provider.metric_imperial = providerFormData.metric_imperial;
      this.provider.locationID = providerFormData.locationID;
      this.provider.addressID = providerFormData.addressID;
      this.provider.related_to = providerFormData.related_to;
      this.provider.type = providerFormData.type;

      if (!this.commonService.isNullOrEmpty(this.providerService.newAddressId)) {
        this.provider.addressID = this.providerService.newAddressId;
      }

      this.buildForm(false);
    }
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

  getProviderType() {
    return new Promise((resolve, reject) => {
      this.dictionaryService.getDictionaryByCode(this.dictionary.Provider_Type).subscribe(res => {
        resolve({ success: true, data: res });
      }, error => {
        resolve({ success: false, data: error });
      });
    });
  }

  getRelatedToProviders() {
    return new Promise((resolve, reject) => {
      this.providerService.getProvidersByCompany(this.companyId, 0).subscribe(res => {
        resolve({ success: true, data: res });
      }, error => {
        resolve({ success: false, data: error });
      });
    });
  }

  getLocations() {
    return new Promise((resolve, reject) => {
      this.locationService.getLocationByCompany(this.companyId).subscribe(res => {
        resolve({ success: true, data: res });
      }, error => {
        resolve({ success: false, data: error });
      });
    });
  }

  getAddresses() {
    return new Promise((resolve, reject) => {
      this.addressService.getAddressByCompany(this.companyId).subscribe(res => {
        resolve({ success: true, data: res });
      }, error => {
        resolve({ success: false, data: error });
      });
    });
  }

  onSubmit() {

    if (!this.addForm.valid) {
      this.providerFormErrors = this.errorService.displayValidationErrors(this.providerValidationMessages, this.addForm, this.providerFormErrors, true);
      this.toastr.error("Please fill all the required field first", "Error!", { timeOut: 3000, closeButton: true });
      this.commonService.scrollToTop();
      return false;
    }

    let body = this.getBodyToPost(this.addForm.value);

    this.providerService.createProvider(body).subscribe(data => {
      if (data != null) {
        if (data.success) {
          const insertedId = data.data.insertId;

          //Track User Action.
          this.providerService.trackUserAction("add", this.microapp.Master_Data, this.storageService.getUserProfileId(), insertedId, body, body)
            .subscribe(res => {
              this.toastr.success("Provider created successfully.", "Success!", { timeOut: 3000, closeButton: true });
              this.router.navigate(['list-provider']);
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

  getBodyToPost(provider) {
    let body: any = {
      name: provider.name,
      metric_imperial: provider.metric_imperial,
      locationID: !this.commonService.isNullOrEmpty(provider.locationID) ? +provider.locationID : null,
      addressID: !this.commonService.isNullOrEmpty(provider.addressID) ? +provider.addressID : null,
      related_to: !this.commonService.isNullOrEmpty(provider.related_to) ? +provider.related_to : null,
      type: provider.type,
      company: this.companyId
    }
    return body;
  }

  backToList() {
    this.addForm.reset();
    this.commonService.hideLoader();
    this.router.navigate(['list-provider']);
  }

  createNewAddress() {
    let queryString: NavigationExtras = {
      queryParams: {
        "id": 0,
        "company": this.companyId,
        "action": "add",
        "source": "provider"
      }
    };

    this.providerService.pageSource = "add";
    this.providerService.providerFormData = this.addForm.value;

    this.router.navigate(['/add-address'], queryString);
  }

}
