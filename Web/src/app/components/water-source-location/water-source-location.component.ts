//@Packages
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ToastrService } from 'ngx-toastr';

//@Services
import { CommonService } from '../../services/common.service';
import { ErrorService } from '../../services/error.service';
import { DictionaryService } from '../../services/dictionary.service';
import { WaterSourceService } from '../../services/water-source.service';
import { LocationService } from '../../services/location.service';
import { StorageService } from '../../services/storage.service';

//@Models
import { WaterSourceLocationVM, PayLoadWaterSourceLocation } from '../../models/WaterSourceLocationVM';
import { LocationVM } from '../../models/LocationVM';

//@Constant
import { DICTIONARY } from '../../constant/dictionary';
import { MICROAPP } from '../../constant/microapp';
import { REGEXP } from '../../constant/regexp';

@Component({
  selector: 'app-water-source-location',
  templateUrl: './water-source-location.component.html',
  styleUrls: ['./water-source-location.component.css']
})
export class WaterSourceLocationComponent implements OnInit {

  watersourceLocationForm: FormGroup;
  pageName: string = "WaterSource Location";

  oldWaterSourceLocation: WaterSourceLocationVM[] = [];

  ID_watersource?: number;
  companyId?: number;
  action: string;
  watersourceName: string = "";

  availableItems: any[] = [];
  selectedItems: any[] = [];

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
    public waterSourceService: WaterSourceService,
    public dictionaryService: DictionaryService,
    public locationService: LocationService) {

    this.route.queryParams.subscribe(params => {
      this.ID_watersource = !this.commonService.isNullOrEmpty(params["id"]) ? +params["id"] : 0;
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
    this.watersourceLocationForm = this.fb.group({
      availableItems: [this.availableItems],
      selectedItems: [this.selectedItems]
    });
  }

  initializeFormValue() {
    this.commonService.showLoader();

    if (this.waterSourceService.watersourceFormData != null) {
      this.watersourceName = this.waterSourceService.watersourceFormData.name;
    }

    //Bind dropdown values    
    Promise.all(
      [
        this.getWaterSourceLocations(this.ID_watersource),
        this.getAvailableLocation(this.companyId)
      ]).then((data: any) => {

        if (data != null) {
          let watersourceLocationResult = data[0];
          let availableLocationResult = data[1];

          //WaterSource-Location Detail
          if (watersourceLocationResult != null && watersourceLocationResult.success) {
            let watersourceLocationItems = watersourceLocationResult.data;
            if (watersourceLocationItems.success) {
              const watersourceLocations = watersourceLocationItems.data as WaterSourceLocationVM[];

              if (watersourceLocations != null && watersourceLocations.length > 0) {
                watersourceLocations.forEach(element => {

                  let location = {
                    ID_location: element.location,
                    name: element.location_name,
                  }
                  this.SelectedList.push(location);

                  let watersourceLocation = {
                    ID_watersource_location: element.ID_watersource_location,
                    watersource: element.watersource,
                    location: element.location,
                    location_name: element.location_name
                  }
                  this.oldWaterSourceLocation.push(watersourceLocation);

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

          this.availableItems = [];
          this.selectedItems = [];

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

  getWaterSourceLocations(watersourceId) {
    return new Promise((resolve, reject) => {
      this.waterSourceService.getWatersourceLocationByWaterSourceId(watersourceId).subscribe(res => {
        resolve({ success: true, data: res });
      }, error => {
        resolve({ success: false, data: error });
      });
    });
  }

  setSelectedItems() {
    const availableItems = this.availableItems;

    if (this.commonService.isNullOrEmpty(availableItems)) {
      this.toastr.error("Please select at least one item from available list.", "Error!", { timeOut: 3000, closeButton: true });
      return false;
    }

    //move selected
    availableItems.forEach(element => {
      this.SelectedList.push(element);
    });

    //remove the ones that were moved.
    availableItems.forEach(element => {
      for (let i = this.AvailableList.length - 1; i >= 0; i--) {
        if (this.AvailableList[i].ID_location == element.ID_location) {
          this.AvailableList.splice(i, 1);
        }
      }
    });

    this.availableItems = [];
  }

  setAvailableItems() {
    const selectedItems = this.selectedItems;

    if (this.commonService.isNullOrEmpty(selectedItems)) {
      this.toastr.error("Please select at least one item from locations list.", "Error!", { timeOut: 3000, closeButton: true });
      return false;
    }

    //move selected
    selectedItems.forEach(element => {
      this.AvailableList.push(element);
    });

    //remove the ones that were moved from the source container.
    selectedItems.forEach(element => {
      for (let i = this.SelectedList.length - 1; i >= 0; i--) {
        if (this.SelectedList[i].ID_location == element.ID_location) {
          this.SelectedList.splice(i, 1);
        }
      }
    });

    this.selectedItems = [];
  }


  onSubmit() {
    this.commonService.hideLoader();

    let watersourceLocationFormData = this.prepareBodyToPost();

    this.waterSourceService.watersourceLocationFormData = watersourceLocationFormData;

    if (this.action == "add") {
      this.router.navigate(['/add-watersource']);
    }
    else if (this.action == "edit") {
      this.router.navigate(['/edit-watersource', this.ID_watersource]);
    } else {
      this.router.navigate(['']);
    }
  }

  prepareBodyToPost() {    
    let bodyToPost = new PayLoadWaterSourceLocation();
    bodyToPost.add = [];
    bodyToPost.delete = [];
    bodyToPost.update = {
      old: [],
      new: []
    }
    bodyToPost.microapp_name = this.microapp.Master_Data;
    bodyToPost.userid = this.storageService.getUserProfileId();


    //Find location which are removed.
    for (let i = 0; i < this.oldWaterSourceLocation.length; i++) {
      const location = this.oldWaterSourceLocation[i].location;

      let item = this.SelectedList.find(i => i.ID_location === location);

      const exist = item ? true : false;

      if (!exist) {
        bodyToPost.delete.push(this.oldWaterSourceLocation[i].ID_watersource_location);
      }
    }

    if (this.SelectedList != null && this.SelectedList.length > 0) {
      for (let i = 0; i < this.SelectedList.length; i++) {

        const ID_location = this.SelectedList[i].ID_location;
        const location_name = this.SelectedList[i].name;

        //Existing watersource location.
        const watersourcelocation_detail = this.oldWaterSourceLocation.find(i => i.location === ID_location);

        if (!watersourcelocation_detail) {
          //Create watersource location.
          let body = this.getBodyToPost(0, ID_location, location_name);

          bodyToPost.add.push(body);
        }
      }
    }

    return bodyToPost;
  }

  getBodyToPost(id, locationId, name) {
    let body: any = {
      ID_watersource_location: id,
      watersource: this.ID_watersource,
      location: locationId,
      location_name: name
    }
    return body;
  }

  backToWaterSource() {
    this.commonService.hideLoader();

    if (this.action == "add") {
      this.waterSourceService.watersourceLocationFormData = null;
      this.router.navigate(['/add-watersource']);
    }
    else if (this.action == "edit") {
      this.router.navigate(['/edit-watersource', this.ID_watersource]);
    } else {
      this.router.navigate(['']);
    }
  }

}
