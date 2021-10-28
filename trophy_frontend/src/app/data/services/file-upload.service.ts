import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, tap } from 'rxjs/operators';

import { ConfigService } from './config.service';
// import { AdminAuthService } from './admin-auth.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FileUploadService {
  private _uploads = new BehaviorSubject<any>(null);
  private serverUrl: string;
  token: string;

  constructor(
    private http: HttpClient,
    private config: ConfigService,
    // private adminAuthService: AdminAuthService
  ) {
    this.serverUrl = this.config.base_url();
    // this.adminAuthService.admin.subscribe(auth => {
    //   if (auth) { this.token = auth.token; }
    // });
  }

  get uploads() {
    return this._uploads.asObservable();
  }

  // Upload any file
  /*  upload(
     fileData: any, folder: string, name: string
   ) {
     return this.http
       .post<any>(
         this.serverUrl + 'user/profile/upload/'
         + folder + '/' + name, fileData,
         {
           reportProgress: true,
           observe: 'events',
         }
       ). pipe(delay(1000));
   } */

  // Upload any file
  upload(fileData: any, folder: string, name: string) {
    return this.http.post<any>(
      `${this.serverUrl}fileupload/${folder}/${name}`,
      fileData,
      {
        reportProgress: true,
        observe: 'events',
      }
    ).pipe(delay(1000));
  }

  // delete file
  delete(id: any) {
    return this.http.get<any>(
      this.serverUrl + 'file_manager/delete/' + this.token + '/' + id
    );
  }

  getUploads(limit = 24, page = 1) {
    return this.http.get<any>(
      this.serverUrl + 'file_manager/' + this.token + '/' + limit + '/' + page
    )
      .pipe(tap(resData => {
        if (resData) {
          this._uploads.next(resData);
        }
      }));
  }
}
