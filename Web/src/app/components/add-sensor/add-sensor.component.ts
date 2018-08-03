//@Packages
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { IMyDpOptions } from 'mydatepicker';

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
  selector: 'app-add-sensor',
  templateUrl: './add-sensor.component.html',
  styleUrls: ['./add-sensor.component.css']
})
export class AddSensorComponent implements OnInit {


  constructor(private router: Router,
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

  addForm: FormGroup;
  sensor: SensorVM;

  companyId: number = 0;

  pageName: string = "Sensor";

  sensorTypeList: DictionaryVM[] = [];
  manufacturerTypeList: DictionaryVM[] = [];

  public sensorFormErrors = {
    sensorid: '',
    name: '',
    type: '',
    manufacturer: '',
    model: '',
    version: '',    
    description: '',
    mac_address: '',
    chipset: '',
    status: '',
    first_install_date: '',
    last_install_date: '',
    calibration_date: '',
    last_service_date: '',
    battery_install_date: '',
    sensor_set_point: ''
  };

  private sensorValidationMessages = {
    sensorid: { 'required': 'Please enter sensor id.' },
    name: { 'required': 'Please enter name.' },
    type: { 'required': 'Please select sensor type.' }
  }

  public date_placeholder = "Select a date";

  public myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'dd/mm/yyyy',
    openSelectorOnInputClick: true,
    editableDateField: false,
  };

  ngOnInit() {
    this.sensor = new SensorVM();
    this.buildForm();
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

  buildForm() {
    this.sensor.type = "";
    this.sensor.manufacturer = "";
    this.sensor.status = 1;

    this.addForm = this.fb.group({
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
      first_install_date: [this.sensor.first_install_date],
      last_install_date: [this.sensor.last_install_date],
      calibration_date: [this.sensor.calibration_date],
      last_service_date: [this.sensor.last_service_date],
      battery_install_date: [this.sensor.battery_install_date],
      sensor_set_point: [this.sensor.sensor_set_point]
    });
    this.addForm.valueChanges.subscribe(data => this.onValueChanged(data));
  }

  onValueChanged(data?: any) {
    //Sensor Form Errors.    
    this.sensorFormErrors = this.errorService.displayValidationErrors(this.sensorValidationMessages, this.addForm, this.sensorFormErrors, false);
  }

  initializeFormValue() {

    this.commonService.showLoader();
    this.companyId = this.storageService.getCompanyId();

    //Bind dropdown values    
    Promise.all(
      [
        this.getSensorType(),
        this.getManufacturerType()
      ]).then((data: any) => {

        if (data != null) {
          let sensorTypeResult = data[0];
          let manufacturerTypeResult = data[1];

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

  onSubmit() {

    if (!this.addForm.valid) {
      this.sensorFormErrors = this.errorService.displayValidationErrors(this.sensorValidationMessages, this.addForm, this.sensorFormErrors, true);
      this.toastr.error("Please fill all the required field first", "Error!", { timeOut: 3000, closeButton: true });
      this.commonService.scrollToTop();
      return false;
    }

    let body = this.getBodyToPost(this.addForm.value);

    this.sensorService.createSensor(body).subscribe(data => {
      if (data != null) {
        if (data.success) {
          const insertedId = data.data.insertId;

          //Track User Action.
          this.sensorService.trackUserAction("add", this.microapp.ASD_Admin, this.storageService.getUserProfileId(), insertedId, body, body)
            .subscribe(res => {
              this.toastr.success("Sensor created successfully.", "Success!", { timeOut: 3000, closeButton: true });
              this.router.navigate(['list-sensor']);
            }, error => {
              this.toastr.error(error.message, "Error!", { timeOut: 3000, closeButton: true });
            });
        } else {
          if (typeof data.message === 'object') {
            this.toastr.error(JSON.stringify(data.message), "Error!", { timeOut: 3000, closeButton: true });
          } else {
            this.toastr.error(data.message, "Error!", { timeOut: 3000, closeButton: true });
          }
        }
      }
    }, error => {
      this.toastr.error(error.message, "Error!", { timeOut: 3000, closeButton: true });
    });
  }

  getBodyToPost(sensor) {

    let first_install_date = null;
    let last_install_date = null;
    let calibration_date = null;
    let last_service_date = null;
    let battery_install_date = null;
    let sensor_set_point = null;

    if (!this.commonService.isNullOrEmpty(sensor.first_install_date)) {
      first_install_date = this.commonService.parseDateToValidFormat(sensor.first_install_date.date.year, sensor.first_install_date.date.month, sensor.first_install_date.date.day);
    }

    if (!this.commonService.isNullOrEmpty(sensor.last_install_date)) {
      last_install_date = this.commonService.parseDateToValidFormat(sensor.last_install_date.date.year, sensor.last_install_date.date.month, sensor.last_install_date.date.day);
    }

    if (!this.commonService.isNullOrEmpty(sensor.calibration_date)) {
      calibration_date = this.commonService.parseDateToValidFormat(sensor.calibration_date.date.year, sensor.calibration_date.date.month, sensor.calibration_date.date.day);
    }

    if (!this.commonService.isNullOrEmpty(sensor.last_service_date)) {
      last_service_date = this.commonService.parseDateToValidFormat(sensor.last_service_date.date.year, sensor.last_service_date.date.month, sensor.last_service_date.date.day);
    }

    if (!this.commonService.isNullOrEmpty(sensor.battery_install_date)) {
      battery_install_date = this.commonService.parseDateToValidFormat(sensor.battery_install_date.date.year, sensor.battery_install_date.date.month, sensor.battery_install_date.date.day);
    }

    if (!this.commonService.isNullOrEmpty(sensor.sensor_set_point)) {
      sensor_set_point = this.commonService.parseDateToValidFormat(sensor.sensor_set_point.date.year, sensor.sensor_set_point.date.month, sensor.sensor_set_point.date.day);
    }

    let body: any = {
      sensorid: sensor.sensorid,
      name: sensor.name,
      type: sensor.type,
      manufacturer: sensor.manufacturer,
      model: sensor.model,
      version: sensor.version,
      description: sensor.description,
      mac_address: sensor.mac_address,
      chipset: sensor.chipset,
      status: sensor.status ? +sensor.status : 0,
      first_install_date: first_install_date,
      last_install_date: last_install_date,
      calibration_date: calibration_date,
      last_service_date: last_service_date,
      battery_install_date: battery_install_date,
      sensor_set_point: sensor_set_point,
      company: this.companyId
    }
    return body;
  }

  backToList() {
    this.addForm.reset();
    this.commonService.hideLoader();
    this.router.navigate(['list-sensor']);
  }


}
