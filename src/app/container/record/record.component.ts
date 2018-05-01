import { Component, OnInit } from '@angular/core';
import { RecordService } from '../../service/record/record.service';
import { UserService } from 'app/service/user/user.service';

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.css'],
  providers: [RecordService, UserService]
})
export class RecordComponent implements OnInit {

  public datas: any = [];
  public page: Number = 1;
  public isLoading: Boolean = true;

  constructor(
    private recordService: RecordService,
    private userService: UserService
  ) { }

  ngOnInit() {
    if (this.userService.userCheck() === false) { window.location.reload() }
    this.recordList();
  }

  public async recordList() {
    await this.recordService.recordList().subscribe(
      result => {
        this.isLoading = false;
        this.datas = result;
      }
    );
  }

}
