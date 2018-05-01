import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../service/user/user.service';
import { SwalComponent } from '@toverux/ngsweetalert2';

import { async } from '@angular/core/testing';

import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Student } from '../../class/user/student';
import { UrlSerializer } from '@angular/router/src/url_tree';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css'],
  providers: [UserService]
})
export class StudentComponent implements OnInit {

  @ViewChild('modelClose') modelClose: ElementRef;
  @ViewChild('dialogError') private swalDialogError: SwalComponent;
  @ViewChild('dialogSuccess') private swalDialogSuccess: SwalComponent;

  public datas: any[] = [];       // 學生資料集合
  public data: any = new Student(); // 學生資料單筆(by username)
  public isAddMode: Boolean = true; // 表單模式(新增/編輯)
  public userdata: any = null;

  public page: Number = 1;          // 當前頁碼
  public isLoading: Boolean = true; // 是否載入中

  public qrcodewebsite: String;
  public qrcode = 'Iw==';

  public groupdatas: any[] = [];
  public groupdata: any;
  public groupId: any;

  public permission = {
    accountcreate: 0,
    accountedit: 0,
    accountdelete: 0,
  };

  constructor(
    private router: Router,
    private userService: UserService,
  ) { }

  ngOnInit() {
    if (this.userService.userCheck() === false) { window.location.reload() }
    this.GetStudent();
    console.log(atob('Iw=='));
  }

  /**
   * 取得學生資料 all
   *
   * @memberof StudentComponent
   */
  public async GetStudent() {
    this.isLoading = true;
    await this.userService.GetStudent().subscribe(
      result => {
        this.datas = result;
        this.getUserInfo();
      });
  }

  /**
   * 取得登入中的使用者
   *
   * @memberof StudentComponent
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
   * @memberof StudentComponent
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
   * @memberof StudentComponent
   */
  public async userGetGroup() {
    await this.userService.userGetGroup().subscribe(
      result => {
        this.groupdatas = result;
        this.userGetPersonnalGroup();
      });
  }

  /**
   * 取得單位資料 個人
   *
   * @memberof StudentComponent
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
    this.isLoading = false;
  }

  /**
   * 資料欄位驗證
   *
   * @memberof StudentComponent
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
        point: this.data.point,
        school: this.data.school,
        studentid: this.data.studentid,
        groupid: this.groupId,
      }
      body2 = {
        username: this.data.username,
        password: this.data.password,
        name: this.data.name,
        gender: this.data.gender,
        point: this.data.point,
        school: this.data.school,
        studentid: this.data.studentid,
        groupid: this.groupId,
      }
      if (this.isAddMode) {
        this.userAddStudent(body2);    // 新增資料
      } else {
        this.userUpdateStudent(body); // 更新資料
      }
    }

  }

  /**
   * 新增學生資料
   *
   * @memberof StudentComponent
   */
  public async userAddStudent(body) {
    body.back = 1;
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
 * 取得學生資料 by username
 *
 * @memberof StudentComponent
 */
  public async userGetStudentById(obj: Student) {
    this.data = this.datas.filter(
      (value, index, array) => {
        return value.username === obj.username
      }
    )[0];
    this.qrcodewebsite = `http://meal.ishareget.org/#/qrcode?childid=${this.data.username}`;
    // this.data 非陣列（是 Child 物件），因此要取出[0]

    // 修改表單模式
    this.isAddMode = false;

  }

  /**
   * 更新學生資料
   *
   * @memberof StudentComponent
   */
  public async userUpdateStudent(body) {
    body.back = 1;
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
   * 刪除學生資料
   *
   * @memberof StudentComponent
   */
  public async userDeleteStudent(user: String) {
    const body = {
      username: user,
      back: 1
    }
    await this.userService.userDelete(body).subscribe(
      result => {
        if (result.affectedRows > 0) {
          this.swalDialogSuccess.show();
          this.GetStudent(); // reload
          this.modelClose.nativeElement.click();
        } else {
          this.swalDialogError.show();
        }
      });

  }
}
