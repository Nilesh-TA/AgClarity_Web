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

//@Models
import { DictionaryVM } from '../../models/DictionaryVM';
import { AddressVM } from '../../models/AddressVM';

//@Constant
import { DICTIONARY } from '../../constant/dictionary';
import { MICROAPP } from '../../constant/microapp';


@Component({
  selector: 'app-edit-address',
  templateUrl: './edit-address.component.html',
  styleUrls: ['./edit-address.component.css']
})
export class EditAddressComponent implements OnInit {

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
    public addressService: AddressService) { }

  editForm: FormGroup;

  address: AddressVM;
  oldaddress: AddressVM;
  ID_address?: number = 0;

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
    this.oldaddress = new AddressVM();
    this.rebuildForm();
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

  rebuildForm() {
    this.editForm = this.fb.group({
      address_1: [this.address.address_1, Validators.required],
      address_2: [this.address.address_2],
      city: [this.address.city],
      state: [this.address.state],
      postal_code: [this.address.postal_code, Validators.required],
      country: [this.address.country, Validators.required],
      company: [this.address.company],
    });
    this.editForm.valueChanges.subscribe(data => this.onValueChanged(data));
  }

  onValueChanged(data?: any) {
    //Address Form Errors.    
    this.addressFormErrors = this.errorService.displayValidationErrors(this.addressValidationMessages, this.editForm, this.addressFormErrors, false);
  }

  initializeFormValue() {

    this.commonService.showLoader();

    this.route.params.subscribe(params => { this.ID_address = +params['id']; });

    //Bind dropdown values & get address detail by id
    Promise.all(
      [
        this.getCountry(),
        this.getAddressDetail()
      ]).then((data: any) => {

        if (data != null) {
          let countryResult = data[0];
          let addressResult = data[1];

          //Country
          if (countryResult != null && countryResult.success) {
            let countryItems = countryResult.data;
            if (countryItems.success) {
              this.countryList = countryItems.data;
            }
          }

          //Address
          if (addressResult != null && addressResult.success) {
            let addressInfo = addressResult.data;
            if (addressInfo.success) {
              this.address = Object.assign({}, addressInfo.data[0] as AddressVM);
              this.oldaddress = Object.assign({}, addressInfo.data[0] as AddressVM);

              //Country
              if (this.commonService.isNullOrEmpty(this.address.country)) {
                this.address.country = "";
              }

              this.rebuildForm();
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

  getAddressDetail() {
    return new Promise((resolve, reject) => {
      this.addressService.getAddressById(this.ID_address).subscribe(res => {
        resolve({ success: true, data: res });
      }, error => {
        resolve({ success: false, data: error });
      });
    });
  }

  onSubmit() {

    if (!this.editForm.valid) {
      this.addressFormErrors = this.errorService.displayValidationErrors(this.addressValidationMessages, this.editForm, this.addressFormErrors, true);
      this.toastr.error("Please fill all the required field first", "Error!", { timeOut: 3000, closeButton: true });
      this.commonService.scrollToTop();
      return false;
    }

    let body = this.getBodyToPost(this.editForm.value);

    this.addressService.updateAddress(body).subscribe(data => {
      if (data != null) {
        if (data.success) {
          //Track User Action.
          this.addressService.trackUserAction("update", this.microapp.Master_Data, this.storageService.getUserProfileId(), this.ID_address, this.oldaddress, body)
            .subscribe(res => {
              this.toastr.success("Address details updated successfully.", "Success!", { timeOut: 3000, closeButton: true });
              this.router.navigate(['list-address']);
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
      ID_address: this.ID_address,
      address_1: address.address_1,
      address_2: address.address_2,
      city: address.city,
      state: address.state,
      postal_code: address.postal_code,
      country: address.country
    }
    return body;
  }

  backToList() {
    this.editForm.reset();
    this.commonService.hideLoader();
    this.router.navigate(['list-address']);
  }

}
