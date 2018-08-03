//@Packages
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ToastrService } from 'ngx-toastr';

//@Services
import { CommonService } from '../../services/common.service';
import { ErrorService } from '../../services/error.service';
import { DictionaryService } from '../../services/dictionary.service';
import { DiseaseService } from '../../services/disease.service';
import { StorageService } from '../../services/storage.service';

//@Models
import { DictionaryVM } from '../../models/DictionaryVM';
import { DiseaseVM } from '../../models/DiseaseVM';

//@Constant
import { DICTIONARY } from '../../constant/dictionary';

@Component({
  selector: 'app-view-disease',
  templateUrl: './view-disease.component.html',
  styleUrls: ['./view-disease.component.css']
})
export class ViewDiseaseComponent implements OnInit {

  constructor(private router: Router,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private toastr: ToastrService,
    public dictionary: DICTIONARY,
    public commonService: CommonService,
    public storageService: StorageService,
    public errorService: ErrorService,
    public dictionaryService: DictionaryService,
    public diseaseService: DiseaseService) { }

  viewForm: FormGroup;

  disease: DiseaseVM;
  ID_disease: number;

  pageName: string = "Disease";

  diseaseTypeList: DictionaryVM[] = [];

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
      name: [this.disease.name, Validators.required],
      description: [this.disease.description],
      type: [this.disease.type, Validators.required],
      severity: [this.disease.severity],
      spread: [this.disease.spread],
      symptoms: [this.disease.symptoms],
      prevention: [this.disease.prevention],
      remedy: [this.disease.remedy],
    });    
  }

  initializeFormValue() {

    this.commonService.showLoader();
    
    this.disease = new DiseaseVM();
    this.route.params.subscribe(params => { this.ID_disease = +params['id']; });

    //Bind dropdown values    
    Promise.all(
      [
        this.getDiseaseType(),
        this.getDiseaseDetail()
      ]).then((data: any) => {

        if (data != null) {
          let diseaseTypeResult = data[0];
          let diseaseResult = data[1];

          //Disease Type
          if (diseaseTypeResult != null && diseaseTypeResult.success) {
            let diseaseTypeItems = diseaseTypeResult.data;
            if (diseaseTypeItems.success) {
              this.diseaseTypeList = diseaseTypeItems.data;
            }
          }

          //Disease Detail
          if (diseaseResult != null && diseaseResult.success) {
            let diseaseInfo = diseaseResult.data;
            if (diseaseInfo.success) {
              this.disease = diseaseInfo.data[0] as DiseaseVM;
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

  getDiseaseType() {
    return new Promise((resolve, reject) => {
      this.dictionaryService.getDictionaryByCode(this.dictionary.Disease_Type).subscribe(res => {
        resolve({ success: true, data: res });
      }, error => {
        resolve({ success: false, data: error });
      });
    });
  }

  getDiseaseDetail() {
    return new Promise((resolve, reject) => {
      this.diseaseService.getDiseaseById(this.ID_disease).subscribe(res => {
        resolve({ success: true, data: res });
      }, error => {
        resolve({ success: false, data: error });
      });
    });
  }

  backToList() {
    this.viewForm.reset();
    this.commonService.hideLoader();
    this.router.navigate(['list-disease']);
  }
}
