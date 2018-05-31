import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';
import { QRCodeModule } from 'angular2-qrcode';
import { Ng2DeviceDetectorModule } from 'ng2-device-detector';

import { enableProdMode } from '@angular/core';

// file-upload
import { AccordionModule } from 'primeng/primeng';
import { MenuItem } from 'primeng/primeng';
import { FileUploadModule } from 'primeng/primeng';


// Plugin
import { ChartsModule } from 'ng2-charts';
import { SweetAlert2Module } from '@toverux/ngsweetalert2';
import { NgxPaginationModule } from 'ngx-pagination';
import { ImageCropperModule } from 'ng2-img-cropper';
// Component
import { AppComponent } from './app.component';
import { NavComponent } from './container/nav/nav.component';
import { HomeComponent } from './container/home/home.component';
import { TeacherComponent } from './container/teacher/teacher.component';
import { StoreComponent } from './container/store/store.component';
import { RecordComponent } from './container/record/record.component';
import { TimerComponent } from './container/timer/timer.component';
import { LogComponent } from './container/log/log.component';
import { LoginComponent } from './container/login/login.component';
import { CarouselComponent } from './container/carousel/carousel.component';
import { AdminComponent } from './container/admin/admin.component';

import animateScrollTo from 'animated-scroll-to';
import { StudentComponent } from './container/student/student.component';
import { VolunteerComponent } from './container/volunteer/volunteer.component';
import { MissionComponent } from './container/mission/mission.component';
import { BrowsercheckComponent } from './container/browsercheck/browsercheck.component';

enableProdMode();

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    StoreComponent,
    RecordComponent,
    TimerComponent,
    LogComponent,
    LoginComponent,
    TeacherComponent,
    CarouselComponent,
    AdminComponent,
    StudentComponent,
    VolunteerComponent,
    MissionComponent,
    BrowsercheckComponent
  ],
  imports: [
    BrowserModule,
    ChartsModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    AppRoutingModule,
    QRCodeModule,
    AccordionModule,
    FileUploadModule,
    SweetAlert2Module.forRoot({
      // buttonsStyling: false,
      // customClass: 'modal-content',
      // confirmButtonClass: 'btn btn-lg btn-primary',
      // cancelButtonClass: 'btn btn-lg'
    }),
    Ng2DeviceDetectorModule.forRoot(),
    NgxPaginationModule,
    ImageCropperModule
  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent]
})
export class AppModule { }
