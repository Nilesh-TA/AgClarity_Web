//@Packages
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { SweetAlertOptions } from 'sweetalert2';
import swal from 'sweetalert2'

//@Services
import { PestService } from '../../services/pest.service';
import { CommonService } from '../../services/common.service';
import { StorageService } from '../../services/storage.service';

//@Models
import { SearchPestVM } from '../../models/PestVM';

//@Constant
import { MICROAPP } from '../../constant/microapp';


@Component({
  selector: 'app-list-pest',
  templateUrl: './list-pest.component.html',
  styleUrls: ['./list-pest.component.css']
})
export class ListPestComponent implements OnInit {
  @Input('data') pests: SearchPestVM[] = [];
  pageNo: number = 1;
  pageSize: number = 3;
  totalItems: number = 0;

  companyId: number = 0;
  pageName: string = "Pest";
  userAccessRole: string = "";

  sortColumn: string = "";
  reverse: boolean = false;

  constructor(private router: Router,
    private toastr: ToastrService,
    public microapp: MICROAPP,
    public commonService: CommonService,
    public storageService: StorageService,
    public pestService: PestService) { }

  ngOnInit() {
    this.companyId = this.storageService.getCompanyId();
    this.userAccessRole = this.storageService.getUserAccessRole();
    this.getPests(1);
  }

  sort(key) {
    this.sortColumn = key;
    this.reverse = !this.reverse;
  }

  getPests(page: number) {
    this.commonService.showLoader();
    this.pestService.searchPests(this.companyId, page, this.pageSize).subscribe(data => {
      this.commonService.hideLoader();
      if (data != null) {
        let response: any = data;
        if (response.success) {
          this.pests = response.data;
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

  deletePest(pest: SearchPestVM): void {

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
        this.pestService.deletePest(pest.ID_pest)
          .subscribe(data => {
            this.commonService.hideLoader();
            if (data != null) {
              let response: any = data;
              if (response.success) {                
                //Track User Action.
                this.pestService.trackUserAction("delete", this.microapp.ASD_Admin, this.storageService.getUserProfileId(), pest.ID_pest, pest, pest)
                  .subscribe(res => {
                    this.pests = this.pests.filter(c => c !== pest);
                    this.getPests(1);
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

  editPest(pest: SearchPestVM): void {
    this.router.navigate(['/edit-pest', pest.ID_pest]);
  };

  addPest(): void {
    this.router.navigate(['/add-pest']);
  };

  viewPest(pest: SearchPestVM): void {
    this.router.navigate(['/view-pest', pest.ID_pest]);
  };

  getPage(page: number) {
    this.sortColumn = '';
    this.reverse = false;
    this.getPests(page);
  }
}
