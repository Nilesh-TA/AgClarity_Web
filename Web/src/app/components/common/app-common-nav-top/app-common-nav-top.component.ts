//@Packages
import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';

//@Services
import { CommonService } from '../../../services/common.service';
import { StorageService } from '../../../services/storage.service';

//@Models
import { DictionaryVM } from '../../../models/DictionaryVM';

@Component({
  selector: 'app-common-nav-top',
  templateUrl: './app-common-nav-top.component.html',
  styleUrls: ['./app-common-nav-top.component.css']
})
export class AppCommonNavTopComponent implements OnInit {

  @Input('masterData') masterDataName: string;

  constructor(private cdRef: ChangeDetectorRef,
    public commonService: CommonService,
    public storageService: StorageService) {}

  //@NgModel Variables
  companyId: number = 0;
  companyName: string = "";
  masterData: string = "";

  masterDataList: DictionaryVM[] = [];

  ngOnInit() {
    this.initializeFormValue();
  }

  ngAfterViewInit() {
    //Set value from sibling component.
    this.masterData = this.masterDataName;
    this.cdRef.detectChanges();
  }
  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }
  ngAfterContentChecked() {
    this.cdRef.detectChanges();
  }


  initializeFormValue() {
    this.companyId = this.storageService.getCompanyId();
    this.companyName = this.storageService.getCompanyName();

    //Redirect to Select Company Page If Company is not selected.
    this.commonService.redirectSelectCompaniesPage(this.companyId);

    //Get Master data.
    const masterData = this.storageService.getUserMasterData();
    if (masterData != null) {
      this.masterDataList = JSON.parse(masterData);
    }
  }

}
