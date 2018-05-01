import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CarouselService } from '../../service/carousel/carousel.service';

import { Carousel } from '../../class/user/carousel';
import { SwalComponent } from '@toverux/ngsweetalert2';
import { ImageCropperComponent, CropperSettings, Bounds } from 'ng2-img-cropper';

declare let jquery: any;
declare let $: any;

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css'],
  providers: [CarouselService]
})
export class CarouselComponent implements OnInit {

  @ViewChild('modelClose') modelClose: ElementRef;
  @ViewChild('dialogSuccess') private swalDialogSuccess: SwalComponent;
  @ViewChild('dialogError') private swalDialogError: SwalComponent;
  @ViewChild('dialogErrorType') private swalDialogErrorType: SwalComponent;

  public datas: any[] = [];
  public data: any = new Carousel();
  public file: any;
  public filename: any;
  public carousel: any = {};
  public filesPhoto: FileList;
  public missionPhotoList: any = [];
  public isLoading: Boolean = true; // 是否載入中
  // public url: any;
  public urlboolean: Boolean = true;
  public filelist: FileList;
  public page: Number = 1;


  @ViewChild('cropper', undefined)
  cropper: ImageCropperComponent;
  cropperSettings: CropperSettings;

  constructor(
    private router: Router,
    private carouselService: CarouselService
  ) {
    this.cropperSettings = new CropperSettings();
    this.cropperSettings.width = 1080;
    this.cropperSettings.height = 500;
    this.cropperSettings.minWidth = 1080;
    this.cropperSettings.minHeight = 500;
    this.cropperSettings.croppedWidth = 1080;
    this.cropperSettings.croppedHeight = 500;
    this.cropperSettings.canvasWidth = 400;
    this.cropperSettings.canvasHeight = 300;
    this.cropperSettings.canvasHeight = 400;
    this.cropperSettings.canvasWidth = 800;
    this.cropperSettings.noFileInput = true;
    this.data = {};
  }

  public fileUploadListener($event) {
    const image: any = new Image();
    const file: File = $event.target.files[0];
    if (file !== undefined) {
      this.filename = file.name.split('.')[1];
      const reader = new FileReader();
      reader.onload = (x: any) => {
        image.src = x.target.result;
        this.cropper.setImage(image);
      }
      reader.readAsDataURL(file);
    }
  }

  ngOnInit() {
    this.GetPicture();
  }

  public async readUrl(data) {
    // console.log(data);
    this.isLoading = true;
    this.file = data;
    this.carousel.picture = data;
    this.UploadPicture(data);
  }

  /**
 * 取得圖片 by id
 *
 * @param {Carousel} obj
 * @memberof CarouselComponent
 */
  public async userGetPictureById(id: Number) {
    this.datas.forEach(element => {
      if (element.id === id) {
        this.data = element;
      }
    });
  }

  /**
   * 取得所有輪播圖圖片
   * @memberof CarouselComponent
   */
  public async GetPicture() {
    await this.carouselService.userGetPicture().subscribe(
      result => {
        this.isLoading = false;
        this.datas = result;
      });
  }

  // /**
  //  * 上傳圖片
  //  *
  //  * @memberof CarouselComponent
  //  */
  // public async SavePicture() {
  //   this.isLoading = true;
  //   const formData = new FormData();
  //   if (this.filelist !== undefined) { formData.append('files', this.filelist[0]); }
  //   await this.carouselService.UploadPicture(formData).subscribe(
  //     result => {
  //       if (result) {
  //         this.SaveData(result);
  //       } else {
  //         this.swalDialogError.show();
  //         this.GetPicture();
  //       }
  //     }
  //   )
  // }

  /**
   * 上傳圖片
   *
   * @memberof CarouselComponent
   */
  public async UploadPicture(data) {
    const body = {
      url: this.file,
      filetype: this.filename
    }
    await this.carouselService.UploadPicture(body).subscribe(
      result => {
        if (result) {
          this.creaatePicture(result);
          $('#uploadphoto').modal('hide');
        } else {
          this.swalDialogError.show();
          this.GetPicture();
        }
      });
  }

  public async creaatePicture(cuid) {
    const body = {
      picturesort: 0,
      picturecontent: '',
      pictureurl: cuid,
      picturelink: ''
    };

    await this.carouselService.creaatePicture(body).subscribe(
      result => {
        if (result.affectedRows > 0) {
          this.swalDialogSuccess.show();
          setTimeout(() => { this.GetPicture(); }, 2000);
        } else {
          this.swalDialogError.show();
          this.GetPicture();
        }
      });
  }

  /**
   * 刪除圖片
   *
   * @memberof CarouselComponent
   */
  public async userDeletePicture(data: any) {
    let body = {};
    body = {
      id: data.id
    }
    await this.carouselService.userDelete(body).subscribe(
      result => {
        if (result.affectedRows > 0) {
          this.swalDialogSuccess.show();
          this.GetPicture();
        } else {
          this.swalDialogError.show();
        }
      });
  }
  /**
   * 編輯圖片
   *
   * @memberof CarouselComponent
   */
  public async userUpdatePicture() {
    let body = {};
    if (this.data.picturelink.indexOf('http://') < 0) {
      this.data.picturelink = 'http://' + this.data.picturelink
    }

    body = {
      id: this.data.id,
      picturesort: this.data.picturesort,
      picturecontent: this.data.picturecontent,
      pictureurl: this.data.pictureurl,
      picturelink: this.data.picturelink
    }

    await this.carouselService.userUpdate(body).subscribe(
      result => {
        if (result.affectedRows > 0) {
          setTimeout(() => {
            this.swalDialogSuccess.show();
            this.modelClose.nativeElement.click();
          }, 1000);
          this.GetPicture();
        } else {
          this.swalDialogError.show();
        }
      });
  }
}
