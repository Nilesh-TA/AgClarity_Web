//@Packages
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
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

@Component({
  selector: 'app-view-crop',
  templateUrl: './view-crop.component.html',
  styleUrls: ['./view-crop.component.css']
})
export class ViewCropComponent implements OnInit {

  constructor(private router: Router,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private toastr: ToastrService,
    public regexp: REGEXP,
    public dictionary: DICTIONARY,
    public commonService: CommonService,
    public storageService: StorageService,
    public errorService: ErrorService,
    public dictionaryService: DictionaryService,
    public cropService: CropService) { }

  viewForm: FormGroup;

  crop: CropVM;
  ID_crop: number;

  pageName: string = "Crop";
  cropTypeDictionaryCode: string = "Crop_type";

  cropTypeList: DictionaryVM[] = [];

  ngOnInit() {    
    this.initializeFormValue();
    this.rebuildForm();    
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
      name: [this.crop.name],
      variety_name: [this.crop.variety_name],
      description: [this.crop.description],
      type: [this.crop.type],
      avg_yield_acre: [this.crop.avg_yield_acre],
      avg_size: [this.crop.avg_size],
      avg_color: [this.crop.avg_color],
      maturity_cycle: [this.crop.maturity_cycle],
      crop_cycle: [this.crop.crop_cycle],
      crop_season: [this.crop.crop_season],
      kc_init: [this.crop.kc_init],
      kc_mid: [this.crop.kc_mid],
      kc_end: [this.crop.kc_end],
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
  }


  initializeFormValue() {

    this.crop = new CropVM();

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
              this.crop = cropInfo.data[0] as CropVM;

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

  backToList() {
    this.viewForm.reset();
    this.commonService.hideLoader();
    this.router.navigate(['list-crop']);
  }
}
