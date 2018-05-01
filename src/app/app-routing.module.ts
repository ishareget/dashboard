import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Component
import { HomeComponent } from './container/home/home.component';
import { StudentComponent } from './container/student/student.component';
import { VolunteerComponent } from './container/volunteer/volunteer.component';
import { StoreComponent } from './container/store/store.component';
import { TeacherComponent } from './container/teacher/teacher.component';
import { RecordComponent } from './container/record/record.component';
import { TimerComponent } from './container/timer/timer.component';
import { LogComponent } from './container/log/log.component';
import { LoginComponent } from './container/login/login.component';
import { CarouselComponent } from './container/carousel/carousel.component';
import { AdminComponent } from './container/admin/admin.component';
import { MissionComponent } from './container/mission/mission.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'carousel', component: CarouselComponent },
  { path: 'student', component: StudentComponent },
  { path: 'store', component: StoreComponent },
  { path: 'teacher', component: TeacherComponent },
  { path: 'volunteer', component: VolunteerComponent },
  { path: 'mission', component: MissionComponent },
  { path: 'record', component: RecordComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'timer', component: TimerComponent },
  { path: 'log', component: LogComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
