//@Packages
import { Routes } from '@angular/router';

//@Services
import { AuthGuard } from './services/auth/auth-guard.service';

//@Components

//Login
import { LoginComponent } from './components/login/login.component';

//Home
import { HomeComponent } from './components/home/home.component';


//Clear Data
import { ClearDataComponent } from './components/clear-data/clear-data.component';

//Company
import { AddCompanyComponent } from './components/add-company/add-company.component';
import { EditCompanyComponent } from './components/edit-company/edit-company.component';
import { ListCompanyComponent } from './components/list-company/list-company.component';
import { ViewCompanyComponent } from './components/view-company/view-company.component';

//Chemical
import { AddChemicalComponent } from './components/add-chemical/add-chemical.component';
import { EditChemicalComponent } from './components/edit-chemical/edit-chemical.component';
import { ViewChemicalComponent } from './components/view-chemical/view-chemical.component';
import { ListChemicalComponent } from './components/list-chemical/list-chemical.component';

//Crop
import { AddCropComponent } from './components/add-crop/add-crop.component';
import { EditCropComponent } from './components/edit-crop/edit-crop.component';
import { ViewCropComponent } from './components/view-crop/view-crop.component';
import { ListCropComponent } from './components/list-crop/list-crop.component';

//Disease
import { AddDiseaseComponent } from './components/add-disease/add-disease.component';
import { EditDiseaseComponent } from './components/edit-disease/edit-disease.component';
import { ViewDiseaseComponent } from './components/view-disease/view-disease.component';
import { ListDiseaseComponent } from './components/list-disease/list-disease.component';

//Pest
import { AddPestComponent } from './components/add-pest/add-pest.component';
import { EditPestComponent } from './components/edit-pest/edit-pest.component';
import { ViewPestComponent } from './components/view-pest/view-pest.component';
import { ListPestComponent } from './components/list-pest/list-pest.component';

//Sensor
import { AddSensorComponent } from './components/add-sensor/add-sensor.component';
import { EditSensorComponent } from './components/edit-sensor/edit-sensor.component';
import { ViewSensorComponent } from './components/view-sensor/view-sensor.component';
import { ListSensorComponent } from './components/list-sensor/list-sensor.component';

//Subscription Page
import { SubscriptionComponent } from './components/subscription/subscription.component';

//Contact Profile
import { ListContactProfileComponent } from './components/list-contact-profile/list-contact-profile.component';
import { AddContactProfileComponent } from './components/add-contact-profile/add-contact-profile.component';
import { EditContactProfileComponent } from './components/edit-contact-profile/edit-contact-profile.component';
import { ViewContactProfileComponent } from './components/view-contact-profile/view-contact-profile.component';

//Company Access Page
import { CompanyAccessComponent } from './components/company-access/company-access.component';

//Contact Access Page
import { ContactAccessComponent } from './components/contact-access/contact-access.component';

//User Profile Page
import { UserProfileComponent } from './components/user-profile/user-profile.component';

//Location
import { AddLocationComponent } from './components/add-location/add-location.component';
import { EditLocationComponent } from './components/edit-location/edit-location.component';
import { ViewLocationComponent } from './components/view-location/view-location.component';
import { ListLocationComponent } from './components/list-location/list-location.component';

//Irrigation
import { AddIrrigationComponent } from './components/add-irrigation/add-irrigation.component';
import { EditIrrigationComponent } from './components/edit-irrigation/edit-irrigation.component';
import { ViewIrrigationComponent } from './components/view-irrigation/view-irrigation.component';
import { ListIrrigationComponent } from './components/list-irrigation/list-irrigation.component';

//Irrigation Location Page
import { IrrigationLocationComponent } from './components/irrigation-location/irrigation-location.component';

//WaterSource Location
import { ListWaterSourceComponent } from './components/list-water-source/list-water-source.component';
import { ViewWaterSourceComponent } from './components/view-water-source/view-water-source.component';
import { EditWaterSourceComponent } from './components/edit-water-source/edit-water-source.component';
import { AddWaterSourceComponent } from './components/add-water-source/add-water-source.component';

//WaterSource Location Page
import { WaterSourceLocationComponent } from './components/water-source-location/water-source-location.component';

//Select Company
import { SelectCompanyComponent } from './components/select-company/select-company.component';

//Dictionary
import { AddDictionaryComponent } from './components/add-dictionary/add-dictionary.component';
import { EditDictionaryComponent } from './components/edit-dictionary/edit-dictionary.component';
import { ViewDictionaryComponent } from './components/view-dictionary/view-dictionary.component';
import { ListDictionaryComponent } from './components/list-dictionary/list-dictionary.component';

//Address
import { ListAddressComponent } from './components/list-address/list-address.component';
import { AddAddressComponent } from './components/add-address/add-address.component';
import { EditAddressComponent } from './components/edit-address/edit-address.component';
import { ViewAddressComponent } from './components/view-address/view-address.component';

//Unauthorize Page
import { UnauthorizeComponent } from './components/unauthorize/unauthorize.component';

export const appRoutes: Routes = [
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'unauthorize',
        component: UnauthorizeComponent
    },
    {
        path: 'set-data',
        component: ClearDataComponent
    },

    //Select  Companies
    {
        path: 'select-company',
        component: SelectCompanyComponent,
    },

    //User Profile
    {
        path: 'user-profile',
        component: UserProfileComponent,
        canActivate: [AuthGuard]
    },

    //company    
    {
        path: 'add-company',
        component: AddCompanyComponent,
        canActivate: [AuthGuard],
        data: { IsSelectCompany: true, Entity: "Company" }
    },
    {
        path: 'edit-company/:id',
        component: EditCompanyComponent,
        canActivate: [AuthGuard],
        data: { IsSelectCompany: true, Entity: "Company" }
    },
    {
        path: 'view-company/:id',
        component: ViewCompanyComponent,
        canActivate: [AuthGuard],
        data: { IsSelectCompany: true, Entity: "Company" }
    },
    {
        path: 'list-company',
        component: ListCompanyComponent,
        canActivate: [AuthGuard],
        data: { IsSelectCompany: true, Entity: "Company" }
    },

    //Chemical
    {
        path: 'add-chemical',
        component: AddChemicalComponent,
        canActivate: [AuthGuard],
        data: { IsSelectCompany: true, Entity: "Chemical" }
    },
    {
        path: 'edit-chemical/:id',
        component: EditChemicalComponent,
        canActivate: [AuthGuard],
        data: { IsSelectCompany: true, Entity: "Chemical" }
    },
    {
        path: 'view-chemical/:id',
        component: ViewChemicalComponent,
        canActivate: [AuthGuard],
        data: { IsSelectCompany: true, Entity: "Chemical" }
    },
    {
        path: 'list-chemical',
        component: ListChemicalComponent,
        canActivate: [AuthGuard],
        data: { IsSelectCompany: true, Entity: "Chemical" }
    },

    //Crop
    {
        path: 'add-crop',
        component: AddCropComponent,
        canActivate: [AuthGuard],
        data: { IsSelectCompany: true, Entity: "Crop" }
    },
    {
        path: 'edit-crop/:id',
        component: EditCropComponent,
        canActivate: [AuthGuard],
        data: { IsSelectCompany: true, Entity: "Crop" }
    },
    {
        path: 'view-crop/:id',
        component: ViewCropComponent,
        canActivate: [AuthGuard],
        data: { IsSelectCompany: true, Entity: "Crop" }
    },
    {
        path: 'list-crop',
        component: ListCropComponent,
        canActivate: [AuthGuard],
        data: { IsSelectCompany: true, Entity: "Crop" }
    },

    //Disease
    {
        path: 'add-disease',
        component: AddDiseaseComponent,
        canActivate: [AuthGuard],
        data: { IsSelectCompany: true, Entity: "Disease" }
    },
    {
        path: 'edit-disease/:id',
        component: EditDiseaseComponent,
        canActivate: [AuthGuard],
        data: { IsSelectCompany: true, Entity: "Disease" }
    },
    {
        path: 'view-disease/:id',
        component: ViewDiseaseComponent,
        canActivate: [AuthGuard],
        data: { IsSelectCompany: true, Entity: "Disease" }
    },
    {
        path: 'list-disease',
        component: ListDiseaseComponent,
        canActivate: [AuthGuard],
        data: { IsSelectCompany: true, Entity: "Disease" }
    },

    //Pest
    {
        path: 'add-pest',
        component: AddPestComponent,
        canActivate: [AuthGuard],
        data: { IsSelectCompany: true, Entity: "Pest" }
    },
    {
        path: 'edit-pest/:id',
        component: EditPestComponent,
        canActivate: [AuthGuard],
        data: { IsSelectCompany: true, Entity: "Pest" }
    },
    {
        path: 'view-pest/:id',
        component: ViewPestComponent,
        canActivate: [AuthGuard],
        data: { IsSelectCompany: true, Entity: "Pest" }
    },
    {
        path: 'list-pest',
        component: ListPestComponent,
        canActivate: [AuthGuard],
        data: { IsSelectCompany: true, Entity: "Pest" }
    },

    //Sensor
    {
        path: 'add-sensor',
        component: AddSensorComponent,
        canActivate: [AuthGuard],
        data: { IsSelectCompany: true, Entity: "Sensor" }
    },
    {
        path: 'edit-sensor/:id',
        component: EditSensorComponent,
        canActivate: [AuthGuard],
        data: { IsSelectCompany: true, Entity: "Sensor" }
    },
    {
        path: 'view-sensor/:id',
        component: ViewSensorComponent,
        canActivate: [AuthGuard],
        data: { IsSelectCompany: true, Entity: "Sensor" }
    },
    {
        path: 'list-sensor',
        component: ListSensorComponent,
        canActivate: [AuthGuard],
        data: { IsSelectCompany: true, Entity: "Sensor" }
    },

    //Subscription
    {
        path: 'subscription',
        component: SubscriptionComponent,
        canActivate: [AuthGuard],
        data: { IsSelectCompany: true, Entity: "Subscription" }
    },

    //Contact Profile
    {
        path: 'add-contact-profile',
        component: AddContactProfileComponent,
        canActivate: [AuthGuard],
        data: { IsSelectCompany: true, Entity: "ContactProfile" }
    },
    {
        path: 'edit-contact-profile/:id',
        component: EditContactProfileComponent,
        canActivate: [AuthGuard],
        data: { IsSelectCompany: true, Entity: "ContactProfile" }
    },
    {
        path: 'view-contact-profile/:id',
        component: ViewContactProfileComponent,
        canActivate: [AuthGuard],
        data: { IsSelectCompany: true, Entity: "ContactProfile" }
    },
    {
        path: 'list-contact-profile',
        component: ListContactProfileComponent,
        canActivate: [AuthGuard],
        data: { IsSelectCompany: true, Entity: "ContactProfile" }
    },

    //Company Access
    {
        path: 'company-access',
        component: CompanyAccessComponent,
        canActivate: [AuthGuard],
        data: { IsSelectCompany: false, Entity: "CompanyAccess" }
    },

    //Contact Access
    {
        path: 'contact-access',
        component: ContactAccessComponent,
        canActivate: [AuthGuard],
        data: { IsSelectCompany: false, Entity: "ContactAccess" }
    },

    //Location
    {
        path: 'add-location',
        component: AddLocationComponent,
        canActivate: [AuthGuard],
        data: { IsSelectCompany: true, Entity: "Location" }
    },
    {
        path: 'edit-location/:id',
        component: EditLocationComponent,
        canActivate: [AuthGuard],
        data: { IsSelectCompany: true, Entity: "Location" }
    },
    {
        path: 'view-location/:id',
        component: ViewLocationComponent,
        canActivate: [AuthGuard],
        data: { IsSelectCompany: true, Entity: "Location" }
    },
    {
        path: 'list-location',
        component: ListLocationComponent,
        canActivate: [AuthGuard],
        data: { IsSelectCompany: true, Entity: "Location" }
    },

    //Irrigation
    {
        path: 'add-irrigation',
        component: AddIrrigationComponent,
        canActivate: [AuthGuard],
        data: { IsSelectCompany: true, Entity: "Irrigation" }
    },
    {
        path: 'edit-irrigation/:id',
        component: EditIrrigationComponent,
        canActivate: [AuthGuard],
        data: { IsSelectCompany: true, Entity: "Irrigation" }
    },
    {
        path: 'view-irrigation/:id',
        component: ViewIrrigationComponent,
        canActivate: [AuthGuard],
        data: { IsSelectCompany: true, Entity: "Irrigation" }
    },
    {
        path: 'list-irrigation',
        component: ListIrrigationComponent,
        canActivate: [AuthGuard],
        data: { IsSelectCompany: true, Entity: "Irrigation" }
    },

    //Irrigation Location
    {
        path: 'irrigation-location',
        component: IrrigationLocationComponent,
        canActivate: [AuthGuard],
        data: { IsSelectCompany: false, Entity: "IrrigationLocation" }
    },

    //WaterSource
    {
        path: 'add-watersource',
        component: AddWaterSourceComponent,
        canActivate: [AuthGuard],
        data: { IsSelectCompany: true, Entity: "WaterSource" }
    },
    {
        path: 'edit-watersource/:id',
        component: EditWaterSourceComponent,
        canActivate: [AuthGuard],
        data: { IsSelectCompany: true, Entity: "WaterSource" }
    },
    {
        path: 'view-watersource/:id',
        component: ViewWaterSourceComponent,
        canActivate: [AuthGuard],
        data: { IsSelectCompany: true, Entity: "WaterSource" }
    },
    {
        path: 'list-watersource',
        component: ListWaterSourceComponent,
        canActivate: [AuthGuard],
        data: { IsSelectCompany: true, Entity: "WaterSource" }
    },

    //WaterSource Location
    {
        path: 'watersource-location',
        component: WaterSourceLocationComponent,
        canActivate: [AuthGuard],
        data: { IsSelectCompany: false, Entity: "WaterSourceLocation" }
    },

    //Dictionary
    {
        path: 'add-dictionary',
        component: AddDictionaryComponent,
        canActivate: [AuthGuard],
        data: { IsSelectCompany: false, Entity: "Dictionary" }
    },
    {
        path: 'edit-dictionary/:id',
        component: EditDictionaryComponent,
        canActivate: [AuthGuard],
        data: { IsSelectCompany: false, Entity: "Dictionary" }
    },
    {
        path: 'view-dictionary/:id',
        component: ViewDictionaryComponent,
        canActivate: [AuthGuard],
        data: { IsSelectCompany: false, Entity: "Dictionary" }
    },
    {
        path: 'list-dictionary',
        component: ListDictionaryComponent,
        canActivate: [AuthGuard],
        data: { IsSelectCompany: false, Entity: "Dictionary" }
    },

    //Address
    {
        path: 'add-address',
        component: AddAddressComponent,
        canActivate: [AuthGuard],
        data: { IsSelectCompany: true, Entity: "Address" }
    },
    {
        path: 'edit-address/:id',
        component: EditAddressComponent,
        canActivate: [AuthGuard],
        data: { IsSelectCompany: true, Entity: "Address" }
    },
    {
        path: 'view-address/:id',
        component: ViewAddressComponent,
        canActivate: [AuthGuard],
        data: { IsSelectCompany: true, Entity: "Address" }
    },
    {
        path: 'list-address',
        component: ListAddressComponent,
        canActivate: [AuthGuard],
        data: { IsSelectCompany: true, Entity: "Address" }
    },

    //Home
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
    },
    { path: '**', redirectTo: 'home' }

];
