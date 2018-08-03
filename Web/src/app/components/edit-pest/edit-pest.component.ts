//@Packages
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ToastrService } from 'ngx-toastr';

//@Services
import { CommonService } from '../../services/common.service';
import { ErrorService } from '../../services/error.service';
import { DictionaryService } from '../../services/dictionary.service';
import { StorageService } from '../../services/storage.service';
import { PestService } from '../../services/pest.service';

//@Models
import { DictionaryVM } from '../../models/DictionaryVM';
import { PestVM } from '../../models/PestVM';

//@Constant
import { DICTIONARY } from '../../constant/dictionary';
import { MICROAPP } from '../../constant/microapp';


@Component({
  selector: 'app-edit-pest',
  templateUrl: './edit-pest.component.html',
  styleUrls: ['./edit-pest.component.css']
})
export class EditPestComponent implements OnInit {

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
    public pestService: PestService) { }

  editForm: FormGroup;

  pest: PestVM;
  oldpest: PestVM;
  ID_pest: number;

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
      name: [this.pest.name, Validators.required],
      description: [this.pest.description],
      type: [this.pest.type, Validators.required],
      severity: [this.pest.severity],
      spread: [this.pest.spread],
      symptoms: [this.pest.symptoms],
      prevention: [this.pest.prevention],
      remedy: [this.pest.remedy],
    });
    this.editForm.valueChanges.subscribe(data => this.onValueChanged(data));
  }

  onValueChanged(data?: any) {
    //Pest Form Errors.    
    this.pestFormErrors = this.errorService.displayValidationErrors(this.pestValidationMessages, this.editForm, this.pestFormErrors, false);
  }

  initializeFormValue() {

    this.commonService.showLoader();
    this.route.params.subscribe(params => { this.ID_pest = +params['id']; });


    //Bind dropdown values    
    Promise.all(
      [
        this.getPestType(),
        this.getPestDetail()
      ]).then((data: any) => {

        if (data != null) {
          let pestTypeResult = data[0];
          let pestResult = data[1];

          //Pest Type
          if (pestTypeResult != null && pestTypeResult.success) {
            let pestTypeItems = pestTypeResult.data;
            if (pestTypeItems.success) {
              this.pestTypeList = pestTypeItems.data;
            }
          }

          //Pest Detail
          if (pestResult != null && pestResult.success) {
            let pestInfo = pestResult.data;
            if (pestInfo.success) {
              this.pest = Object.assign({}, pestInfo.data[0] as PestVM);
              this.oldpest = Object.assign({}, pestInfo.data[0] as PestVM);
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

  getPestType() {
    return new Promise((resolve, reject) => {
      this.dictionaryService.getDictionaryByCode(this.dictionary.Pest_Type).subscribe(res => {
        resolve({ success: true, data: res });
      }, error => {
        resolve({ success: false, data: error });
      });
    });
  }

  getPestDetail() {
    return new Promise((resolve, reject) => {
      this.pestService.getPestById(this.ID_pest).subscribe(res => {
        resolve({ success: true, data: res });
      }, error => {
        resolve({ success: false, data: error });
      });
    });
  }

  onSubmit() {

    if (!this.editForm.valid) {
      this.pestFormErrors = this.errorService.displayValidationErrors(this.pestValidationMessages, this.editForm, this.pestFormErrors, true);
      this.toastr.error("Please fill all the required field first", "Error!", { timeOut: 3000, closeButton: true });
      this.commonService.scrollToTop();
      return false;
    }

    let body = this.getBodyToPost(this.editForm.value);

    this.pestService.updatePest(body).subscribe(data => {
      if (data != null) {
        if (data.success) {          
          //Track User Action.
          this.pestService.trackUserAction("update", this.microapp.ASD_Admin, this.storageService.getUserProfileId(), this.ID_pest, this.oldpest, body)
            .subscribe(res => {
              this.toastr.success("Pest details updated successfully.", "Success!", { timeOut: 3000, closeButton: true });
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
      ID_pest: this.ID_pest,
      name: pest.name,
      description: pest.description,
      type: pest.type,
      severity: pest.severity,
      spread: pest.spread,
      symptoms: pest.symptoms,
      prevention: pest.prevention,
      remedy: pest.remedy
    }
    return body;
  }

  backToList() {
    this.editForm.reset();
    this.commonService.hideLoader();
    this.router.navigate(['list-pest']);
  }
}
