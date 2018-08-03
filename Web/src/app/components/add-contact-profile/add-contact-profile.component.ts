//@Packages
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import { Router, NavigationExtras } from "@angular/router";
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
import { PhoneVM, PayLoadPhone } from '../../models/PhoneVM';
import { EmailVM, PayLoadEmail } from '../../models/EmailVM';
import { PayLoadCompanyAccess } from '../../models/CompanyAccessVM';
import { PayLoadContactAccess } from '../../models/ContactAccessVM';

//@Constant
import { DICTIONARY } from '../../constant/dictionary';
import { MICROAPP } from '../../constant/microapp';
import { REGEXP } from '../../constant/regexp';

@Component({
  selector: 'app-add-contact-profile',
  templateUrl: './add-contact-profile.component.html',
  styleUrls: ['./add-contact-profile.component.css']
})
export class AddContactProfileComponent implements OnInit {

  constructor(private router: Router,
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

  addForm: FormGroup;
  profile: ContactProfileVM;

  companyId: number = 0;
  companyName: string = "";

  pageName: string = "Contact Profile";

  contactMethodList: DictionaryVM[] = [];
  contactTypeList: DictionaryVM[] = [];
  contactSourceList: DictionaryVM[] = [];
  roleList: DictionaryVM[] = [];
  countryList: DictionaryVM[] = [];
  languageList: DictionaryVM[] = [];


  //International format - +1 (123) 456-7890
  //phone_mask: any[] = ['+', '1', ' ', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  //Regular format - (123) 456-7890
  phone_mask: any[] = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  public profileFormErrors = {
    first_name: '',
    last_name: '',
    title: '',
    phone: '',
    phone_source: '',
    email: '',
    email_source: '',
    responsibility_level: '',
    preferred_contact_method: '',
    secondary_contact_method: '',
    address_1: '',
    address_2: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    access_role: '',
    language: '',
    type: '',
    phones: '',
    emails: ''
  };

  private profileValidationMessages = {
    last_name: { 'required': 'Please enter last name.' },
    first_name: { 'required': 'Please enter first name.' },
    phone: { 'pattern': 'Please enter valid phone number.' },
    phone_source: { 'required': 'Please select type.' },
    email: { 'required': 'Please enter email.', 'pattern': 'Please enter valid email.' },
    email_source: { 'required': 'Please select type.' },
    preferred_contact_method: { 'required': 'Please select preferred contact method.' },
    postal_code: { 'required': 'Please enter postal code.' },
    access_role: { 'required': 'Please select role.' }
  }

  ngOnInit() {
    this.profile = new ContactProfileVM();
    this.buildForm(true);
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

  buildForm(isClearData = false) {

    if (isClearData) {
      this.profile.phone_source = "";
      this.profile.email_source = "";
      this.profile.preferred_contact_method = "";
      this.profile.secondary_contact_method = "";
      this.profile.responsibility_level = "";
      this.profile.country = "";
      this.profile.access_role = "";
      this.profile.language = "";      
    }


    this.addForm = this.fb.group({
      first_name: [this.profile.first_name, Validators.required],
      last_name: [this.profile.last_name, Validators.required],
      title: [this.profile.title],
      responsibility_level: [this.profile.responsibility_level],
      preferred_contact_method: [this.profile.preferred_contact_method, Validators.required],
      secondary_contact_method: [this.profile.secondary_contact_method],
      address_1: [this.profile.address_1],
      address_2: [this.profile.address_2],
      //phone: [this.profile.phone, Validators.pattern(this.regexp.PHONE_NUMBER_REGEXP)],
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
    this.addForm.valueChanges.subscribe(data => this.onValueChanged(data));
  }

  onValueChanged(data?: any) {
    //Contact Profile Form Errors.    
    this.profileFormErrors = this.errorService.displayValidationErrors(this.profileValidationMessages, this.addForm, this.profileFormErrors, false);
  }

  createPhoneItem(): FormGroup {
    return this.fb.group({
      phone: [''],
      phone_source: ['']
    });
  }

  addPhone() {
    const control = <FormArray>this.addForm.controls['phones'];
    control.push(this.createPhoneItem());
  }

  deletePhoneItem(index: number, item: any) {
    // control refers to your formarray
    const control = <FormArray>this.addForm.controls['phones'];
    // remove the chosen row
    control.removeAt(index);
  }

  setPhoneItem(phoneData: any, index: number) {
    const control = (<FormArray>this.addForm.controls['phones']).at(index);

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
    const control = <FormArray>this.addForm.controls['emails'];
    control.push(this.createEmailItem());
  }

  deleteEmailItem(index: number, item: any) {
    // control refers to your formarray
    const control = <FormArray>this.addForm.controls['emails'];
    // remove the chosen row
    control.removeAt(index);
  }

  setEmailItem(emailData: any, index: number) {
    const control = (<FormArray>this.addForm.controls['emails']).at(index);

    control['controls'].email.setValue(emailData.email);
    control['controls'].email_source.setValue(emailData.email_source);
  }

  initializeFormValue() {

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
        this.getContactSource()
      ]).then((data: any) => {

        if (data != null) {
          let contactMethodResult = data[0];
          let countryResult = data[1];
          let contactTypeResult = data[2];
          let roleResult = data[3];
          let languageResult = data[4];
          let contactSourceResult = data[5];

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

      this.buildForm(false);

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

    // if (companyAccessFormData != null) {      
    //   if (companyAccessFormData.add != null && companyAccessFormData.add.length > 0) {        
    //     const company_name = companyAccessFormData.add[0].company_name;
    //     this.companyName = company_name;
    //   }
    // }
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

  onSubmit() {
    
    let phones: any[] = [];
    let emails: any[] = [];

    if (this.addForm.value.phones && this.addForm.value.phones.length > 0) {
      //Add each element to phones array.
      this.addForm.value.phones.forEach(x => phones.push(x));
    }
    let primayPhone = {
      phone: this.addForm.value.phone,
      phone_source: this.addForm.value.phone_source
    }
    phones.unshift(primayPhone); //Add primary phone to beginning of the phones array (0th index) 

    if (this.addForm.value.emails && this.addForm.value.emails.length > 0) {
      //Add each element to emails array.
      this.addForm.value.emails.forEach(x => emails.push(x));
    }
    let primayEmail = {
      email: this.addForm.value.email,
      email_source: this.addForm.value.email_source
    }
    emails.unshift(primayEmail); //Add primary email to beginning of the emails array (0th index) 

    if (this.addForm.value.phones && this.addForm.value.phones.length > 0) {
      if (this.commonService.isNullOrEmpty(this.addForm.value.phone) || this.commonService.isNullOrEmpty(this.addForm.value.phone_source)) {
        this.toastr.error("Please enter phone number and select their type.", "Error!", { timeOut: 3000, closeButton: true });
        this.commonService.scrollToTop();
        return false;
      }

      // if(this.commonService.hasDuplicateValue(phones)){
      //   this.toastr.error("Please check you have entered same phone number two or more times.", "Error!", { timeOut: 3000, closeButton: true });
      //   this.commonService.scrollToTop();
      //   return false;
      // }
    }

    if (this.addForm.value.emails && this.addForm.value.emails.length > 0) {
      if (this.commonService.isNullOrEmpty(this.addForm.value.email) || this.commonService.isNullOrEmpty(this.addForm.value.email_source)) {
        this.toastr.error("Please enter email and select their type.", "Error!", { timeOut: 3000, closeButton: true });
        this.commonService.scrollToTop();
        return false;
      }

      // if(this.commonService.hasDuplicateValue(emails)){
      //   this.toastr.error("Please check you have entered same email address two or more times.", "Error!", { timeOut: 3000, closeButton: true });
      //   this.commonService.scrollToTop();
      //   return false;
      // }
    }

    if (!this.addForm.valid) {
      this.profileFormErrors = this.errorService.displayValidationErrors(this.profileValidationMessages, this.addForm, this.profileFormErrors, true);
      this.toastr.error("Please fill all the required field first", "Error!", { timeOut: 3000, closeButton: true });
      this.commonService.scrollToTop();
      return false;
    }

    let body = this.getBodyToPost(this.addForm.value);
    this.commonService.showLoader();
    this.contactProfileService.createContactProfile(body).subscribe(data => {
      if (data != null) {
        if (data.success) {          
          const insertedId = data.data.insertId;

          this.profile.ID_profile = insertedId;

          //Phone
          let bodyPayLoadPhone = new PayLoadPhone();
          bodyPayLoadPhone = this.getPhoneBodyToPost(phones);

          //Email
          let bodyPayLoadEmail = new PayLoadEmail();
          bodyPayLoadEmail = this.getEmailBodyToPost(emails);

          //CompanyAccess
          let bodyPayLoadCompanyAccess = new PayLoadCompanyAccess();
          bodyPayLoadCompanyAccess = this.getCompanyAccessBodyToPost();

          //ContactAccess
          let bodyPayLoadContactAccess = new PayLoadContactAccess();
          bodyPayLoadContactAccess = this.getContactAccessBodyToPost();

          //Save phone numbers, emails, contact-access, company-access and track user actions.
          Promise.all(
            [
              this.trackUserAction("add", this.microapp.Master_Data, this.storageService.getUserProfileId(), insertedId, body, body),
              this.phoneCRUD(bodyPayLoadPhone),
              this.emailCRUD(bodyPayLoadEmail),
              this.companyaccessCRUD(bodyPayLoadCompanyAccess),
              this.contactaccessCRUD(bodyPayLoadContactAccess)
            ]).then((data: any) => {              
              this.commonService.hideLoader();
              this.toastr.success("Contact Profile created successfully.", "Success!", { timeOut: 3000, closeButton: true });
              this.router.navigate(['list-contact-profile']);
            }).catch((error) => {
              this.toastr.error(error.message, "Error!", { timeOut: 3000, closeButton: true });
              this.commonService.hideLoader();
              console.error(error);
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
      this.commonService.hideLoader();
    });
  }

  getBodyToPost(profile) {

    let body: any = {
      first_name: profile.first_name,
      last_name: profile.last_name,
      title: profile.title,
      responsibility_level: profile.responsibility_level,
      preferred_contact_method: profile.preferred_contact_method,
      secondary_contact_method: profile.secondary_contact_method,
      address_1: profile.address_1,
      address_2: profile.address_2,
      city: profile.city,
      state: profile.state,
      postal_code: profile.postal_code,
      country: profile.country,
      access_role: profile.access_role,
      language: profile.language,
      type: profile.type,
      company: this.companyId
    }
    return body;
  }

  getPhoneBodyToPost(phones) {
    //Phone
    let bodyPayLoadPhone = new PayLoadPhone();
    bodyPayLoadPhone.add = [];
    bodyPayLoadPhone.delete = [];
    bodyPayLoadPhone.update = {
      old: [],
      new: []
    }
    bodyPayLoadPhone.microapp_name = this.microapp.Master_Data;
    bodyPayLoadPhone.userid = this.storageService.getUserProfileId();

    if (phones.length > 0) {
      phones.forEach(item => {
        if (!this.commonService.isNullOrEmpty(item.phone)) {
          let objPhone = new PhoneVM();
          objPhone.number = this.unmaskPhoneNumber(item.phone);
          objPhone.type = !this.commonService.isNullOrEmpty(item.phone_source) ? +item.phone_source : null;
          objPhone.contact = this.profile.ID_profile;
          bodyPayLoadPhone.add.push(objPhone);
        }
      });
    }

    return bodyPayLoadPhone;
  }

  getEmailBodyToPost(emails) {
    let bodyPayLoadEmail = new PayLoadEmail();
    bodyPayLoadEmail.add = [];
    bodyPayLoadEmail.delete = [];
    bodyPayLoadEmail.update = {
      old: [],
      new: []
    }
    bodyPayLoadEmail.microapp_name = this.microapp.Master_Data;
    bodyPayLoadEmail.userid = this.storageService.getUserProfileId();

    if (emails.length > 0) {
      emails.forEach(item => {
        if (!this.commonService.isNullOrEmpty(item.email)) {
          let objEmail = new EmailVM();
          objEmail.email = item.email;
          objEmail.type = !this.commonService.isNullOrEmpty(item.email_source) ? +item.email_source : null;
          objEmail.contact = this.profile.ID_profile;

          bodyPayLoadEmail.add.push(objEmail);
        }
      });
    }

    return bodyPayLoadEmail;
  }

  getCompanyAccessBodyToPost() {
    let bodyPayLoadCompanyAccess = new PayLoadCompanyAccess();
    bodyPayLoadCompanyAccess.add = [];
    bodyPayLoadCompanyAccess.delete = [];
    bodyPayLoadCompanyAccess.update = {
      old: [],
      new: []
    }
    bodyPayLoadCompanyAccess.microapp_name = this.microapp.Master_Data;
    bodyPayLoadCompanyAccess.userid = this.storageService.getUserProfileId();

    if (this.contactProfileService.companyAccessFormData != null) {
      bodyPayLoadCompanyAccess = this.contactProfileService.companyAccessFormData

      for (let i = 0; i < bodyPayLoadCompanyAccess.add.length; i++) {
        bodyPayLoadCompanyAccess.add[i].contactProfileID = this.profile.ID_profile;
      }      
    } else {
      //Add default selected company from the Top Companie dropdown box.
      let body: any = {
        contactProfileID: this.profile.ID_profile,
        company: this.companyId,
        company_name: this.companyName
      }
      bodyPayLoadCompanyAccess.add.push(body);
    }

    return bodyPayLoadCompanyAccess;
  }

  getContactAccessBodyToPost() {
    let bodyPayLoadContactAccess = new PayLoadContactAccess();
    bodyPayLoadContactAccess.add = [];
    bodyPayLoadContactAccess.delete = [];
    bodyPayLoadContactAccess.update = {
      old: [],
      new: []
    }
    bodyPayLoadContactAccess.microapp_name = this.microapp.Master_Data;
    bodyPayLoadContactAccess.userid = this.storageService.getUserProfileId();


    if (this.contactProfileService.contactAccessFormData != null) {
      bodyPayLoadContactAccess = this.contactProfileService.contactAccessFormData

      for (let i = 0; i < bodyPayLoadContactAccess.add.length; i++) {
        bodyPayLoadContactAccess.add[i].contactprofileid = this.profile.ID_profile;
      }      
    }

    return bodyPayLoadContactAccess;
  }

  trackUserAction(action, appname, user, id, oldContactProfile: any, newContactProfile: any) {
    return new Promise((resolve, reject) => {
      this.contactProfileService.trackUserAction(action, appname, user, id, oldContactProfile, newContactProfile).subscribe(res => {
        resolve({ success: true, data: res });
      }, error => {
        resolve({ success: false, data: error });
      });
    });
  }

  phoneCRUD(body: any) {
    return new Promise((resolve, reject) => {
      this.contactProfileService.phoneCRUD(body).subscribe(res => {
        resolve({ success: true, data: res });
      }, error => {
        resolve({ success: false, data: error });
      });
    });
  }

  emailCRUD(body: any) {
    return new Promise((resolve, reject) => {
      this.contactProfileService.emailCRUD(body).subscribe(res => {
        resolve({ success: true, data: res });
      }, error => {
        resolve({ success: false, data: error });
      });
    });
  }

  companyaccessCRUD(body: any) {
    return new Promise((resolve, reject) => {
      this.contactProfileService.companyaccessCRUD(body).subscribe(res => {
        resolve({ success: true, data: res });
      }, error => {
        resolve({ success: false, data: error });
      });
    });
  }

  contactaccessCRUD(body: any) {
    return new Promise((resolve, reject) => {
      this.contactProfileService.contactaccessCRUD(body).subscribe(res => {
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
    this.addForm.reset();
    this.commonService.hideLoader();
    this.router.navigate(['list-contact-profile']);
  }

  selectMoreCompanies() {
    let queryString: NavigationExtras = {
      queryParams: {
        "id": 0,
        "company": this.companyId,
        "action": "add"
      }
    };

    this.contactProfileService.pageSource = "add";
    this.contactProfileService.contactProfileFormData = this.addForm.value;

    this.router.navigate(['/company-access'], queryString);
  }

  selectMicroApps() {
    let queryString: NavigationExtras = {
      queryParams: {
        "id": 0,
        "company": this.companyId,
        "action": "add"
      }
    };

    this.contactProfileService.pageSource = "add";
    this.contactProfileService.contactProfileFormData = this.addForm.value;

    this.router.navigate(['/contact-access'], queryString);
  }

  getControls(frmGrp: FormGroup, key: string) {
    return (<FormArray>frmGrp.controls[key]).controls;
  }
}

