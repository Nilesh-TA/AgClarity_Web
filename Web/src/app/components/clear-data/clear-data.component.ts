//@Packages
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

//@Services
import { StorageService } from '../../services/storage.service';
import { AuthService } from '../../services/auth/auth.service';


@Component({
  selector: 'app-clear-data',
  templateUrl: './clear-data.component.html',
  styleUrls: ['./clear-data.component.css']
})
export class ClearDataComponent implements OnInit {

  constructor(public router: Router,
    private toastr: ToastrService,
    public authSerive: AuthService,
    public storageService: StorageService) { }

  ngOnInit() {
  }

  clearLoginData(){
    this.storageService.clearCredentials();

    this.toastr.info("Login data cleared successfully.", "Info!", { timeOut: 3000, closeButton: true });

    this.redirectToHomePage(1500);
  }

  set_AgrisourceDataAdmin_LoginData(){
    this.authSerive.setDefaultLogin();
    this.toastr.success("Default login settings applied successfully. Now you can access master screens.", "Success!", { timeOut: 3000, closeButton: true });    

    this.redirectToHomePage();
  }

  set_Adminstrator_LoginData(){
    this.authSerive.setAdministratorLogin();
    this.toastr.success("Default adminstrator login settings applied successfully. Now you can access master screens.", "Success!", { timeOut: 3000, closeButton: true });    

    this.redirectToHomePage();
  }

  redirectToHomePage(timeOut = 1000){
    setTimeout(() => {
      window.location.href = "home";
    }, timeOut);
  }

}
