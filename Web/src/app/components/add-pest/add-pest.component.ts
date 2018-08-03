//@Packages
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';

//@Services
import { CommonService } from '../../services/common.service';
import { ErrorService } from '../../services/error.service';
import { DictionaryService } from '../../services/dictionary.service';
import { PestService } from '../../services/pest.service';
import { StorageService } from '../../services/storage.service';

//@Models
import { DictionaryVM } from '../../models/DictionaryVM';
import { PestVM } from '../../models/PestVM';

//@Constant
import { DICTIONARY } from '../../constant/dictionary';
import { MICROAPP } from '../../constant/microapp';


@Component({
  selector: 'app-add-pest',
  templateUrl: './add-pest.component.html',
  styleUrls: ['./add-pest.component.css']
})
export class AddPestComponent implements OnInit {

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
    public pestService: PestService) { }

  addForm: FormGroup;
  pest: PestVM;

  companyId: number = 0;

  pageName: string = "Pest";

  pestTypeList: DictionaryVM[] = [];

  public pestFormErrors = {
    name: '',
    description: '',
    type: '',
    severity: '',
    spread: '',
    symptoms: '',
    prevention: '',
    remedy: ''
  };

  private pestValidationMessages = {
    name: { 'required': 'Please enter name.' },
    type: { 'required': 'Please select pest type.' }
  }

  ngOnInit() {
    this.pest = new PestVM();
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
    this.pest.type = "";

    this.addForm = this.fb.group({
      name: [this.pest.name, Validators.required],
      description: [this.pest.description],
      type: [this.pest.type, Validators.required],
      severity: [this.pest.severity],
      spread: [this.pest.spread],
      symptoms: [this.pest.symptoms],
      prevention: [this.pest.prevention],
      remedy: [this.pest.remedy],
    });
    this.addForm.valueChanges.subscribe(data => this.onValueChanged(data));
  }

  onValueChanged(data?: any) {
    //Pest Form Errors.    
    this.pestFormErrors = this.errorService.displayValidationErrors(this.pestValidationMessages, this.addForm, this.pestFormErrors, false);
  }

  initializeFormValue() {

    this.commonService.showLoader();
    this.companyId = this.storageService.getCompanyId();

    //Bind dropdown values    
    Promise.all(
      [
        this.getPestType()
      ]).then((data: any) => {

        if (data != null) {
          let pestTypeResult = data[0];

          //Pest Type
          if (pestTypeResult != null && pestTypeResult.success) {
            let pestTypeItems = pestTypeResult.data;
            if (pestTypeItems.success) {
              this.pestTypeList = pestTypeItems.data;
            }
          }

          this.commonService.hideLoader();
        }
      }).catch((error) => {
        this.commonService.hideLoader();
        console.error(error);
      });
  }

  getPestType() {
    return new Promise((resolve, reject) => {
      this.dictionaryService.getDictionaryByCode(this.dictionary.Pest_Type).subscribe(res => {
        resolve({ success: true, data: res });
      }, error => {
        resolve({ success: false, data: error });
      });
    });
  }

  onSubmit() {

    if (!this.addForm.valid) {
      this.pestFormErrors = this.errorService.displayValidationErrors(this.pestValidationMessages, this.addForm, this.pestFormErrors, true);
      this.toastr.error("Please fill all the required field first", "Error!", { timeOut: 3000, closeButton: true });
      this.commonService.scrollToTop();
      return false;
    }

    let body = this.getBodyToPost(this.addForm.value);

    this.pestService.createPest(body).subscribe(data => {
      if (data != null) {
        if (data.success) {        
          const insertedId = data.data.insertId;

          //Track User Action.
          this.pestService.trackUserAction("add", this.microapp.ASD_Admin, this.storageService.getUserProfileId(), insertedId, body, body)
            .subscribe(res => {              
              this.toastr.success("Pest created successfully.", "Success!", { timeOut: 3000, closeButton: true });
              this.router.navigate(['list-pest']);
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

  getBodyToPost(pest) {

    let body: any = {
      name: pest.name,
      description: pest.description,
      type: pest.type,
      severity: pest.severity,
      spread: pest.spread,
      symptoms: pest.symptoms,
      prevention: pest.prevention,
      remedy: pest.remedy,
      company: this.companyId
    }
    return body;
  }

  backToList() {
    this.addForm.reset();
    this.commonService.hideLoader();
    this.router.navigate(['list-pest']);
  }
}
