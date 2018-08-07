//@Packages
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
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
  selector: 'app-add-dictionary',
  templateUrl: './add-dictionary.component.html',
  styleUrls: ['./add-dictionary.component.css']
})
export class AddDictionaryComponent implements OnInit {

  constructor(private router: Router,
    private cdRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private toastr: ToastrService,
    public dictionary: DICTIONARY,
    public microapp: MICROAPP,
    public commonService: CommonService,
    public storageService: StorageService,
    public errorService: ErrorService,
    public dictionaryService: DictionaryService) { }

  addForm: FormGroup;
  dictionaryModel: DictionaryVM;

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
    this.buildForm();    
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
    this.addForm = this.fb.group({
      code: [this.dictionaryModel.code, Validators.required],
      value: [this.dictionaryModel.value, Validators.required],
      description: [this.dictionaryModel.description],
    });
    this.addForm.valueChanges.subscribe(data => this.onValueChanged(data));
  }

  onValueChanged(data?: any) {
    //Dictionary Form Errors.    
    this.dictionaryFormErrors = this.errorService.displayValidationErrors(this.dictionaryValidationMessages, this.addForm, this.dictionaryFormErrors, false);
  }

  onSubmit() {

    if (!this.addForm.valid) {
      this.dictionaryFormErrors = this.errorService.displayValidationErrors(this.dictionaryValidationMessages, this.addForm, this.dictionaryFormErrors, true);
      this.toastr.error("Please fill all the required field first", "Error!", { timeOut: 3000, closeButton: true });
      this.commonService.scrollToTop();
      return false;
    }

    let body = this.getBodyToPost(this.addForm.value);

    this.dictionaryService.createDictionary(body).subscribe(data => {
      if (data != null) {
        if (data.success) {        
          const insertedId = data.data.insertId;

          //Track User Action.
          this.dictionaryService.trackUserAction("add", this.microapp.ASD_Admin, this.storageService.getUserProfileId(), insertedId, body, body)
            .subscribe(res => {              
              this.toastr.success("Dictionary created successfully.", "Success!", { timeOut: 3000, closeButton: true });
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
      code: dictionary.code,
      value: dictionary.value,
      description: dictionary.description      
    }
    return body;
  }

  backToList() {
    this.addForm.reset();
    this.commonService.hideLoader();
    this.router.navigate(['list-dictionary']);
  }

}
