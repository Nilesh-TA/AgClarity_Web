//@Packages
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { JwtModule } from '@auth0/angular-jwt';
import { Http, RequestOptions, HttpModule } from '@angular/http';
import { ToastrModule } from 'ngx-toastr';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2OrderModule } from 'ng2-order-pipe';
import { MyDatePickerModule } from 'mydatepicker';
import { TextMaskModule } from 'angular2-text-mask';

//@Routes
import { appRoutes } from './app.routing';

//@Components
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { AppHeaderComponent } from './components/common/app-header/app-header.component';
import { AppLeftMenuComponent } from './components/common/app-left-menu/app-left-menu.component';
import { AppFooterComponent } from './components/common/app-footer/app-footer.component';
import { AppCommonNavTopComponent } from './components/common/app-common-nav-top/app-common-nav-top.component';
import { HomeComponent } from './components/home/home.component';
import { ListCompanyComponent } from './components/list-company/list-company.component';
import { AddCompanyComponent } from './components/add-company/add-company.component';
import { EditCompanyComponent } from './components/edit-company/edit-company.component';
import { ViewCompanyComponent } from './components/view-company/view-company.component';
import { ListChemicalComponent } from './components/list-chemical/list-chemical.component';
import { AddChemicalComponent } from './components/add-chemical/add-chemical.component';
import { EditChemicalComponent } from './components/edit-chemical/edit-chemical.component';
import { ViewChemicalComponent } from './components/view-chemical/view-chemical.component';
import { SelectCompanyComponent } from './components/select-company/select-company.component';
import { ClearDataComponent } from './components/clear-data/clear-data.component';
import { UnauthorizeComponent } from './components/unauthorize/unauthorize.component';
import { ListCropComponent } from './components/list-crop/list-crop.component';
import { AddCropComponent } from './components/add-crop/add-crop.component';
import { EditCropComponent } from './components/edit-crop/edit-crop.component';
import { ViewCropComponent } from './components/view-crop/view-crop.component';
import { ListDiseaseComponent } from './components/list-disease/list-disease.component';
import { AddDiseaseComponent } from './components/add-disease/add-disease.component';
import { EditDiseaseComponent } from './components/edit-disease/edit-disease.component';
import { ViewDiseaseComponent } from './components/view-disease/view-disease.component';
import { ListPestComponent } from './components/list-pest/list-pest.component';
import { AddPestComponent } from './components/add-pest/add-pest.component';
import { EditPestComponent } from './components/edit-pest/edit-pest.component';
import { ViewPestComponent } from './components/view-pest/view-pest.component';
import { ListSensorComponent } from './components/list-sensor/list-sensor.component';
import { AddSensorComponent } from './components/add-sensor/add-sensor.component';
import { EditSensorComponent } from './components/edit-sensor/edit-sensor.component';
import { ViewSensorComponent } from './components/view-sensor/view-sensor.component';
import { SubscriptionComponent } from './components/subscription/subscription.component';
import { ListContactProfileComponent } from './components/list-contact-profile/list-contact-profile.component';
import { AddContactProfileComponent } from './components/add-contact-profile/add-contact-profile.component';
import { EditContactProfileComponent } from './components/edit-contact-profile/edit-contact-profile.component';
import { ViewContactProfileComponent } from './components/view-contact-profile/view-contact-profile.component';
import { CompanyAccessComponent } from './components/company-access/company-access.component';
import { ContactAccessComponent } from './components/contact-access/contact-access.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { ListLocationComponent } from './components/list-location/list-location.component';
import { AddLocationComponent } from './components/add-location/add-location.component';
import { EditLocationComponent } from './components/edit-location/edit-location.component';
import { ViewLocationComponent } from './components/view-location/view-location.component';
import { ListIrrigationComponent } from './components/list-irrigation/list-irrigation.component';
import { AddIrrigationComponent } from './components/add-irrigation/add-irrigation.component';
import { EditIrrigationComponent } from './components/edit-irrigation/edit-irrigation.component';
import { ViewIrrigationComponent } from './components/view-irrigation/view-irrigation.component';
import { IrrigationLocationComponent } from './components/irrigation-location/irrigation-location.component';
import { ListWaterSourceComponent } from './components/list-water-source/list-water-source.component';
import { AddWaterSourceComponent } from './components/add-water-source/add-water-source.component';
import { EditWaterSourceComponent } from './components/edit-water-source/edit-water-source.component';
import { ViewWaterSourceComponent } from './components/view-water-source/view-water-source.component';
import { WaterSourceLocationComponent } from './components/water-source-location/water-source-location.component';
import { ListDictionaryComponent } from './components/list-dictionary/list-dictionary.component';
import { AddDictionaryComponent } from './components/add-dictionary/add-dictionary.component';
import { EditDictionaryComponent } from './components/edit-dictionary/edit-dictionary.component';
import { ViewDictionaryComponent } from './components/view-dictionary/view-dictionary.component';
import { ListAddressComponent } from './components/list-address/list-address.component';
import { AddAddressComponent } from './components/add-address/add-address.component';
import { EditAddressComponent } from './components/edit-address/edit-address.component';
import { ViewAddressComponent } from './components/view-address/view-address.component';

//@Services
import { CONFIG } from './constant/config';
import { REGEXP } from './constant/regexp';
import { DICTIONARY } from './constant/dictionary';
import { MICROAPP } from './constant/microapp';
import { AuthService } from './services/auth/auth.service';
import { AuthGuard } from './services/auth/auth-guard.service';
import { SecureService } from './services/secure.service';
import { HttpService } from './services/http.service';
import { StorageService } from './services/storage.service';
import { UserService } from './services/user.service';
import { CommonService } from './services/common.service';
import { DictionaryService } from './services/dictionary.service';
import { ErrorService } from './services/error.service';
import { DiseaseService } from './services/disease.service';
import { PestService } from './services/pest.service';
import { SensorService } from './services/sensor.service';
import { SubscriptionService } from './services/subscription.service';
import { ContactProfileService } from './services/contact-profile.service';
import { LocationService } from './services/location.service';
import { IrrigationService } from './services/irrigation.service';
import { WaterSourceService } from './services/water-source.service';
import { AddressService } from './services/address.service';

export function tokenGetter() {
  return localStorage.getItem('access_token');
}

// export function authHttpServiceFactory(http: Http, options: RequestOptions) {
//   return new AuthHttp(new AuthConfig({
//     tokenGetter: (() => localStorage.getItem('access_token')),
//     globalHeaders: [{ 'Content-Type': 'application/json' }],
//   }), http, options);
// }

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AppHeaderComponent,
    AppFooterComponent,
    AppLeftMenuComponent,
    HomeComponent,
    ListCompanyComponent,
    AddCompanyComponent,
    EditCompanyComponent,
    ViewCompanyComponent,
    ListChemicalComponent,
    AddChemicalComponent,
    EditChemicalComponent,
    ViewChemicalComponent,
    AppCommonNavTopComponent,
    SelectCompanyComponent,
    ClearDataComponent,
    UnauthorizeComponent,
    ListCropComponent,
    AddCropComponent,
    EditCropComponent,
    ViewCropComponent,
    ListDiseaseComponent,
    AddDiseaseComponent,
    EditDiseaseComponent,
    ViewDiseaseComponent,
    ListPestComponent,
    AddPestComponent,
    EditPestComponent,
    ViewPestComponent,
    AddSensorComponent,
    ListSensorComponent,
    ViewSensorComponent,
    EditSensorComponent,
    SubscriptionComponent,
    ListContactProfileComponent,
    AddContactProfileComponent,
    EditContactProfileComponent,
    ViewContactProfileComponent,
    CompanyAccessComponent,
    ContactAccessComponent,
    UserProfileComponent,
    ListLocationComponent,
    AddLocationComponent,
    EditLocationComponent,
    ViewLocationComponent,
    ListIrrigationComponent,
    AddIrrigationComponent,
    EditIrrigationComponent,
    ViewIrrigationComponent,
    IrrigationLocationComponent,
    ListWaterSourceComponent,
    AddWaterSourceComponent,
    EditWaterSourceComponent,
    ViewWaterSourceComponent,
    WaterSourceLocationComponent,
    ListDictionaryComponent,
    AddDictionaryComponent,
    EditDictionaryComponent,
    ViewDictionaryComponent,
    ListAddressComponent,
    AddAddressComponent,
    EditAddressComponent,
    ViewAddressComponent,    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    ToastrModule.forRoot({
      preventDuplicates: true
    }),    
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['localhost:3000'],
        blacklistedRoutes: ['localhost:3000/auth/']
      }
    }),
    NgxPaginationModule,
    Ng2OrderModule,
    MyDatePickerModule,
    TextMaskModule,
  ],
  providers: [
    // {
    //   provide: AuthHttp,
    //   useFactory: authHttpServiceFactory,
    //   deps: [Http, RequestOptions]
    // },
    AuthService,
    AuthGuard,
    SecureService,
    HttpService,
    StorageService,
    UserService,
    CommonService,
    DictionaryService,
    ErrorService,
    DiseaseService,
    PestService,
    SensorService,
    SubscriptionService,
    ContactProfileService,
    LocationService,
    IrrigationService,
    WaterSourceService,
    AddressService,
    CONFIG,
    REGEXP,
    DICTIONARY,
    MICROAPP
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
