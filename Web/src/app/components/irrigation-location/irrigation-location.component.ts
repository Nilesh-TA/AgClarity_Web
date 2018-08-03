//@Packages
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ToastrService } from 'ngx-toastr';

//@Services
import { CommonService } from '../../services/common.service';
import { ErrorService } from '../../services/error.service';
import { DictionaryService } from '../../services/dictionary.service';
import { IrrigationService } from '../../services/irrigation.service';
import { LocationService } from '../../services/location.service';
import { StorageService } from '../../services/storage.service';

//@Models
import { IrrigationLocationVM, PayLoadIrrigationLocation } from '../../models/IrrigationLocationVM';
import { LocationVM } from '../../models/LocationVM';

//@Constant
import { DICTIONARY } from '../../constant/dictionary';
import { MICROAPP } from '../../constant/microapp';
import { REGEXP } from '../../constant/regexp';

@Component({
  selector: 'app-irrigation-location',
  templateUrl: './irrigation-location.component.html',
  styleUrls: ['./irrigation-location.component.css']
})
export class IrrigationLocationComponent implements OnInit {

  irrigationLocationForm: FormGroup;
  pageName: string = "Irrigation Location";

  oldIrrigationLocation: IrrigationLocationVM[] = [];

  ID_irrigation?: number;
  companyId?: number;
  action: string;
  irrigationName: string = "";

  selectedAvailableItems: any[] = [];
  selectedLocationItems: any[] = [];

  SelectedList = [];
  AvailableList = [];

  constructor(private router: Router,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private toastr: ToastrService,
    public dictionary: DICTIONARY,
    public microapp: MICROAPP,
    public regexp: REGEXP,
    public commonService: CommonService,
    public storageService: StorageService,
    public errorService: ErrorService,
    public irrigationService: IrrigationService,
    public dictionaryService: DictionaryService,
    public locationService: LocationService) {

    this.route.queryParams.subscribe(params => {
      this.ID_irrigation = !this.commonService.isNullOrEmpty(params["id"]) ? +params["id"] : 0;
      this.companyId = !this.commonService.isNullOrEmpty(params["company"]) ? +params["company"] : 0;
      this.action = params["action"];
    });

  }

  ngOnInit() {
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
    this.irrigationLocationForm = this.fb.group({
      selectedAvailableItems: [this.selectedAvailableItems],
      selectedLocationItems: [this.selectedLocationItems]
    });
  }

  initializeFormValue() {
    this.commonService.showLoader();

    if (this.irrigationService.irrigationFormData != null) {
      this.irrigationName = this.irrigationService.irrigationFormData.name;
    }

    //Bind dropdown values    
    Promise.all(
      [
        this.getIrrigationLocations(this.ID_irrigation),
        this.getAvailableLocation(this.companyId)
      ]).then((data: any) => {

        if (data != null) {
          let irrigationLocationResult = data[0];
          let availableLocationResult = data[1];

          //Irrigation-Location Detail
          if (irrigationLocationResult != null && irrigationLocationResult.success) {
            let irrigationLocationItems = irrigationLocationResult.data;
            if (irrigationLocationItems.success) {
              const irrigationLocations = irrigationLocationItems.data as IrrigationLocationVM[];

              if (irrigationLocations != null && irrigationLocations.length > 0) {
                irrigationLocations.forEach(element => {

                  let location = {
                    ID_location: element.location,
                    name: element.location_name,
                  }
                  this.SelectedList.push(location);

                  let irrigationLocation = {
                    ID_irrigation_location: element.ID_irrigation_location,
                    irrigation: element.irrigation,
                    location: element.location,
                    location_name: element.location_name
                  }
                  this.oldIrrigationLocation.push(irrigationLocation);

                });

                this.rebuildForm();
              }
            }
          }

          //Available Locations
          if (availableLocationResult != null && availableLocationResult.success) {
            let locationItems = availableLocationResult.data;
            if (locationItems.success) {
              const locations = locationItems.data as LocationVM[];

              locations.forEach(element => {
                const existInSelectedList = this.SelectedList.find(i => i.ID_location === element.ID_location);

                if (!existInSelectedList) {
                  let location = {
                    ID_location: element.ID_location,
                    name: !this.commonService.isNullOrEmpty(element.description) ? (element.name + ", " + element.description) : element.name,
                  }
                  this.AvailableList.push(location);
                }
              });
            }
          }

          this.selectedAvailableItems = [];
          this.selectedLocationItems = [];

          this.commonService.hideLoader();
        }
      }).catch((error) => {
        this.commonService.hideLoader();
        console.error(error);
      });
  }

  getAvailableLocation(companyId) {
    return new Promise((resolve, reject) => {
      this.locationService.getLocationByCompany(companyId).subscribe(res => {
        resolve({ success: true, data: res });
      }, error => {
        resolve({ success: false, data: error });
      });
    });
  }

  getIrrigationLocations(irrigationId) {
    return new Promise((resolve, reject) => {
      this.irrigationService.getIrrigationLocationByIrrigationId(irrigationId).subscribe(res => {
        resolve({ success: true, data: res });
      }, error => {
        resolve({ success: false, data: error });
      });
    });
  }

  setSelectedItems() {
    const selectedAvailableItems = this.selectedAvailableItems;

    if (this.commonService.isNullOrEmpty(selectedAvailableItems)) {
      this.toastr.error("Please select at least one item from available list.", "Error!", { timeOut: 3000, closeButton: true });
      return false;
    }

    //move selected
    selectedAvailableItems.forEach(element => {
      this.SelectedList.push(element);
    });

    //remove the ones that were moved.
    selectedAvailableItems.forEach(element => {
      for (let i = this.AvailableList.length - 1; i >= 0; i--) {
        if (this.AvailableList[i].ID_location == element.ID_location) {
          this.AvailableList.splice(i, 1);
        }
      }
    });

    this.selectedAvailableItems = [];
  }

  setAvailableItems() {
    const selectedLocationItems = this.selectedLocationItems;

    if (this.commonService.isNullOrEmpty(selectedLocationItems)) {
      this.toastr.error("Please select at least one item from locations list.", "Error!", { timeOut: 3000, closeButton: true });
      return false;
    }

    //move selected
    selectedLocationItems.forEach(element => {
      this.AvailableList.push(element);
    });

    //remove the ones that were moved from the source container.
    selectedLocationItems.forEach(element => {
      for (let i = this.SelectedList.length - 1; i >= 0; i--) {
        if (this.SelectedList[i].ID_location == element.ID_location) {
          this.SelectedList.splice(i, 1);
        }
      }
    });

    this.selectedLocationItems = [];
  }


  onSubmit() {
    this.commonService.hideLoader();

    let irrigationLocationFormData = this.prepareBodyToPost();

    this.irrigationService.irrigationLocationFormData = irrigationLocationFormData;

    if (this.action == "add") {
      this.router.navigate(['/add-irrigation']);
    }
    else if (this.action == "edit") {
      this.router.navigate(['/edit-irrigation', this.ID_irrigation]);
    } else {
      this.router.navigate(['']);
    }
  }

  prepareBodyToPost() {
    let bodyToPost = new PayLoadIrrigationLocation();
    bodyToPost.add = [];
    bodyToPost.delete = [];
    bodyToPost.update = {
      old: [],
      new: []
    }
    bodyToPost.microapp_name = this.microapp.Master_Data;
    bodyToPost.userid = this.storageService.getUserProfileId();


    //Find location which are removed.
    for (let i = 0; i < this.oldIrrigationLocation.length; i++) {
      const location = this.oldIrrigationLocation[i].location;

      let item = this.SelectedList.find(i => i.ID_location === location);

      const exist = item ? true : false;

      if (!exist) {
        bodyToPost.delete.push(this.oldIrrigationLocation[i].ID_irrigation_location);
      }
    }

    if (this.SelectedList != null && this.SelectedList.length > 0) {
      for (let i = 0; i < this.SelectedList.length; i++) {

        const ID_location = this.SelectedList[i].ID_location;
        const location_name = this.SelectedList[i].name;

        //Existing irrigation location.
        const irrigationlocation_detail = this.oldIrrigationLocation.find(i => i.location === ID_location);

        if (!irrigationlocation_detail) {
          //Create irrigation location.
          let body = this.getBodyToPost(0, ID_location, location_name);

          bodyToPost.add.push(body);
        }
      }
    }

    return bodyToPost;
  }

  getBodyToPost(id, locationId, name) {
    let body: any = {
      ID_irrigation_location: id,
      irrigation: this.ID_irrigation,
      location: locationId,
      location_name: name
    }
    return body;
  }

  backToContactProfile() {
    this.commonService.hideLoader();

    if (this.action == "add") {
      this.irrigationService.irrigationLocationFormData = null;
      this.router.navigate(['/add-irrigation']);
    }
    else if (this.action == "edit") {
      this.router.navigate(['/edit-irrigation', this.ID_irrigation]);
    } else {
      this.router.navigate(['']);
    }
  }

}
