//@Packages
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
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
  selector: 'app-edit-location',
  templateUrl: './edit-location.component.html',
  styleUrls: ['./edit-location.component.css']
})
export class EditLocationComponent implements OnInit {

  constructor(private router: Router,
    private route: ActivatedRoute,
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

  editForm: FormGroup;
  
  location: LocationVM;
  oldlocation: LocationVM;
  ID_location: number = 0;
  
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
    this.oldlocation = new LocationVM();
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

    this.editForm.valueChanges.subscribe(data => this.onValueChanged(data));
  }

  onValueChanged(data?: any) {
    //Location Form Errors.    
    this.locationFormErrors = this.errorService.displayValidationErrors(this.locationValidationMessages, this.editForm, this.locationFormErrors, false);
  }

  initializeFormValue() {

    this.commonService.showLoader();

    this.route.params.subscribe(params => { this.ID_location = +params['id']; });    

    //Bind dropdown values    
    Promise.all(
      [
        this.getLocationType(),
        this.getLoctionDetail()
      ]).then((data: any) => {

        if (data != null) {
          let locationTypeResult = data[0];
          let locationResult = data[1];

          //Location Type
          if (locationTypeResult != null && locationTypeResult.success) {
            let locationTypeItems = locationTypeResult.data;
            if (locationTypeItems.success) {
              this.locationTypeList = locationTypeItems.data;
            }
          }

          //Location Detail
          if (locationResult != null && locationResult.success) {
            let locationInfo = locationResult.data;
            if (locationInfo.success) {
              this.location = Object.assign({}, locationInfo.data[0] as LocationVM);
              this.oldlocation = Object.assign({}, locationInfo.data[0] as LocationVM);

              this.location.type = !this.commonService.isNullOrEmpty(this.location.type) ?  this.location.type : "";

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

  getLocationType() {
    return new Promise((resolve, reject) => {
      this.dictionaryService.getDictionaryByCode(this.dictionary.Location_Type).subscribe(res => {
        resolve({ success: true, data: res });
      }, error => {
        resolve({ success: false, data: error });
      });
    });
  }

  getLoctionDetail() {
    return new Promise((resolve, reject) => {
      this.locationService.getLocationById(this.ID_location).subscribe(res => {
        resolve({ success: true, data: res });
      }, error => {
        resolve({ success: false, data: error });
      });
    });
  }

  onSubmit() {

    if (!this.editForm.valid) {
      this.locationFormErrors = this.errorService.displayValidationErrors(this.locationValidationMessages, this.editForm, this.locationFormErrors, true);
      this.toastr.error("Please fill all the required field first", "Error!", { timeOut: 3000, closeButton: true });
      this.commonService.scrollToTop();
      return false;
    }

    let body = this.getBodyToPost(this.editForm.value);

    this.locationService.updateLocation(body).subscribe(data => {
      if (data != null) {
        if (data.success) {
          const insertedId = data.data.insertId;

          //Track User Action.
          this.locationService.trackUserAction("update", this.microapp.Master_Data, this.storageService.getUserProfileId(), this.ID_location, this.oldlocation, body)
            .subscribe(res => {
              this.toastr.success("Location detail updated successfully.", "Success!", { timeOut: 3000, closeButton: true });
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
      ID_location: this.ID_location,
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
      mdp: location.mdp      
    }
    return body;
  }

  backToList() {
    this.editForm.reset();
    this.commonService.hideLoader();
    this.router.navigate(['list-location']);
  }
}
