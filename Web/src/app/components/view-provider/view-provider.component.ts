//@Packages
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";

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
  selector: 'app-view-provider',
  templateUrl: './view-provider.component.html',
  styleUrls: ['./view-provider.component.css']
})
export class ViewProviderComponent implements OnInit {

  constructor(private router: Router,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private fb: FormBuilder,    
    public dictionary: DICTIONARY,
    public microapp: MICROAPP,    
    public commonService: CommonService,
    public storageService: StorageService,
    public errorService: ErrorService,
    public dictionaryService: DictionaryService,
    public locationService: LocationService,
    public addressService: AddressService,
    public providerService: ProviderService) { }

  viewForm: FormGroup;

  provider: ProviderVM;
  ID_provider?: number = 0;

  companyId: number = 0;

  pageName: string = "Provider";

  providerTypeList: DictionaryVM[] = [];
  uomList: DictionaryVM[] = [];
  relatedToList: ProviderVM[] = [];
  locationList: LocationVM[] = [];
  addressList: AddressVM[] = [];

  ngOnInit() {
    this.provider = new ProviderVM();
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
      name: [this.provider.name, Validators.required],
      metric_imperial: [this.provider.metric_imperial, Validators.required],
      related_to: [this.provider.related_to],
      locationID: [this.provider.locationID],
      type: [this.provider.type, Validators.required],
      addressID: [this.provider.addressID, Validators.required]
    });    
  }


  initializeFormValue() {

    this.commonService.showLoader();
    this.companyId = this.storageService.getCompanyId();
    this.route.params.subscribe(params => { this.ID_provider = +params['id']; });

    //Bind dropdown values    
    Promise.all(
      [
        this.getUOM(),
        this.getProviderType(),
        this.getLocations(),
        this.getRelatedToProviders(),
        this.getAddresses(),
        this.getProviderDetail()
      ]).then((data: any) => {

        if (data != null) {
          let uomResult = data[0];
          let providerTypeResult = data[1];
          let locationResult = data[2];
          let providerResult = data[3];
          let addressResult = data[4];
          let providerDetailResult = data[5];

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

          //Provider Detail
          if (providerDetailResult != null && providerDetailResult.success) {
            let providerInfo = providerDetailResult.data;
            if (providerInfo.success) {
              this.provider = providerInfo.data[0] as ProviderVM;
              
              this.provider.metric_imperial = !this.commonService.isNullOrEmpty(this.provider.metric_imperial) ? this.provider.metric_imperial : "";
              this.provider.type = !this.commonService.isNullOrEmpty(this.provider.type) ? this.provider.type : "";
              this.provider.related_to = !this.commonService.isNullOrEmpty(this.provider.related_to) ? this.provider.related_to : "";              
              this.provider.locationID = !this.commonService.isNullOrEmpty(this.provider.locationID) ? this.provider.locationID : "";
              this.provider.addressID = !this.commonService.isNullOrEmpty(this.provider.addressID) ? this.provider.addressID : "";

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
      this.providerService.getProvidersByCompany(this.companyId, this.ID_provider).subscribe(res => {
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

  getProviderDetail() {
    return new Promise((resolve, reject) => {
      this.providerService.getProviderById(this.ID_provider).subscribe(res => {
        resolve({ success: true, data: res });
      }, error => {
        resolve({ success: false, data: error });
      });
    });
  }

  backToList() {
    this.viewForm.reset();
    this.commonService.hideLoader();
    this.router.navigate(['list-provider']);
  }

}
