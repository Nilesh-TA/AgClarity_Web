import { Component } from '@angular/core';
import { StorageService } from './services/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(private storageService: StorageService,){
    //console.log("App Component Called");
    //this.storageService.clearCompanySelection();
  }
}
