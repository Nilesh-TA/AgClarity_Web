//@Packages
import { Component, OnInit, Input } from '@angular/core';
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { SweetAlertOptions } from 'sweetalert2';
import swal from 'sweetalert2'

//@Services
import { IrrigationService } from '../../services/irrigation.service';
import { CommonService } from '../../services/common.service';
import { StorageService } from '../../services/storage.service';

//@Models
import { SearchIrrigationVM } from '../../models/IrrigationVM';

//@Constant
import { MICROAPP } from '../../constant/microapp';


@Component({
  selector: 'app-list-irrigation',
  templateUrl: './list-irrigation.component.html',
  styleUrls: ['./list-irrigation.component.css']
})
export class ListIrrigationComponent implements OnInit {

  @Input('data') irrigations: SearchIrrigationVM[] = [];
  pageNo: number = 1;
  pageSize: number = 3;
  totalItems: number = 0;

  companyId: number = 0;
  pageName: string = "Irrigation";
  userAccessRole: string = "";

  sortColumn: string = "";
  reverse: boolean = false;

  constructor(private router: Router,
    private toastr: ToastrService,
    public microapp: MICROAPP,
    public commonService: CommonService,
    public storageService: StorageService,
    public irrigationService: IrrigationService) { }

  ngOnInit() {
    this.companyId = this.storageService.getCompanyId();
    this.userAccessRole = this.storageService.getUserAccessRole();

    this.irrigationService.irrigationFormData = null;
    this.irrigationService.irrigationLocationFormData = null;
    this.irrigationService.pageSource = null;    

    this.getIrrigations(1);
  }

  sort(key) {
    this.sortColumn = key;
    this.reverse = !this.reverse;
  }

  getIrrigations(page: number) {
    this.commonService.showLoader();
    this.irrigationService.searchIrrigations(this.companyId, page, this.pageSize).subscribe(data => {
      this.commonService.hideLoader();
      if (data != null) {
        let response: any = data;
        if (response.success) {
          this.irrigations = response.data;
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

  deleteIrrigation(irrigation: SearchIrrigationVM): void {

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
        this.irrigationService.deleteIrrigation(irrigation.ID_irrigation)
          .subscribe(data => {
            this.commonService.hideLoader();
            if (data != null) {
              let response: any = data;
              if (response.success) {
                //Track User Action.
                this.irrigationService.trackUserAction("delete", this.microapp.Master_Data, this.storageService.getUserProfileId(), irrigation.ID_irrigation, irrigation, irrigation)
                  .subscribe(res => {
                    this.irrigations = this.irrigations.filter(c => c !== irrigation);
                    this.getIrrigations(1);
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

  editIrrigation(irrigation: SearchIrrigationVM): void {
    this.router.navigate(['/edit-irrigation', irrigation.ID_irrigation]);
  };

  addIrrigation(): void {
    this.router.navigate(['/add-irrigation']);
  };

  viewIrrigation(irrigation: SearchIrrigationVM): void {
    this.router.navigate(['/view-irrigation', irrigation.ID_irrigation]);
  };

  getPage(page: number) {
    this.sortColumn = '';
    this.reverse = false;
    this.getIrrigations(page);
  }

}
