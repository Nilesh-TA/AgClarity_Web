//@Packages
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
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
import { WaterSourceLocationVM } from '../../models/WaterSourceLocationVM';

//@Constant
import { DICTIONARY } from '../../constant/dictionary';
import { MICROAPP } from '../../constant/microapp';
import { REGEXP } from '../../constant/regexp';

@Component({
  selector: 'app-view-water-source',
  templateUrl: './view-water-source.component.html',
  styleUrls: ['./view-water-source.component.css']
})
export class ViewWaterSourceComponent implements OnInit {

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

  viewForm: FormGroup;

  ID_watersource?: number = 0;
  watersource: WaterSourceVM;  
  watersourceLocations: WaterSourceLocationVM[] = [];

  companyId: number = 0;

  pageName: string = "Water Source";

  watersourceTypeList: DictionaryVM[] = [];

  ngOnInit() {
    this.watersource = new WaterSourceVM();    
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
      name: [this.watersource.name, Validators.required],
      type: [this.watersource.type, Validators.required],
      description: [this.watersource.description],
      volume_rating: [this.watersource.volume_rating],
      min_depth: [this.watersource.min_depth, [Validators.pattern(this.regexp.NUMBER_REGEXP)]],
      max_depth: [this.watersource.max_depth, [Validators.pattern(this.regexp.NUMBER_REGEXP)]]
    });    
  }

  initializeFormValue() {

    this.commonService.showLoader();
    this.companyId = this.storageService.getCompanyId();

    this.route.params.subscribe(params => { this.ID_watersource = +params['id']; });

    //Bind dropdown values    
    Promise.all(
      [
        this.getWaterSourceType(),
        this.getWaterSourceDetail(), 
        this.getWaterSourceLocations()
      ]).then((data: any) => {

        if (data != null) {
          let watersourceTypeResult = data[0];
          let watersourceResult = data[1];
          let watersourceLocationResult = data[2];

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
              this.watersource = Object.assign({}, watersourceData);

              if (this.commonService.isNullOrEmpty(this.watersource.type)) {
                this.watersource.type = "";
              }

              this.rebuildForm();
            }
          }

          //WaterSource Location Detail
          if (watersourceLocationResult != null && watersourceLocationResult.success) {
            let watersourceLocationItems = watersourceLocationResult.data;
            if (watersourceLocationItems.success) {
              this.watersourceLocations = watersourceLocationItems.data as WaterSourceLocationVM[];
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

  getWaterSourceLocations() {
    return new Promise((resolve, reject) => {
      this.waterSourceService.getWatersourceLocationByWaterSourceId(this.ID_watersource).subscribe(res => {
        resolve({ success: true, data: res });
      }, error => {
        resolve({ success: false, data: error });
      });
    });
  }
 
  backToList() {
    this.viewForm.reset();
    this.commonService.hideLoader();
    this.router.navigate(['list-watersource']);
  }

}
