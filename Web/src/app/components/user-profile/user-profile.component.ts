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
import { PhoneVM, PayLoadPhone } from '../../models/PhoneVM';
import { EmailVM, PayLoadEmail } from '../../models/EmailVM';

//@Constant
import { DICTIONARY } from '../../constant/dictionary';
import { MICROAPP } from '../../constant/microapp';
import { REGEXP } from '../../constant/regexp';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

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

  userProfileForm: FormGroup;

  profile: ContactProfileVM;
  oldprofile: ContactProfileVM;
  oldphones: PhoneVM[] = [];
  oldemails: EmailVM[] = [];

  ID_profile?: number;

  pageName: string = "User Profile";

  contactMethodList: DictionaryVM[] = [];  
  contactSourceList: DictionaryVM[] = [];  
  countryList: DictionaryVM[] = [];

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
  }

  private profileValidationMessages = {
    last_name: { 'required': 'Please enter last name.' },
    first_name: { 'required': 'Please enter first name.' },
    phone: { 'pattern': 'Please enter valid phone number.' },
    phone_source: { 'required': 'Please select type.' },
    email: { 'required': 'Please enter email.', 'pattern': 'Please enter valid email.' },
    email_source: { 'required': 'Please select type.' },
    preferred_contact_method: { 'required': 'Please select preferred contact method.' },
    postal_code: { 'required': 'Please enter postal code.' },    
  }

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

    this.userProfileForm = this.fb.group({
      first_name: [this.profile.first_name, Validators.required],
      last_name: [this.profile.last_name, Validators.required],
      title: [this.profile.title],      
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
      phones: this.fb.array([]), //Set NULL array first time when page load.
      emails: this.fb.array([]), //Set NULL array first time when page load.
    });
    this.userProfileForm.valueChanges.subscribe(data => this.onValueChanged(data));
  }

  onValueChanged(data?: any) {
    //Contact Profile Form Errors.    
    this.profileFormErrors = this.errorService.displayValidationErrors(this.profileValidationMessages, this.userProfileForm, this.profileFormErrors, false);
  }

  createPhoneItem(): FormGroup {
    return this.fb.group({
      phone: [''],
      phone_source: ['']
    });

    //phone: ['', Validators.pattern(this.regexp.PHONE_NUMBER_REGEXP)]
  }

  addPhone() {
    const control = <FormArray>this.userProfileForm.controls['phones'];
    control.push(this.createPhoneItem());
  }

  deletePhoneItem(index: number, item: any) {
    // control refers to your formarray
    const control = <FormArray>this.userProfileForm.controls['phones'];
    // remove the chosen row
    control.removeAt(index);
  }

  setPhoneItem(phoneData: any, index: number) {
    const control = (<FormArray>this.userProfileForm.controls['phones']).at(index);

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
    const control = <FormArray>this.userProfileForm.controls['emails'];
    control.push(this.createEmailItem());
  }

  deleteEmailItem(index: number, item: any) {
    // control refers to your formarray
    const control = <FormArray>this.userProfileForm.controls['emails'];
    // remove the chosen row
    control.removeAt(index);
  }

  setEmailItem(emailData: any, index: number) {
    const control = (<FormArray>this.userProfileForm.controls['emails']).at(index);

    control['controls'].email.setValue(emailData.email);
    control['controls'].email_source.setValue(emailData.email_source);
  }

  initializeFormValue() {

    this.ID_profile =  this.storageService.getUserProfileId();

    this.commonService.showLoader();

    //Bind dropdown values    
    Promise.all(
      [
        this.getContactMethod(),
        this.getCountry(),
        this.getContactSource(),
        this.getContactProfileDetail(),
        this.getPhoneByContactProfileId(),
        this.getEmailByContactProfileId()
      ]).then((data: any) => {

        if (data != null) {

          let contactMethodResult = data[0];
          let countryResult = data[1];
          let contactSourceResult = data[2];
          let contactProfileResult = data[3];
          let phoneResult = data[4];
          let emailResult = data[5];

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
              this.profile.country = !this.commonService.isNullOrEmpty(this.profile.country) ? this.profile.country : "";              

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

                this.userProfileForm.controls['phone'].setValue(this.profile.phone, { onlySelf: true });
                this.userProfileForm.controls['phone_source'].setValue(this.profile.phone_source, { onlySelf: true });

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

                this.userProfileForm.controls['email'].setValue(this.profile.email, { onlySelf: true });
                this.userProfileForm.controls['email_source'].setValue(this.profile.email_source, { onlySelf: true });

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

          this.commonService.hideLoader();
        }
      }).catch((error) => {
        this.commonService.hideLoader();
        console.error(error);
      });
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

  getContactMethod() {
    return new Promise((resolve, reject) => {
      this.dictionaryService.getDictionaryByCode(this.dictionary.ContactMethod).subscribe(res => {
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

  getCountry() {
    return new Promise((resolve, reject) => {
      this.dictionaryService.getDictionaryByCode(this.dictionary.Country).subscribe(res => {
        resolve({ success: true, data: res });
      }, error => {
        resolve({ success: false, data: error });
      });
    });
  }

  onSubmit() {

    let phones: any[] = [];
    let emails: any[] = [];

    if (this.userProfileForm.value.phones && this.userProfileForm.value.phones.length > 0) {
      //Add each element to phones array.
      this.userProfileForm.value.phones.forEach(x => phones.push(x));
    }
    let primayPhone = {
      phone: this.userProfileForm.value.phone,
      phone_source: this.userProfileForm.value.phone_source
    }
    phones.unshift(primayPhone); //Add primary phone to beginning of the phones array (0th index) 

    if (this.userProfileForm.value.emails && this.userProfileForm.value.emails.length > 0) {
      //Add each element to emails array.
      this.userProfileForm.value.emails.forEach(x => emails.push(x));
    }
    let primayEmail = {
      email: this.userProfileForm.value.email,
      email_source: this.userProfileForm.value.email_source
    }
    emails.unshift(primayEmail); //Add primary email to beginning of the emails array (0th index) 

    if (this.userProfileForm.value.phones && this.userProfileForm.value.phones.length > 0) {
      if (this.commonService.isNullOrEmpty(this.userProfileForm.value.phone) || this.commonService.isNullOrEmpty(this.userProfileForm.value.phone_source)) {
        this.toastr.error("Please enter phone number and select their type.", "Error!", { timeOut: 3000, closeButton: true });
        this.commonService.scrollToTop();
        return false;
      }
    }

    if (this.userProfileForm.value.emails && this.userProfileForm.value.emails.length > 0) {
      if (this.commonService.isNullOrEmpty(this.userProfileForm.value.email) || this.commonService.isNullOrEmpty(this.userProfileForm.value.email_source)) {
        this.toastr.error("Please enter email and select their type.", "Error!", { timeOut: 3000, closeButton: true });
        this.commonService.scrollToTop();
        return false;
      }
    }

    if (!this.userProfileForm.valid) {
      this.profileFormErrors = this.errorService.displayValidationErrors(this.profileValidationMessages, this.userProfileForm, this.profileFormErrors, true);
      this.toastr.error("Please fill all the required field first", "Error!", { timeOut: 3000, closeButton: true });
      this.commonService.scrollToTop();
      return false;
    }

    let body = this.getBodyToPost(this.userProfileForm.value);
    this.commonService.showLoader();
    this.contactProfileService.updateUserProfile(body).subscribe(data => {
      if (data != null) {
        if (data.success) {

          //Phone
          let bodyPayLoadPhone = new PayLoadPhone();
          bodyPayLoadPhone = this.getPhoneBodyToPost(phones);

          //Email
          let bodyPayLoadEmail = new PayLoadEmail();
          bodyPayLoadEmail = this.getEmailBodyToPost(emails);

          //Save phone numbers, emails, contact-access, company-access and track user actions.
          Promise.all(
            [
              this.trackUserAction("update", this.microapp.Master_Data, this.storageService.getUserProfileId(), this.ID_profile, this.oldprofile, body),
              this.phoneCRUD(bodyPayLoadPhone),
              this.emailCRUD(bodyPayLoadEmail)
            ]).then((data: any) => {
              this.commonService.hideLoader();
              this.toastr.success("User Profile details updated successfully.", "Success!", { timeOut: 3000, closeButton: true });
              //this.router.navigate(['home']);
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
      ID_profile: this.ID_profile,
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
      type: profile.type
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

    //Find phone number which are removed.
    for (let i = 0; i < this.oldphones.length; i++) {
      const phone_number = this.oldphones[i].number;

      let item = phones.find(i => i.phone === phone_number);

      const exist = item ? true : false;

      if (!exist) {
        bodyPayLoadPhone.delete.push(this.oldphones[i].ID_phone);
      }
    }

    if (phones.length > 0) {
      phones.forEach(item => {

        //Existing phone detail.
        const phone_detail = this.oldphones.find(i => i.number === item.phone);

        if (!phone_detail) {
          //Create New Phone Detail
          if (!this.commonService.isNullOrEmpty(item.phone)) {
            let objPhone = new PhoneVM();
            objPhone.number = this.unmaskPhoneNumber(item.phone);
            objPhone.type = !this.commonService.isNullOrEmpty(item.phone_source) ? +item.phone_source : null;
            objPhone.contact = this.ID_profile;
            bodyPayLoadPhone.add.push(objPhone);
          }
        } else {
          bodyPayLoadPhone.update.old.push(phone_detail);

          //Edit Phone Detail.
          const ID_phone = phone_detail.ID_phone;

          if (!this.commonService.isNullOrEmpty(item.phone)) {
            let objPhone = new PhoneVM();
            objPhone.ID_phone = ID_phone;
            objPhone.number = this.unmaskPhoneNumber(item.phone);
            objPhone.type = !this.commonService.isNullOrEmpty(item.phone_source) ? +item.phone_source : null;
            objPhone.contact = this.ID_profile;
            bodyPayLoadPhone.update.new.push(objPhone);
          }
        }

      });
    }

    return bodyPayLoadPhone;
  }

  getEmailBodyToPost(emails) {
    //Email
    let bodyPayLoadEmail = new PayLoadEmail();
    bodyPayLoadEmail.add = [];
    bodyPayLoadEmail.delete = [];
    bodyPayLoadEmail.update = {
      old: [],
      new: []
    }
    bodyPayLoadEmail.microapp_name = this.microapp.Master_Data;
    bodyPayLoadEmail.userid = this.storageService.getUserProfileId();

    //Find email which are removed.
    for (let i = 0; i < this.oldemails.length; i++) {
      const email = this.oldemails[i].email;

      let item = emails.find(i => i.email === email);

      const exist = item ? true : false;

      if (!exist) {
        bodyPayLoadEmail.delete.push(this.oldemails[i].ID_email);
      }
    }

    if (emails.length > 0) {

      emails.forEach(item => {

        //Existing email detail.
        const email_detail = this.oldemails.find(i => i.email === item.email);

        if (!email_detail) {
          //Create New Email Detail
          if (!this.commonService.isNullOrEmpty(item.email)) {
            let objEmail = new EmailVM();
            objEmail.email = item.email;
            objEmail.type = !this.commonService.isNullOrEmpty(item.email_source) ? +item.email_source : null;
            objEmail.contact = this.ID_profile;

            bodyPayLoadEmail.add.push(objEmail);
          }
        } else {
          bodyPayLoadEmail.update.old.push(email_detail);

          //Edit Existing Email Detail
          const ID_email = email_detail.ID_email;

          if (!this.commonService.isNullOrEmpty(item.email)) {
            let objEmail = new EmailVM();
            objEmail.ID_email = ID_email;
            objEmail.email = item.email;
            objEmail.type = !this.commonService.isNullOrEmpty(item.email_source) ? +item.email_source : null;
            objEmail.contact = this.ID_profile;

            bodyPayLoadEmail.update.new.push(objEmail);
          }
        }

      });
    }

    return bodyPayLoadEmail;
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

  unmaskPhoneNumber(phone) {
    if (!this.commonService.isNullOrEmpty(phone)) {
      return phone.replace(/\D+/g, '');
    }
    return "";
  }

  backToList() {
    this.userProfileForm.reset();
    this.commonService.hideLoader();
    this.router.navigate(['home']);
  }

  getControls(frmGrp: FormGroup, key: string) {
    return (<FormArray>frmGrp.controls[key]).controls;
  }

}
