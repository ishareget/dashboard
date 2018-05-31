import { Component, OnInit, ViewChild } from '@angular/core';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Ng2DeviceService } from 'ng2-device-detector';
import { SwalComponent } from '@toverux/ngsweetalert2';

@Component({
  selector: 'app-browsercheck',
  templateUrl: './browsercheck.component.html',
  styleUrls: ['./browsercheck.component.css']
})
export class BrowsercheckComponent implements OnInit {
  url: any = {
    ishare: '/login',
    download: 'https://www.google.com.tw/chrome/'
  }
  @ViewChild('dialogCheck') private swalDialogCheck: SwalComponent;
  @ViewChild('dialogOld') private swalDialogOld: SwalComponent;
  constructor(
    private deviceService: Ng2DeviceService, ) { }

  ngOnInit() {
    Cookie.get('checkAdBrowser') ? window.location.href = this.url.ishare : this.checkBrowser();
  }


  public checkBrowser() {
    setTimeout(() => {
      switch (this.deviceService.getDeviceInfo().browser) {
        case 'chrome':
          Cookie.set('checkAdBrowser', 'checkOK');
          window.location.href = this.url.ishare;
          break;
        case 'firefox':
        case 'ms-edge':
          this.swalDialogCheck.show();
          setTimeout(() => {
            Cookie.set('checkBrowser', 'checkOK');
            window.location.href = this.url.ishare;
          }, 1000);
          break;
        case 'ie':
          this.swalDialogOld.show();
          window.location.href = this.url.download;
          break;
        default:
          this.swalDialogCheck.show();
          break;
      }
    }, 4000);
  }
}
