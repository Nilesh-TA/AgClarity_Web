//@Packages
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
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
  selector: 'app-edit-crop',
  templateUrl: './edit-crop.component.html',
  styleUrls: ['./edit-crop.component.css']
})
export class EditCropComponent implements OnInit {

  constructor(private router: Router,
    private route: ActivatedRoute,
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

  editForm: FormGroup;

  oldcrop: CropVM;
  crop: CropVM;
  ID_crop: number;

  pageName: string = "Crop";
  cropTypeDictionaryCode: string = "Crop_type";

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
    this.oldcrop = new CropVM();
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
    this.editForm.valueChanges.subscribe(data => this.onValueChanged(data));
  }

  onValueChanged(data?: any) {
    //Crop Form Errors.    
    this.cropFormErrors = this.errorService.displayValidationErrors(this.cropValidationMessages, this.editForm, this.cropFormErrors, false);
  }

  initializeFormValue() {

    this.route.params.subscribe(params => { this.ID_crop = +params['id']; });

    this.commonService.showLoader();

    //Bind dropdown values    
    Promise.all(
      [
        this.getCropType(),
        this.getCropDetail()
      ]).then((data: any) => {

        if (data != null) {
          let cropTypeResult = data[0];
          let cropResult = data[1];

          //Crop Type
          if (cropTypeResult != null && cropTypeResult.success) {
            let cropTypeItems = cropTypeResult.data;
            if (cropTypeItems.success) {
              this.cropTypeList = cropTypeItems.data;
            }
          }

          //Crop Detail
          if (cropResult != null && cropResult.success) {
            let cropInfo = cropResult.data;
            if (cropInfo.success) {
              this.crop = Object.assign({}, cropInfo.data[0] as CropVM);
              this.oldcrop = Object.assign({}, cropInfo.data[0] as CropVM);

              if (this.commonService.isNullOrEmpty(this.crop.type)) {
                this.crop.type = "";
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

  getCropType() {
    return new Promise((resolve, reject) => {
      this.dictionaryService.getDictionaryByCode(this.dictionary.Crop_Type).subscribe(res => {
        resolve({ success: true, data: res });
      }, error => {
        resolve({ success: false, data: error });
      });
    });
  }

  getCropDetail() {
    return new Promise((resolve, reject) => {
      this.cropService.getCropById(this.ID_crop).subscribe(res => {
        resolve({ success: true, data: res });
      }, error => {
        resolve({ success: false, data: error });
      });
    });
  }

  onSubmit() {

    if (!this.editForm.valid) {
      this.cropFormErrors = this.errorService.displayValidationErrors(this.cropValidationMessages, this.editForm, this.cropFormErrors, true);
      this.toastr.error("Please fill all the required field first", "Error!", { timeOut: 3000, closeButton: true });
      this.commonService.scrollToTop();
      return false;
    }

    let body = this.getBodyToPost(this.editForm.value);

    this.cropService.updateCrop(body).subscribe(data => {
      if (data != null) {
        if (data.success) {
          //Track User Action.
          this.cropService.trackUserAction("update", this.microapp.ASD_Admin, this.storageService.getUserProfileId(), this.ID_crop, this.oldcrop, body)
          .subscribe(res => {
            this.toastr.success("Crop details updated successfully.", "Success!", { timeOut: 3000, closeButton: true });
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
      ID_crop: this.ID_crop,
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
      stage_10: crop.stage_10
    }
    return body;
  }

  backToList() {
    this.editForm.reset();
    this.commonService.hideLoader();
    this.router.navigate(['list-crop']);
  }

}
