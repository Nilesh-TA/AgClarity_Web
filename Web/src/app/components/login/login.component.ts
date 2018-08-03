//@Packages
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms/src/model';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

//@Model
import { UserVM } from '../../models/UserVM';

//@Services
import { AuthService } from '../../services/auth/auth.service';




@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loginUser: UserVM = new UserVM();

  constructor(private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private _authService: AuthService) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {

    const self = this;
    this._authService.login(this.loginUser).subscribe(data => {      
      if (data && data._body) {
        let response: any = JSON.parse(data._body);
        if (response != null) {
          if (response.success) {
            self._authService.setSession(response);
            this.router.navigate(['/list-user']);
          } else {
            this.toastr.error(response.message, "Error!", { timeOut: 3000, closeButton: true });
          }
        } else {
          this.toastr.error(response.message, "Error!", { timeOut: 3000, closeButton: true });
        }
      }
    }, error => {
      this.toastr.error(error.message, "Error!", { timeOut: 3000, closeButton: true });
    });
  }

}
