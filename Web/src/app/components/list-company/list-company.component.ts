//@Packages
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { SweetAlertOptions } from 'sweetalert2';
import swal from 'sweetalert2'

//@Services
import { CompanyService } from '../../services/company.service';
import { CommonService } from '../../services/common.service';
import { StorageService } from '../../services/storage.service';

//@Models
import { SearchCompanyVM } from '../../models/CompanyVM';

//@Constants
import { MICROAPP } from '../../constant/microapp';


@Component({
  selector: 'app-list-company',
  templateUrl: './list-company.component.html',
  styleUrls: ['./list-company.component.css']
})
export class ListCompanyComponent implements OnInit {

  @Input('data') companies: SearchCompanyVM[] = [];
  pageNo: number = 1;
  pageSize: number = 3;
  totalItems: number;

  companyId: number = 0;
  pageName: string = "Company";
  userAccessRole: string = "";

  sortColumn: string = "";
  reverse: boolean = false;

  constructor(private router: Router,
    private toastr: ToastrService,
    public microapp: MICROAPP,
    public commonService: CommonService,
    public storageService: StorageService,
    public companyService: CompanyService) { }

  ngOnInit() {
    this.companyId = this.storageService.getCompanyId();
    this.userAccessRole = this.storageService.getUserAccessRole();
    this.getCompanies(1);
  }

  sort(key) {
    this.sortColumn = key;
    this.reverse = !this.reverse;
  }

  getCompanies(page: number) {
    this.commonService.showLoader();
    this.companyService.searchCompanies(this.companyId, page, this.pageSize).subscribe(data => {
      this.commonService.hideLoader();
      if (data != null) {
        let response: any = data;
        if (response.success) {
          this.companies = response.data;
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

  deleteCompany(company: SearchCompanyVM): void {
    let isRelatedWithOtherCompany: boolean = false;
    isRelatedWithOtherCompany = this.commonService.parseBoolean(company.IsRelatedWithOtherCompany);

    if (isRelatedWithOtherCompany == false) {

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
          this.companyService.deleteCompany(company.ID_company)
            .subscribe(data => {
              this.commonService.hideLoader();
              if (data != null) {
                let response: any = data;
                if (response.success) {

                  //Track User Action.
                  this.companyService.trackUserAction("delete", this.microapp.ASD_Admin, this.storageService.getUserProfileId(), company.ID_company, company, company)
                    .subscribe(res => {
                      this.companies = this.companies.filter(u => u !== company);
                      this.getCompanies(1);
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
    } else {
      swal("Sorry! You can not delete this company because it's  related with other company", "", "error");
    }
  };

  editCompany(company: SearchCompanyVM): void {
    this.router.navigate(['/edit-company', company.ID_company]);
  };

  addCompany(): void {
    this.router.navigate(['/add-company']);
  };

  viewCompany(company: SearchCompanyVM): void {
    this.router.navigate(['/view-company', company.ID_company]);
  };

  getPage(page: number) {
    this.sortColumn = '';
    this.reverse = false;
    this.getCompanies(page);
  }
}
