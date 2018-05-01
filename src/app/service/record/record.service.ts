import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import 'rxjs/add/operator/map';

@Injectable()
export class RecordService {
  public option: any;

  constructor(private http: Http) { }

  /**
   * Token打包
   * @memberof UserService
   */
  public packToken() {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', 'Bearer ' + Cookie.get('userCookie'));
    const options = new RequestOptions({ headers: headers });
    this.option = options;
    return options;
  }

  public recordList() {
    return this.http.get('/api/record/', this.packToken())
      .map((res) => {
        return res.json() || []
      });
  }
}
