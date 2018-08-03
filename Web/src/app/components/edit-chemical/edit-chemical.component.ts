//@Packages
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
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
  selector: 'app-edit-chemical',
  templateUrl: './edit-chemical.component.html',
  styleUrls: ['./edit-chemical.component.css']
})
export class EditChemicalComponent implements OnInit {

  constructor(private router: Router,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private toastr: ToastrService,
    public dictionary: DICTIONARY,
    public microapp: MICROAPP,
    public commonService: CommonService,
    public errorService: ErrorService,
    public storageService: StorageService,
    public dictionaryService: DictionaryService,
    public chemicalService: ChemicalService) { }

  editForm: FormGroup;

  pageName: string = "Chemical";

  chemical: ChemicalVM;
  oldchemical: ChemicalVM;

  ID_chemical: number;

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
      name: [this.chemical.name, Validators.required],
      description: [this.chemical.description],
      type: [this.chemical.type, Validators.required],
      severity: [this.chemical.severity],
      spread: [this.chemical.spread],
      symptoms: [this.chemical.symptoms],
      prevention: [this.chemical.prevention],
      remedy: [this.chemical.remedy],
    });
    this.editForm.valueChanges.subscribe(data => this.onValueChanged(data));
  }

  onValueChanged(data?: any) {
    //Chemical Form Errors.    
    this.chemicalFormErrors = this.errorService.displayValidationErrors(this.chemicalValidationMessages, this.editForm, this.chemicalFormErrors, false);
  }

  initializeFormValue() {

    this.chemical = new ChemicalVM();
    this.route.params.subscribe(params => { this.ID_chemical = +params['id']; });

    this.commonService.showLoader();

    Promise.all(
      [
        this.getChemicalType(),
        this.getChemicalDetail()
      ]).then((data: any) => {

        if (data != null) {
          let chemicalTypeResult = data[0];
          let chemicalResult = data[1];

          //Chemical Type
          if (chemicalTypeResult != null && chemicalTypeResult.success) {
            let chemicalTypeItems = chemicalTypeResult.data;
            if (chemicalTypeItems.success) {
              this.chemicalTypeList = chemicalTypeItems.data;
            }
          }

          //Chemical Detail
          if (chemicalResult != null && chemicalResult.success) {
            let chemicalInfo = chemicalResult.data;
            if (chemicalInfo.success) {              
              this.chemical = Object.assign({}, chemicalInfo.data[0] as ChemicalVM);
              this.oldchemical = Object.assign({}, chemicalInfo.data[0] as ChemicalVM);
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

  getChemicalType() {
    return new Promise((resolve, reject) => {
      this.dictionaryService.getDictionaryByCode(this.dictionary.Chemical_Type).subscribe(res => {
        resolve({ success: true, data: res });
      }, error => {
        resolve({ success: false, data: error });
      });
    });
  }

  getChemicalDetail() {
    return new Promise((resolve, reject) => {
      this.chemicalService.getChemicalById(this.ID_chemical).subscribe(res => {
        resolve({ success: true, data: res });
      }, error => {
        resolve({ success: false, data: error });
      });
    });
  }

  onSubmit() {

    if (!this.editForm.valid) {
      this.chemicalFormErrors = this.errorService.displayValidationErrors(this.chemicalValidationMessages, this.editForm, this.chemicalFormErrors, true);
      this.toastr.error("Please fill all the required field first", "Error!", { timeOut: 3000, closeButton: true });
      this.commonService.scrollToTop();
      return false;
    }

    let body = this.getBodyToPost(this.editForm.value);
    this.chemicalService.updateChemical(body).subscribe(data => {
      if (data != null) {
        if (data.success) {          
          //Track User Action.
          this.chemicalService.trackUserAction("update", this.microapp.ASD_Admin, this.storageService.getUserProfileId(), this.ID_chemical, this.oldchemical, body)
          .subscribe(res => {            
            this.toastr.success("Chemical details updated successfully.", "Success!", { timeOut: 3000, closeButton: true });
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
      ID_chemical: this.ID_chemical,
      name: chemical.name,
      description: chemical.description,
      type: chemical.type,
      severity: chemical.severity,
      spread: chemical.spread,
      symptoms: chemical.symptoms,
      prevention: chemical.prevention,
      remedy: chemical.remedy,
    }
    return body;
  }

  backToList() {
    this.editForm.reset();
    this.commonService.hideLoader();
    this.router.navigate(['list-chemical']);
  }

}
