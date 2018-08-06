//@Packages
import { Component, OnInit, Input } from '@angular/core';
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { SweetAlertOptions } from 'sweetalert2';
import swal from 'sweetalert2'

//@Services
import { WaterSourceService } from '../../services/water-source.service';
import { CommonService } from '../../services/common.service';
import { StorageService } from '../../services/storage.service';

//@Models
import { SearchWaterSourceVM } from '../../models/WaterSourceVM';

//@Constant
import { MICROAPP } from '../../constant/microapp';

@Component({
  selector: 'app-list-water-source',
  templateUrl: './list-water-source.component.html',
  styleUrls: ['./list-water-source.component.css']
})
export class ListWaterSourceComponent implements OnInit {
  
  @Input('data') watersources: SearchWaterSourceVM[] = [];
  pageNo: number = 1;
  pageSize: number = 3;
  totalItems: number = 0;

  companyId: number = 0;
  pageName: string = "Water Source";
  userAccessRole: string = "";

  sortColumn: string = "";
  reverse: boolean = false;

  constructor(private router: Router,
    private toastr: ToastrService,
    public microapp: MICROAPP,
    public commonService: CommonService,
    public storageService: StorageService,
    public waterSourceService: WaterSourceService) { }

  ngOnInit() {
    this.companyId = this.storageService.getCompanyId();
    this.userAccessRole = this.storageService.getUserAccessRole();

    this.waterSourceService.watersourceFormData = null;
    this.waterSourceService.watersourceLocationFormData = null;
    this.waterSourceService.pageSource = null;    

    this.getWaterSources(1);
  }

  sort(key) {
    this.sortColumn = key;
    this.reverse = !this.reverse;
  }

  getWaterSources(page: number) {
    this.commonService.showLoader();
    this.waterSourceService.searchWaterSources(this.companyId, page, this.pageSize).subscribe(data => {
      this.commonService.hideLoader();
      if (data != null) {
        let response: any = data;
        if (response.success) {
          this.watersources = response.data;
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

  deleteWaterSource(watersource: SearchWaterSourceVM): void {

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
        this.waterSourceService.deleteWaterSource(watersource.ID_watersource)
          .subscribe(data => {
            this.commonService.hideLoader();
            if (data != null) {
              let response: any = data;
              if (response.success) {
                //Track User Action.
                this.waterSourceService.trackUserAction("delete", this.microapp.Master_Data, this.storageService.getUserProfileId(), watersource.ID_watersource, watersource, watersource)
                  .subscribe(res => {
                    this.watersources = this.watersources.filter(c => c !== watersource);
                    this.getWaterSources(1);
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

  editWaterSource(watersource: SearchWaterSourceVM): void {
    this.router.navigate(['/edit-watersource', watersource.ID_watersource]);
  };

  addWaterSource(): void {
    this.router.navigate(['/add-watersource']);
  };

  viewWaterSource(watersource: SearchWaterSourceVM): void {
    this.router.navigate(['/view-watersource', watersource.ID_watersource]);
  };

  getPage(page: number) {
    this.sortColumn = '';
    this.reverse = false;
    this.getWaterSources(page);
  }

}
