//@Packages
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, NavigationExtras } from "@angular/router";
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
  selector: 'app-add-water-source',
  templateUrl: './add-water-source.component.html',
  styleUrls: ['./add-water-source.component.css']
})
export class AddWaterSourceComponent implements OnInit {

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
    public waterSourceService: WaterSourceService) { }

  addForm: FormGroup;
  watersource: WaterSourceVM;

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
      this.watersource.type = "";
    }

    this.addForm = this.fb.group({
      name: [this.watersource.name, Validators.required],
      type: [this.watersource.type, Validators.required],
      description: [this.watersource.description],
      volume_rating: [this.watersource.volume_rating],
      min_depth: [this.watersource.min_depth, [Validators.pattern(this.regexp.NUMBER_REGEXP)]],
      max_depth: [this.watersource.max_depth, [Validators.pattern(this.regexp.NUMBER_REGEXP)]]
    });
    this.addForm.valueChanges.subscribe(data => this.onValueChanged(data));
  }

  onValueChanged(data?: any) {
    //WaterSource Form Errors.    
    this.watersourceFormErrors = this.errorService.displayValidationErrors(this.watersourceValidationMessages, this.addForm, this.watersourceFormErrors, false);
  }

  initializeFormValue() {

    this.commonService.showLoader();
    this.companyId = this.storageService.getCompanyId();

    //Bind dropdown values    
    Promise.all(
      [
        this.getWaterSourceType()
      ]).then((data: any) => {

        if (data != null) {
          let watersourceTypeResult = data[0];

          //WaterSource Type
          if (watersourceTypeResult != null && watersourceTypeResult.success) {
            let watersourceTypeItems = watersourceTypeResult.data;
            if (watersourceTypeItems.success) {
              this.watersourceTypeList = watersourceTypeItems.data;
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

      this.buildForm(false);
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

  onSubmit() {

    if (!this.addForm.valid) {
      this.watersourceFormErrors = this.errorService.displayValidationErrors(this.watersourceValidationMessages, this.addForm, this.watersourceFormErrors, true);
      this.toastr.error("Please fill all the required field first", "Error!", { timeOut: 3000, closeButton: true });
      this.commonService.scrollToTop();
      return false;
    }

    let body = this.getBodyToPost(this.addForm.value);

    this.commonService.showLoader();
    this.waterSourceService.createWaterSource(body).subscribe(data => {
      this.commonService.hideLoader();
      if (data != null) {
        if (data.success) {
          const insertedId = data.data.insertId;
          this.watersource.ID_watersource = insertedId;

          //WaterSourceLocation
          let bodyPayLoadWaterSourceLocation = new PayLoadWaterSourceLocation();
          bodyPayLoadWaterSourceLocation = this.getWaterSourceLocationBodyToPost();

          this.commonService.showLoader();
          //Save watersource-location and track user actions.
          Promise.all(
            [
              this.trackUserAction("add", this.microapp.Master_Data, this.storageService.getUserProfileId(), insertedId, body, body),
              this.watersourcelocationCRUD(bodyPayLoadWaterSourceLocation)
            ]).then((data: any) => {
              this.commonService.hideLoader();
              this.toastr.success("Water Source created successfully.", "Success!", { timeOut: 3000, closeButton: true });
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
        bodyPayLoadWaterSourceLocation.add[i].watersource = this.watersource.ID_watersource;
      }
    }

    return bodyPayLoadWaterSourceLocation;
  }

  selectWaterSourceLocation() {
    let queryString: NavigationExtras = {
      queryParams: {
        "id": 0,
        "company": this.companyId,
        "action": "add"
      }
    };

    this.waterSourceService.pageSource = "add";
    this.waterSourceService.watersourceFormData = this.addForm.value;

    this.router.navigate(['/watersource-location'], queryString);
  }

  backToList() {
    this.addForm.reset();
    this.commonService.hideLoader();
    this.router.navigate(['list-watersource']);
  }

}
