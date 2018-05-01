import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../service/user/user.service';
import { SwalComponent } from '@toverux/ngsweetalert2';
import { NgxPaginationModule } from 'ngx-pagination';

import { async } from '@angular/core/testing';

import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Student } from '../../class/user/student';
import { UrlSerializer } from '@angular/router/src/url_tree';
import { element } from 'protractor';
import * as moment from 'moment';

import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-mission',
  templateUrl: './mission.component.html',
  styleUrls: ['./mission.component.css'],
  providers: [UserService]
})
export class MissionComponent implements OnInit {

  @ViewChild('dialogError') private swalDialogError: SwalComponent;
  @ViewChild('dialogSuccess') private swalDialogSuccess: SwalComponent;
  @ViewChild('dialogWarn') private dialogWarning: SwalComponent;
  @ViewChild('dialogWarn') private dialogdispute: SwalComponent;

  public datas: any[] = [];       // 學生資料集合
  public data: any = new Student(); // 學生資料單筆(by username)
  public isAddMode: Boolean = true; // 表單模式(新增/編輯)
  public userdata: any = null;

  public showData: any = [];
  public videoUrl: any = '';

  public auditData: any[] = [];
  public goOffData: any[] = [];
  public launchedData: any[] = [];
  public returnData: any[] = [];
  public closeData: any[] = [];


  public page: Number = 1;          // 當前頁碼
  // public maxSize: number = 5;
  public isLoading: Boolean = true; // 是否載入中

  public qrcodewebsite: String;

  public groupdatas: any[] = [];
  public typedatas: any[] = [];
  public groupdata: any;
  public tab: Number = 0;

  public permission = {
    accountedit: 0,
    accountdelete: 0,
  };

  constructor(
    private router: Router,
    private userService: UserService,
    private domSanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    if (this.userService.userCheck() === false) { window.location.reload() }
    this.GetMission();
  }

  /**
 * 將任務執行時間格式化
 *
 * @memberof MissionComponent
 */
  public formatDate(data) {
    if (data) {
      data = {
        year: moment(data).format('YYYY'),
        month: moment(data).format('MM'),
        day: moment(data).format('DD'),
      }
    }
    return data['year'] + data['month'] + data['day'];
  }

  /**
   * 取得任務資料 all
   *
   * @memberof MissionComponent
   */
  public async GetMission() {
    await this.userService.GetMission().subscribe(
      result => {
        this.datas = result;
        this.auditData = [];
        this.launchedData = [];
        this.goOffData = [];
        this.returnData = [];
        this.closeData = [];
        this.datas.forEach(e => {
          if (this.formatDate(e.missionfinaldate) < this.formatDate(moment())) {
            // if (e.status !== "已結束") {
            //   e.status = "已結束"
            //   this.missionEnd("已結束", e.id)
            // }
            this.closeData.push(e);
          } else {
            switch (e.status) {
              case '審核中':
                this.auditData.push(e);
                break;
              case '已上架':
                this.launchedData.push(e);
                break;
              case '已下架':
                this.goOffData.push(e);
                break;
              case '已退回':
                this.returnData.push(e);
                break;
            }
          }
        });
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
          this.GetGroup();
        }
      }
    )
  }

  /**
   * 取得權限
   *
   * @memberof StudentComponent
   */
  public async GetGroup() {
    await this.userService.userGetGroup().subscribe(
      result => {
        this.groupdatas = result;
        this.GetType();
      }
    )
  }

  public async GetType() {
    await this.userService.userGetType().subscribe(
      result => {
        this.typedatas = result;
        for (let i = 0; i < this.datas.length; i += 1) {
          for (let j = 0; j < this.groupdatas.length; j += 1) {
            if (this.datas[i].missiongroup === this.groupdatas[j].id) {
              this.datas[i].missiongroup = this.groupdatas[j].groupname;
              break;
            }
          }
          for (let j = 0; j < this.typedatas.length; j += 1) {
            if (this.datas[i].missiontype === this.typedatas[j].id) {
              this.datas[i].missiontype = this.typedatas[j].missiontype;
              break;
            }
          }
        }
        this.isLoading = false;
      }
    )
  }

  /**
   * 刪除任務資料
   *
   * @memberof MissionComponent
   */
  public async userDeleteMission(id: String) {
    const body = {
      id: id
    }
    await this.userService.userDeleteMission(body).subscribe(
      result => {
        if (result.affectedRows > 0) {
          this.swalDialogSuccess.show();
          this.GetMission();
        } else {
          this.swalDialogError.show();
        }
      });
  }

  // public async missionEnd(status, id) {
  //   const body = {
  //     'id': id,
  //     'status': status
  //   }
  //   await this.userService.updateMission(body).subscribe();
  // }

  public async missionStatus(status, id) {
    const body = {
      'id': id,
      'status': status
    }
    await this.userService.updateMission(body).subscribe(
      result => {
        if (result.affectedRows > 0) {
          this.swalDialogSuccess.show();
          this.GetMission();
        } else {
          this.swalDialogError.show();
        }
      });
  }

  public async showOnModal(params) {
    this.showData = params;
    if (this.showData.missionspecial['Link']) {
      let data: any = '';
      data = this.showData.missionspecial['Link'].split('?v=')[1];
      this.videoUrl = await this.domSanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${data}`);
    }
  }
}
