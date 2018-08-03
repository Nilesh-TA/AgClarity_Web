//@Packages
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';

//@Services
import { CommonService } from '../../services/common.service';
import { ErrorService } from '../../services/error.service';
import { DictionaryService } from '../../services/dictionary.service';
import { ChemicalService } from '../../services/chemical.service';
import { StorageService } from '../../services/storage.service';


//@Models
import { DictionaryVM } from '../../models/DictionaryVM';
import { ChemicalVM } from '../../models/ChemicalVM';

//@Constant
import { DICTIONARY } from '../../constant/dictionary';
import { MICROAPP } from '../../constant/microapp';


@Component({
  selector: 'app-add-chemical',
  templateUrl: './add-chemical.component.html',
  styleUrls: ['./add-chemical.component.css']
})
export class AddChemicalComponent implements OnInit {

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
    public chemicalService: ChemicalService) { }

  addForm: FormGroup;
  chemical: ChemicalVM;

  companyId: number = 0;

  pageName: string = "Chemical";

  chemicalTypeList: DictionaryVM[] = [];

  public chemicalFormErrors = {
    name: '',
    description: '',
    type: '',
    severity: '',
    spread: '',
    symptoms: '',
    prevention: '',
    remedy: ''
  };

  private chemicalValidationMessages = {
    name: { 'required': 'Please enter name.' },
    type: { 'required': 'Please select chemical type.' }
  }

  ngOnInit() {
    this.chemical = new ChemicalVM();
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
    this.chemical.type = "";

    this.addForm = this.fb.group({
      name: [this.chemical.name, Validators.required],
      description: [this.chemical.description],
      type: [this.chemical.type, Validators.required],
      severity: [this.chemical.severity],
      spread: [this.chemical.spread],
      symptoms: [this.chemical.symptoms],
      prevention: [this.chemical.prevention],
      remedy: [this.chemical.remedy],
    });
    this.addForm.valueChanges.subscribe(data => this.onValueChanged(data));
  }

  onValueChanged(data?: any) {
    //Chemical Form Errors.    
    this.chemicalFormErrors = this.errorService.displayValidationErrors(this.chemicalValidationMessages, this.addForm, this.chemicalFormErrors, false);
  }

  initializeFormValue() {

    this.commonService.showLoader();
    this.companyId = this.storageService.getCompanyId();

    //Bind dropdown values    
    Promise.all(
      [
        this.getChemicalType()
      ]).then((data: any) => {

        if (data != null) {
          let chemicalTypeResult = data[0];

          //Chemical Type
          if (chemicalTypeResult != null && chemicalTypeResult.success) {
            let chemicalTypeItems = chemicalTypeResult.data;
            if (chemicalTypeItems.success) {
              this.chemicalTypeList = chemicalTypeItems.data;
            }
          }

          this.commonService.hideLoader();
        }
      }).catch((error) => {
        this.commonService.hideLoader();
        console.error(error);
      });
  }

  getChemicalType() {
    return new Promise((resolve, reject) => {
      this.dictionaryService.getDictionaryByCode(this.dictionary.Chemical_Type).subscribe(res => {
        resolve({ success: true, data: res });
      }, error => {
        resolve({ success: false, data: error });
      });
    });
  }

  onSubmit() {

    if (!this.addForm.valid) {
      this.chemicalFormErrors = this.errorService.displayValidationErrors(this.chemicalValidationMessages, this.addForm, this.chemicalFormErrors, true);
      this.toastr.error("Please fill all the required field first", "Error!", { timeOut: 3000, closeButton: true });
      this.commonService.scrollToTop();
      return false;
    }

    let body = this.getBodyToPost(this.addForm.value);

    this.chemicalService.createChemical(body).subscribe(data => {
      if (data != null) {
        if (data.success) {
          const insertedId = data.data.insertId;

          //Track User Action.
          this.chemicalService.trackUserAction("add", this.microapp.ASD_Admin, this.storageService.getUserProfileId(), insertedId, body, body)
            .subscribe(res => {
              this.toastr.success("Chemical created successfully.", "Success!", { timeOut: 3000, closeButton: true });
              this.router.navigate(['list-chemical']);
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

  getBodyToPost(chemical) {

    let body: any = {
      name: chemical.name,
      description: chemical.description,
      type: chemical.type,
      severity: chemical.severity,
      spread: chemical.spread,
      symptoms: chemical.symptoms,
      prevention: chemical.prevention,
      remedy: chemical.remedy,
      company: this.companyId
    }
    return body;
  }

  backToList() {
    this.addForm.reset();
    this.commonService.hideLoader();
    this.router.navigate(['list-chemical']);
  }

}
