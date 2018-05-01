import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Router } from '@angular/router';
import { tokenKey } from '@angular/core/src/view/util';

@Injectable()
export class UserService {
  public option: any;

  constructor(
    private http: Http,
    private router: Router,
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
   * 登入
   * @param body
   * @memberof UserService
   */
  public Login(body: object) {
    return this.http.post('/api/user/login', body)
      .map((res) => {
        return res.json() || {}
      });
  }

  /**
   * 使用者資料 By Token
   *
   */
  public userInfo() {
    return this.http.get('/api/user/userinfo', this.packToken())
      .map((res) => {
        return res.json() || {}
      })
  }

  /**
   * 使用者權限
   *
   */
  public userPermission(id) {
    return this.http.get(`/api/user/permission/${id}`, this.packToken())
      .map((res) => {
        return res.json() || {}
      });
  }

  public userCheck() {
    if (!Cookie.get('userCookie')) {
      return false;
    } else {
      return true;
    }
  }


  /**
   * 學童資料取得
   *
   * @returns
   * @memberof UserService
   */
  public GetStudent() {
    return this.http.get('/api/student', this.packToken())
      .map((res) => {
        return res.json() || {}
      });
  }

  /**
   * 學童資料新增
   *
   * @param {object} body
   * @returns
   * @memberof UserService
   */
  public userAdd(body: object) {
    return this.http.post('/api/user/create', body, this.packToken())
      .map((res) => {
        return res.json() || false
      });
  }

  /**
   * 學童資料更新
   * @returns
   * @memberof UserService
   */
  public userUpdate(body) {
    return this.http.post('/api/user/update', body, this.packToken())
      .map((res) => {
        return res.json() || false
      });
  }


  /**
   * 學童資料刪除
   *
   * @param {object} body
   * @returns
   * @memberof UserService
   */
  public userDelete(body: object) {
    return this.http.post('/api/user/delete', body, this.packToken())
      .map((res) => {
        return res.json() || false
      });
  }

  /**
   * 老師資料取得
   *
   * @returns
   * @memberof UserService
   */
  public GetTeacher() {
    return this.http.get('/api/teacher', this.packToken())
      .map((res) => {
        return res.json() || {}
      });
  }

  /**
   * 改變已發送狀態
   * @returns
   * @param body
   * @memberof UserService
   */
  public GiveMission(body) {
    return this.http.post('/api/mission/give', body, this.packToken())
      .map((res) => {
        return res.json() || {}
      });
  }

  /**
   * 任務資料取得
   *
   * @returns
   * @memberof UserService
   */
  public GetMission() {
    return this.http.get(`/api/mission`, this.packToken())
      .map((res) => {
        return res.json() || {}
      });
  }

  /**
   * 任務參加資料取得
   *
   * @returns
   * @memberof UserService
   */
  public GetJoin(body) {
    return this.http.get(`/api/participate/missionexp?back=${body}`, this.packToken())
      .map((res) => {
        return res.json() || {}
      });
  }

  /**
   * 志工資料取得
   *
   * @returns
   * @memberof UserService
   */
  public GetVolunteer() {
    return this.http.get('/api/volunteer', this.packToken())
      .map((res) => {
        return res.json() || {}
      });
  }

  /**
   * 單位資料取得
   *
   * @returns
   * @memberof UserService
   */
  public userGetGroup() {
    return this.http.get('/api/group', this.packToken())
      .map((res) => {
        return res.json() || {}
      });
  }

  /**
   * 任務類別資料取得
   *
   * @returns
   * @memberof UserService
   */
  public userGetType() {
    return this.http.get('/api/mission/type')
      .map((res) => {
        return res.json() || {}
      });
  }

  /**
   * 任務資料刪除
   *
   * @returns
   * @memberof UserService
   */
  public userDeleteMission(body) {
    return this.http.post('/api/mission/delete', body, this.packToken())
      .map((res) => {
        return res.json() || {}
      })
  }


  /**
   * 編輯任務
   *
   * @param id
   * @memberof UserService
   */
  public updateMission(body) {
    console.log(body);
    return this.http.post('/api/mission/update', body, this.packToken())
      .map((res) => {
        return res.json() || {}
      });
  }

}
