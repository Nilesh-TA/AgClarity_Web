//@Packages
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';

//@Services
import { CommonService } from '../../services/common.service';
import { ErrorService } from '../../services/error.service';
import { DictionaryService } from '../../services/dictionary.service';
import { CropService } from '../../services/crop.service';
import { StorageService } from '../../services/storage.service';

//@Models
import { DictionaryVM } from '../../models/DictionaryVM';
import { CropVM } from '../../models/CropVM';

//@Constant
import { REGEXP } from '../../constant/regexp';
import { DICTIONARY } from '../../constant/dictionary';
import { MICROAPP } from '../../constant/microapp';

@Component({
  selector: 'app-add-crop',
  templateUrl: './add-crop.component.html',
  styleUrls: ['./add-crop.component.css']
})
export class AddCropComponent implements OnInit {

  constructor(private router: Router,
    private cdRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private toastr: ToastrService,
    public regexp: REGEXP,
    public dictionary: DICTIONARY,
    public microapp: MICROAPP,
    public commonService: CommonService,
    public storageService: StorageService,
    public errorService: ErrorService,
    public dictionaryService: DictionaryService,
    public cropService: CropService) { }

  addForm: FormGroup;
  crop: CropVM;

  companyId: number = 0;

  pageName: string = "Crop";

  cropTypeList: DictionaryVM[] = [];

  public cropFormErrors = {
    name: '',
    variety_name: '',
    description: '',
    type: '',
    avg_yield_acre: '',
    avg_size: '',
    avg_color: '',
    maturity_cycle: '',
    crop_cycle: '',
    crop_season: '',
    kc_init: '',
    kc_mid: '',
    kc_end: '',
    stage_1: '',
    stage_2: '',
    stage_3: '',
    stage_4: '',
    stage_5: '',
    stage_6: '',
    stage_7: '',
    stage_8: '',
    stage_9: '',
    stage_10: ''
  };

  private cropValidationMessages = {
    name: { 'required': 'Please enter name.' },
    type: { 'required': 'Please select crop type.' },
    avg_yield_acre: {
      'required': 'Please enter average yield/acre.',
      'pattern': 'Please enter valid average yield/acre. It must be valid numeric value.'
    },
    avg_size: { 'pattern': 'Please enter valid average size. It must be valid numeric value.' },
    kc_init: { 'pattern': 'Please enter valid KC Init. It must be valid numeric value.' },
    kc_mid: { 'pattern': 'Please enter valid KC Mid. It must be valid numeric value.' },
    kc_end: { 'pattern': 'Please enter valid KC End. It must be valid numeric value.' }
  }

  ngOnInit() {
    this.crop = new CropVM();
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
    this.crop.type = "";

    this.addForm = this.fb.group({
      name: [this.crop.name, Validators.required],
      variety_name: [this.crop.variety_name],
      description: [this.crop.description],
      type: [this.crop.type, Validators.required],
      avg_yield_acre: [this.crop.avg_yield_acre, [Validators.required, Validators.pattern(this.regexp.NUMBER_REGEXP)]],
      avg_size: [this.crop.avg_size, [Validators.pattern(this.regexp.NUMBER_REGEXP)]],
      avg_color: [this.crop.avg_color],
      maturity_cycle: [this.crop.maturity_cycle],
      crop_cycle: [this.crop.crop_cycle],
      crop_season: [this.crop.crop_season],
      kc_init: [this.crop.kc_init, [Validators.pattern(this.regexp.NUMBER_REGEXP)]],
      kc_mid: [this.crop.kc_mid, [Validators.pattern(this.regexp.NUMBER_REGEXP)]],
      kc_end: [this.crop.kc_end, [Validators.pattern(this.regexp.NUMBER_REGEXP)]],
      stage_1: [this.crop.stage_1],
      stage_2: [this.crop.stage_2],
      stage_3: [this.crop.stage_3],
      stage_4: [this.crop.stage_4],
      stage_5: [this.crop.stage_5],
      stage_6: [this.crop.stage_6],
      stage_7: [this.crop.stage_7],
      stage_8: [this.crop.stage_8],
      stage_9: [this.crop.stage_9],
      stage_10: [this.crop.stage_10],
    });
    this.addForm.valueChanges.subscribe(data => this.onValueChanged(data));
  }

  onValueChanged(data?: any) {
    //Crop Form Errors.    
    this.cropFormErrors = this.errorService.displayValidationErrors(this.cropValidationMessages, this.addForm, this.cropFormErrors, false);
  }

  initializeFormValue() {

    this.commonService.showLoader();
    this.companyId = this.storageService.getCompanyId();

    //Bind dropdown values    
    Promise.all(
      [
        this.getCropType()
      ]).then((data: any) => {

        if (data != null) {
          let cropTypeResult = data[0];

          //Crop Type
          if (cropTypeResult != null && cropTypeResult.success) {
            let cropTypeItems = cropTypeResult.data;
            if (cropTypeItems.success) {
              this.cropTypeList = cropTypeItems.data;
            }
          }

          this.commonService.hideLoader();
        }
      }).catch((error) => {
        this.commonService.hideLoader();
        console.error(error);
      });
  }

  getCropType() {
    return new Promise((resolve, reject) => {
      this.dictionaryService.getDictionaryByCode(this.dictionary.Crop_Type).subscribe(res => {
        resolve({ success: true, data: res });
      }, error => {
        resolve({ success: false, data: error });
      });
    });
  }

  onSubmit() {

    if (!this.addForm.valid) {
      this.cropFormErrors = this.errorService.displayValidationErrors(this.cropValidationMessages, this.addForm, this.cropFormErrors, true);
      this.toastr.error("Please fill all the required field first", "Error!", { timeOut: 3000, closeButton: true });
      this.commonService.scrollToTop();
      return false;
    }

    let body = this.getBodyToPost(this.addForm.value);

    this.cropService.createCrop(body).subscribe(data => {
      if (data != null) {
        if (data.success) {
          const insertedId = data.data.insertId;

          //Track User Action.
          this.cropService.trackUserAction("add", this.microapp.ASD_Admin, this.storageService.getUserProfileId(), insertedId, body, body)
            .subscribe(res => {
              this.toastr.success("Crop created successfully.", "Success!", { timeOut: 3000, closeButton: true });
              this.router.navigate(['list-crop']);
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

  getBodyToPost(crop) {
    let body: any = {
      name: crop.name,
      variety_name: crop.variety_name,
      description: crop.description,
      type: crop.type,
      avg_yield_acre: +crop.avg_yield_acre,
      avg_size: crop.avg_size ? +crop.avg_size : null,
      avg_color: crop.avg_color,
      maturity_cycle: crop.maturity_cycle,
      crop_cycle: crop.crop_cycle,
      crop_season: crop.crop_season,
      kc_init: crop.kc_init ? +crop.kc_init : null,
      kc_mid: crop.kc_mid ? +crop.kc_mid : null,
      kc_end: crop.kc_end ? +crop.kc_end : null,
      stage_1: crop.stage_1,
      stage_2: crop.stage_2,
      stage_3: crop.stage_3,
      stage_4: crop.stage_4,
      stage_5: crop.stage_5,
      stage_6: crop.stage_6,
      stage_7: crop.stage_7,
      stage_8: crop.stage_8,
      stage_9: crop.stage_9,
      stage_10: crop.stage_10,
      company: this.companyId
    }
    return body;
  }

  backToList() {
    this.addForm.reset();
    this.commonService.hideLoader();
    this.router.navigate(['list-crop']);
  }

}
