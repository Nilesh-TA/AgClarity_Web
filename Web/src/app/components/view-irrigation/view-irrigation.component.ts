//@Packages
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
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
import { IrrigationLocationVM } from '../../models/IrrigationLocationVM';

//@Constant
import { DICTIONARY } from '../../constant/dictionary';
import { MICROAPP } from '../../constant/microapp';

@Component({
  selector: 'app-view-irrigation',
  templateUrl: './view-irrigation.component.html',
  styleUrls: ['./view-irrigation.component.css']
})
export class ViewIrrigationComponent implements OnInit {

  constructor(private router: Router,
    private route: ActivatedRoute,
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

  viewForm: FormGroup;

  ID_irrigation?: number = 0;
  irrigation: IrrigationVM;
  irrigationLocations: IrrigationLocationVM[] = [];

  companyId: number = 0;
  pageName: string = "Irrigation";

  irrigationTypeList: DictionaryVM[] = [];

  ngOnInit() {
    this.irrigation = new IrrigationVM();
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
      name: [this.irrigation.name, Validators.required],
      type: [this.irrigation.type, Validators.required],
      description: [this.irrigation.description],
      volume_rating: [this.irrigation.volume_rating]
    });
  }

  initializeFormValue() {

    this.commonService.showLoader();
    this.companyId = this.storageService.getCompanyId();

    this.route.params.subscribe(params => { this.ID_irrigation = +params['id']; });

    //Bind dropdown values    
    Promise.all(
      [
        this.getIrrigationType(),
        this.getIrrigationDetail(),
        this.getIrrigationLocations()
      ]).then((data: any) => {

        if (data != null) {
          let irrigationTypeResult = data[0];
          let irrigationResult = data[1];
          let irrigationLocationResult = data[2];
          
          //Irrigation Type
          if (irrigationTypeResult != null && irrigationTypeResult.success) {
            let irrigationTypeItems = irrigationTypeResult.data;
            if (irrigationTypeItems.success) {
              this.irrigationTypeList = irrigationTypeItems.data;
            }
          }

          //Irrigation Detail
          if (irrigationResult != null && irrigationResult.success) {
            let irrigationItems = irrigationResult.data;
            if (irrigationItems.success) {
              this.irrigation = irrigationItems.data[0] as IrrigationVM;

              if (this.commonService.isNullOrEmpty(this.irrigation.type)) {
                this.irrigation.type = "";
              }

              this.rebuildForm();
            }
          }

          //Irrigation Location Detail
          if (irrigationLocationResult != null && irrigationLocationResult.success) {
            let irrigationLocationItems = irrigationLocationResult.data;
            if (irrigationLocationItems.success) {
              this.irrigationLocations = irrigationLocationItems.data as IrrigationLocationVM[];
            }
          }

          this.commonService.hideLoader();
        }
      }).catch((error) => {
        this.commonService.hideLoader();
        console.error(error);
      });
  }

  getIrrigationDetail() {
    return new Promise((resolve, reject) => {
      this.irrigationService.getIrrigationById(this.ID_irrigation).subscribe(res => {
        resolve({ success: true, data: res });
      }, error => {
        resolve({ success: false, data: error });
      });
    });
  }

  getIrrigationLocations() {
    return new Promise((resolve, reject) => {
      this.irrigationService.getIrrigationLocationByIrrigationId(this.ID_irrigation).subscribe(res => {
        resolve({ success: true, data: res });
      }, error => {
        resolve({ success: false, data: error });
      });
    });
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

  backToList() {
    this.viewForm.reset();
    this.commonService.hideLoader();
    this.router.navigate(['list-irrigation']);
  }

}
