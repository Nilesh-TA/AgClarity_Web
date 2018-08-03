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
import { ContactAccessVM, ContactAccessDataVM, PayloadContactAccessDataVM, PayLoadContactAccess } from '../../models/ContactAccessVM';
import { CompanyVM } from '../../models/CompanyVM';
import { DictionaryVM } from '../../models/DictionaryVM';

//@Constant
import { DICTIONARY } from '../../constant/dictionary';
import { MICROAPP } from '../../constant/microapp';
import { REGEXP } from '../../constant/regexp';
import { element } from '../../../../node_modules/protractor';

@Component({
  selector: 'app-contact-access',
  templateUrl: './contact-access.component.html',
  styleUrls: ['./contact-access.component.css']
})
export class ContactAccessComponent implements OnInit {

  contactAccessForm: FormGroup;
  pageName: string = "Contact Access";

  oldContactAccess: ContactAccessVM[] = [];

  companyList: CompanyVM[] = [];

  contactAccessData: PayloadContactAccessDataVM;

  ID_profile?: number;
  companyId?: number;
  action: string;
  contactProfileName: string = "";

  selectedAvailableItems: any[] = [];
  selectedMicroAppItems: any[] = [];

  SelectedMicroAppList = [];
  AvailableMicroAppList = [];
  gblAvailableMicroAppList = [];

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
    this.contactAccessForm = this.fb.group({
      companyId: [this.companyId],
      selectedAvailableItems: [this.selectedAvailableItems],
      selectedMicroAppItems: [this.selectedMicroAppItems]
    });
  }

  initializeFormValue() {
    this.commonService.showLoader();

    if (this.contactProfileService.contactProfileFormData != null) {
      this.contactProfileName = this.contactProfileService.contactProfileFormData.first_name + " " + this.contactProfileService.contactProfileFormData.last_name;
    }

    this.contactAccessData = new PayloadContactAccessDataVM();
    this.contactAccessData.data = [];

    //Bind dropdown values    
    Promise.all(
      [
        this.getCompanies(this.companyId),
        this.getAvailableMicroApp(),
        this.getSelectedMicroApps(this.ID_profile, this.companyId),
      ]).then((data: any) => {

        if (data != null) {
          let companyResult = data[0];
          let availableMicroAppResult = data[1];
          let selectedMicroAppsResult = data[2];

          //Companies Detail
          if (companyResult != null && companyResult.success) {
            let companyItems = companyResult.data;
            if (companyItems.success) {

              const companies = companyItems.data as CompanyVM[];

              if (companies != null && companies.length > 0) {
                this.companyList = companies;

                //Bind company wise selected micro-apps data.
                this.companyList.forEach(element => {
                  this.initializeMicroAppDataByCompany(element.ID_company, element.name);
                });
              }
            }
          }

          //Contact Access Micro App.
          if (selectedMicroAppsResult != null && selectedMicroAppsResult.success) {
            let selectedMicroAppItems = selectedMicroAppsResult.data;
            if (selectedMicroAppItems.success) {
              const contactAccessList = selectedMicroAppItems.data as ContactAccessVM[];
              contactAccessList.forEach(element => {
                this.SelectedMicroAppList.push(element.micro_apps);
              });

              this.setMicroAppDataByCompany(this.companyId, contactAccessList, this.SelectedMicroAppList);
            }
          }

          //Available Micro App.
          if (availableMicroAppResult != null && availableMicroAppResult.success) {
            let microAppItems = availableMicroAppResult.data;
            if (microAppItems.success) {
              const microApp = microAppItems.data as DictionaryVM[];
              microApp.forEach(element => {

                this.gblAvailableMicroAppList.push(element.value);

                const existInSelectedMicroApp = this.SelectedMicroAppList.find(i => i === element.value);
                if (!existInSelectedMicroApp) {
                  this.AvailableMicroAppList.push(element.value);
                }
              });
            }
          }

          //Set contact access data as user selected.
          if (this.contactProfileService.contactAccessSelectedMicroAppData != null) {
            this.contactAccessData = this.contactProfileService.contactAccessSelectedMicroAppData;
          }

          this.selectedAvailableItems = [];
          this.selectedMicroAppItems = [];

          this.commonService.hideLoader();
        }
      }).catch((error) => {
        this.commonService.hideLoader();
        console.error(error);
      });
  }

  getAvailableMicroApp() {
    return new Promise((resolve, reject) => {
      this.dictionaryService.getDictionaryByCode(this.dictionary.MicroApp).subscribe(res => {
        resolve({ success: true, data: res });
      }, error => {
        resolve({ success: false, data: error });
      });
    });
  }

  getSelectedMicroApps(profileId, companyId) {
    return new Promise((resolve, reject) => {
      this.contactProfileService.getSelectedMicroApps(profileId, companyId).subscribe(res => {
        resolve({ success: true, data: res });
      }, error => {
        resolve({ success: false, data: error });
      });
    });
  }

  getCompanies(companyId) {
    return new Promise((resolve, reject) => {
      this.companyService.getRelatedCompanyById(companyId).subscribe(res => {
        resolve({ success: true, data: res });
      }, error => {
        resolve({ success: false, data: error });
      });
    });
  }

  setMicroAppItems() {

    if (this.commonService.isNullOrEmpty(this.companyId)) {
      this.toastr.error("Please select company name.", "Error!", { timeOut: 3000, closeButton: true });
      return false;
    }

    const selectedAvailableItems = this.selectedAvailableItems;    

    if (this.commonService.isNullOrEmpty(selectedAvailableItems)) {
      this.toastr.error("Please select at least one item from available list.", "Error!", { timeOut: 3000, closeButton: true });
      return false;
    }

    //move selected
    selectedAvailableItems.forEach(element => {
      this.SelectedMicroAppList.push(element);
    });

    //remove the ones that were moved.
    selectedAvailableItems.forEach(element => {
      for (let i = this.AvailableMicroAppList.length - 1; i >= 0; i--) {
        if (this.AvailableMicroAppList[i] == element) {
          this.AvailableMicroAppList.splice(i, 1);
        }
      }
    });

    this.setMicroAppDataByCompany(this.companyId, [], this.SelectedMicroAppList);

    this.selectedAvailableItems = [];

  }

  setAvailableItems() {
    const selectedMicroAppItems = this.selectedMicroAppItems;    

    if (this.commonService.isNullOrEmpty(selectedMicroAppItems)) {
      this.toastr.error("Please select at least one item from micro-apps list.", "Error!", { timeOut: 3000, closeButton: true });
      return false;
    }

    //move selected
    selectedMicroAppItems.forEach(element => {
      this.AvailableMicroAppList.push(element);
    });

    //remove the ones that were moved from the source container.
    selectedMicroAppItems.forEach(element => {
      for (let i = this.SelectedMicroAppList.length - 1; i >= 0; i--) {
        if (this.SelectedMicroAppList[i] == element) {
          this.SelectedMicroAppList.splice(i, 1);
        }
      }
    });

    this.setMicroAppDataByCompany(this.companyId, [], this.SelectedMicroAppList);

    this.selectedMicroAppItems = [];
  }


  onSubmit() {
    this.commonService.hideLoader();

    let contactAccessFormData = this.prepareBodyToPost();

    this.contactProfileService.contactAccessFormData = contactAccessFormData;
    this.contactProfileService.contactAccessSelectedMicroAppData = this.contactAccessData;

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
    let bodyToPost = new PayLoadContactAccess();
    bodyToPost.add = [];
    bodyToPost.delete = [];
    bodyToPost.update = {
      old: [],
      new: []
    }
    bodyToPost.microapp_name = this.microapp.Master_Data;
    bodyToPost.userid = this.storageService.getUserProfileId();

    if (this.contactAccessData.data != null && this.contactAccessData.data.length > 0) {

      for (let i = 0; i < this.contactAccessData.data.length; i++) {

        const item = this.contactAccessData.data[i];

        //Find micro app which are removed.
        if (item.old_contactaccess && item.old_contactaccess.length > 0) {
          item.old_contactaccess.forEach(element => {
            const micro_apps = element.micro_apps;

            let item_exist = item.selectedMicroApps.find(i => i === micro_apps);

            const exist = item_exist ? true : false;

            if (!exist) {
              bodyToPost.delete.push(element.id_contact_access);
            }
          });
        }

        if (item.selectedMicroApps != null && item.selectedMicroApps.length > 0) {
          for (let i = 0; i < item.selectedMicroApps.length; i++) {

            const micro_apps = item.selectedMicroApps[i];

            //Existing contact access.
            const contactaccess_detail = item.old_contactaccess.find(i => i.micro_apps === micro_apps);

            if (!contactaccess_detail) {
              //Create contact access.
              let body = this.getBodyToPost(0, item.ID_company, micro_apps);

              bodyToPost.add.push(body);
            }
          }
        }
      }
    }


    return bodyToPost;
  }

  getBodyToPost(id, companyId, micro_app) {
    let body: any = {
      id_contact_access: id,
      contactprofileid: this.ID_profile,
      company: companyId,
      micro_apps: micro_app
    }
    return body;
  }

  backToContactProfile() {
    this.commonService.hideLoader();

    if (this.action == "add") {
      this.contactProfileService.contactAccessFormData = null;
      this.router.navigate(['/add-contact-profile']);
    }
    else if (this.action == "edit") {
      this.router.navigate(['/edit-contact-profile', this.ID_profile]);
    } else {
      this.router.navigate(['']);
    }
  }

  initializeMicroAppDataByCompany(id, companyName, old_contactaccess = [], selectedMicroApps = []) {
    let data = new ContactAccessDataVM();
    data.ID_company = id;
    data.companyName = companyName;
    data.old_contactaccess = old_contactaccess;
    data.selectedMicroApps = selectedMicroApps;

    this.contactAccessData.data.push(data);
  }

  setMicroAppDataByCompany(id, old_contactaccess = [], selectedMicroApps = []) {

    if (this.contactAccessData.data != null && this.contactAccessData.data.length > 0) {
      const existingData = this.contactAccessData.data.find(i => i.ID_company == id);

      if (existingData) {
        this.contactAccessData.data.forEach(element => {
          if (element.ID_company == existingData.ID_company) {

            if (selectedMicroApps && selectedMicroApps.length > 0) {
              element.selectedMicroApps = selectedMicroApps;
            }

            if (old_contactaccess && old_contactaccess.length > 0) {
              element.old_contactaccess = old_contactaccess;
            }

          }
        });
      } else {
        const companyDetail = this.companyList.find(i => i.ID_company == this.companyId);
        let companyName = companyDetail ? companyDetail.name : "";

        this.initializeMicroAppDataByCompany(id, companyName, old_contactaccess, selectedMicroApps);
      }
    }

  }

  getMicroAppDataByCompany(companyId) {
    if (this.contactAccessData.data != null && this.contactAccessData.data.length > 0) {
      const companyData = this.contactAccessData.data.find(i => i.ID_company == companyId);
      return companyData;
    } else {
      return null;
    }
  }

  companyChange(event) {

    let companyId = event.target.value;    

    const availableMicroApps = this.gblAvailableMicroAppList;

    if (!this.commonService.isNullOrEmpty(companyId)) {
      companyId = +companyId;

      if (this.action == "add") {
        if (availableMicroApps) {
          const selectedContactAccessData = this.getMicroAppDataByCompany(companyId);
          if (selectedContactAccessData.selectedMicroApps != null && selectedContactAccessData.selectedMicroApps.length > 0) {
            this.SelectedMicroAppList = selectedContactAccessData.selectedMicroApps;
          } else {
            this.SelectedMicroAppList = [];
          }

          this.AvailableMicroAppList = [];

          availableMicroApps.forEach(element => {
            const existInSelectedMicroApp = this.SelectedMicroAppList.find(i => i === element);
            if (!existInSelectedMicroApp) {
              this.AvailableMicroAppList.push(element);
            }
          });

          this.selectedAvailableItems = [];
          this.selectedMicroAppItems = [];
          this.rebuildForm();
        }
      }
      else if (this.action == "edit") {

        this.SelectedMicroAppList = [];
        this.AvailableMicroAppList = [];

        const selectedContactAccessData = this.getMicroAppDataByCompany(companyId);

        if (selectedContactAccessData.selectedMicroApps != null && selectedContactAccessData.selectedMicroApps.length > 0) {
          selectedContactAccessData.selectedMicroApps.forEach(element => {
            this.SelectedMicroAppList.push(element);
          });
        }

        if (selectedContactAccessData.old_contactaccess == null || selectedContactAccessData.old_contactaccess.length == 0) {
          this.contactProfileService.getSelectedMicroApps(this.ID_profile, this.companyId).subscribe(data => {

            if (data != null && data.success) {
              const contactAccessList = data.data as ContactAccessVM[];
              contactAccessList.forEach(element => {
                const existInSelectedMicroApp = this.SelectedMicroAppList.find(i => i === element.micro_apps);
                if (!existInSelectedMicroApp) {
                  this.SelectedMicroAppList.push(element.micro_apps);
                }

              });
              this.setMicroAppDataByCompany(this.companyId, contactAccessList, this.SelectedMicroAppList);
            }

            availableMicroApps.forEach(element => {
              const existInSelectedMicroApp = this.SelectedMicroAppList.find(i => i === element);
              if (!existInSelectedMicroApp) {
                this.AvailableMicroAppList.push(element);
              }
            });

            this.selectedAvailableItems = [];
            this.selectedMicroAppItems = [];
            this.rebuildForm();
          });
        } else {

          availableMicroApps.forEach(element => {
            const existInSelectedMicroApp = this.SelectedMicroAppList.find(i => i === element);
            if (!existInSelectedMicroApp) {
              this.AvailableMicroAppList.push(element);
            }
          });

          this.selectedAvailableItems = [];
          this.selectedMicroAppItems = [];
          this.rebuildForm();
        }
      }
    } else {
      if (availableMicroApps) {
        this.AvailableMicroAppList = availableMicroApps;
      }

      this.SelectedMicroAppList = [];

      this.selectedAvailableItems = [];
      this.selectedMicroAppItems = [];
      this.rebuildForm();
    }

  }

}
