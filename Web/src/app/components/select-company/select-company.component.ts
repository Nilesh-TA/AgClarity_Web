//@Packages
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import * as $ from 'jquery';

//@Services
import { CommonService } from '../../services/common.service';
import { StorageService } from '../../services/storage.service';
import { DictionaryService } from '../../services/dictionary.service';

//@Models
import { DictionaryVM } from '../../models/DictionaryVM';
import { CompanyVM } from '../../models/CompanyVM';


@Component({
  selector: 'app-select-company',
  templateUrl: './select-company.component.html',
  styleUrls: ['./select-company.component.css']
})
export class SelectCompanyComponent implements OnInit {

  constructor(private router: Router,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private storageService: StorageService,
    private dictionaryService: DictionaryService) { }

  companyList: CompanyVM[] = [];
  masterDataList: DictionaryVM[] = [];

  //@NgModel Variables
  companyId: string = "0";
  masterData: string = "";

  showMasterDataDropdown: boolean = false;

  ngOnInit() {
    this.initializeFormValue();
  }

  initializeFormValue() {
    this.commonService.showLoader();

    let companies = this.storageService.getUserCompanies();
    if (companies != null) {      
      this.companyList = (JSON.parse(companies)) as CompanyVM[];
      //this.companyId = "2";
    }

    let masterData = this.storageService.getUserMasterData();
    if (masterData != null) {
      this.masterDataList = JSON.parse(masterData);
    }

    this.commonService.hideLoader();
  }

  getMasterData(code: string) {
    return new Promise((resolve, reject) => {
      this.dictionaryService.getDictionaryByCode(code).subscribe(res => {
        resolve({ success: true, data: res });
      }, error => {
        resolve({ success: false, data: error });
      });
    });
  }

  setCompany(event): void {    
    const companyId = +event.target.value;    

    if (companyId > 0) {      
      //Get company details.
      const companyList = this.storageService.getUserCompanies();

      if (companyList != null && companyList.length > 0) {        
        const companies = (JSON.parse(companyList)) as CompanyVM[];

        const selectedCompany = companies.filter(x => x.ID_company == companyId);

        if (selectedCompany && selectedCompany.length > 0) {
          //Parent Company Id.
          const parentCompanyId = selectedCompany[0].related_to;

          //Store Parent Company Id.
          this.storageService.setParentCompanyId(parentCompanyId);

          //Store Company Id.
          this.storageService.setCompanyId(companyId);

          //Store Company Name.
          this.storageService.setCompanyName(selectedCompany[0].name);
        }
      }

      this.masterData = "";
      this.showMasterDataDropdown = true;
    } else {
      this.masterData = "";
      this.showMasterDataDropdown = false;
      this.storageService.removeParentCompanyId();
      this.storageService.removeCompanyId();
      this.storageService.removeCompanyName();
    }
  }
}
