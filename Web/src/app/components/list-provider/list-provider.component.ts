//@Packages
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { SweetAlertOptions } from 'sweetalert2';
import swal from 'sweetalert2'

//@Services
import { ProviderService } from '../../services/provider.service';
import { CommonService } from '../../services/common.service';
import { StorageService } from '../../services/storage.service';

//@Models
import { SearchProviderVM } from '../../models/ProviderVM';

//@Constant
import { MICROAPP } from '../../constant/microapp';

@Component({
  selector: 'app-list-provider',
  templateUrl: './list-provider.component.html',
  styleUrls: ['./list-provider.component.css']
})
export class ListProviderComponent implements OnInit {

  @Input('data') providers: SearchProviderVM[] = [];
  pageNo: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;

  companyId: number = 0;
  pageName: string = "Provider";
  userAccessRole: string = "";

  sortColumn: string = "";
  reverse: boolean = false;

  constructor(private router: Router,
    private toastr: ToastrService,
    public microapp: MICROAPP,
    public commonService: CommonService,
    public storageService: StorageService,
    public providerService: ProviderService) { }

  ngOnInit() {
    this.companyId = this.storageService.getCompanyId();
    this.userAccessRole = this.storageService.getUserAccessRole();

    this.providerService.pageSource = null;
    this.providerService.providerFormData = null;
    this.providerService.newAddressId = null;

    this.getProviders(1);
  }

  sort(key) {
    this.sortColumn = key;
    this.reverse = !this.reverse;
  }

  getProviders(page: number) {
    this.commonService.showLoader();
    this.providerService.searchProviders(this.companyId, page, this.pageSize).subscribe(data => {
      this.commonService.hideLoader();
      if (data != null) {
        let response: any = data;
        if (response.success) {
          this.providers = response.data;
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

  deleteProvider(provider: SearchProviderVM): void {

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
        this.providerService.deleteProvider(provider.ID_provider)
          .subscribe(data => {
            this.commonService.hideLoader();
            if (data != null) {
              let response: any = data;
              if (response.success) {
                //Track User Action.
                this.providerService.trackUserAction("delete", this.microapp.Master_Data, this.storageService.getUserProfileId(), provider.ID_provider, provider, provider)
                  .subscribe(res => {
                    this.providers = this.providers.filter(c => c !== provider);
                    this.getProviders(1);
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

  editProvider(provider: SearchProviderVM): void {
    this.router.navigate(['/edit-provider', provider.ID_provider]);
  };

  addProvider(): void {
    this.router.navigate(['/add-provider']);
  };

  viewProvider(provider: SearchProviderVM): void {
    this.router.navigate(['/view-provider', provider.ID_provider]);
  };

  getPage(page: number) {
    this.sortColumn = '';
    this.reverse = false;
    this.getProviders(page);
  }

}
