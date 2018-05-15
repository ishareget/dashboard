import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../service/user/user.service';
import { NotificationService } from '../../service/notification/notification.service';
import { SwalComponent } from '@toverux/ngsweetalert2';

import { async } from '@angular/core/testing';

import * as moment from 'moment';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { ChildActivationEnd } from '@angular/router/src/events';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  providers: [UserService, NotificationService]

})
export class AdminComponent implements OnInit {

  @ViewChild('dialogPassSuccess') private swalDialogPassSuccess: SwalComponent;
  @ViewChild('dialogError') private swalDialogError: SwalComponent;
  @ViewChild('dialogPermissionError') private swalDialogPermissionError: SwalComponent

  private userdata: any = null;
  public isLoading: Boolean = true;
  public datas: any[] = [];
  public page: Number = 1;
  public data: any;
  public studentdata: any;
  public studentalldata: any[] = [];

  public groupdatas: any[] = [];
  public groupdata: any;

  public permission = {
    accountedit: 0,
    accountdelete: 0,
  };

  constructor(
    private router: Router,
    private userService: UserService,
    private notificationservice: NotificationService
  ) { }

  ngOnInit() {
    if (this.userService.userCheck() === false) { window.location.reload() }
    this.GetAllStudent();
  }

  /**
   * 取得所有學生資料
   * @memberof AdminComponent
   */
  public async GetAllStudent() {
    this.datas = [];
    await this.userService.GET_AllStudent().subscribe(
      result => {
        this.studentalldata = result;
        this.GetAllMission(1);
        this.getUserInfo();
      });
  }


  /**
   * 取得登入中的使用者
   *
   * @memberof AdminComponent
   */
  public async getUserInfo() {
    await this.userService.userInfo().subscribe(
      result => {
        if (result[0]) {
          this.userdata = result[0];
          if (this.userdata.logingroup !== 4) {
            this.swalDialogPermissionError.show();
            this.router.navigate(['/home']);
          }
          this.GetPermission();
        }
      }
    )
  }

  /**
   * 取得權限
   *
   * @memberof AdminComponent
   */
  public async GetPermission() {
    await this.userService.userPermission(this.userdata.logingroup).subscribe(
      result => {
        this.permission.accountedit = result[0].accountedit;
        this.permission.accountdelete = result[0].accountdelete;
        this.userGetGroup();
      });
  }

  /**
   * 取得單位資料 all
   *
   * @memberof AdminComponent
   */
  public async userGetGroup() {
    await this.userService.userGetGroup().subscribe(
      result => {
        this.isLoading = false;
        this.groupdatas = result;
      });
  }

  /**
   * 取得欲發送點數之學生資料
   * @param cuid
   * @memberof AdminComponent
   */
  public async GetStudent(cuid: String) {
    this.studentalldata.forEach(element => {
      if (element.username === cuid) {
        this.studentdata = element;
      }
    });
  }

  /**
   * 資料欄位驗證
   *
   * @memberof AdminComponent
   */
  public async userDataCheck() {

    let valid = false;
    let body = {};

    if (Object.keys(this.data).length < 1) {
      valid = true;
      body = {
        id: this.data.id,
        missiontype: this.data.missiontype,
        missionname: this.data.missionname,
        missionpoint: this.data.missionpoint,
        childusername: this.data.childusername,
        createtime: this.data.createtime,
        submittime: this.data.submittime
      }
    }
  }

  /**
   * 取得已審核任務資料
   *
   * @memberof AdminComponent
   */
  public async GetAllMission(body) {
    await this.userService.GetJoin(body).subscribe(
      result => {
        if (result) {
          this.isLoading = false;
          result.forEach(element => {
            if (element.status === '已審核') {
              this.datas.push(element);
            }
          });
        }
      });
  }


  /**
   * 通過系統管理員發送
   * @param cuid
   * @param mid
   * @param mpoint
   * @memberof AdminComponent
   */
  public async PassMission(cuid: String, mid: Number, mpoint: Number, index: Number) {
    this.GetStudent(cuid);
    this.UpdateStudent(cuid, mpoint + this.studentdata.point);
    const body = {
      status: '已發送',
      givetime: moment().format('YYYY-MM-DD hh:mm:ss'),
      giveusername: this.userdata.username,
      missionid: mid,
      username: cuid
    };
    await this.userService.GiveMission(body)
      .subscribe(result => {
        if (result.affectedRows > 0) {
          this.createNotification(moment().format('YYYY-MM-DD HH:mm:ss'), mid, index);
        } else {
          this.swalDialogError.show();
        }
      });
  }

  /**
   *  新增通知
   * 
   *  @member AdminComponent
   */
  public async createNotification(createtime, missionId, index) {
    const body = {
      username: this.datas[index].studentusername,
      type: '點數',
      groupid: this.studentdata.groupid,
      mission_id: missionId,
      noti_time: createtime,
      description: `${this.userdata.name}--發放點數100點-- ${this.datas[index].missionname}`,
      status: 0
    }
    console.log(body);
    await this.notificationservice.createNoti(body).subscribe(
      result => {
        console.log(result);
        if (result.affectedRows === 1) {
          console.log('有進');
          this.swalDialogPassSuccess.show();
          setTimeout(() => { this.GetAllStudent(); }, 1200);
        } else {
          this.swalDialogError.show();
        }
      }
    )
  }


  /**
   * 發送點數
   * @param cuid
   * @param mpoint
   * @memberof AdminComponent
   */
  public async UpdateStudent(cuid: String, mpoint: Number) {

    const body = {
      point: mpoint,
      username: this.studentdata.username,
      back: 1
    }

    await this.userService.userUpdate(body).subscribe();
  }
}
