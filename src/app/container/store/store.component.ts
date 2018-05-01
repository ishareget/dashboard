import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../service/user/user.service';
import { SwalComponent } from '@toverux/ngsweetalert2';

import { Store } from '../../class/user/store';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css'],
  providers: [UserService]
})
export class StoreComponent implements OnInit {

  @ViewChild('modelClose') modelClose: ElementRef;
  @ViewChild('dialogError') private swalDialogError: SwalComponent;
  @ViewChild('dialogSuccess') private swalDialogSuccess: SwalComponent;
  @ViewChild('dialogUpdateError') private swalDialogUpdateError: SwalComponent;
  @ViewChild('dialogInsertError') private swalDialogInsertError: SwalComponent;
  @ViewChild('dialogDeleteError') private swalDialogDeleteError: SwalComponent;

  public datas: any[] = [];       // 學生資料集合
  public data: any = new Store(); // 學生資料單筆(by username)
  public isAddMode: Boolean = true; // 表單模式(新增/編輯)
  public userdata: any = null;

  public page: Number = 1;
  public isLoading: Boolean = true;

  constructor(
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit() {
    // this.userdata = JSON.parse(Cookie.get('dashboardLogin'));
    // this.userGetStore();
  }


  // /**
  //  * 資料欄位驗證
  //  *
  //  * @memberof StoreComponent
  //  */
  // public async userDataCheck() {

  //   let valid = false;
  //   let body = {};

  //   if (Object.keys(this.data).length < 1) {

  //     this.swalDialogError
  //       .show().then((value) => {
  //         this.data.storepassword = '';
  //         this.data.storepasswordRe = '';
  //       });

  //   } else if (
  //     this.data.storepassword !== this.data.storepasswordRe ||
  //     this.data.storepassword === '' ||
  //     this.data.storepasswordRe === ''
  //   ) {

  //     this.swalDialogError
  //       .show().then((value) => {
  //         this.data.storepassword = '';
  //         this.data.storepasswordRe = '';
  //       });

  //   } else {

  //     valid = true;

  //     body = {
  //       id: this.data.id,
  //       storeusername: this.data.storeusername,
  //       storepassword: this.data.storepassword,
  //       storename: this.data.storename,
  //       storeaddr: this.data.storeaddr,
  //       storeadminstore: this.data.storeadminstore,
  //       storetel: this.data.storetel,
  //       storeein: this.data.storeein,
  //       storetype: this.data.storetype
  //     }
  //   }

  //   if (valid && this.isAddMode) {
  //     this.userAddStore(body);    // 新增資料
  //   } else {
  //     this.userUpdateStore(body); // 更新資料
  //   }
  // }


  // /**
  //  * 取得店家資料 by username
  //  *
  //  * @param {Store} obj
  //  * @memberof StoreComponent
  //  */
  // public async userGetStoreById(obj: Store) {

  //   this.data = this.datas.filter(
  //     (value, index, array) => {
  //       return value.storeusername === obj.storeusername;
  //     }
  //   )[0];
  //   // this.data 非陣列（是 Store 物件），因此要取出[0]

  //   // 編輯暫時先不用重新輸入密碼
  //   this.data.storepasswordRe = this.data.storepassword;

  //   // 修改表單模式
  //   this.isAddMode = false;

  // }

  // /**
  //  * 取得店家資料 all
  //  *
  //  * @memberof StoreComponent
  //  */
  // public async userGetStore() {
  //   await this.userService.userGetStore().subscribe(
  //     result => {
  //       this.isLoading = false;
  //       this.datas = result;
  //     });
  // }


  // /**
  //  * 新增店家資料
  //  *
  //  * @memberof StoreComponent
  //  */
  // public async userAddStore(body) {

  //   await this.userService.userAddStore(body).subscribe(
  //     result => {
  //       if (result.affectedRows > 0) {
  //         this.swalDialogSuccess
  //           .show().then((value) => {
  //             // reset data
  //             this.userGetStore();
  //             this.modelClose.nativeElement.click();
  //           });
  //       } else {
  //         this.swalDialogInsertError
  //           .show().then((value) => {
  //             this.data.storepassword = '';
  //             this.data.storepasswordRe = '';
  //           });
  //       }
  //     });

  // }


  // /**
  //  * 更新店家資料
  //  *
  //  * @memberof StoreComponent
  //  */
  // public async userUpdateStore(body) {

  //   await this.userService.userUpdateStore(body).subscribe(
  //     result => {
  //       if (result.affectedRows > 0) {
  //         this.swalDialogSuccess
  //           .show().then((value) => {
  //             // reset data
  //             this.userGetStore();
  //             this.modelClose.nativeElement.click();
  //           });
  //       } else {
  //         this.swalDialogUpdateError
  //           .show().then((value) => {
  //             this.data.storepassword = '';
  //             this.data.storepasswordRe = '';
  //           });
  //       }
  //     });

  // }

  // /**
  //  * 刪除店家資料
  //  *
  //  * @memberof StoreComponent
  //  */
  // public async userDeleteStore(obj: Store) {

  //   await this.userService.userDeleteStore(obj).subscribe(
  //     result => {
  //       if (result.affectedRows > 0) {
  //         this.swalDialogSuccess
  //           .show().then((value) => {
  //             this.userGetStore(); // reload
  //             this.modelClose.nativeElement.click();
  //           });
  //       } else {
  //         this.swalDialogDeleteError
  //           .show();
  //       }
  //     });

  // }
}
