//@Packages
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";

//@Services
import { CommonService } from '../../services/common.service';
import { DictionaryService } from '../../services/dictionary.service';
import { AddressService } from '../../services/address.service';

//@Models
import { DictionaryVM } from '../../models/DictionaryVM';
import { AddressVM } from '../../models/AddressVM';

//@Constant
import { DICTIONARY } from '../../constant/dictionary';
import { MICROAPP } from '../../constant/microapp';
import { REGEXP } from '../../constant/regexp';

@Component({
  selector: 'app-view-address',
  templateUrl: './view-address.component.html',
  styleUrls: ['./view-address.component.css']
})
export class ViewAddressComponent implements OnInit {

  constructor(private router: Router,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private fb: FormBuilder,    
    public dictionary: DICTIONARY,
    public microapp: MICROAPP,
    public regexp: REGEXP,
    public commonService: CommonService,        
    public dictionaryService: DictionaryService,
    public addressService: AddressService) { }

  viewForm: FormGroup;

  address: AddressVM;
  ID_address?: number = 0;

  pageName: string = "Address";

  countryList: DictionaryVM[] = [];

  ngOnInit() {
    this.address = new AddressVM();
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
    this.viewForm = this.fb.group({
      address_1: [this.address.address_1, Validators.required],
      address_2: [this.address.address_2],
      city: [this.address.city],
      state: [this.address.state],
      postal_code: [this.address.postal_code, Validators.required],
      country: [this.address.country, Validators.required],
      company: [this.address.company],
    });
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

  backToList() {
    this.viewForm.reset();
    this.commonService.hideLoader();
    this.router.navigate(['list-address']);
  }

}
