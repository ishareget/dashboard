import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Injectable()
export class CarouselService {
  public option: any;

  constructor(
    private http: Http
  ) { }


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

  /**
   * 上傳圖片
   *
   * @param  body
   * @returns
   * @memberof CarouselService
   */
  public UploadPicture(body) {
    return this.http.post('/api/upload/carousel', body)
      .map((res: any) => {
        return res._body;
      });
  }


  /**
   * 上傳圖片
   *
   * @param {object} body
   * @returns
   * @memberof CarouselService
   */
  public creaatePicture(body: object) {
    return this.http.post('/api/carousel/create', body, this.packToken())
      .map((res) => {
        return res.json() || {}
      });
  }

  /**
 * 編輯圖片
 *
 * @param {object} body
 * @returns
 * @memberof CarouselService
 */
  public userUpdate(body: object) {
    return this.http.post('/api/carousel/update', body, this.packToken())
      .map((res) => {
        return res.json() || {}
      });
  }

  /**
 * 刪除圖片
 *
 * @param {object} body
 * @returns
 * @memberof CarouselService
 */
  public userDelete(body: object) {
    return this.http.post('/api/carousel/delete', body, this.packToken())
      .map((res) => {
        return res.json() || {}
      });
  }
  /**
   * 使用者登入
   *
   * @param {object} body
   * @returns
   * @memberof CarouselService
   */
  public userGetPicture() {
    return this.http.get('/api/carousel', this.packToken())
      .map((res) => {
        return res.json() || {}
      });
  }

}
