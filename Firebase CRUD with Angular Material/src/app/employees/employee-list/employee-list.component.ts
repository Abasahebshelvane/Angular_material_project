import { Component, OnInit, ViewChild } from '@angular/core';
import { EmployeeService } from 'src/app/shared/employee.service';
import { MatSort, MatPaginator ,MatTableDataSource} from '@angular/material';
import { MatDialog, MatDialogConfig } from "@angular/material";

import { NotificationService } from '../../shared/notification.service';

import { EmployeeComponent } from './../employee/employee.component'

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {
  

  constructor(public service:EmployeeService , public dialog: MatDialog, public notificationService: NotificationService) { }

  listData:MatTableDataSource<any>;

  displayedColumns: string[] =['fullName','email','address','gender','birthdate','actions'];

  @ViewChild(MatSort) sort : MatSort;
  @ViewChild(MatPaginator) paginator:MatPaginator;
  

  ngOnInit() {
    this.service.getEmployees().subscribe(
      list =>{
        let array=list.map(item =>{
          return{
            $key:item.key ,
            ...item.payload.val()
          };
        });
          this.listData =new MatTableDataSource(array);
          console.log(this.listData);
          this.listData.sort=this.sort;
          this.listData.paginator=this.paginator;
          this.listData.filterPredicate = (data, filter) => {
            return this.displayedColumns.some(ele => {
              return ele != 'actions' && data[ele].toLowerCase().indexOf(filter) != -1;
        
    
        });
      };

    });
  }
      
  
  onCreate() {
    this.service.initializeFormGroup();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    this.dialog.open(EmployeeComponent,dialogConfig);
  }

  onEdit(row){
     this.service.populateForm(row);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    this.dialog.open(EmployeeComponent,dialogConfig);
  }

  onDelete($key){
    if(confirm('Are you sure to delete this record ?')){
    this.service.deleteEmployee($key);
    this.notificationService.warn('! Deleted successfully');
    }
  }

}