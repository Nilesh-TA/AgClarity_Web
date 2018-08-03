//@Packages
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { SweetAlertOptions } from 'sweetalert2';
import swal from 'sweetalert2'

//@Services
import { ChemicalService } from '../../services/chemical.service';
import { CommonService } from '../../services/common.service';
import { StorageService } from '../../services/storage.service';

//@Models
import { SearchChemicalVM } from '../../models/ChemicalVM';

//@Constant
import { MICROAPP } from '../../constant/microapp';

@Component({
  selector: 'app-list-chemical',
  templateUrl: './list-chemical.component.html',
  styleUrls: ['./list-chemical.component.css']
})
export class ListChemicalComponent implements OnInit {

  @Input('data') chemicals: SearchChemicalVM[] = [];
  pageNo: number = 1;
  pageSize: number = 3;
  totalItems: number = 0;

  companyId: number = 0;
  pageName: string = "Chemical";
  userAccessRole: string = "";

  sortColumn: string = "";
  reverse: boolean = false;

  constructor(private router: Router,
    private toastr: ToastrService,
    public microapp: MICROAPP,
    public commonService: CommonService,
    public storageService: StorageService,
    public chemicalService: ChemicalService) { }

  ngOnInit() {
    this.companyId = this.storageService.getCompanyId();
    this.userAccessRole = this.storageService.getUserAccessRole();
    this.getChemicals(1);
  }

  sort(key) {
    this.sortColumn = key;
    this.reverse = !this.reverse;
  }

  getChemicals(page: number) {
    this.commonService.showLoader();
    this.chemicalService.searchChemicals(this.companyId, page, this.pageSize).subscribe(data => {
      this.commonService.hideLoader();
      if (data != null) {
        let response: any = data;
        if (response.success) {
          this.chemicals = response.data;
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

  deleteChemical(chemical: SearchChemicalVM): void {

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
        this.chemicalService.deleteChemical(chemical.ID_chemical)
          .subscribe(data => {
            this.commonService.hideLoader();
            if (data != null) {
              let response: any = data;
              if (response.success) {

                //Track User Action.
                this.chemicalService.trackUserAction("delete", this.microapp.ASD_Admin, this.storageService.getUserProfileId(), chemical.ID_chemical, chemical, chemical)
                  .subscribe(res => {
                    this.chemicals = this.chemicals.filter(c => c !== chemical);
                    this.getChemicals(1);
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

  editChemical(chemical: SearchChemicalVM): void {
    this.router.navigate(['/edit-chemical', chemical.ID_chemical]);
  };

  addChemical(): void {
    this.router.navigate(['/add-chemical']);
  };

  viewChemical(chemical: SearchChemicalVM): void {
    this.router.navigate(['/view-chemical', chemical.ID_chemical]);
  };

  getPage(page: number) {
    this.sortColumn = '';
    this.reverse = false;
    this.getChemicals(page);
  }
}
