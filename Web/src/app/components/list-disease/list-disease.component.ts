//@Packages
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { SweetAlertOptions } from 'sweetalert2';
import swal from 'sweetalert2'

//@Services
import { DiseaseService } from '../../services/disease.service';
import { CommonService } from '../../services/common.service';
import { StorageService } from '../../services/storage.service';

//@Models
import { SearchDiseaseVM } from '../../models/DiseaseVM';

//@Constant
import { MICROAPP } from '../../constant/microapp';

@Component({
  selector: 'app-list-disease',
  templateUrl: './list-disease.component.html',
  styleUrls: ['./list-disease.component.css']
})
export class ListDiseaseComponent implements OnInit {

  @Input('data') diseases: SearchDiseaseVM[] = [];
  pageNo: number = 1;
  pageSize: number = 3;
  totalItems: number = 0;

  companyId: number = 0;
  pageName: string = "Disease";
  userAccessRole: string = "";

  sortColumn: string = "";
  reverse: boolean = false;

  constructor(private router: Router,
    private toastr: ToastrService,
    public microapp: MICROAPP,
    public commonService: CommonService,
    public storageService: StorageService,
    public diseaseService: DiseaseService) { }

  ngOnInit() {
    this.companyId = this.storageService.getCompanyId();
    this.userAccessRole = this.storageService.getUserAccessRole();
    this.getDiseases(1);
  }

  sort(key) {
    this.sortColumn = key;
    this.reverse = !this.reverse;
  }

  getDiseases(page: number) {
    this.commonService.showLoader();
    this.diseaseService.searchDiseases(this.companyId, page, this.pageSize).subscribe(data => {
      this.commonService.hideLoader();
      if (data != null) {
        let response: any = data;
        if (response.success) {
          this.diseases = response.data;
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

  deleteDisease(disease: SearchDiseaseVM): void {

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
        this.diseaseService.deleteDisease(disease.ID_disease)
          .subscribe(data => {
            this.commonService.hideLoader();
            if (data != null) {
              let response: any = data;
              if (response.success) {                
                //Track User Action.
                this.diseaseService.trackUserAction("delete", this.microapp.ASD_Admin, this.storageService.getUserProfileId(), disease.ID_disease, disease, disease)
                  .subscribe(res => {
                    this.diseases = this.diseases.filter(c => c !== disease);
                    this.getDiseases(1);
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

  editDisease(disease: SearchDiseaseVM): void {
    this.router.navigate(['/edit-disease', disease.ID_disease]);
  };

  addDisease(): void {
    this.router.navigate(['/add-disease']);
  };

  viewDisease(disease: SearchDiseaseVM): void {
    this.router.navigate(['/view-disease', disease.ID_disease]);
  };

  getPage(page: number) {
    this.sortColumn = '';
    this.reverse = false;
    this.getDiseases(page);
  }
}
