//@Packages
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { SweetAlertOptions } from 'sweetalert2';
import swal from 'sweetalert2'

//@Services
import { LocationService } from '../../services/location.service';
import { CommonService } from '../../services/common.service';
import { StorageService } from '../../services/storage.service';

//@Models
import { SearchLocationVM } from '../../models/LocationVM';

//@Constant
import { MICROAPP } from '../../constant/microapp';


@Component({
  selector: 'app-list-location',
  templateUrl: './list-location.component.html',
  styleUrls: ['./list-location.component.css']
})
export class ListLocationComponent implements OnInit {

  @Input('data') locations: SearchLocationVM[] = [];
  pageNo: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;

  companyId: number = 0;
  pageName: string = "Location";
  userAccessRole: string = "";

  sortColumn: string = "";
  reverse: boolean = false;

  constructor(private router: Router,
    private toastr: ToastrService,
    public microapp: MICROAPP,
    public commonService: CommonService,
    public storageService: StorageService,
    public locationService: LocationService) { }

  ngOnInit() {
    this.companyId = this.storageService.getCompanyId();
    this.userAccessRole = this.storageService.getUserAccessRole();
    this.getLocations(1);
  }

  sort(key) {
    this.sortColumn = key;
    this.reverse = !this.reverse;
  }

  getLocations(page: number) {
    this.commonService.showLoader();
    this.locationService.searchLocations(this.companyId, page, this.pageSize).subscribe(data => {
      this.commonService.hideLoader();
      if (data != null) {
        let response: any = data;
        if (response.success) {
          this.locations = response.data;
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

  deleteLocation(location: SearchLocationVM): void {

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
        this.locationService.deleteLocation(location.ID_location)
          .subscribe(data => {
            this.commonService.hideLoader();
            if (data != null) {
              let response: any = data;
              if (response.success) {                
                //Track User Action.
                this.locationService.trackUserAction("delete", this.microapp.Master_Data, this.storageService.getUserProfileId(), location.ID_location, location, location)
                  .subscribe(res => {
                    this.locations = this.locations.filter(c => c !== location);
                    this.getLocations(1);
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

  editLocation(location: SearchLocationVM): void {
    this.router.navigate(['/edit-location', location.ID_location]);
  };

  addLocation(): void {
    this.router.navigate(['/add-location']);
  };

  viewLocation(location: SearchLocationVM): void {
    this.router.navigate(['/view-location', location.ID_location]);
  };

  getPage(page: number) {
    this.sortColumn = '';
    this.reverse = false;
    this.getLocations(page);
  }

}
