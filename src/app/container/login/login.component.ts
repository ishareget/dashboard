import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { SwalComponent } from '@toverux/ngsweetalert2';

import { UserService } from '../../service/user/user.service';
import { LogService } from '../../service/log/log.service';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService, LogService]
})
export class LoginComponent implements OnInit {

  @ViewChild('dialogSuccess') private swalDialogSuccess: SwalComponent;
  @ViewChild('dialogError') private swalDialogError: SwalComponent;
  @ViewChild('dialogErrorGroup') private swalDialogErrorGroup: SwalComponent;

  public userId: String = 'ISHT01';
  public userPwd: String = '123456';
  public logingroup: Number = 0;

  constructor(
    private router: Router,
    private logService: LogService,
    private userService: UserService
  ) { }

  ngOnInit() {

  }

  public async login() {

    const body = {
      userId: this.userId,
      userPwd: this.userPwd
    }
    await this.userService.Login(body).subscribe(
      result => {
        if (result.token) {
          Cookie.set('userCookie', result.token, 1, '/');
          this.getUserInfo();
        } else {
          this.swalDialogError.show();
        }
      });
  }

  public async getUserInfo() {
    await this.userService.userInfo().subscribe(
      result => {
        if (result[0]) {
          this.GetPermission(result[0].logingroup);
        }
      }
    )
  }

  public async GetPermission(id) {
    await this.userService.userPermission(id).subscribe(
      result => {
        if (result[0].enterdashboard) {
          this.swalDialogSuccess.show();
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        } else {
          Cookie.delete('userCookie', '/');
          this.swalDialogError.show();
        }
      }
    )
  }
}
