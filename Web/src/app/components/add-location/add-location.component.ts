//@Packages
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';

//@Services
import { CommonService } from '../../services/common.service';
import { ErrorService } from '../../services/error.service';
import { DictionaryService } from '../../services/dictionary.service';
import { LocationService } from '../../services/location.service';
import { StorageService } from '../../services/storage.service';

//@Models
import { DictionaryVM } from '../../models/DictionaryVM';
import { LocationVM } from '../../models/LocationVM';

//@Constant
import { DICTIONARY } from '../../constant/dictionary';
import { MICROAPP } from '../../constant/microapp';
import { REGEXP } from '../../constant/regexp';

@Component({
  selector: 'app-add-location',
  templateUrl: './add-location.component.html',
  styleUrls: ['./add-location.component.css']
})
export class AddLocationComponent implements OnInit {

  constructor(private router: Router,
    private cdRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private toastr: ToastrService,
    public dictionary: DICTIONARY,
    public microapp: MICROAPP,
    public regexp: REGEXP,
    public commonService: CommonService,
    public storageService: StorageService,
    public errorService: ErrorService,
    public dictionaryService: DictionaryService,
    public locationService: LocationService) { }

  addForm: FormGroup;
  location: LocationVM;

  companyId: number = 0;
  parentCompanyId: number = 0;

  pageName: string = "Location";

  locationTypeList: DictionaryVM[] = [];

  public locationFormErrors = {
    name: '',
    type: '',
    description: '',    
    address: '',
    longitude: '',
    latitude: '',
    polygon_data: '',
    size: '',
    slope: '',
    aspect: '',
    elevation: '',
    soil_texture: '',
    soil_depth: '',
    water_depth: '',
    field_capacity: '',
    mdp: '',
    company: '',
    related_to: ''
  };

  private locationValidationMessages = {
    name: { 'required': 'Please enter name.' },
    type: { 'required': 'Please select location type.' },
    description: { 'required': 'Please enter description.' },
    longitude: { 'pattern': 'Longitude range must be between -180.0 to 180.0' },
    latitude: { 'pattern': 'Latitude range must be between -90.0 to 90.0' },
    size: { 'pattern': 'Please enter valid size. It must be valid numeric value.' },
    elevation: { 'pattern': 'Please enter valid elevation. It must be valid numeric value.' },
    soil_texture: { 'pattern': 'Please enter valid soil texture index. It must be valid numeric value.' },
    soil_depth: { 'pattern': 'Please enter valid soil depth. It must be valid numeric value.' },
    water_depth: { 'pattern': 'Please enter valid water depth. It must be valid numeric value.' },
    field_capacity: { 'pattern': 'Please enter valid field capacity. It must be valid numeric value.' },
    mdp: { 'pattern': 'Please enter valid MDP. It must be valid numeric value.' },
  }

  ngOnInit() {
    this.location = new LocationVM();
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
    this.location.type = "";

    this.addForm = this.fb.group({
      name: [this.location.name, Validators.required],
      type: [this.location.type, Validators.required],
      description: [this.location.description, Validators.required],
      address: [this.location.address],
      longitude: [this.location.longitude, [Validators.pattern(this.regexp.LONGITUDE_EXP)]],
      latitude: [this.location.latitude, [Validators.pattern(this.regexp.LATITUDE_EXP)]],
      polygon_data: [this.location.polygon_data],
      size: [this.location.size, [Validators.pattern(this.regexp.NUMBER_REGEXP)]],
      slope: [this.location.slope],
      aspect: [this.location.aspect],
      elevation: [this.location.elevation, [Validators.pattern(this.regexp.NUMBER_REGEXP)]],
      soil_texture: [this.location.soil_texture, [Validators.pattern(this.regexp.NUMBER_REGEXP)]],
      soil_depth: [this.location.soil_depth, [Validators.pattern(this.regexp.NUMBER_REGEXP)]],
      water_depth: [this.location.water_depth, [Validators.pattern(this.regexp.NUMBER_REGEXP)]],
      field_capacity: [this.location.field_capacity, [Validators.pattern(this.regexp.NUMBER_REGEXP)]],
      mdp: [this.location.mdp, [Validators.pattern(this.regexp.NUMBER_REGEXP)]],
      company: [this.location.company],
      related_to: [this.location.related_to],
    });
    this.addForm.valueChanges.subscribe(data => this.onValueChanged(data));
  }

  onValueChanged(data?: any) {
    //Location Form Errors.    
    this.locationFormErrors = this.errorService.displayValidationErrors(this.locationValidationMessages, this.addForm, this.locationFormErrors, false);
  }

  initializeFormValue() {

    this.commonService.showLoader();
    this.companyId = this.storageService.getCompanyId();
    this.parentCompanyId = this.storageService.getParentCompanyId();

    //Bind dropdown values    
    Promise.all(
      [
        this.getLocationType()
      ]).then((data: any) => {

        if (data != null) {
          let locationTypeResult = data[0];

          //Location Type
          if (locationTypeResult != null && locationTypeResult.success) {
            let locationTypeItems = locationTypeResult.data;
            if (locationTypeItems.success) {
              this.locationTypeList = locationTypeItems.data;
            }
          }

          this.commonService.hideLoader();
        }
      }).catch((error) => {
        this.commonService.hideLoader();
        console.error(error);
      });
  }

  getLocationType() {
    return new Promise((resolve, reject) => {
      this.dictionaryService.getDictionaryByCode(this.dictionary.Location_Type).subscribe(res => {
        resolve({ success: true, data: res });
      }, error => {
        resolve({ success: false, data: error });
      });
    });
  }

  onSubmit() {

    if (!this.addForm.valid) {
      this.locationFormErrors = this.errorService.displayValidationErrors(this.locationValidationMessages, this.addForm, this.locationFormErrors, true);
      this.toastr.error("Please fill all the required field first", "Error!", { timeOut: 3000, closeButton: true });
      this.commonService.scrollToTop();
      return false;
    }

    let body = this.getBodyToPost(this.addForm.value);

    this.locationService.createLocation(body).subscribe(data => {
      if (data != null) {
        if (data.success) {
          const insertedId = data.data.insertId;

          //Track User Action.
          this.locationService.trackUserAction("add", this.microapp.Master_Data, this.storageService.getUserProfileId(), insertedId, body, body)
            .subscribe(res => {
              this.toastr.success("Location created successfully.", "Success!", { timeOut: 3000, closeButton: true });
              this.router.navigate(['list-location']);
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

  getBodyToPost(location) {

    let body: any = {
      name: location.name,
      type: location.type,
      description: location.description,      
      address: location.address,      
      longitude: location.longitude,
      latitude: location.latitude,
      polygon_data: location.polygon_data,
      size: location.size,
      slope: location.slope,
      aspect: location.aspect,
      elevation: location.elevation,
      soil_texture: location.soil_texture,
      soil_depth: location.soil_depth,
      water_depth: location.water_depth,
      field_capacity: location.field_capacity,
      mdp: location.mdp,
      company: this.companyId,
      related_to: this.parentCompanyId > 0 ? this.parentCompanyId : null
    }
    return body;
  }

  backToList() {
    this.addForm.reset();
    this.commonService.hideLoader();
    this.router.navigate(['list-location']);
  }
}
