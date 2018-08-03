//@Packages
import { Component, OnInit, Input } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { SweetAlertOptions } from 'sweetalert2';
import swal from 'sweetalert2'

//@Services
import { ContactProfileService } from '../../services/contact-profile.service';
import { CommonService } from '../../services/common.service';
import { StorageService } from '../../services/storage.service';

//@Models
import { SearchContactProfileVM } from '../../models/ContactProfileVM';

//@Constant
import { MICROAPP } from '../../constant/microapp';


@Component({
  selector: 'app-list-contact-profile',
  templateUrl: './list-contact-profile.component.html',
  styleUrls: ['./list-contact-profile.component.css']
})
export class ListContactProfileComponent implements OnInit {
  @Input('data') profiles: SearchContactProfileVM[] = [];
  pageNo: number = 1;
  pageSize: number = 3;
  totalItems: number = 0;

  companyId: number = 0;
  pageName: string = "Contact Profile";
  userAccessRole: string = "";

  sortColumn: string = "";
  reverse: boolean = false;

  constructor(private router: Router,
    private toastr: ToastrService,
    public microapp: MICROAPP,
    public commonService: CommonService,
    public storageService: StorageService,
    public contactProfileService: ContactProfileService) { }

  ngOnInit() {
    this.companyId = this.storageService.getCompanyId();
    this.userAccessRole = this.storageService.getUserAccessRole();

    this.contactProfileService.contactProfileFormData = null;
    this.contactProfileService.companyAccessFormData = null;
    this.contactProfileService.contactAccessFormData = null;
    this.contactProfileService.contactAccessSelectedMicroAppData = null;
    this.contactProfileService.pageSource = null;

    this.getContactProfiles(1);
  }

  sort(key) {
    this.sortColumn = key;
    this.reverse = !this.reverse;
  }

  getContactProfiles(page: number) {
    this.commonService.showLoader();
    this.contactProfileService.searchContactProfiles(this.companyId, page, this.pageSize).subscribe(data => {
      this.commonService.hideLoader();
      if (data != null) {
        let response: any = data;
        if (response.success) {
          this.profiles = response.data;
          this.totalItems = response.data.length > 0 ? response.data[0].TotalRows : 0;
          this.pageNo = page;
        } else {
          if (typeof response.message === 'object') {
            this.toastr.error(JSON.stringify(response.message), "Error!", { timeOut: 3000, closeButton: true });
          } else {
            this.toastr.error(response.message, "Error!", { timeOut: 3000, closeButton: true });
          }
        }
      }
    }, error => {
      this.commonService.hideLoader();
      this.toastr.error(error.message, "Error!", { timeOut: 3000, closeButton: true });
    });
  }

  deleteContactProfile(profile: SearchContactProfileVM): void {

    const options: SweetAlertOptions = {
      title: 'Are you sure do you want to delete?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      focusCancel: true
    };

    swal(options).then((result) => {
      if (result.value) {
        this.commonService.showLoader();
        this.contactProfileService.deleteContactProfile(profile.ID_profile)
          .subscribe(data => {
            this.commonService.hideLoader();
            if (data != null) {
              let response: any = data;
              if (response.success) {
                //Track User Action.
                this.contactProfileService.trackUserAction("delete", this.microapp.Master_Data, this.storageService.getUserProfileId(), profile.ID_profile, profile, profile)
                  .subscribe(res => {
                    this.profiles = this.profiles.filter(c => c !== profile);
                    this.getContactProfiles(1);
                    this.toastr.success("Record deleted successfully.", "Success!", { timeOut: 3000, closeButton: true });
                  }, error => {
                    this.toastr.error(error.message, "Error!", { timeOut: 3000, closeButton: true });
                  });
              } else {
                if (typeof response.message === 'object') {
                  this.toastr.error(JSON.stringify(response.message), "Error!", { timeOut: 3000, closeButton: true });
                } else {
                  this.toastr.error(response.message, "Error!", { timeOut: 3000, closeButton: true });
                }
              }
            }
          }, error => {
            this.commonService.hideLoader();
            this.toastr.error(error.message, "Error!", { timeOut: 3000, closeButton: true });
          });
      }
    })

  };

  editContactProfile(profile: SearchContactProfileVM): void {
    this.router.navigate(['/edit-contact-profile', profile.ID_profile]);
  };

  addContactProfile(): void {
    this.router.navigate(['/add-contact-profile']);
  };

  viewContactProfile(profile: SearchContactProfileVM): void {
    this.router.navigate(['/view-contact-profile', profile.ID_profile]);
  };

  getPage(page: number) {
    this.sortColumn = '';
    this.reverse = false;
    this.getContactProfiles(page);
  }
}
