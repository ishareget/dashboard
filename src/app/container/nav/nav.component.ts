import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { SwalComponent } from '@toverux/ngsweetalert2';
import { UserService } from '../../service/user/user.service';
import { error } from 'util';

declare let jquery: any;
declare let $: any;

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
  providers: [UserService]
})
export class NavComponent implements OnInit {

  @ViewChild('navbarToggler') navbarToggler: ElementRef;
  @ViewChild('dialogLogout') private swalDialogLogout: SwalComponent;

  public sideActive: String = 'home';
  public isLogin: any = false;
  public permission = {
    pointsend: 0,
    setcarousel: 0,
    missiondelete: 0
  };

  constructor(
    private router: Router,
    private userService: UserService
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () { return false; }
    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        this.router.navigated = false;
        window.scrollTo(0, 0);
      }
    });
  }

  ngOnInit() {
    if (this.userService.userCheck()) { this.router.navigate(['/home']); } else {
      this.router.navigate(['/login']);
    }
    this.reloadRedirect();
  }

  /**
   * 取得登入中的使用者
   * @memberof NavComponent
   */
  public async getUserInfo() {
    await this.userService.userInfo().subscribe(
      result => {
        this.isLogin = result[0];
        this.getPermission();
      },
      err => {
        Cookie.delete('userCookie', '/');
        window.location.reload();
      })
  }

  public async getPermission() {
    await this.userService.userPermission(this.isLogin.logingroup).subscribe(
      result => {
        if (result[0].enterdashboard === 0) { Cookie.delete('userCookie'); window.location.reload(); }
        this.permission.pointsend = result[0].pointsend;
        this.permission.setcarousel = result[0].setcarousel;
        this.permission.missiondelete = result[0].missiondelete;
      })
  }
  /**
   * 權限檢查
   *
   * @memberof NavComponent
   */
  public reloadRedirect() {

    this.isLogin = Cookie.get('userCookie');
    if (!this.isLogin) {
      this.router.navigate(['/login']);
    } else {
      this.getUserInfo();
    }

  }

  /**
   * 切換選單底色
   *
   * @param {any} e
   * @memberof NavComponent
   */
  public sidebarActive(e: any) {
    this.sideActive = e.srcElement.href.split('/')[4];
    $('.navbar-toggler').click();
  }

  /**
   * 登出
   */
  public logout() {
    Cookie.delete('userCookie', '/');
    this.router.navigate(['/login']);
    this.isLogin = false;
  }

  /**
   * 登出
   */
  public routerget() {
    window.open('http://www.ishareget.org', '_blank');
  }

  navBarTogglerIsVisible() {
    return this.navbarToggler.nativeElement.offsetParent !== null;

  }

  collapseNav() {
    if (this.navBarTogglerIsVisible()) {
      this.navbarToggler.nativeElement.click();
    }
  }

}
