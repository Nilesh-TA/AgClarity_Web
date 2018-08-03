//@Packages
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import { ToastrService } from 'ngx-toastr';

//@Services
import { CommonService } from '../../services/common.service';
import { ErrorService } from '../../services/error.service';
import { DictionaryService } from '../../services/dictionary.service';
import { ContactProfileService } from '../../services/contact-profile.service';
import { StorageService } from '../../services/storage.service';

//@Models
import { DictionaryVM } from '../../models/DictionaryVM';
import { ContactProfileVM } from '../../models/ContactProfileVM';
import { PhoneVM } from '../../models/PhoneVM';
import { EmailVM } from '../../models/EmailVM';
import { CompanyAccessVM } from '../../models/CompanyAccessVM';
import { ContactAccessVM, ViewContactAccessDataVM } from '../../models/ContactAccessVM';

//@Constant
import { DICTIONARY } from '../../constant/dictionary';
import { MICROAPP } from '../../constant/microapp';
import { REGEXP } from '../../constant/regexp';

@Component({
  selector: 'app-view-contact-profile',
  templateUrl: './view-contact-profile.component.html',
  styleUrls: ['./view-contact-profile.component.css']
})
export class ViewContactProfileComponent implements OnInit {

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
    public dictionaryService: DictionaryService,
    public contactProfileService: ContactProfileService) { }

  viewForm: FormGroup;

  profile: ContactProfileVM;
  oldprofile: ContactProfileVM;
  oldphones: PhoneVM[] = [];
  oldemails: EmailVM[] = [];

  ID_profile?: number;

  companyId: number = 0;
  companyName: string = "";

  pageName: string = "Contact Profile";

  contactMethodList: DictionaryVM[] = [];
  contactTypeList: DictionaryVM[] = [];
  contactSourceList: DictionaryVM[] = [];
  roleList: DictionaryVM[] = [];
  countryList: DictionaryVM[] = [];
  languageList: DictionaryVM[] = [];
  companyAccessList: CompanyAccessVM[] = [];
  contactAccessList: ContactAccessVM[] = [];

  //International format - +1 (123) 456-7890
  //phone_mask: any[] = ['+', '1', ' ', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  //Regular format - (123) 456-7890
  phone_mask: any[] = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  ngOnInit() {
    this.profile = new ContactProfileVM();
    this.oldprofile = new ContactProfileVM();
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
      first_name: [this.profile.first_name, Validators.required],
      last_name: [this.profile.last_name, Validators.required],
      title: [this.profile.title],
      responsibility_level: [this.profile.responsibility_level],
      preferred_contact_method: [this.profile.preferred_contact_method, Validators.required],
      secondary_contact_method: [this.profile.secondary_contact_method],
      address_1: [this.profile.address_1],
      address_2: [this.profile.address_2],
      phone: [this.profile.phone],
      phone_source: [this.profile.phone_source],
      email: [this.profile.email, [Validators.required, Validators.pattern(this.regexp.EMAIL_REGEXP)]],
      email_source: [this.profile.email_source, Validators.required],
      city: [this.profile.city],
      state: [this.profile.state],
      postal_code: [this.profile.postal_code, Validators.required],
      country: [this.profile.country],
      access_role: [this.profile.access_role, Validators.required],
      language: [this.profile.language],
      companyName: [this.companyName],
      phones: this.fb.array([]), //Set NULL array first time when page load.
      emails: this.fb.array([]), //Set NULL array first time when page load.
    });

  }

  createPhoneItem(): FormGroup {
    return this.fb.group({
      phone: [''],
      phone_source: ['']
    });
  }

  addPhone() {
    const control = <FormArray>this.viewForm.controls['phones'];
    control.push(this.createPhoneItem());
  }

  deletePhoneItem(index: number, item: any) {
    // control refers to your formarray.
    const control = <FormArray>this.viewForm.controls['phones'];
    // remove the chosen row.
    control.removeAt(index);
  }

  setPhoneItem(phoneData: any, index: number) {
    const control = (<FormArray>this.viewForm.controls['phones']).at(index);

    control['controls'].phone.setValue(phoneData.phone);
    control['controls'].phone_source.setValue(phoneData.phone_source);
  }

  createEmailItem(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.pattern(this.regexp.EMAIL_REGEXP)]],
      email_source: ['', Validators.required]
    });
  }

  addEmail() {
    const control = <FormArray>this.viewForm.controls['emails'];
    control.push(this.createEmailItem());
  }

  deleteEmailItem(index: number, item: any) {
    // control refers to your formarray
    const control = <FormArray>this.viewForm.controls['emails'];
    // remove the chosen row
    control.removeAt(index);
  }

  setEmailItem(emailData: any, index: number) {
    const control = (<FormArray>this.viewForm.controls['emails']).at(index);

    control['controls'].email.setValue(emailData.email);
    control['controls'].email_source.setValue(emailData.email_source);
  }

  initializeFormValue() {

    this.route.params.subscribe(params => { this.ID_profile = +params['id']; });

    this.commonService.showLoader();
    this.companyId = this.storageService.getCompanyId();
    this.companyName = this.storageService.getCompanyName();

    //Bind dropdown values    
    Promise.all(
      [
        this.getContactMethod(),
        this.getCountry(),
        this.getContactType(),
        this.getRole(),
        this.getLanguage(),
        this.getContactSource(),
        this.getContactProfileDetail(),
        this.getPhoneByContactProfileId(),
        this.getEmailByContactProfileId(),
        this.getContactAccessByProfileId(),
        this.getCompanyAccessByProfileId()
      ]).then((data: any) => {

        if (data != null) {

          let contactMethodResult = data[0];
          let countryResult = data[1];
          let contactTypeResult = data[2];
          let roleResult = data[3];
          let languageResult = data[4];
          let contactSourceResult = data[5];
          let contactProfileResult = data[6];
          let phoneResult = data[7];
          let emailResult = data[8];
          let contactAccessResult = data[9];
          let companyAccessResult = data[10];

          //Contact Method
          if (contactMethodResult != null && contactMethodResult.success) {
            let contactMethodItems = contactMethodResult.data;
            if (contactMethodItems.success) {
              this.contactMethodList = contactMethodItems.data;
            }
          }

          //Country
          if (countryResult != null && countryResult.success) {
            let countryItems = countryResult.data;
            if (countryItems.success) {
              this.countryList = countryItems.data;
            }
          }

          //Contact Type
          if (contactTypeResult != null && contactTypeResult.success) {
            let contactTypeItems = contactTypeResult.data;
            if (contactTypeItems.success) {
              this.contactTypeList = contactTypeItems.data;
            }
          }

          //Role
          if (roleResult != null && roleResult.success) {
            let roleItems = roleResult.data;
            if (roleItems.success) {
              this.roleList = roleItems.data;
            }
          }

          //Language
          if (languageResult != null && languageResult.success) {
            let languageItems = languageResult.data;
            if (languageItems.success) {
              this.languageList = languageItems.data;
            }
          }

          //Contact Source
          if (contactSourceResult != null && contactSourceResult.success) {
            let contactSourceItems = contactSourceResult.data;
            if (contactSourceItems.success) {
              this.contactSourceList = contactSourceItems.data;
            }
          }

          //Contact Profile
          if (contactProfileResult != null && contactProfileResult.success) {
            let contactProfileInfo = contactProfileResult.data;
            if (contactProfileInfo.success) {
              this.profile = contactProfileInfo.data[0] as ContactProfileVM;
              this.oldprofile = contactProfileInfo.data[0] as ContactProfileVM;

              this.profile.phone_source = !this.commonService.isNullOrEmpty(this.profile.phone_source) ? this.profile.phone_source : "";
              this.profile.email_source = !this.commonService.isNullOrEmpty(this.profile.email_source) ? this.profile.email_source : "";
              this.profile.preferred_contact_method = !this.commonService.isNullOrEmpty(this.profile.preferred_contact_method) ? this.profile.preferred_contact_method : "";
              this.profile.secondary_contact_method = !this.commonService.isNullOrEmpty(this.profile.secondary_contact_method) ? this.profile.secondary_contact_method : "";
              this.profile.responsibility_level = !this.commonService.isNullOrEmpty(this.profile.responsibility_level) ? this.profile.responsibility_level : "";
              this.profile.country = !this.commonService.isNullOrEmpty(this.profile.country) ? this.profile.country : "";
              this.profile.access_role = !this.commonService.isNullOrEmpty(this.profile.access_role) ? this.profile.access_role : "";
              this.profile.language = !this.commonService.isNullOrEmpty(this.profile.language) ? this.profile.language : "";

              this.rebuildForm();
            }
          }

          //Phone Result
          if (phoneResult != null && phoneResult.success) {
            let phoneItems = phoneResult.data;
            if (phoneItems.success) {

              const phones = phoneItems.data as PhoneVM[];
              this.oldphones = phones;

              if (phones != null && phones.length > 0) {
                this.profile.phone = phones[0].number;
                this.profile.phone_source = this.commonService.parseString(phones[0].type);

                this.viewForm.controls['phone'].setValue(this.profile.phone, { onlySelf: true });
                this.viewForm.controls['phone_source'].setValue(this.profile.phone_source, { onlySelf: true });

                let index = 0;
                for (let i = 1; i < phones.length; i++) {
                  let phoneData = {
                    phone: phones[i].number,
                    phone_source: this.commonService.parseString(phones[i].type),
                  }
                  this.addPhone();
                  this.setPhoneItem(phoneData, index);
                  index++;
                }
              }
            }
          }

          //Email Result
          if (emailResult != null && emailResult.success) {
            let emailItems = emailResult.data;
            if (emailItems.success) {

              const emails = emailItems.data as EmailVM[];
              this.oldemails = emails;

              if (emails != null && emails.length > 0) {
                this.profile.email = emails[0].email;
                this.profile.email_source = this.commonService.parseString(emails[0].type);

                this.viewForm.controls['email'].setValue(this.profile.email, { onlySelf: true });
                this.viewForm.controls['email_source'].setValue(this.profile.email_source, { onlySelf: true });

                let index = 0;
                for (let i = 1; i < emails.length; i++) {
                  let emailData = {
                    email: emails[i].email,
                    email_source: this.commonService.parseString(emails[i].type),
                  }
                  this.addEmail();
                  this.setEmailItem(emailData, index);
                  index++;
                }
              }
            }
          }

          //Contact Access By Profile
          if (contactAccessResult != null && contactAccessResult.success) {
            let contactAccessItems = contactAccessResult.data;
            if (contactAccessItems.success) {
              let contactAccessData = contactAccessItems.data as ContactAccessVM[];
              if (contactAccessData != null && contactAccessData.length > 0) {

                const companies = contactAccessData.map(i => i.company);
                const distinctCompanyIds = companies.filter((x, i, a) => x && a.indexOf(x) == i);

                distinctCompanyIds.forEach(element => {
                  let companyId = element;                  

                  let micro_apps_data = contactAccessData.filter(i => i.company === companyId) as ContactAccessVM[];
                  
                  if(micro_apps_data != null && micro_apps_data.length > 0){
                    let obj: any = {};
                    obj.ID_company = companyId;
                    obj.companyName = micro_apps_data[0].company_name;
                    obj.micro_apps = micro_apps_data.map(i => i.micro_apps);
                   
                    this.contactAccessList.push(obj);
                  }
                });
              }
            }
          }

          //Company Access By Profile
          if (companyAccessResult != null && companyAccessResult.success) {
            let companyAccessItems = companyAccessResult.data;
            if (companyAccessItems.success) {
              this.companyAccessList = companyAccessItems.data as CompanyAccessVM[];
            }
          }

          //Set data from service if exist.
          this.SetFormData();

          this.commonService.hideLoader();
        }
      }).catch((error) => {
        this.commonService.hideLoader();
        console.error(error);
      });
  }

  SetFormData() {
    let contactProfileFormData = this.contactProfileService.contactProfileFormData;
    let companyAccessFormData = this.contactProfileService.companyAccessFormData;

    if (contactProfileFormData != null) {
      this.profile.last_name = contactProfileFormData.last_name;
      this.profile.first_name = contactProfileFormData.first_name;
      this.profile.title = contactProfileFormData.title;
      this.profile.phone = contactProfileFormData.phone;
      this.profile.phone_source = contactProfileFormData.phone_source;
      this.profile.email = contactProfileFormData.email;
      this.profile.email_source = contactProfileFormData.email_source;
      this.profile.responsibility_level = contactProfileFormData.responsibility_level;
      this.profile.preferred_contact_method = contactProfileFormData.preferred_contact_method;
      this.profile.secondary_contact_method = contactProfileFormData.secondary_contact_method;
      this.profile.address_1 = contactProfileFormData.address_1;
      this.profile.address_2 = contactProfileFormData.address_2;
      this.profile.city = contactProfileFormData.city;
      this.profile.state = contactProfileFormData.state;
      this.profile.postal_code = contactProfileFormData.postal_code;
      this.profile.country = contactProfileFormData.country;
      this.profile.access_role = contactProfileFormData.access_role;
      this.profile.language = contactProfileFormData.language;
      this.profile.type = contactProfileFormData.type;
      this.profile.company = contactProfileFormData.company;

      this.rebuildForm();

      //Emails
      if (contactProfileFormData.emails != null && contactProfileFormData.emails.length > 0) {
        let totalEmails = contactProfileFormData.emails.length;
        for (let i = 0; i < totalEmails; i++) {
          this.addEmail();
          this.setEmailItem(contactProfileFormData.emails[i], i);
        }
      }

      //Phones
      if (contactProfileFormData.phones != null && contactProfileFormData.phones.length > 0) {
        let totalPhoneNumbers = contactProfileFormData.phones.length;
        for (let i = 0; i < totalPhoneNumbers; i++) {
          this.addPhone();
          this.setPhoneItem(contactProfileFormData.phones[i], i);
        }
      }

    }

  }

  getContactProfileDetail() {
    return new Promise((resolve, reject) => {
      this.contactProfileService.getContactProfileById(this.ID_profile).subscribe(res => {
        resolve({ success: true, data: res });
      }, error => {
        resolve({ success: false, data: error });
      });
    });
  }

  getPhoneByContactProfileId() {
    return new Promise((resolve, reject) => {
      this.contactProfileService.getPhoneByContactProfileId(this.ID_profile).subscribe(res => {
        resolve({ success: true, data: res });
      }, error => {
        resolve({ success: false, data: error });
      });
    });
  }

  getEmailByContactProfileId() {
    return new Promise((resolve, reject) => {
      this.contactProfileService.getEmailByContactProfileId(this.ID_profile).subscribe(res => {
        resolve({ success: true, data: res });
      }, error => {
        resolve({ success: false, data: error });
      });
    });
  }

  getContactAccessByProfileId() {
    return new Promise((resolve, reject) => {
      this.contactProfileService.getContactAccessByProfileId(this.ID_profile).subscribe(res => {
        resolve({ success: true, data: res });
      }, error => {
        resolve({ success: false, data: error });
      });
    });
  }

  getCompanyAccessByProfileId() {
    return new Promise((resolve, reject) => {
      this.contactProfileService.getCompanyAccessByProfileId(this.ID_profile).subscribe(res => {
        resolve({ success: true, data: res });
      }, error => {
        resolve({ success: false, data: error });
      });
    });
  }

  getContactMethod() {
    return new Promise((resolve, reject) => {
      this.dictionaryService.getDictionaryByCode(this.dictionary.ContactMethod).subscribe(res => {
        resolve({ success: true, data: res });
      }, error => {
        resolve({ success: false, data: error });
      });
    });
  }

  getContactType() {
    return new Promise((resolve, reject) => {
      this.dictionaryService.getDictionaryByCode(this.dictionary.ContactType).subscribe(res => {
        resolve({ success: true, data: res });
      }, error => {
        resolve({ success: false, data: error });
      });
    });
  }

  getContactSource() {
    return new Promise((resolve, reject) => {
      this.dictionaryService.getContactSource().subscribe(res => {
        resolve({ success: true, data: res });
      }, error => {
        resolve({ success: false, data: error });
      });
    });
  }

  getRole() {
    return new Promise((resolve, reject) => {
      this.dictionaryService.getDictionaryByCode(this.dictionary.Role).subscribe(res => {
        resolve({ success: true, data: res });
      }, error => {
        resolve({ success: false, data: error });
      });
    });
  }

  getCountry() {
    return new Promise((resolve, reject) => {
      this.dictionaryService.getDictionaryByCode(this.dictionary.Country).subscribe(res => {
        resolve({ success: true, data: res });
      }, error => {
        resolve({ success: false, data: error });
      });
    });
  }

  getLanguage() {
    return new Promise((resolve, reject) => {
      this.dictionaryService.getDictionaryByCode(this.dictionary.Language).subscribe(res => {
        resolve({ success: true, data: res });
      }, error => {
        resolve({ success: false, data: error });
      });
    });
  }

  unmaskPhoneNumber(phone) {
    if (!this.commonService.isNullOrEmpty(phone)) {
      return phone.replace(/\D+/g, '');
    }
    return "";
  }

  backToList() {
    this.viewForm.reset();
    this.commonService.hideLoader();
    this.router.navigate(['list-contact-profile']);
  }

  selectMoreCompanies() {
    let queryString: NavigationExtras = {
      queryParams: {
        "id": this.ID_profile,
        "company": this.companyId,
        "action": "edit"
      }
    };

    this.contactProfileService.pageSource = "edit";
    this.contactProfileService.contactProfileFormData = this.viewForm.value;

    this.router.navigate(['/company-access'], queryString);
  }

  selectMicroApps() {
    let queryString: NavigationExtras = {
      queryParams: {
        "id": this.ID_profile,
        "company": this.companyId,
        "action": "edit"
      }
    };

    this.contactProfileService.pageSource = "edit";
    this.contactProfileService.contactProfileFormData = this.viewForm.value;

    this.router.navigate(['/contact-access'], queryString);
  }

  getControls(frmGrp: FormGroup, key: string) {
    return (<FormArray>frmGrp.controls[key]).controls;
  }

}
