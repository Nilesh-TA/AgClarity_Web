//@Packages
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, NavigationExtras } from "@angular/router";
import { ToastrService } from 'ngx-toastr';

//@Services
import { CommonService } from '../../services/common.service';
import { ErrorService } from '../../services/error.service';
import { DictionaryService } from '../../services/dictionary.service';
import { IrrigationService } from '../../services/irrigation.service';
import { StorageService } from '../../services/storage.service';

//@Models
import { DictionaryVM } from '../../models/DictionaryVM';
import { IrrigationVM } from '../../models/IrrigationVM';
import { PayLoadIrrigationLocation } from '../../models/IrrigationLocationVM';

//@Constant
import { DICTIONARY } from '../../constant/dictionary';
import { MICROAPP } from '../../constant/microapp';

@Component({
  selector: 'app-add-irrigation',
  templateUrl: './add-irrigation.component.html',
  styleUrls: ['./add-irrigation.component.css']
})
export class AddIrrigationComponent implements OnInit {

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
    public irrigationService: IrrigationService) { }

  addForm: FormGroup;
  irrigation: IrrigationVM;

  companyId: number = 0;

  pageName: string = "Irrigation";

  irrigationTypeList: DictionaryVM[] = [];

  public irrigationFormErrors = {
    name: '',
    type: '',
    description: '',
    volume_rating: ''
  };

  private irrigationValidationMessages = {
    name: { 'required': 'Please enter name.' },
    type: { 'required': 'Please select irrigation type.' }
  }

  ngOnInit() {
    this.irrigation = new IrrigationVM();
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
      this.irrigation.type = "";
    }

    this.addForm = this.fb.group({
      name: [this.irrigation.name, Validators.required],
      type: [this.irrigation.type, Validators.required],
      description: [this.irrigation.description],
      volume_rating: [this.irrigation.volume_rating]
    });
    this.addForm.valueChanges.subscribe(data => this.onValueChanged(data));
  }

  onValueChanged(data?: any) {
    //Irrigation Form Errors.    
    this.irrigationFormErrors = this.errorService.displayValidationErrors(this.irrigationValidationMessages, this.addForm, this.irrigationFormErrors, false);
  }

  initializeFormValue() {

    this.commonService.showLoader();
    this.companyId = this.storageService.getCompanyId();

    //Bind dropdown values    
    Promise.all(
      [
        this.getIrrigationType()
      ]).then((data: any) => {

        if (data != null) {
          let irrigationTypeResult = data[0];

          //Irrigation Type
          if (irrigationTypeResult != null && irrigationTypeResult.success) {
            let irrigationTypeItems = irrigationTypeResult.data;
            if (irrigationTypeItems.success) {
              this.irrigationTypeList = irrigationTypeItems.data;
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
    let irrigationFormData = this.irrigationService.irrigationFormData;

    if (irrigationFormData != null) {
      this.irrigation.name = irrigationFormData.name;
      this.irrigation.type = irrigationFormData.type;
      this.irrigation.description = irrigationFormData.description;
      this.irrigation.volume_rating = irrigationFormData.volume_rating;

      this.buildForm(false);

    }
  }

  getIrrigationType() {
    return new Promise((resolve, reject) => {
      this.dictionaryService.getDictionaryByCode(this.dictionary.Irrigation_Type).subscribe(res => {
        resolve({ success: true, data: res });
      }, error => {
        resolve({ success: false, data: error });
      });
    });
  }

  onSubmit() {

    if (!this.addForm.valid) {
      this.irrigationFormErrors = this.errorService.displayValidationErrors(this.irrigationValidationMessages, this.addForm, this.irrigationFormErrors, true);
      this.toastr.error("Please fill all the required field first", "Error!", { timeOut: 3000, closeButton: true });
      this.commonService.scrollToTop();
      return false;
    }

    let body = this.getBodyToPost(this.addForm.value);

    this.commonService.showLoader();
    this.irrigationService.createIrrigation(body).subscribe(data => {
      this.commonService.hideLoader();
      if (data != null) {
        if (data.success) {
          const insertedId = data.data.insertId;
          this.irrigation.ID_irrigation = insertedId;

          //IrrigationLocation
          let bodyPayLoadIrrigationLocation = new PayLoadIrrigationLocation();
          bodyPayLoadIrrigationLocation = this.getIrrigationLocationBodyToPost();

          this.commonService.showLoader();
          //Save irrigation-location and track user actions.
          Promise.all(
            [
              this.trackUserAction("add", this.microapp.Master_Data, this.storageService.getUserProfileId(), insertedId, body, body),
              this.irrigationlocationCRUD(bodyPayLoadIrrigationLocation)
            ]).then((data: any) => {
              this.commonService.hideLoader();
              this.toastr.success("Irrigation created successfully.", "Success!", { timeOut: 3000, closeButton: true });
              this.router.navigate(['list-irrigation']);
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

  trackUserAction(action, appname, user, id, oldIrrigation: any, newIrrigation: any) {
    return new Promise((resolve, reject) => {
      this.irrigationService.trackUserAction(action, appname, user, id, oldIrrigation, newIrrigation).subscribe(res => {
        resolve({ success: true, data: res });
      }, error => {
        resolve({ success: false, data: error });
      });
    });
  }

  irrigationlocationCRUD(body: any) {    
    return new Promise((resolve, reject) => {
      this.irrigationService.irrigationlocation_CRUD(body).subscribe(res => {        
        resolve({ success: true, data: res });
      }, error => {        
        resolve({ success: false, data: error });
      });
    });
  }

  getBodyToPost(irrigation) {

    let body: any = {
      name: irrigation.name,
      type: irrigation.type,
      description: irrigation.description,
      volume_rating: irrigation.volume_rating,
      company: this.companyId
    }
    return body;
  }

  getIrrigationLocationBodyToPost() {    
    let bodyPayLoadIrrigationLocation = new PayLoadIrrigationLocation();
    bodyPayLoadIrrigationLocation.add = [];
    bodyPayLoadIrrigationLocation.delete = [];
    bodyPayLoadIrrigationLocation.update = {
      old: [],
      new: []
    }
    bodyPayLoadIrrigationLocation.microapp_name = this.microapp.Master_Data;
    bodyPayLoadIrrigationLocation.userid = this.storageService.getUserProfileId();

    if (this.irrigationService.irrigationLocationFormData != null) {
      bodyPayLoadIrrigationLocation = this.irrigationService.irrigationLocationFormData

      for (let i = 0; i < bodyPayLoadIrrigationLocation.add.length; i++) {
        bodyPayLoadIrrigationLocation.add[i].irrigation = this.irrigation.ID_irrigation;
      }
    }

    return bodyPayLoadIrrigationLocation;
  }

  selectIrrigationLocation() {
    let queryString: NavigationExtras = {
      queryParams: {
        "id": 0,
        "company": this.companyId,
        "action": "add"
      }
    };

    this.irrigationService.pageSource = "add";
    this.irrigationService.irrigationFormData = this.addForm.value;

    this.router.navigate(['/irrigation-location'], queryString);
  }

  backToList() {
    this.addForm.reset();
    this.commonService.hideLoader();
    this.router.navigate(['list-irrigation']);
  }

}
