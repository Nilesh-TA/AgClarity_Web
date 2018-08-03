//@Packages
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";

//@Services
import { CommonService } from '../../services/common.service';
import { DictionaryService } from '../../services/dictionary.service';
import { LocationService } from '../../services/location.service';

//@Models
import { DictionaryVM } from '../../models/DictionaryVM';
import { LocationVM } from '../../models/LocationVM';

//@Constant
import { DICTIONARY } from '../../constant/dictionary';


@Component({
  selector: 'app-view-location',
  templateUrl: './view-location.component.html',
  styleUrls: ['./view-location.component.css']
})
export class ViewLocationComponent implements OnInit {

  constructor(private router: Router,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private fb: FormBuilder,
    public dictionary: DICTIONARY,
    public commonService: CommonService,
    public dictionaryService: DictionaryService,
    public locationService: LocationService) { }

  viewForm: FormGroup;

  location: LocationVM;
  ID_location: number;

  pageName: string = "Location";

  locationTypeList: DictionaryVM[] = [];

  ngOnInit() {
    this.location = new LocationVM();
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
      name: [this.location.name, Validators.required],
      type: [this.location.type, Validators.required],
      description: [this.location.description, Validators.required],
      address: [this.location.address],
      longitude: [this.location.longitude],
      latitude: [this.location.latitude],
      polygon_data: [this.location.polygon_data],
      size: [this.location.size],
      slope: [this.location.slope],
      aspect: [this.location.aspect],
      elevation: [this.location.elevation],
      soil_texture: [this.location.soil_texture],
      soil_depth: [this.location.soil_depth],
      water_depth: [this.location.water_depth],
      field_capacity: [this.location.field_capacity],
      mdp: [this.location.mdp],
      company: [this.location.company],
      related_to: [this.location.related_to],
    });
  }

  initializeFormValue() {

    this.commonService.showLoader();
    this.route.params.subscribe(params => { this.ID_location = +params['id']; });

    //Bind dropdown values    
    Promise.all(
      [
        this.getLocationType(),
        this.getLoctionDetail()
      ]).then((data: any) => {

        if (data != null) {
          let locationTypeResult = data[0];
          let locationResult = data[1];

          //Location Type
          if (locationTypeResult != null && locationTypeResult.success) {
            let locationTypeItems = locationTypeResult.data;
            if (locationTypeItems.success) {
              this.locationTypeList = locationTypeItems.data;
            }
          }

          //Location Detail
          if (locationResult != null && locationResult.success) {
            let locationInfo = locationResult.data;
            if (locationInfo.success) {
              this.location = locationInfo.data[0] as LocationVM;
              this.rebuildForm();
            }
          }

          this.commonService.hideLoader();
        }
      }).catch((error) => {
        this.commonService.hideLoader();
        console.error(error);
      });
  }

  getLocationType() {
    return new Promise((resolve, reject) => {
      this.dictionaryService.getDictionaryByCode(this.dictionary.Location_Type).subscribe(res => {
        resolve({ success: true, data: res });
      }, error => {
        resolve({ success: false, data: error });
      });
    });
  }

  getLoctionDetail() {
    return new Promise((resolve, reject) => {
      this.locationService.getLocationById(this.ID_location).subscribe(res => {
        resolve({ success: true, data: res });
      }, error => {
        resolve({ success: false, data: error });
      });
    });
  }

  backToList() {
    this.viewForm.reset();
    this.commonService.hideLoader();
    this.router.navigate(['list-location']);
  }

}
