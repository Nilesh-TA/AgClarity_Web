//@Packages
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";

//@Services
import { CommonService } from '../../services/common.service';
import { DictionaryService } from '../../services/dictionary.service';
import { PestService } from '../../services/pest.service';

//@Models
import { DictionaryVM } from '../../models/DictionaryVM';
import { PestVM } from '../../models/PestVM';

//@Constant
import { DICTIONARY } from '../../constant/dictionary';

@Component({
  selector: 'app-view-pest',
  templateUrl: './view-pest.component.html',
  styleUrls: ['./view-pest.component.css']
})
export class ViewPestComponent implements OnInit {

  constructor(private router: Router,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private fb: FormBuilder,
    public dictionary: DICTIONARY,
    public commonService: CommonService,
    public dictionaryService: DictionaryService,
    public pestService: PestService) { }

  viewForm: FormGroup;

  pest: PestVM;
  ID_pest: number;

  pageName: string = "Pest";

  pestTypeList: DictionaryVM[] = [];

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

    this.viewForm = this.fb.group({
      name: [this.pest.name, Validators.required],
      description: [this.pest.description],
      type: [this.pest.type, Validators.required],
      severity: [this.pest.severity],
      spread: [this.pest.spread],
      symptoms: [this.pest.symptoms],
      prevention: [this.pest.prevention],
      remedy: [this.pest.remedy],
    });
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
              this.pest = pestInfo.data[0] as PestVM;
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
  
  backToList() {
    this.viewForm.reset();
    this.commonService.hideLoader();
    this.router.navigate(['list-pest']);
  }
}
