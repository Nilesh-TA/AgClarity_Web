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

//@Models
import { DictionaryVM } from '../../models/DictionaryVM';

//@Constant
import { DICTIONARY } from '../../constant/dictionary';
import { MICROAPP } from '../../constant/microapp';

@Component({
  selector: 'app-edit-dictionary',
  templateUrl: './edit-dictionary.component.html',
  styleUrls: ['./edit-dictionary.component.css']
})
export class EditDictionaryComponent implements OnInit {

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
    public dictionaryService: DictionaryService) { }

  editForm: FormGroup;
  dictionaryModel: DictionaryVM;
  olddictionaryModel: DictionaryVM;
  ID_dictionary?: number = 0;

  pageName: string = "Dictionary";

  public dictionaryFormErrors = {
    code: '',
    value: '',
    description: ''
  };

  private dictionaryValidationMessages = {
    code: { 'required': 'Please enter code.' },
    value: { 'required': 'Please enter value.' }
  }

  ngOnInit() {
    this.dictionaryModel = new DictionaryVM();
    this.olddictionaryModel = new DictionaryVM();
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
      code: [this.dictionaryModel.code, Validators.required],
      value: [this.dictionaryModel.value, Validators.required],
      description: [this.dictionaryModel.description],
    });
    this.editForm.valueChanges.subscribe(data => this.onValueChanged(data));
  }

  onValueChanged(data?: any) {
    //Dictionary Form Errors.    
    this.dictionaryFormErrors = this.errorService.displayValidationErrors(this.dictionaryValidationMessages, this.editForm, this.dictionaryFormErrors, false);
  }

  initializeFormValue() {
    this.commonService.showLoader();
    this.route.params.subscribe(params => { this.ID_dictionary = +params['id']; });

    //Bind dropdown values    
    Promise.all(
      [
        this.getDictionaryDetail()
      ]).then((data: any) => {        
        if (data != null) {          
          let dictionaryResult = data[0];

          //Dictionary Detail
          if (dictionaryResult != null && dictionaryResult.success) {
            let dictionaryInfo = dictionaryResult.data;
            if (dictionaryInfo.success) {
              this.dictionaryModel = Object.assign({}, dictionaryInfo.data[0] as DictionaryVM);
              this.olddictionaryModel = Object.assign({}, dictionaryInfo.data[0] as DictionaryVM);
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

  getDictionaryDetail() {
    return new Promise((resolve, reject) => {
      this.dictionaryService.getDictionaryById(this.ID_dictionary).subscribe(res => {
        resolve({ success: true, data: res });
      }, error => {
        resolve({ success: false, data: error });
      });
    });
  }

  onSubmit() {

    if (!this.editForm.valid) {
      this.dictionaryFormErrors = this.errorService.displayValidationErrors(this.dictionaryValidationMessages, this.editForm, this.dictionaryFormErrors, true);
      this.toastr.error("Please fill all the required field first", "Error!", { timeOut: 3000, closeButton: true });
      this.commonService.scrollToTop();
      return false;
    }

    let body = this.getBodyToPost(this.editForm.value);

    this.dictionaryService.updateDictionary(body).subscribe(data => {
      if (data != null) {
        if (data.success) {

          //Track User Action.
          this.dictionaryService.trackUserAction("update", this.microapp.ASD_Admin, this.storageService.getUserProfileId(), this.ID_dictionary, this.olddictionaryModel, body)
            .subscribe(res => {
              this.toastr.success("Dictionary details updated successfully.", "Success!", { timeOut: 3000, closeButton: true });
              this.router.navigate(['list-dictionary']);
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

  getBodyToPost(dictionary) {

    let body: any = {
      ID_dictionary: this.ID_dictionary,
      code: dictionary.code,
      value: dictionary.value,
      description: dictionary.description
    }
    return body;
  }

  backToList() {
    this.editForm.reset();
    this.commonService.hideLoader();
    this.router.navigate(['list-dictionary']);
  }

}
