//@Packages
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ToastrService } from 'ngx-toastr';

//@Services
import { CommonService } from '../../services/common.service';
import { ErrorService } from '../../services/error.service';
import { DictionaryService } from '../../services/dictionary.service';
import { ContactProfileService } from '../../services/contact-profile.service';
import { CompanyService } from '../../services/company.service';
import { StorageService } from '../../services/storage.service';

//@Models
import { CompanyAccessVM, PayLoadCompanyAccess } from '../../models/CompanyAccessVM';
import { CompanyVM } from '../../models/CompanyVM';

//@Constant
import { DICTIONARY } from '../../constant/dictionary';
import { MICROAPP } from '../../constant/microapp';
import { REGEXP } from '../../constant/regexp';


@Component({
  selector: 'app-company-access',
  templateUrl: './company-access.component.html',
  styleUrls: ['./company-access.component.css']
})
export class CompanyAccessComponent implements OnInit {

  companyAccessForm: FormGroup;
  pageName: string = "Company Access";

  oldCompanyAccess: CompanyAccessVM[] = [];

  ID_profile?: number;
  companyId?: number;
  action: string;
  contactProfileName: string = "";

  selectedAvailableItems: any[] = [];
  selectedCompanyItems: any[] = [];

  SelectedCompanyList = [];
  AvailableCompanyList = [];

  constructor(private router: Router,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private toastr: ToastrService,
    public dictionary: DICTIONARY,
    public microapp: MICROAPP,
    public regexp: REGEXP,
    public commonService: CommonService,
    public storageService: StorageService,
    public errorService: ErrorService,
    public companyService: CompanyService,
    public dictionaryService: DictionaryService,
    public contactProfileService: ContactProfileService) {

    this.route.queryParams.subscribe(params => {
      this.ID_profile = !this.commonService.isNullOrEmpty(params["id"]) ? +params["id"] : 0;
      this.companyId = !this.commonService.isNullOrEmpty(params["company"]) ? +params["company"] : 0;
      this.action = params["action"];
    });

  }

  ngOnInit() {
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
    this.companyAccessForm = this.fb.group({
      selectedAvailableItems: [this.selectedAvailableItems],
      selectedCompanyItems: [this.selectedCompanyItems]
    });
  }

  initializeFormValue() {
    this.commonService.showLoader();

    if(this.contactProfileService.contactProfileFormData != null){      
      this.contactProfileName = this.contactProfileService.contactProfileFormData.first_name + " " + this.contactProfileService.contactProfileFormData.last_name;
    }   

    //Bind dropdown values    
    Promise.all(
      [
        this.getCompanies(this.ID_profile),
        this.getAvailableCompany(this.companyId)
      ]).then((data: any) => {

        if (data != null) {
          let companyResult = data[0];
          let availableCompanyResult = data[1];

          //Companies Detail
          if (companyResult != null && companyResult.success) {
            let companyItems = companyResult.data;
            if (companyItems.success) {

              const companies = companyItems.data;

              if (companies != null && companies.length > 0) {
                companies.forEach(element => {

                  let company = {
                    ID_company: element.ID_company,
                    name: element.name,
                  }
                  this.SelectedCompanyList.push(company);

                  let companyaccess = {
                    ID_company_access: element.ID_company_access,
                    contactProfileID: element.contactProfileID,
                    company: element.company,
                    company_name: element.name
                  }
                  this.oldCompanyAccess.push(companyaccess);

                });

                this.rebuildForm();
              }
            }
          }

          //Available Companies
          if (availableCompanyResult != null && availableCompanyResult.success) {
            let companyItems = availableCompanyResult.data;
            if (companyItems.success) {
              const companies = companyItems.data as CompanyVM[];

              companies.forEach(element => {
                const existInCompanyList = this.SelectedCompanyList.find(i => i.ID_company === element.ID_company);

                if (!existInCompanyList) {
                  let company = {
                    ID_company: element.ID_company,
                    name: element.name,
                  }
                  this.AvailableCompanyList.push(company);
                }
              });

              if (this.action == "add") {                
                const selectedCompany = this.AvailableCompanyList.find(i => i.ID_company == this.companyId);
                const existSelectedCompany = this.SelectedCompanyList.find(i => i.ID_company == this.companyId);
                if (selectedCompany && !existSelectedCompany) {
                  this.SelectedCompanyList.push(selectedCompany);

                  //Remove selected company from the available list.
                  let index = this.AvailableCompanyList.indexOf(selectedCompany);

                  if (index > -1) {
                    this.AvailableCompanyList.splice(index, 1);
                  }
                }
              }
            }
          }

          this.selectedAvailableItems = [];
          this.selectedCompanyItems = [];

          this.commonService.hideLoader();
        }
      }).catch((error) => {
        this.commonService.hideLoader();
        console.error(error);
      });
  }

  getAvailableCompany(companyId) {
    return new Promise((resolve, reject) => {
      this.companyService.getRelatedCompanyById(companyId).subscribe(res => {
        resolve({ success: true, data: res });
      }, error => {
        resolve({ success: false, data: error });
      });
    });
  }

  getCompanies(profileId) {
    return new Promise((resolve, reject) => {
      this.companyService.getCompanyByContactProfileId(profileId).subscribe(res => {
        resolve({ success: true, data: res });
      }, error => {
        resolve({ success: false, data: error });
      });
    });
  }

  setCompanyItems() {
    const selectedAvailableItems = this.selectedAvailableItems;    

    if (this.commonService.isNullOrEmpty(selectedAvailableItems)) {
      this.toastr.error("Please select at least one item from available list.", "Error!", { timeOut: 3000, closeButton: true });
      return false;
    }

    //move selected
    selectedAvailableItems.forEach(element => {
      this.SelectedCompanyList.push(element);
    });

    //remove the ones that were moved.
    selectedAvailableItems.forEach(element => {
      for (let i = this.AvailableCompanyList.length - 1; i >= 0; i--) {
        if (this.AvailableCompanyList[i].ID_company == element.ID_company) {
          this.AvailableCompanyList.splice(i, 1);
        }
      }
    });

    this.selectedAvailableItems = [];
  }

  setAvailableItems() {
    const selectedCompanyItems = this.selectedCompanyItems;

    if (this.commonService.isNullOrEmpty(selectedCompanyItems)) {
      this.toastr.error("Please select at least one item from companies list.", "Error!", { timeOut: 3000, closeButton: true });
      return false;
    }

    //move selected
    selectedCompanyItems.forEach(element => {
      this.AvailableCompanyList.push(element);
    });

    //remove the ones that were moved from the source container.
    selectedCompanyItems.forEach(element => {
      for (let i = this.SelectedCompanyList.length - 1; i >= 0; i--) {
        if (this.SelectedCompanyList[i].ID_company == element.ID_company) {
          this.SelectedCompanyList.splice(i, 1);
        }
      }
    });

    this.selectedCompanyItems = [];
  }


  onSubmit() {
    this.commonService.hideLoader();

    let companyAccessFormData = this.prepareBodyToPost();

    this.contactProfileService.companyAccessFormData = companyAccessFormData;

    if (this.action == "add") {
      this.router.navigate(['/add-contact-profile']);
    }
    else if (this.action == "edit") {
      this.router.navigate(['/edit-contact-profile', this.ID_profile]);
    } else {
      this.router.navigate(['']);
    }
  }

  prepareBodyToPost() {        
    let bodyToPost = new PayLoadCompanyAccess();
    bodyToPost.add = [];
    bodyToPost.delete = [];
    bodyToPost.update = {
      old: [],
      new: []
    }
    bodyToPost.microapp_name = this.microapp.Master_Data;
    bodyToPost.userid = this.storageService.getUserProfileId();


    //Find company which are removed.
    for (let i = 0; i < this.oldCompanyAccess.length; i++) {
      const company = this.oldCompanyAccess[i].company;

      let item = this.SelectedCompanyList.find(i => i.ID_company === company);

      const exist = item ? true : false;

      if (!exist) {
        bodyToPost.delete.push(this.oldCompanyAccess[i].ID_company_access);
      }
    }

    if (this.SelectedCompanyList != null && this.SelectedCompanyList.length > 0) {            
      for (let i = 0; i < this.SelectedCompanyList.length; i++) {

        const ID_company = this.SelectedCompanyList[i].ID_company;
        const company_name = this.SelectedCompanyList[i].name;

        //Existing company access.
        const companyaccess_detail = this.oldCompanyAccess.find(i => i.company === ID_company);

        if (!companyaccess_detail) {
          //Create company access.
          let body = this.getBodyToPost(0, ID_company, company_name);

          bodyToPost.add.push(body);
        }
      }
    }

    return bodyToPost;
  }

  getBodyToPost(id, companyId, name) {
    let body: any = {
      ID_company_access: id,
      contactProfileID: this.ID_profile,
      company: companyId,
      company_name: name
    }
    return body;
  }

  backToContactProfile() {
    this.commonService.hideLoader();

    if (this.action == "add") {
      this.contactProfileService.companyAccessFormData = null;
      this.router.navigate(['/add-contact-profile']);
    }
    else if (this.action == "edit") {
      this.router.navigate(['/edit-contact-profile', this.ID_profile]);
    } else {
      this.router.navigate(['']);
    }
  }

}
