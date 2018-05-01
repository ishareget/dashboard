import { Component, OnInit, ViewChild } from '@angular/core';

import { LogService } from '../../service/log/log.service';
import { UserService } from '../../service/user/user.service';
import { async } from '@angular/core/testing';
import { SwalComponent } from '@toverux/ngsweetalert2';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css'],
  providers: [LogService, UserService]
})
export class LogComponent implements OnInit {
  @ViewChild('dialogSuccess') private swalDialogSuccess: SwalComponent;

  public datas: any = [];

  public page: Number = 1;          // 當前頁碼
  public isLoading: Boolean = true; // 是否載入中

  public userData: any;
  public userPermission: any;

  constructor(
    private userService: UserService,
    private logService: LogService
  ) { }

  ngOnInit() {
    this.getUserInfo();
  }

  public async logList() {
    await this.logService.getLog().subscribe(
      result => {
        this.isLoading = false;
        this.datas = result;
      }
    )
  }

  /**
   * 取得登入中的使用者
   *
   * @memberof LogComponent
   */
  public async getUserInfo() {
    await this.userService.userInfo().subscribe(
      result => {
        if (result[0]) {
          this.userData = result[0];
          this.getUserPermission();
        }
      }
    )
  }
  /**
   * 取得權限
   *
   * @memberof LogComponent
   */
  public async getUserPermission() {
    await this.userService.userPermission(this.userData.logingroup).subscribe(
      result => {
        this.userPermission = result[0];
        this.logList();
      });
  }

  /**
   * 取得權限
   *
   * @memberof LogComponent
   */
  public async cleanLog() {
    await this.logService.cleanLog().subscribe(
      result => {
        this.swalDialogSuccess.show();
        this.logList();
      }
    );
  }
}
