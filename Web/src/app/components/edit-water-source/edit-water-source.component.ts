//@Packages
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
import { ToastrService } from 'ngx-toastr';

//@Services
import { CommonService } from '../../services/common.service';
import { ErrorService } from '../../services/error.service';
import { DictionaryService } from '../../services/dictionary.service';
import { WaterSourceService } from '../../services/water-source.service';
import { StorageService } from '../../services/storage.service';

//@Models
import { DictionaryVM } from '../../models/DictionaryVM';
import { WaterSourceVM } from '../../models/WaterSourceVM';
import { PayLoadWaterSourceLocation } from '../../models/WaterSourceLocationVM';

//@Constant
import { DICTIONARY } from '../../constant/dictionary';
import { MICROAPP } from '../../constant/microapp';
import { REGEXP } from '../../constant/regexp';

@Component({
  selector: 'app-edit-water-source',
  templateUrl: './edit-water-source.component.html',
  styleUrls: ['./edit-water-source.component.css']
})
export class EditWaterSourceComponent implements OnInit {

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
    public waterSourceService: WaterSourceService) { }

  editForm: FormGroup;

  ID_watersource?: number = 0;
  watersource: WaterSourceVM;
  oldwatersource: WaterSourceVM;  

  companyId: number = 0;

  pageName: string = "Water Source";

  watersourceTypeList: DictionaryVM[] = [];

  public watersourceFormErrors = {
    name: '',
    type: '',
    description: '',
    volume_rating: '',
    min_depth: '',
    max_depth: ''
  };

  private watersourceValidationMessages = {
    name: { 'required': 'Please enter name.' },
    type: { 'required': 'Please select watersource type.' },
    min_depth: { 'pattern': 'Please enter valid min depth. It must be valid numeric value.' },
    max_depth: { 'pattern': 'Please enter valid max depth. It must be valid numeric value.' }
  }

  ngOnInit() {
    this.watersource = new WaterSourceVM();
    this.oldwatersource = new WaterSourceVM();
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
      name: [this.watersource.name, Validators.required],
      type: [this.watersource.type, Validators.required],
      description: [this.watersource.description],
      volume_rating: [this.watersource.volume_rating],
      min_depth: [this.watersource.min_depth, [Validators.pattern(this.regexp.NUMBER_REGEXP)]],
      max_depth: [this.watersource.max_depth, [Validators.pattern(this.regexp.NUMBER_REGEXP)]]
    });
    this.editForm.valueChanges.subscribe(data => this.onValueChanged(data));
  }

  onValueChanged(data?: any) {
    //WaterSource Form Errors.    
    this.watersourceFormErrors = this.errorService.displayValidationErrors(this.watersourceValidationMessages, this.editForm, this.watersourceFormErrors, false);
  }

  initializeFormValue() {

    this.commonService.showLoader();
    this.companyId = this.storageService.getCompanyId();

    this.route.params.subscribe(params => { this.ID_watersource = +params['id']; });

    //Bind dropdown values    
    Promise.all(
      [
        this.getWaterSourceType(),
        this.getWaterSourceDetail()
      ]).then((data: any) => {

        if (data != null) {
          let watersourceTypeResult = data[0];
          let watersourceResult = data[1];

          //WaterSource Type
          if (watersourceTypeResult != null && watersourceTypeResult.success) {
            let watersourceTypeItems = watersourceTypeResult.data;
            if (watersourceTypeItems.success) {
              this.watersourceTypeList = watersourceTypeItems.data;
            }
          }
          
          //WaterSource Detail
          if (watersourceResult != null && watersourceResult.success) {
            let watersourceItems = watersourceResult.data;
            if (watersourceItems.success) {

              const watersourceData = watersourceItems.data[0] as WaterSourceVM;

              //Copy Object.
              this.oldwatersource = Object.assign({}, watersourceData);
              this.watersource = Object.assign({}, watersourceData);

              if (this.commonService.isNullOrEmpty(this.watersource.type)) {
                this.watersource.type = "";
              }

              this.rebuildForm();
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
    let watersourceFormData = this.waterSourceService.watersourceFormData;

    if (watersourceFormData != null) {
      this.watersource.name = watersourceFormData.name;
      this.watersource.type = watersourceFormData.type;
      this.watersource.description = watersourceFormData.description;
      this.watersource.volume_rating = watersourceFormData.volume_rating;
      this.watersource.min_depth = watersourceFormData.min_depth;
      this.watersource.max_depth = watersourceFormData.max_depth;

      this.rebuildForm();
    }
  }

  getWaterSourceType() {
    return new Promise((resolve, reject) => {
      this.dictionaryService.getDictionaryByCode(this.dictionary.WaterSource).subscribe(res => {
        resolve({ success: true, data: res });
      }, error => {
        resolve({ success: false, data: error });
      });
    });
  }

  getWaterSourceDetail() {
    return new Promise((resolve, reject) => {
      this.waterSourceService.getWaterSourceById(this.ID_watersource).subscribe(res => {
        resolve({ success: true, data: res });
      }, error => {
        resolve({ success: false, data: error });
      });
    });
  }

  onSubmit() {

    if (!this.editForm.valid) {
      this.watersourceFormErrors = this.errorService.displayValidationErrors(this.watersourceValidationMessages, this.editForm, this.watersourceFormErrors, true);
      this.toastr.error("Please fill all the required field first", "Error!", { timeOut: 3000, closeButton: true });
      this.commonService.scrollToTop();
      return false;
    }

    let body = this.getBodyToPost(this.editForm.value);

    this.commonService.showLoader();
    this.waterSourceService.updateWaterSource(body).subscribe(data => {
      this.commonService.hideLoader();
      if (data != null) {
        if (data.success) {

          //WaterSourceLocation
          let bodyPayLoadWaterSourceLocation = new PayLoadWaterSourceLocation();
          bodyPayLoadWaterSourceLocation = this.getWaterSourceLocationBodyToPost();

          this.commonService.showLoader();
          //Save watersource-location and track user actions.
          Promise.all(
            [
              this.trackUserAction("update", this.microapp.Master_Data, this.storageService.getUserProfileId(), this.ID_watersource, this.oldwatersource, body),
              this.watersourcelocationCRUD(bodyPayLoadWaterSourceLocation)
            ]).then((data: any) => {
              this.commonService.hideLoader();
              this.toastr.success("Water Source details updated successfully.", "Success!", { timeOut: 3000, closeButton: true });
              this.router.navigate(['list-watersource']);
            }).catch((error) => {
              this.toastr.error(error.message, "Error!", { timeOut: 3000, closeButton: true });
              this.commonService.hideLoader();
              console.error(error);
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
      this.commonService.hideLoader();
    });
  }

  trackUserAction(action, appname, user, id, oldWaterSource: any, newWaterSource: any) {
    return new Promise((resolve, reject) => {
      this.waterSourceService.trackUserAction(action, appname, user, id, oldWaterSource, newWaterSource).subscribe(res => {
        resolve({ success: true, data: res });
      }, error => {
        resolve({ success: false, data: error });
      });
    });
  }

  watersourcelocationCRUD(body: any) {
    return new Promise((resolve, reject) => {
      this.waterSourceService.watersourcelocation_CRUD(body).subscribe(res => {
        resolve({ success: true, data: res });
      }, error => {
        resolve({ success: false, data: error });
      });
    });
  }

  getBodyToPost(watersource) {

    let body: any = {
      ID_watersource: this.ID_watersource,
      name: watersource.name,
      type: watersource.type,
      description: watersource.description,
      volume_rating: watersource.volume_rating,
      min_depth: watersource.min_depth,
      max_depth: watersource.max_depth,
      company: this.companyId
    }
    return body;
  }

  getWaterSourceLocationBodyToPost() {    
    let bodyPayLoadWaterSourceLocation = new PayLoadWaterSourceLocation();
    bodyPayLoadWaterSourceLocation.add = [];
    bodyPayLoadWaterSourceLocation.delete = [];
    bodyPayLoadWaterSourceLocation.update = {
      old: [],
      new: []
    }
    bodyPayLoadWaterSourceLocation.microapp_name = this.microapp.Master_Data;
    bodyPayLoadWaterSourceLocation.userid = this.storageService.getUserProfileId();

    if (this.waterSourceService.watersourceLocationFormData != null) {
      bodyPayLoadWaterSourceLocation = this.waterSourceService.watersourceLocationFormData;

      for (let i = 0; i < bodyPayLoadWaterSourceLocation.add.length; i++) {
        bodyPayLoadWaterSourceLocation.add[i].watersource = this.ID_watersource;
      }
    }

    return bodyPayLoadWaterSourceLocation;
  }

  selectWaterSourceLocation() {
    let queryString: NavigationExtras = {
      queryParams: {
        "id": this.ID_watersource,
        "company": this.companyId,
        "action": "edit"
      }
    };

    this.waterSourceService.pageSource = "edit";
    this.waterSourceService.watersourceFormData = this.editForm.value;

    this.router.navigate(['/watersource-location'], queryString);
  }

  backToList() {
    this.editForm.reset();
    this.commonService.hideLoader();
    this.router.navigate(['list-watersource']);
  }

}
