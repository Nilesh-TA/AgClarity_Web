import { Injectable, EventEmitter } from '@angular/core';


@Injectable()
export class StorageService {

    public change: EventEmitter<string> = new EventEmitter();
    setCredentials(authResult: any): void {
        // Save session data and update login status subject
        const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + Date.now());

        localStorage.setItem('access_token', authResult.access_token);
        localStorage.setItem('expires_at', expiresAt);
        localStorage.setItem('companies', JSON.stringify(authResult.companies));
        localStorage.setItem('hasaccess_to_multiple_companies', (authResult.companies && authResult.companies.length > 1) ? "true" : "false");
        localStorage.setItem('masterdata', JSON.stringify(authResult.masterdata));
        localStorage.setItem('profile', JSON.stringify(authResult.data));
    }

    set(token: string): void {
        localStorage.setItem('access_token', token);
    }

    setProfileImg(profileImgLink: string) {
        localStorage.setItem('currentImg', profileImgLink);
        this.change.emit('currentImg');
    }

    getTokenExpireAt(): string {
        return localStorage.getItem('expires_at');
    }
    getToken(): string {
        return localStorage.getItem('access_token');
    }
    getUser(): string {
        return localStorage.getItem('profile');
    }
    getUserProfile(): any {
        if (localStorage.getItem("profile")) {
            return JSON.parse(localStorage.getItem("profile"));
        }
        return null;
    }

    getUserProfileId(): number {
        let profileObj = this.getUserProfile();
        if (profileObj != null && profileObj != undefined) {
            return profileObj.ID_profile;
        }
        return 0;
    }

    getUserName(): string {
        let profileObj = this.getUserProfile();
        if (profileObj != null && profileObj != undefined) {
            return profileObj.first_name + " " + profileObj.last_name;
        }
        return "";
    }

    getUserAccessRole(): string {
        let profileObj = this.getUserProfile();
        if (profileObj != null && profileObj != undefined) {
            return profileObj.access_role;
        }
        return "";
    }

    setParentCompanyId(parentCompanyId: any) {
        localStorage.setItem('current_parent_company_id', parentCompanyId);
    }

    getParentCompanyId(): number {
        let id = localStorage.getItem('current_parent_company_id');
        return (id && id != null && id != "null") ? +id : 0;
    }

    removeParentCompanyId() {
        localStorage.removeItem('current_parent_company_id');
    }


    setCompanyId(companyId: any) {
        localStorage.setItem('current_company_id', companyId);
    }

    getCompanyId(): number {
        return localStorage.getItem('current_company_id') ? +localStorage.getItem('current_company_id') : 0;
    }

    removeCompanyId() {
        localStorage.removeItem('current_company_id');
    }

    setCompanyName(companyName: any) {
        localStorage.setItem('current_company_name', companyName);
    }

    getCompanyName(): string {
        return localStorage.getItem('current_company_name') ? localStorage.getItem('current_company_name') : "";
    }

    removeCompanyName() {
        localStorage.removeItem('current_company_name');
    }

    getUserCompanies(): any {
        const companies = localStorage.getItem('companies');
        if (companies != null && companies != undefined) {
            return companies;
        }
        return null;
    }

    getUserMasterData(): any {
        const masterdata = localStorage.getItem('masterdata');
        if (masterdata != null && masterdata != undefined) {
            return masterdata;
        }
        return null;
    }

    checkUserHasAccessToMultipleCompanies() {
        return localStorage.getItem('hasaccess_to_multiple_companies');
    }

    clearCredentials(): void {
        localStorage.removeItem('access_token');
        localStorage.removeItem('expires_at');
        localStorage.removeItem('profile');
        localStorage.removeItem('companies');
        localStorage.removeItem('masterdata');
        localStorage.removeItem('current_company_id');
        localStorage.removeItem('current_company_name');
        localStorage.removeItem('hasaccess_to_multiple_companies');
    }

    clearCompanySelection(): void {
        if (this.checkUserHasAccessToMultipleCompanies() == "true") {
            localStorage.removeItem('current_company_id');
            localStorage.removeItem('current_company_name');
        }
    }
}
