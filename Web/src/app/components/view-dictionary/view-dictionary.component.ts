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
  selector: 'app-view-dictionary',
  templateUrl: './view-dictionary.component.html',
  styleUrls: ['./view-dictionary.component.css']
})
export class ViewDictionaryComponent implements OnInit {

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

  viewForm: FormGroup;

  dictionaryModel: DictionaryVM;  
  ID_dictionary?: number = 0;

  pageName: string = "Dictionary";

  ngOnInit() {
    this.dictionaryModel = new DictionaryVM();    
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
    this.viewForm = this.fb.group({
      code: [this.dictionaryModel.code, Validators.required],
      value: [this.dictionaryModel.value, Validators.required],
      description: [this.dictionaryModel.description],
    });
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

  backToList() {
    this.viewForm.reset();
    this.commonService.hideLoader();
    this.router.navigate(['list-dictionary']);
  }

}
