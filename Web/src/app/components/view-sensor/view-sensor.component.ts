//@Packages
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { IMyDpOptions } from 'mydatepicker';
import * as moment from 'moment';

//@Services
import { CommonService } from '../../services/common.service';
import { ErrorService } from '../../services/error.service';
import { DictionaryService } from '../../services/dictionary.service';
import { SensorService } from '../../services/sensor.service';
import { StorageService } from '../../services/storage.service';


//@Models
import { DictionaryVM } from '../../models/DictionaryVM';
import { SensorVM } from '../../models/SensorVM';

//@Constant
import { DICTIONARY } from '../../constant/dictionary';
import { MICROAPP } from '../../constant/microapp';

@Component({
  selector: 'app-view-sensor',
  templateUrl: './view-sensor.component.html',
  styleUrls: ['./view-sensor.component.css']
})
export class ViewSensorComponent implements OnInit {

  constructor(private router: Router,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private toastr: ToastrService,
    public dictionary: DICTIONARY,
    public microapp: MICROAPP,
    public commonService: CommonService,
    public storageService: StorageService,
    public errorService: ErrorService,
    public dictionaryService: DictionaryService,
    public sensorService: SensorService) { }

  viewForm: FormGroup;
  sensor: SensorVM;
  ID_sensor: number;

  pageName: string = "Sensor";

  sensorTypeList: DictionaryVM[] = [];
  manufacturerTypeList: DictionaryVM[] = [];

  public date_placeholder = "Select a date";

  public myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'dd/mm/yyyy',
    openSelectorOnInputClick: true,
    editableDateField: false,
  };

  ngOnInit() {
    this.sensor = new SensorVM();
    this.rebuildForm();
    this.initializeFormValue();
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

  rebuildForm() {

    this.viewForm = this.fb.group({
      sensorid: [this.sensor.sensorid, Validators.required],
      name: [this.sensor.name, Validators.required],
      type: [this.sensor.type, Validators.required],
      manufacturer: [this.sensor.manufacturer],
      model: [this.sensor.model],
      version: [this.sensor.version],
      description: [this.sensor.description],
      mac_address: [this.sensor.mac_address],
      chipset: [this.sensor.chipset],
      status: [this.sensor.status],
      first_install_date: [null],
      last_install_date: [null],
      calibration_date: [null],
      last_service_date: [null],
      battery_install_date: [null],
      sensor_set_point: [null]
    });
  }

  initializeFormValue() {

    this.commonService.showLoader();
    this.route.params.subscribe(params => { this.ID_sensor = +params['id']; });

    //Bind dropdown values    
    Promise.all(
      [
        this.getSensorType(),
        this.getManufacturerType(),
        this.getSensorDetail()
      ]).then((data: any) => {

        if (data != null) {
          let sensorTypeResult = data[0];
          let manufacturerTypeResult = data[1];
          let sensorResult = data[2];

          //Sensor Type
          if (sensorTypeResult != null && sensorTypeResult.success) {
            let sensorTypeItems = sensorTypeResult.data;
            if (sensorTypeItems.success) {
              this.sensorTypeList = sensorTypeItems.data;
            }
          }

          //Manufacturer Type
          if (manufacturerTypeResult != null && manufacturerTypeResult.success) {
            let manufacturerTypeItems = manufacturerTypeResult.data;
            if (manufacturerTypeItems.success) {
              this.manufacturerTypeList = manufacturerTypeItems.data;
            }
          }

          //Sensor Detail
          if (sensorResult != null && sensorResult.success) {
            let sensorInfo = sensorResult.data;
            if (sensorInfo.success) {
              this.sensor = sensorInfo.data[0] as SensorVM;
              this.rebuildForm();

              if (this.sensor.first_install_date) {
                let first_install_date = this.commonService.parseToIMyDate(this.sensor.first_install_date);
                this.viewForm.patchValue({
                  first_install_date: first_install_date
                })
              }
              
              if (this.sensor.last_install_date) {
                let last_install_date = this.commonService.parseToIMyDate(this.sensor.last_install_date);
                this.viewForm.patchValue({
                  last_install_date: last_install_date
                })
              }

              if (this.sensor.calibration_date) {
                let calibration_date = this.commonService.parseToIMyDate(this.sensor.calibration_date);
                this.viewForm.patchValue({
                  calibration_date: calibration_date
                })
              }

              if (this.sensor.last_service_date) {
                let last_service_date = this.commonService.parseToIMyDate(this.sensor.last_service_date);
                this.viewForm.patchValue({
                  last_service_date: last_service_date
                })
              }

              if (this.sensor.battery_install_date) {
                let battery_install_date = this.commonService.parseToIMyDate(this.sensor.battery_install_date);
                this.viewForm.patchValue({
                  battery_install_date: battery_install_date
                })
              }

              if (this.sensor.sensor_set_point) {
                let sensor_set_point = this.commonService.parseToIMyDate(this.sensor.sensor_set_point);
                this.viewForm.patchValue({
                  sensor_set_point: sensor_set_point
                })
              }

            }
          }


          this.commonService.hideLoader();
        }
      }).catch((error) => {
        this.commonService.hideLoader();
        console.error(error);
      });
  }

  getSensorType() {
    return new Promise((resolve, reject) => {
      this.dictionaryService.getDictionaryByCode(this.dictionary.Sensor_Type).subscribe(res => {
        resolve({ success: true, data: res });
      }, error => {
        resolve({ success: false, data: error });
      });
    });
  }

  getManufacturerType() {
    return new Promise((resolve, reject) => {
      this.dictionaryService.getDictionaryByCode(this.dictionary.Manufacturer).subscribe(res => {
        resolve({ success: true, data: res });
      }, error => {
        resolve({ success: false, data: error });
      });
    });
  }

  getSensorDetail() {
    return new Promise((resolve, reject) => {
      this.sensorService.getSensorById(this.ID_sensor).subscribe(res => {
        resolve({ success: true, data: res });
      }, error => {
        resolve({ success: false, data: error });
      });
    });
  }

  backToList() {
    this.viewForm.reset();
    this.commonService.hideLoader();
    this.router.navigate(['list-sensor']);
  }
}
