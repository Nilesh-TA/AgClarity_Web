//@Packages
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { SweetAlertOptions } from 'sweetalert2';
import swal from 'sweetalert2'

//@Services
import { CropService } from '../../services/crop.service';
import { CommonService } from '../../services/common.service';
import { StorageService } from '../../services/storage.service';

//@Models
import { SearchCropVM } from '../../models/CropVM';

//@Constants
import { MICROAPP } from '../../constant/microapp';

@Component({
  selector: 'app-list-crop',
  templateUrl: './list-crop.component.html',
  styleUrls: ['./list-crop.component.css']
})
export class ListCropComponent implements OnInit {
  @Input('data') crops: SearchCropVM[] = [];
  pageNo: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;

  companyId: number = 0;
  pageName: string = "Crop";
  userAccessRole: string = "";

  sortColumn: string = "";
  reverse: boolean = false;

  constructor(private router: Router,
    private toastr: ToastrService,
    public microapp: MICROAPP,
    public commonService: CommonService,
    public storageService: StorageService,
    public cropService: CropService) { }

  ngOnInit() {
    this.companyId = this.storageService.getCompanyId();
    this.userAccessRole = this.storageService.getUserAccessRole();
    this.getCrops(1);
  }

  sort(key) {
    this.sortColumn = key;
    this.reverse = !this.reverse;
  }

  getCrops(page: number) {
    this.commonService.showLoader();
    this.cropService.searchCrops(this.companyId, page, this.pageSize).subscribe(data => {
      this.commonService.hideLoader();
      if (data != null) {
        let response: any = data;
        if (response.success) {
          this.crops = response.data;
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

  deleteCrop(crop: SearchCropVM): void {

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
        this.cropService.deleteCrop(crop.ID_crop)
          .subscribe(data => {
            this.commonService.hideLoader();
            if (data != null) {
              let response: any = data;
              if (response.success) {

                //Track User Action.
                this.cropService.trackUserAction("delete", this.microapp.ASD_Admin, this.storageService.getUserProfileId(), crop.ID_crop, crop, crop)
                  .subscribe(res => {
                    this.crops = this.crops.filter(c => c !== crop);
                    this.getCrops(1);
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

  editCrop(crop: SearchCropVM): void {
    this.router.navigate(['/edit-crop', crop.ID_crop]);
  };

  addCrop(): void {
    this.router.navigate(['/add-crop']);
  };

  viewCrop(crop: SearchCropVM): void {
    this.router.navigate(['/view-crop', crop.ID_crop]);
  };

  getPage(page: number) {
    this.sortColumn = '';
    this.reverse = false;
    this.getCrops(page);
  }

}
