//@Packages
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { IMyDpOptions } from 'mydatepicker';

//@Services
import { CommonService } from '../../services/common.service';
import { ErrorService } from '../../services/error.service';
import { DictionaryService } from '../../services/dictionary.service';
import { StorageService } from '../../services/storage.service';
import { SubscriptionService } from '../../services/subscription.service';

//@Models
import { DictionaryVM } from '../../models/DictionaryVM';
import { SubscriptionVM, PayLoadSubscription } from '../../models/SubscriptionVM';

//@Constant
import { REGEXP } from '../../constant/regexp';
import { DICTIONARY } from '../../constant/dictionary';
import { MICROAPP } from '../../constant/microapp';


@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})
export class SubscriptionComponent implements OnInit {

  constructor(private router: Router,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private toastr: ToastrService,
    public regexp: REGEXP,
    public dictionary: DICTIONARY,
    public microapp: MICROAPP,
    public commonService: CommonService,
    public storageService: StorageService,
    public errorService: ErrorService,
    public subscriptionService: SubscriptionService,
    public dictionaryService: DictionaryService) { }

  subscriptionForm: FormGroup;
  subscription: SubscriptionVM;

  oldsubscriptions: SubscriptionVM[];

  companyId: number = 0;
  pageName: string = "Subscription";

  selectedAvailableItems = [];
  selectedSubscriptionItems = [];

  SelectedMicroAppList = [];
  AvailableMicroAppList = [];

  public date_placeholder = "Select a date";

  public myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'dd/mm/yyyy'
  };

  public subscriptionFormErrors = {
    micro_app_name: '',
    app_level: '',
    app_version: '',
    start_date: '',
    expire_date: ''
  };

  private subscriptionValidationMessages = {
    app_version: { 'required': 'Please enter app version.' },
    start_date: { 'required': 'Please select subscription start date.' },
    expire_date: { 'required': 'Please select subscription end date.' }
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

  ngOnInit() {
    this.subscription = new SubscriptionVM();
    this.rebuildForm();
    this.initializeFormValue();
  }

  rebuildForm() {
    this.subscriptionForm = this.fb.group({
      selectedAvailableItems: [this.selectedAvailableItems],
      selectedSubscriptionItems: [this.selectedSubscriptionItems],
      app_level: [this.subscription.app_level],
      app_version: [this.subscription.app_version, Validators.required],
      start_date: [this.subscription.start_date, Validators.required],
      expire_date: [this.subscription.expire_date, Validators.required],
    });
    this.subscriptionForm.valueChanges.subscribe(data => this.onValueChanged(data));
  }

  onValueChanged(data?: any) {
    //Subscription Form Errors.    
    this.subscriptionFormErrors = this.errorService.displayValidationErrors(this.subscriptionValidationMessages, this.subscriptionForm, this.subscriptionFormErrors, false);
  }

  initializeFormValue() {
    this.commonService.showLoader();
    this.companyId = this.storageService.getCompanyId();

    //Bind dropdown values    
    Promise.all(
      [
        this.getSubscriptionByCompany(),
        this.getMicroApp()
      ]).then((data: any) => {

        if (data != null) {
          let subscriptionResult = data[0];
          let microAppResult = data[1];

          //Subscription Detail
          if (subscriptionResult != null && subscriptionResult.success) {
            let subscriptionItems = subscriptionResult.data;
            if (subscriptionItems.success) {

              const subscriptions = subscriptionItems.data as SubscriptionVM[];
              this.oldsubscriptions = subscriptions;

              if (subscriptions != null && subscriptions.length > 0) {
                subscriptions.forEach(element => {
                  this.SelectedMicroAppList.push(element.micro_app_name);
                });

                this.subscription.app_level = subscriptions[0].app_level;
                this.subscription.app_version = subscriptions[0].app_version;

                this.rebuildForm();

                if (subscriptions[0].start_date) {
                  let start_date = this.commonService.parseToIMyDate(subscriptions[0].start_date);
                  this.subscriptionForm.patchValue({
                    start_date: start_date
                  })
                }

                if (subscriptions[0].expire_date) {
                  let expire_date = this.commonService.parseToIMyDate(subscriptions[0].expire_date);
                  this.subscriptionForm.patchValue({
                    expire_date: expire_date
                  })
                }

              }
            }
          }

          //Micro App
          if (microAppResult != null && microAppResult.success) {
            let microAppItems = microAppResult.data;
            if (microAppItems.success) {
              const microApp = microAppItems.data as DictionaryVM[];

              microApp.forEach(element => {
                const existInSubscription = this.SelectedMicroAppList.find(i => i === element.value);

                if (!existInSubscription) {
                  this.AvailableMicroAppList.push(element.value);
                }
              });
            }
          }

          this.selectedAvailableItems = [];
          this.selectedSubscriptionItems = [];

          this.commonService.hideLoader();
        }
      }).catch((error) => {
        this.commonService.hideLoader();
        console.error(error);
      });
  }

  getMicroApp() {
    return new Promise((resolve, reject) => {
      this.dictionaryService.getDictionaryByCode(this.dictionary.MicroApp).subscribe(res => {
        resolve({ success: true, data: res });
      }, error => {
        resolve({ success: false, data: error });
      });
    });
  }

  getSubscriptionByCompany() {
    return new Promise((resolve, reject) => {
      this.subscriptionService.getSubscriptionByCompany(this.companyId).subscribe(res => {
        resolve({ success: true, data: res });
      }, error => {
        resolve({ success: false, data: error });
      });
    });
  }


  setSubscriptionItems() {
    const selectedAvailableItems = this.selectedAvailableItems;
    //const selectedAvailableItems = this.subscriptionForm.get("selectedAvailableItems").value;    

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

    this.selectedAvailableItems = [];
    //this.subscriptionForm.get("selectedAvailableItems").setValue([], { onlySelf : true});
  }

  setAvailableItems() {
    const selectedSubscriptionItems = this.selectedSubscriptionItems;
    //const selectedSubscriptionItems = this.subscriptionForm.get("selectedSubscriptionItems").value;

    if (this.commonService.isNullOrEmpty(selectedSubscriptionItems)) {
      this.toastr.error("Please select at least one item from subscription list.", "Error!", { timeOut: 3000, closeButton: true });
      return false;
    }

    //move selected
    selectedSubscriptionItems.forEach(element => {
      this.AvailableMicroAppList.push(element);
    });

    //remove the ones that were moved from the source container.
    selectedSubscriptionItems.forEach(element => {
      for (let i = this.SelectedMicroAppList.length - 1; i >= 0; i--) {
        if (this.SelectedMicroAppList[i] == element) {
          this.SelectedMicroAppList.splice(i, 1);
        }
      }
    });

    this.selectedSubscriptionItems = [];
    //this.subscriptionForm.get("selectedSubscriptionItems").setValue([], { onlySelf : true});
  }

  onSubmit() {
    const formData = this.subscriptionForm.value;

    if (this.commonService.isNullOrEmpty(this.SelectedMicroAppList) || this.SelectedMicroAppList.length == 0) {
      this.toastr.error("Subscription item list can not be empty.", "Error!", { timeOut: 3000, closeButton: true });
      this.commonService.scrollToTop();
      return false;
    }
    if (this.commonService.isNullOrEmpty(formData.app_version)) {
      this.toastr.error("Please enter app version.", "Error!", { timeOut: 3000, closeButton: true });
      return false;
    }
    if (this.commonService.isNullOrEmpty(formData.start_date)) {
      this.toastr.error("Please select subscription start date.", "Error!", { timeOut: 3000, closeButton: true });
      return false;
    }
    if (this.commonService.isNullOrEmpty(formData.expire_date)) {
      this.toastr.error("Please select subscription end date.", "Error!", { timeOut: 3000, closeButton: true });
      return false;
    } else {
      const start_date = this.commonService.parseDateToValidFormat(formData.start_date.date.year, formData.start_date.date.month, formData.start_date.date.day);
      const expire_date = this.commonService.parseDateToValidFormat(formData.expire_date.date.year, formData.expire_date.date.month, formData.expire_date.date.day);

      const dt_start_date = new Date(start_date);
      const dt_expire_date = new Date(expire_date);

      if (dt_start_date > dt_expire_date) {
        this.toastr.error("Subscription start date must be less than end date.", "Error!", { timeOut: 3000, closeButton: true });
        return false;
      }
    }


    let bodyToPost = new PayLoadSubscription();
    bodyToPost.add = [];
    bodyToPost.delete = [];
    bodyToPost.update = {
      old: [],
      new: []
    }
    bodyToPost.microapp_name = this.microapp.ASD_Admin;
    bodyToPost.userid = this.storageService.getUserProfileId();

    const self = this;

    //Find subscription which are removed.
    for (let i = 0; i < self.oldsubscriptions.length; i++) {
      const micro_app_name = self.oldsubscriptions[i].micro_app_name;

      let item = self.SelectedMicroAppList.find(i => i === micro_app_name);

      const exist = (item && item.length > 0) ? true : false;

      if (!exist) {
        bodyToPost.delete.push(self.oldsubscriptions[i].ID_subscription);
      }
    }

    if (self.SelectedMicroAppList != null && self.SelectedMicroAppList.length > 0) {

      for (let i = 0; i < self.SelectedMicroAppList.length; i++) {

        const micro_app_name = self.SelectedMicroAppList[i];

        //Existing subscription.
        const subscription_detail = self.oldsubscriptions.find(i => i.micro_app_name === micro_app_name);

        if (subscription_detail != null) {

          bodyToPost.update.old.push(subscription_detail);

          //Edit subscription.          
          const ID_subscription = subscription_detail.ID_subscription;

          let body = self.getBodyToPost(ID_subscription, micro_app_name, self.subscriptionForm.value);

          bodyToPost.update.new.push(body);
        } else {
          //Create subscription.
          let body = self.getBodyToPost(0, micro_app_name, self.subscriptionForm.value);

          bodyToPost.add.push(body);
        }
      }
    }

    self.commonService.showLoader();
    self.subscriptionService.subscriptionCRUD(bodyToPost).subscribe(data => {
      self.commonService.hideLoader();
      if (data != null) {
        if (data.success) {
          this.toastr.success("Subscription details updated succesfully.", "Success!", { timeOut: 3000, closeButton: true });
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
      self.commonService.hideLoader();
    });
  }


  getBodyToPost(id, micro_app_name, subscription) {

    let start_date = null;
    let expire_date = null;

    if (!this.commonService.isNullOrEmpty(subscription.start_date)) {
      start_date = this.commonService.parseDateToValidFormat(subscription.start_date.date.year, subscription.start_date.date.month, subscription.start_date.date.day);
    }

    if (!this.commonService.isNullOrEmpty(subscription.expire_date)) {
      expire_date = this.commonService.parseDateToValidFormat(subscription.expire_date.date.year, subscription.expire_date.date.month, subscription.expire_date.date.day);
    }

    let body: any = {
      ID_subscription: id,
      micro_app_name: micro_app_name,
      app_level: subscription.app_level,
      app_version: subscription.app_version,
      start_date: start_date,
      expire_date: expire_date,
      company: this.companyId
    }
    return body;
  }
}
