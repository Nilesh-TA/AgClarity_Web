//@Packages
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
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
import { MICROAPP } from '../../constant/microapp';

@Component({
  selector: 'app-add-disease',
  templateUrl: './add-disease.component.html',
  styleUrls: ['./add-disease.component.css']
})
export class AddDiseaseComponent implements OnInit {

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
    public diseaseService: DiseaseService) { }

  addForm: FormGroup;
  disease: DiseaseVM;

  companyId: number = 0;

  pageName: string = "Disease";

  diseaseTypeList: DictionaryVM[] = [];

  public diseaseFormErrors = {
    name: '',
    description: '',
    type: '',
    severity: '',
    spread: '',
    symptoms: '',
    prevention: '',
    remedy: ''
  };

  private diseaseValidationMessages = {
    name: { 'required': 'Please enter name.' },
    type: { 'required': 'Please select disease type.' }
  }

  ngOnInit() {
    this.disease = new DiseaseVM();
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
    this.disease.type = "";

    this.addForm = this.fb.group({
      name: [this.disease.name, Validators.required],
      description: [this.disease.description],
      type: [this.disease.type, Validators.required],
      severity: [this.disease.severity],
      spread: [this.disease.spread],
      symptoms: [this.disease.symptoms],
      prevention: [this.disease.prevention],
      remedy: [this.disease.remedy],
    });
    this.addForm.valueChanges.subscribe(data => this.onValueChanged(data));
  }

  onValueChanged(data?: any) {
    //Disease Form Errors.    
    this.diseaseFormErrors = this.errorService.displayValidationErrors(this.diseaseValidationMessages, this.addForm, this.diseaseFormErrors, false);
  }

  initializeFormValue() {

    this.commonService.showLoader();
    this.companyId = this.storageService.getCompanyId();

    //Bind dropdown values    
    Promise.all(
      [
        this.getDiseaseType()
      ]).then((data: any) => {

        if (data != null) {
          let diseaseTypeResult = data[0];

          //Disease Type
          if (diseaseTypeResult != null && diseaseTypeResult.success) {
            let diseaseTypeItems = diseaseTypeResult.data;
            if (diseaseTypeItems.success) {
              this.diseaseTypeList = diseaseTypeItems.data;
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

  onSubmit() {

    if (!this.addForm.valid) {
      this.diseaseFormErrors = this.errorService.displayValidationErrors(this.diseaseValidationMessages, this.addForm, this.diseaseFormErrors, true);
      this.toastr.error("Please fill all the required field first", "Error!", { timeOut: 3000, closeButton: true });
      this.commonService.scrollToTop();
      return false;
    }

    let body = this.getBodyToPost(this.addForm.value);

    this.diseaseService.createDisease(body).subscribe(data => {
      if (data != null) {
        if (data.success) {        
          const insertedId = data.data.insertId;

          //Track User Action.
          this.diseaseService.trackUserAction("add", this.microapp.ASD_Admin, this.storageService.getUserProfileId(), insertedId, body, body)
            .subscribe(res => {              
              this.toastr.success("Disease created successfully.", "Success!", { timeOut: 3000, closeButton: true });
              this.router.navigate(['list-disease']);
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

  getBodyToPost(disease) {

    let body: any = {
      name: disease.name,
      description: disease.description,
      type: disease.type,
      severity: disease.severity,
      spread: disease.spread,
      symptoms: disease.symptoms,
      prevention: disease.prevention,
      remedy: disease.remedy,
      company: this.companyId
    }
    return body;
  }

  backToList() {
    this.addForm.reset();
    this.commonService.hideLoader();
    this.router.navigate(['list-disease']);
  }
}
