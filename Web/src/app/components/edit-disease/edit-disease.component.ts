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
import { MICROAPP } from '../../constant/microapp';

@Component({
  selector: 'app-edit-disease',
  templateUrl: './edit-disease.component.html',
  styleUrls: ['./edit-disease.component.css']
})
export class EditDiseaseComponent implements OnInit {

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
    public diseaseService: DiseaseService) { }

  editForm: FormGroup;

  disease: DiseaseVM;
  olddisease: DiseaseVM;
  ID_disease: number;

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
      name: [this.disease.name, Validators.required],
      description: [this.disease.description],
      type: [this.disease.type, Validators.required],
      severity: [this.disease.severity],
      spread: [this.disease.spread],
      symptoms: [this.disease.symptoms],
      prevention: [this.disease.prevention],
      remedy: [this.disease.remedy],
    });
    this.editForm.valueChanges.subscribe(data => this.onValueChanged(data));
  }

  onValueChanged(data?: any) {
    //Disease Form Errors.    
    this.diseaseFormErrors = this.errorService.displayValidationErrors(this.diseaseValidationMessages, this.editForm, this.diseaseFormErrors, false);
  }

  initializeFormValue() {

    this.commonService.showLoader();
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
              this.disease = Object.assign({}, diseaseInfo.data[0] as DiseaseVM);
              this.olddisease = Object.assign({}, diseaseInfo.data[0] as DiseaseVM);
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

  onSubmit() {

    if (!this.editForm.valid) {
      this.diseaseFormErrors = this.errorService.displayValidationErrors(this.diseaseValidationMessages, this.editForm, this.diseaseFormErrors, true);
      this.toastr.error("Please fill all the required field first", "Error!", { timeOut: 3000, closeButton: true });
      this.commonService.scrollToTop();
      return false;
    }

    let body = this.getBodyToPost(this.editForm.value);

    this.diseaseService.updateDisease(body).subscribe(data => {
      if (data != null) {
        if (data.success) {          
          //Track User Action.
          this.diseaseService.trackUserAction("update", this.microapp.ASD_Admin, this.storageService.getUserProfileId(), this.ID_disease, this.olddisease, body)
            .subscribe(res => {
              this.toastr.success("Disease details updated successfully.", "Success!", { timeOut: 3000, closeButton: true });
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
      ID_disease: this.ID_disease,
      name: disease.name,
      description: disease.description,
      type: disease.type,
      severity: disease.severity,
      spread: disease.spread,
      symptoms: disease.symptoms,
      prevention: disease.prevention,
      remedy: disease.remedy
    }
    return body;
  }

  backToList() {
    this.editForm.reset();
    this.commonService.hideLoader();
    this.router.navigate(['list-disease']);
  }

}
