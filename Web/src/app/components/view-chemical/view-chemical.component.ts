//@Packages
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ToastrService } from 'ngx-toastr';

//@Services
import { CommonService } from '../../services/common.service';
import { DictionaryService } from '../../services/dictionary.service';
import { ChemicalService } from '../../services/chemical.service';

//@Models
import { DictionaryVM } from '../../models/DictionaryVM';
import { ChemicalVM } from '../../models/ChemicalVM';

//@Constant
import { DICTIONARY } from '../../constant/dictionary';

@Component({
  selector: 'app-view-chemical',
  templateUrl: './view-chemical.component.html',
  styleUrls: ['./view-chemical.component.css']
})
export class ViewChemicalComponent implements OnInit {

  constructor(private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private toastr: ToastrService,
    public dictionary: DICTIONARY,
    public commonService: CommonService,
    public dictionaryService: DictionaryService,
    public chemicalService: ChemicalService) { }

  viewForm: FormGroup;

  pageName:string= "Chemical";
  
  chemical: ChemicalVM;
  ID_chemical: number;

  chemicalTypeList: DictionaryVM[] = [];

  ngOnInit() {
    this.initializeFormValue();
    this.rebuildForm();
  }

  rebuildForm() {

    this.viewForm = this.fb.group({
      name: [this.chemical.name],
      description: [this.chemical.description],
      type: [this.chemical.type],
      severity: [this.chemical.severity],
      spread: [this.chemical.spread],
      symptoms: [this.chemical.symptoms],
      prevention: [this.chemical.prevention],
      remedy: [this.chemical.remedy],
    });    
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
              this.chemical = chemicalInfo.data[0] as ChemicalVM;
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

  backToList() {
    this.viewForm.reset();
    this.commonService.hideLoader();
    this.router.navigate(['list-chemical']);
  }
}
