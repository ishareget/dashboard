import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../service/user/user.service';
import { SwalComponent } from '@toverux/ngsweetalert2';
import { Cookie } from 'ng2-cookies/ng2-cookies';

import { async } from '@angular/core/testing';

import { Teacher } from '../../class/user/teacher';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css'],
  providers: [UserService]
})
export class TeacherComponent implements OnInit {

  @ViewChild('modelClose') modelClose: ElementRef;
  @ViewChild('dialogError') private swalDialogError: SwalComponent;
  @ViewChild('dialogSuccess') private swalDialogSuccess: SwalComponent;

  public datas: any[] = [];       // 老師資料集合
  public data: any = new Teacher(); // 老師資料單筆(by username)
  public isAddMode: Boolean = true; // 表單模式(新增/編輯)
  public userdata: any = null;

  public page: Number = 1;          // 當前頁碼
  public isLoading: Boolean = true; // 是否載入中

  public qrcodewebsite: String;

  public groupdatas: any[] = [];
  public groupdata: any;
  public groupId: any;

  public permission = {
    accountcreate: 0,
    accountedit: 0,
    accountdelete: 0
  };

  constructor(
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit() {
    if (this.userService.userCheck() === false) { window.location.reload() }
    this.GetTeacher();
  }

  /**
   * 取得教職員資料 all
   *
   * @memberof TeacherComponent
   */
  public async GetTeacher() {
    this.isLoading = true;
    await this.userService.GetTeacher().subscribe(
      result => {
        this.datas = result;
        this.getUserInfo();
      });
  }

  /**
   * 取得登入中的使用者
   *
   * @memberof TeacherComponent
   */
  public async getUserInfo() {
    await this.userService.userInfo().subscribe(
      result => {
        if (result[0]) {
          this.userdata = result[0];
          this.GetPermission();
        }
      }
    )
  }

  /**
   * 取得權限
   *
   * @memberof TeacherComponent
   */
  public async GetPermission() {
    await this.userService.userPermission(this.userdata.logingroup).subscribe(
      result => {
        this.permission.accountcreate = result[0].accountcreate;
        this.permission.accountedit = result[0].accountedit;
        this.permission.accountdelete = result[0].accountdelete;
        this.userGetGroup();
      });
  }

  /**
   * 取得單位資料 all
   *
   * @memberof TeacherComponent
   */
  public async userGetGroup() {
    await this.userService.userGetGroup().subscribe(
      result => {
        this.isLoading = false;
        this.groupdatas = result;
        this.userGetPersonnalGroup();
      });
  }

  /**
   * 取得單位資料 個人
   *
   * @memberof TeacherComponent
   */
  public async userGetPersonnalGroup() {
    for (let i = 0; i < this.datas.length; i++) {
      for (let j = 0; j < this.groupdatas.length; j++) {
        if (this.datas[i].groupid === this.groupdatas[j].id) {
          this.datas[i].group = this.groupdatas[j].groupname;
          break;
        }
      }
    }
  }

  /**
   * 資料欄位驗證
   *
   * @memberof TeacherComponent
   */
  public async userDataCheck() {
    let body, body2 = {};

    if (Object.keys(this.data).length < 1) {

      this.swalDialogError.show();
      this.data.password = '';
      this.data.passwordRe = '';

    } else if (
      this.data.password !== this.data.passwordRe ||
      this.data.password === '' ||
      this.data.passwordRe === ''
    ) {

      this.swalDialogError.show();
      this.data.password = '';
      this.data.passwordRe = '';

    } else {
      for (let i = 0; i < this.groupdatas.length; i++) {
        if (this.data.group === this.groupdatas[i].groupname) {
          this.groupId = this.groupdatas[i].id;
          break;
        }
      }
      body = {
        username: this.data.username,
        name: this.data.name,
        gender: this.data.gender,
        tel: this.data.tel,
        school: this.data.school,
        groupid: this.groupId,
      }
      body2 = {
        username: this.data.username,
        password: this.data.password,
        name: this.data.name,
        gender: this.data.gender,
        tel: this.data.tel,
        school: this.data.school,
        groupid: this.groupId,
      }
      if ( this.isAddMode) {
        this.userAddTeacher(body2);    // 新增資料
      } else {
        this.userUpdateTeacher(body); // 更新資料
      }
    }
  }

  /**
   * 新增教職員資料
   *
   * @memberof TeacherComponent
   */
  public async userAddTeacher(body) {
    body.back = 2;
    await this.userService.userAdd(body).subscribe(
      result => {
        if (result) {
          this.swalDialogSuccess.show();
          this.modelClose.nativeElement.click();
        } else {
          this.swalDialogError.show();
        }
      });
  }

  /**
   * 取得教職員資料 by username
   *
   * @memberof TeacherComponent
   */
  public async userGetTeacherById(obj: Teacher) {

    this.data = this.datas.filter(
      (value, index, array) => {
        return value.username === obj.username
      }
    )[0];

    // 修改表單模式
    this.isAddMode = false;
  }


  /**
   * 更新教職員資料
   *
   * @memberof TeacherComponent
   */
  public async userUpdateTeacher(body) {
    body.back = 2;
    await this.userService.userUpdate(body).subscribe(
      result => {
        if (result) {
          this.swalDialogSuccess.show();
          this.modelClose.nativeElement.click();
        } else {
          this.swalDialogError.show();
        }
      });

  }

  /**
   * 刪除教職員資料
   *
   * @memberof TeacherComponent
   */
  public async userDeleteTeacher(user: String) {
    const body = {
      back: 2,
      username: user
    }
    await this.userService.userDelete(body).subscribe(
      result => {
        if (result.affectedRows > 0) {
          this.swalDialogSuccess.show();
          this.GetTeacher(); // reload
          this.modelClose.nativeElement.click();
        } else {
          this.swalDialogError.show();
        }
      });

  }

}
