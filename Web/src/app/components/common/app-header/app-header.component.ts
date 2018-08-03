import { Component, OnInit } from '@angular/core';

//@Services
import { AuthService } from '../../../services/auth/auth.service';
import { StorageService } from '../../../services/storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.css']
})
export class AppHeaderComponent implements OnInit {

  username: string;
  constructor(private auth: AuthService,
    public storageService: StorageService) { }

  ngOnInit() {
    this.username = this.storageService.getUserName();
  }

  logout(){
    this.auth.logout();
  }

}
