//@Packages
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { SweetAlertOptions } from 'sweetalert2';
import swal from 'sweetalert2'

//@Services
import { SensorService } from '../../services/sensor.service';
import { CommonService } from '../../services/common.service';
import { StorageService } from '../../services/storage.service';

//@Models
import { SearchSensorVM } from '../../models/SensorVM';

//@Constant
import { MICROAPP } from '../../constant/microapp';


@Component({
  selector: 'app-list-sensor',
  templateUrl: './list-sensor.component.html',
  styleUrls: ['./list-sensor.component.css']
})
export class ListSensorComponent implements OnInit {
  @Input('data') sensors: SearchSensorVM[] = [];
  pageNo: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;

  companyId: number = 0;
  pageName: string = "Sensor";
  userAccessRole: string = "";

  sortColumn: string = "";
  reverse: boolean = false;
  constructor(private router: Router,
    private toastr: ToastrService,
    public microapp: MICROAPP,
    public commonService: CommonService,
    public storageService: StorageService,
    public sensorService: SensorService) { }

  ngOnInit() {
    this.companyId = this.storageService.getCompanyId();
    this.userAccessRole = this.storageService.getUserAccessRole();
    this.getSensors(1);
  }

  sort(key) {
    this.sortColumn = key;
    this.reverse = !this.reverse;
  }

  getSensors(page: number) {
    this.commonService.showLoader();
    this.sensorService.searchSensors(this.companyId, page, this.pageSize).subscribe(data => {
      this.commonService.hideLoader();
      if (data != null) {
        let response: any = data;
        if (response.success) {
          this.sensors = response.data;
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

  deleteSensor(sensor: SearchSensorVM): void {

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
        this.sensorService.deleteSensor(sensor.ID_sensor)
          .subscribe(data => {
            this.commonService.hideLoader();
            if (data != null) {
              let response: any = data;
              if (response.success) {
                //Track User Action.
                this.sensorService.trackUserAction("delete", this.microapp.ASD_Admin, this.storageService.getUserProfileId(), sensor.ID_sensor, sensor, sensor)
                  .subscribe(res => {
                    this.sensors = this.sensors.filter(c => c !== sensor);
                    this.getSensors(1);
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

  editSensor(sensor: SearchSensorVM): void {
    this.router.navigate(['/edit-sensor', sensor.ID_sensor]);
  };

  addSensor(): void {
    this.router.navigate(['/add-sensor']);
  };

  viewSensor(sensor: SearchSensorVM): void {
    this.router.navigate(['/view-sensor', sensor.ID_sensor]);
  };

  getPage(page: number) {
    this.sortColumn = '';
    this.reverse = false;
    this.getSensors(page);
  }

}
