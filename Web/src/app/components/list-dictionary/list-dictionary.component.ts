//@Packages
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { SweetAlertOptions } from 'sweetalert2';
import swal from 'sweetalert2'

//@Services
import { DictionaryService } from '../../services/dictionary.service';
import { CommonService } from '../../services/common.service';
import { StorageService } from '../../services/storage.service';

//@Models
import { SearchDictionaryVM } from '../../models/DictionaryVM';

//@Constant
import { MICROAPP } from '../../constant/microapp';

@Component({
  selector: 'app-list-dictionary',
  templateUrl: './list-dictionary.component.html',
  styleUrls: ['./list-dictionary.component.css']
})
export class ListDictionaryComponent implements OnInit {

  @Input('data') dictionaries: SearchDictionaryVM[] = [];
  pageNo: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;

  companyId: number = 0;
  pageName: string = "Dictionary";
  userAccessRole: string = "";

  sortColumn: string = "";
  reverse: boolean = false;

  constructor(private router: Router,
    private toastr: ToastrService,
    public microapp: MICROAPP,
    public commonService: CommonService,
    public storageService: StorageService,
    public dictionaryService: DictionaryService) { }

  ngOnInit() {
    this.companyId = this.storageService.getCompanyId();
    this.userAccessRole = this.storageService.getUserAccessRole();
    this.getDictionaries(1);
  }

  sort(key) {
    this.sortColumn = key;
    this.reverse = !this.reverse;
  }

  getDictionaries(page: number) {
    this.commonService.showLoader();
    this.dictionaryService.searchDictionary(page, this.pageSize).subscribe(data => {
      this.commonService.hideLoader();
      if (data != null) {
        let response: any = data;
        if (response.success) {
          this.dictionaries = response.data;
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

  deleteDictionary(dictionary: SearchDictionaryVM): void {

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
        this.dictionaryService.deleteDictionary(dictionary.ID_dictionary)
          .subscribe(data => {
            this.commonService.hideLoader();
            if (data != null) {
              let response: any = data;
              if (response.success) {                
                //Track User Action.
                this.dictionaryService.trackUserAction("delete", this.microapp.ASD_Admin, this.storageService.getUserProfileId(), dictionary.ID_dictionary, dictionary, dictionary)
                  .subscribe(res => {
                    this.dictionaries = this.dictionaries.filter(c => c !== dictionary);
                    this.getDictionaries(1);
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

  editDictionary(dictionary: SearchDictionaryVM): void {
    this.router.navigate(['/edit-dictionary', dictionary.ID_dictionary]);
  };

  addDictionary(): void {
    this.router.navigate(['/add-dictionary']);
  };

  viewDictionary(dictionary: SearchDictionaryVM): void {
    this.router.navigate(['/view-dictionary', dictionary.ID_dictionary]);
  };

  getPage(page: number) {
    this.sortColumn = '';
    this.reverse = false;
    this.getDictionaries(page);
  }

}
